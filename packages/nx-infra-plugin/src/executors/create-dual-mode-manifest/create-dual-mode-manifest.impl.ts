import { logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import { createExecutor } from '../../utils/create-executor';
import { CreateDualModeManifestExecutorSchema } from './schema';
import { SideEffectFinder } from './side-effect-finder';
import { toPosixPath } from '../../utils/path-resolver';
import { exists, ensureDir, writeFileText } from '../../utils/file-operations';

const ERROR_MESSAGES = {
  ESM_DIR_NOT_FOUND: (dir: string) => `ESM directory does not exist: ${dir}`,
  CJS_DIR_NOT_FOUND: (dir: string) => `CJS directory does not exist: ${dir}`,
} as const;

function normalizePackagePath(value: string): string {
  return value.replace(/\\/g, '/');
}

function createModuleConfig(
  fileName: string,
  fileDir: string,
  esmFilePath: string,
  srcDir: string,
  generatedDtsFiles: string[],
  sideEffectFinder: SideEffectFinder,
): string {
  const isIndex = fileName === 'index.js';
  const relative = path.join('./', fileDir.replace(srcDir, ''), fileName);
  const currentPath = isIndex ? path.join(relative, '../') : relative;

  const esmFile = path.relative(currentPath, path.join('./esm', relative));
  const cjsFile = path.relative(currentPath, path.join('./cjs', relative));

  const dtsRelative = relative.replace(/\.js$/, '.d.ts');
  const realDtsPath = path.join(fileDir, fileName.replace(/\.js$/, '.d.ts'));
  const hasGeneratedDts = generatedDtsFiles.includes(
    normalizePackagePath(dtsRelative.replace(/^\.\//, '')),
  );

  const relativeEsmBase = normalizePackagePath(esmFile).match(/^.*\/esm\//)?.[0] || './esm/';
  let sideEffectFiles: string[] | false = false;

  try {
    const moduleSideEffects = sideEffectFinder.getModuleSideEffectFiles(esmFilePath);
    if (moduleSideEffects.length > 0) {
      sideEffectFiles = moduleSideEffects.map((importPath) =>
        importPath.replace(/^.*\/esm\//, relativeEsmBase),
      );
    }
  } catch (error) {
    logger.verbose(`Side effect analysis failed for ${esmFilePath}: ${error}`);
  }

  const result: Record<string, unknown> = {
    sideEffects: sideEffectFiles,
    main: normalizePackagePath(cjsFile),
    module: normalizePackagePath(esmFile),
  };

  const hasRealDts = require('fs').existsSync(realDtsPath);
  const hasDts = hasRealDts || hasGeneratedDts;

  if (hasDts) {
    const typingFile = fileName.replace(/\.js$/, '.d.ts');
    result['typings'] = `${isIndex ? './' : '../'}${typingFile}`;
  }

  return JSON.stringify(result, null, 2);
}

function getPackageJsonOutputPath(
  fileName: string,
  fileDir: string,
  srcDir: string,
  outputDir: string,
): string {
  const relativePath = fileDir.replace(srcDir, '');
  const baseName = path.basename(fileName, '.js');
  const isIndex = fileName === 'index.js';

  if (isIndex) {
    return path.join(outputDir, relativePath, 'package.json');
  } else {
    return path.join(outputDir, relativePath, baseName, 'package.json');
  }
}

async function validateDirectories(esmDir: string, cjsDir: string): Promise<void> {
  if (!(await exists(esmDir))) {
    throw new Error(ERROR_MESSAGES.ESM_DIR_NOT_FOUND(esmDir));
  }

  if (!(await exists(cjsDir))) {
    throw new Error(ERROR_MESSAGES.CJS_DIR_NOT_FOUND(cjsDir));
  }
}

async function discoverJsFiles(esmDir: string): Promise<string[]> {
  const pattern = path.join(esmDir, '**/*.js');
  const globPattern = toPosixPath(pattern);

  return glob(globPattern, {
    nodir: true,
    ignore: ['**/node_modules/**'],
  });
}

function shouldExcludeFile(relativeFilePath: string, excludePatterns: string[]): boolean {
  return excludePatterns.some((pattern) => minimatch(relativeFilePath, pattern, { dot: true }));
}

async function processFile(
  file: string,
  esmDir: string,
  srcDir: string,
  outputDir: string,
  excludePatterns: string[],
  generatedDtsFiles: string[],
  sideEffectFinder: SideEffectFinder,
): Promise<boolean> {
  const fileName = path.basename(file);
  const fileDir = path.dirname(file);

  const relativeFromEsm = path.relative(esmDir, fileDir);
  const relativeFilePath = normalizePackagePath(path.join(relativeFromEsm, fileName));

  if (shouldExcludeFile(relativeFilePath, excludePatterns)) {
    logger.verbose(`Skipping excluded file: ${relativeFilePath}`);
    return false;
  }

  const correspondingSrcDir = path.join(srcDir, relativeFromEsm);

  const moduleConfig = createModuleConfig(
    fileName,
    correspondingSrcDir,
    file,
    srcDir,
    generatedDtsFiles,
    sideEffectFinder,
  );

  const packageJsonPath = getPackageJsonOutputPath(
    fileName,
    correspondingSrcDir,
    srcDir,
    outputDir,
  );

  await ensureDir(path.dirname(packageJsonPath));
  await writeFileText(packageJsonPath, moduleConfig);

  logger.verbose(`Created: ${path.relative(outputDir, packageJsonPath)}`);
  return true;
}

interface ResolvedCreateDualModeManifest {
  esmDir: string;
  cjsDir: string;
  outputDir: string;
  srcDir: string;
  excludePatterns: string[];
  generatedDtsFiles: string[];
}

export default createExecutor<CreateDualModeManifestExecutorSchema, ResolvedCreateDualModeManifest>(
  {
    name: 'CreateDualModeManifest',
    resolve: (options, { projectRoot }) => {
      return {
        esmDir: path.resolve(projectRoot, options.esmDir),
        cjsDir: path.resolve(projectRoot, options.cjsDir),
        outputDir: path.resolve(projectRoot, options.outputDir),
        srcDir: path.resolve(projectRoot, options.srcDir),
        excludePatterns: options.excludePatterns || [],
        generatedDtsFiles: options.generatedDtsFiles || [],
      };
    },
    run: async (resolved) => {
      logger.verbose(`Creating dual-mode manifest files...`);
      logger.verbose(`  ESM dir: ${resolved.esmDir}`);
      logger.verbose(`  CJS dir: ${resolved.cjsDir}`);
      logger.verbose(`  Output dir: ${resolved.outputDir}`);
      logger.verbose(`  Source dir: ${resolved.srcDir}`);
      logger.verbose(`  Exclude patterns: ${resolved.excludePatterns.join(', ') || '(none)'}`);

      await validateDirectories(resolved.esmDir, resolved.cjsDir);

      const files = await discoverJsFiles(resolved.esmDir);

      if (files.length === 0) {
        logger.warn(`No JS files found in ESM directory: ${resolved.esmDir}`);
        return;
      }

      logger.verbose(`Found ${files.length} JS files to process`);

      const sideEffectFinder = new SideEffectFinder();
      let createdCount = 0;

      for (const file of files) {
        const created = await processFile(
          file,
          resolved.esmDir,
          resolved.srcDir,
          resolved.outputDir,
          resolved.excludePatterns,
          resolved.generatedDtsFiles,
          sideEffectFinder,
        );
        if (created) {
          createdCount++;
        }
      }

      logger.info(`Created ${createdCount} package.json manifest files`);
    },
  },
);
