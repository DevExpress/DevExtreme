import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { NpmAssembleExecutorSchema } from './schema';
import { resolveProjectPath, toPosixPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import {
  readFileText,
  writeFileText,
  copyFile,
  readJson,
  normalizeEol,
  ensureTrailingNewline,
} from '../../utils/file-operations';
import { copyDirectory } from '../../utils/copy-directory';
import { buildLicenseBannerRenderer, applyLicenseBannerToFile } from '../../utils/license-banner';

interface PackageJson {
  name: string;
  version: string;
  repository?: string | { url?: string };
}

const SRC_JS_EXCLUDES = [
  'bundles/*.js',
  'cjs/bundles/**/*',
  'esm/bundles/**/*',
  'bundles/modules/parts/*.js',
  'viz/vector_map.utils/*.js',
  'viz/docs/*.js',
  '**/license/license_validation_internal.js',
];

const DIST_EXCLUDES = [
  'transpiled**/**/*',
  'npm/**/*.*',
  'ts/jquery*',
  'ts/knockout*',
  'ts/globalize*',
  'ts/cldr*',
  'css/dx-diagram.*',
  'css/dx-gantt.*',
  'js/knockout*',
  'js/cldr/*.*',
  'js/cldr*',
  'js/globalize/*.*',
  'js/globalize*',
  'js/dx-exceljs-fork*',
  'js/file-saver*',
  'js/jquery*',
  'js/jspdf*',
  'js/jspdf-autotable*',
  'js/jszip*',
  'js/dx.custom*',
  'js/dx.viz*',
  'js/dx.web*',
  'js/dx-diagram*',
  'js/dx-gantt*',
  'js/dx-quill*',
];

async function copySourceJs(transpiledDir: string, outputDir: string): Promise<void> {
  await copyDirectory(transpiledDir, outputDir, {
    include: ['**/*.js'],
    exclude: SRC_JS_EXCLUDES,
  });
}

async function copyEsmPackageJsonFiles(transpiledDir: string, outputDir: string): Promise<void> {
  await copyDirectory(transpiledDir, outputDir, {
    include: ['**/*.json'],
    exclude: ['viz/vector_map.utils/**'],
  });
}

async function copyJsSrcJsonFiles(jsSrcDir: string, outputDir: string): Promise<void> {
  await copyDirectory(jsSrcDir, outputDir, {
    include: ['**/*.json'],
    exclude: ['viz/vector_map.utils/**'],
  });
}

async function normalizeDirectoryEol(dirPath: string, pattern: string): Promise<void> {
  const cwd = toPosixPath(dirPath);
  const files = await glob(pattern, { cwd, nodir: true, absolute: true });
  await Promise.all(
    files.map(async (filePath) => {
      const content = await readFileText(filePath);
      await writeFileText(filePath, ensureTrailingNewline(normalizeEol(content)));
    }),
  );
}

async function copyLicenseFiles(licenseSrcDir: string, outputDir: string): Promise<void> {
  const licenseOutDir = path.join(outputDir, 'license');
  await copyDirectory(licenseSrcDir, licenseOutDir);
  await normalizeDirectoryEol(licenseOutDir, '**/*');
}

async function copyNpmBinFiles(npmBinDir: string, outputDir: string): Promise<void> {
  const binOutDir = path.join(outputDir, 'bin');
  await copyDirectory(npmBinDir, binOutDir, { include: ['*.js'] });
  await normalizeDirectoryEol(binOutDir, '*.js');
}

async function copyDistFiles(artifactsDir: string, outputDir: string): Promise<void> {
  await copyDirectory(artifactsDir, path.join(outputDir, 'dist'), {
    include: ['**/*'],
    exclude: DIST_EXCLUDES,
  });
}

async function applyHeadersToSourceJs(
  outputDir: string,
  licenseTemplatePath: string,
  pkg: PackageJson,
  eulaUrl: string,
): Promise<void> {
  const renderBanner = await buildLicenseBannerRenderer({
    templatePath: licenseTemplatePath,
    pkg,
    eulaUrl,
    commentType: '*',
  });
  const cwd = toPosixPath(outputDir);
  const jsFiles = await glob('**/*.js', {
    cwd,
    nodir: true,
    absolute: true,
    ignore: [...SRC_JS_EXCLUDES, 'dist/**/*', 'bin/**/*', 'license/**/*'],
  });
  await Promise.all(
    jsFiles.map(async (filePath) => {
      const fileRelative = path.relative(outputDir, filePath).replace(/\\/g, '/');
      const banner = renderBanner(fileRelative);
      await applyLicenseBannerToFile(filePath, banner, { commentType: '*' });
    }),
  );
}

const runExecutor: PromiseExecutor<NpmAssembleExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const transpiledDir = path.resolve(projectRoot, options.transpiledDir);
  const jsSrcDir = path.resolve(projectRoot, options.jsSrcDir);
  const licenseSrcDir = path.resolve(projectRoot, options.licenseSrcDir);
  const npmBinDir = path.resolve(projectRoot, options.npmBinDir);
  const webpackConfigSrc = path.resolve(projectRoot, options.webpackConfig);
  const artifactsDir = path.resolve(projectRoot, options.artifactsDir);
  const outputDir = path.resolve(projectRoot, options.outputDir);
  const licenseTemplatePath = path.resolve(projectRoot, options.licenseTemplateFile);

  try {
    const pkg = await readJson<PackageJson>(path.join(projectRoot, 'package.json'));

    await copySourceJs(transpiledDir, outputDir);
    logger.verbose(`Copied source JS from ${options.transpiledDir}`);

    await copyEsmPackageJsonFiles(transpiledDir, outputDir);
    logger.verbose(`Copied ESM package.json files from ${options.transpiledDir}`);

    await copyJsSrcJsonFiles(jsSrcDir, outputDir);
    logger.verbose(`Copied js/**/*.json from ${options.jsSrcDir}`);

    await copyLicenseFiles(licenseSrcDir, outputDir);
    logger.verbose(`Copied license files from ${options.licenseSrcDir}`);

    await copyNpmBinFiles(npmBinDir, outputDir);
    logger.verbose(`Copied npm-bin scripts from ${options.npmBinDir}`);

    await copyFile(webpackConfigSrc, path.join(outputDir, 'bin', path.basename(webpackConfigSrc)));
    logger.verbose(`Copied ${options.webpackConfig} to bin/`);

    await copyDistFiles(artifactsDir, outputDir);
    logger.verbose(`Copied dist files from ${options.artifactsDir}`);

    await applyHeadersToSourceJs(outputDir, licenseTemplatePath, pkg, options.eulaUrl);
    logger.verbose('Applied star-license banners to source JS files');

    return { success: true };
  } catch (error) {
    logError('NpmAssemble executor failed', error);
    return { success: false };
  }
};

export default runExecutor;
