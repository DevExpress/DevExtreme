import { PromiseExecutor, logger } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { glob } from 'glob';
import { CleanExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';

const CLEAN_MODE_SIMPLE = 'simple';
const CLEAN_MODE_SHALLOW = 'shallow';
const CLEAN_MODE_RECURSIVE = 'recursive';

const DEFAULT_TARGET_DIR = './src';
const DEFAULT_CLEAN_MODE = CLEAN_MODE_SIMPLE;

const GLOB_ALL_FILES = '**/*';

function resolveExcludePaths(patterns: string[], absoluteProjectRoot: string): string[] {
  return patterns.map((pattern) =>
    path.isAbsolute(pattern) ? pattern : path.join(absoluteProjectRoot, pattern),
  );
}

function shouldPreservePath(
  filePath: string,
  excludePaths: string[],
  exactMatch: boolean,
): boolean {
  const normalized = path.normalize(filePath);

  return excludePaths.some((excludePath) => {
    const normalizedExclude = path.normalize(excludePath);
    return exactMatch ? normalized === normalizedExclude : normalized.startsWith(normalizedExclude);
  });
}

function cleanSimple(targetDirectory: string): void {
  if (fs.existsSync(targetDirectory)) {
    fs.rmSync(targetDirectory, { recursive: true, force: true });
  }
}

function cleanShallow(targetDirectory: string, absoluteExcludePaths: string[]): void {
  if (!fs.existsSync(targetDirectory)) {
    return;
  }

  const entries = fs.readdirSync(targetDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(targetDirectory, entry.name);

    if (!shouldPreservePath(fullPath, absoluteExcludePaths, true)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

async function cleanRecursive(
  targetDirectory: string,
  absoluteExcludePaths: string[],
): Promise<void> {
  const filesToDelete = await glob(GLOB_ALL_FILES, {
    cwd: targetDirectory,
    dot: true,
    absolute: true,
  });

  const filteredFiles = filesToDelete.filter(
    (file) => !shouldPreservePath(file, absoluteExcludePaths, false),
  );

  for (const file of filteredFiles) {
    rimraf.sync(file);
  }
}

const runExecutor: PromiseExecutor<CleanExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const targetDirectory = path.join(
    absoluteProjectRoot,
    options.targetDirectory || DEFAULT_TARGET_DIR,
  );
  const mode = options.mode || DEFAULT_CLEAN_MODE;
  const excludePatterns = options.excludePatterns || [];

  logger.info(`Cleaning ${targetDirectory} in ${mode} mode...`);

  if (excludePatterns.length > 0) {
    logger.info(`Excluding patterns: ${excludePatterns.join(', ')}`);
  }

  try {
    const absoluteExcludePaths = resolveExcludePaths(excludePatterns, absoluteProjectRoot);

    switch (mode) {
      case CLEAN_MODE_SIMPLE:
        cleanSimple(targetDirectory);
        break;
      case CLEAN_MODE_SHALLOW:
        cleanShallow(targetDirectory, absoluteExcludePaths);
        break;
      case CLEAN_MODE_RECURSIVE:
        await cleanRecursive(targetDirectory, absoluteExcludePaths);
        break;
    }

    logger.info(`Successfully cleaned ${targetDirectory}`);
    return { success: true };
  } catch (error) {
    logError(`Failed to clean ${targetDirectory}`, error);
    return { success: false };
  }
};

export default runExecutor;
