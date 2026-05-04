import * as path from 'path';
import * as fs from 'fs/promises';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import {
  copyFile,
  ensureDir,
  ensureTrailingNewline,
  loadProjectPackageJson,
  normalizeEol,
  readFileText,
  writeFileText,
} from '../../utils/file-operations';
import { copyDirectory } from '../copy-files/copy-files.impl';
import { applyLicenseHeadersToDirectory } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';
import type { PackageJson } from '../../utils/types';
import { NpmAssembleExecutorSchema } from './schema';

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

const SRC_JS_HEADER_EXCLUDES = [...SRC_JS_EXCLUDES, 'dist/**/*', 'bin/**/*', 'license/**/*'];

const VECTOR_MAP_UTILS_EXCLUDES = ['viz/vector_map.utils/**'];

async function copySourceJs(transpiledDir: string, outputDir: string): Promise<void> {
  await copyDirectory(transpiledDir, outputDir, {
    include: ['**/*.js'],
    exclude: SRC_JS_EXCLUDES,
  });
}

async function copyEsmPackageJsonFiles(transpiledDir: string, outputDir: string): Promise<void> {
  await copyDirectory(transpiledDir, outputDir, {
    include: ['**/*.json'],
    exclude: VECTOR_MAP_UTILS_EXCLUDES,
  });
}

async function copyJsSrcJsonFiles(jsSrcDir: string, outputDir: string): Promise<void> {
  await copyDirectory(jsSrcDir, outputDir, {
    include: ['**/*.json'],
    exclude: VECTOR_MAP_UTILS_EXCLUDES,
  });
}

async function copyAndNormalizeFiles(
  sourceDir: string,
  destinationDir: string,
  pattern: string,
): Promise<void> {
  const cwd = toPosixPath(sourceDir);
  const relativePaths = await glob(pattern, { cwd, nodir: true });
  await Promise.all(
    relativePaths.map(async (relative) => {
      const destination = path.join(destinationDir, relative);
      await ensureDir(path.dirname(destination));
      await fs.copyFile(path.join(sourceDir, relative), destination);
      const content = await readFileText(destination);
      await writeFileText(destination, ensureTrailingNewline(normalizeEol(content)));
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

interface ResolvedNpmAssemble {
  pkg: PackageJson;
  templatePath: string;
  eulaUrl: string;
  transpiledDir: string;
  jsSrcDir: string;
  licenseSrcDir: string;
  npmBinDir: string;
  webpackConfigSrc: string;
  artifactsDir: string;
  outputDir: string;
}

export default createExecutor<NpmAssembleExecutorSchema, ResolvedNpmAssemble>({
  name: 'NpmAssemble',
  resolve: async (options, { projectRoot }) => {
    const pkg = await loadProjectPackageJson(projectRoot);
    const templatePath = resolveLicenseTemplate(projectRoot, options);

    return {
      pkg,
      templatePath,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      transpiledDir: path.resolve(projectRoot, options.transpiledDir),
      jsSrcDir: path.resolve(projectRoot, options.jsSrcDir),
      licenseSrcDir: path.resolve(projectRoot, options.licenseSrcDir),
      npmBinDir: path.resolve(projectRoot, options.npmBinDir),
      webpackConfigSrc: path.resolve(projectRoot, options.webpackConfig),
      artifactsDir: path.resolve(projectRoot, options.artifactsDir),
      outputDir: path.resolve(projectRoot, options.outputDir),
    };
  },
  run: async (resolved) => {
    const webpackConfigDestination = path.join(
      resolved.outputDir,
      'bin',
      path.basename(resolved.webpackConfigSrc),
    );

    await Promise.all([
      copySourceJs(resolved.transpiledDir, resolved.outputDir),
      copyEsmPackageJsonFiles(resolved.transpiledDir, resolved.outputDir),
      copyJsSrcJsonFiles(resolved.jsSrcDir, resolved.outputDir),
      copyLicenseFiles(resolved.licenseSrcDir, resolved.outputDir),
      copyNpmBinFiles(resolved.npmBinDir, resolved.outputDir),
      copyFile(resolved.webpackConfigSrc, webpackConfigDestination),
      copyDistFiles(resolved.artifactsDir, resolved.outputDir),
    ]);
    logger.verbose('Assembled npm package contents');

    await applyLicenseHeadersToDirectory({
      targetDir: resolved.outputDir,
      pkg: resolved.pkg,
      templatePath: resolved.templatePath,
      eulaUrl: resolved.eulaUrl,
      commentType: '*',
      includePatterns: ['**/*.js'],
      excludePatterns: SRC_JS_HEADER_EXCLUDES,
      filenameMode: 'relative',
    });
    logger.verbose('Applied star-license banners to source JS files');
  },
});
