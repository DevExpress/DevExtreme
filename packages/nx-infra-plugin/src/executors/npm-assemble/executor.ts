import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs/promises';
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
  ensureDir,
} from '../../utils/file-operations';
import { copyDirectory } from '../../utils/copy-directory';
import { buildLicenseBannerRenderer, applyLicenseBannerToFile } from '../../utils/license-banner';
import { DEFAULT_LICENSE_TEMPLATE_EULA, DEFAULT_EULA_URL } from '../add-license-headers/defaults';
import type { PackageJson } from '../../utils/types';

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

async function copyAndNormalizeFiles(
  srcDir: string,
  outDir: string,
  pattern: string,
): Promise<void> {
  const cwd = toPosixPath(srcDir);
  const relPaths = await glob(pattern, { cwd, nodir: true });
  await Promise.all(
    relPaths.map(async (rel) => {
      const dest = path.join(outDir, rel);
      await ensureDir(path.dirname(dest));
      await fs.copyFile(path.join(srcDir, rel), dest);
      const content = await readFileText(dest);
      await writeFileText(dest, ensureTrailingNewline(normalizeEol(content)));
    }),
  );
}

async function copyLicenseFiles(licenseSrcDir: string, outputDir: string): Promise<void> {
  await copyAndNormalizeFiles(licenseSrcDir, path.join(outputDir, 'license'), '**/*');
}

async function copyNpmBinFiles(npmBinDir: string, outputDir: string): Promise<void> {
  await copyAndNormalizeFiles(npmBinDir, path.join(outputDir, 'bin'), '*.js');
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
      await applyLicenseBannerToFile(filePath, banner);
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
  const licenseTemplatePath = options.licenseTemplateFile
    ? path.resolve(projectRoot, options.licenseTemplateFile)
    : DEFAULT_LICENSE_TEMPLATE_EULA;

  let pkg: PackageJson;
  try {
    pkg = await readJson<PackageJson>(path.join(projectRoot, 'package.json'));
  } catch (error) {
    logError('Failed to read package.json', error);
    return { success: false };
  }

  try {
    const webpackConfigDest = path.join(outputDir, 'bin', path.basename(webpackConfigSrc));

    await Promise.all([
      copySourceJs(transpiledDir, outputDir),
      copyEsmPackageJsonFiles(transpiledDir, outputDir),
      copyJsSrcJsonFiles(jsSrcDir, outputDir),
      copyLicenseFiles(licenseSrcDir, outputDir),
      copyNpmBinFiles(npmBinDir, outputDir),
      copyFile(webpackConfigSrc, webpackConfigDest),
      copyDistFiles(artifactsDir, outputDir),
    ]);
    logger.verbose('Assembled npm package contents');

    await applyHeadersToSourceJs(
      outputDir,
      licenseTemplatePath,
      pkg,
      options.eulaUrl ?? DEFAULT_EULA_URL,
    );
    logger.verbose('Applied star-license banners to source JS files');

    return { success: true };
  } catch (error) {
    logError('NpmAssemble executor failed', error);
    return { success: false };
  }
};

export default runExecutor;
