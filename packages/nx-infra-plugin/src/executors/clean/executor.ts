import { PromiseExecutor, logger } from '@nx/devkit';
import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { CleanExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';

const DEFAULT_TARGET_DIR = './src';
const rimrafAsync = promisify(rimraf);

function resolveExcludePatterns(patterns: string[], baseDir: string): string[] {
  return patterns.map((pattern) => path.resolve(baseDir, pattern));
}

function isPathExcluded(filePath: string, excludePaths: string[]): boolean {
  const normalized = path.normalize(filePath);

  return excludePaths.some((excludePath) => {
    const normalizedExclude = path.normalize(excludePath);

    if (normalized === normalizedExclude) {
      return true;
    }

    return normalized.startsWith(normalizedExclude + path.sep);
  });
}

async function generateDeletionPlan(targetDir: string, excludePaths: string[]): Promise<string[]> {
  if (!fs.existsSync(targetDir)) {
    return [];
  }

  if (excludePaths.length === 0) {
    return [targetDir];
  }

  const allPaths = await glob('**/*', {
    cwd: targetDir,
    dot: true,
    nodir: false,
  });

  const fullPaths = allPaths.map((relativePath) => path.join(targetDir, relativePath));

  return fullPaths.filter((fullPath) => !isPathExcluded(fullPath, excludePaths));
}

async function removeDirectoryCompletely(targetDirectory: string): Promise<void> {
  if (fs.existsSync(targetDirectory)) {
    await rimrafAsync(targetDirectory);
  }
}

async function removeDirectoryWithExclusions(
  targetDirectory: string,
  excludePaths: string[],
): Promise<void> {
  if (!fs.existsSync(targetDirectory)) {
    return;
  }

  if (excludePaths.length === 0) {
    await rimrafAsync(path.join(targetDirectory, '*'));
    await rimrafAsync(path.join(targetDirectory, '.*'));
    return;
  }

  const itemsToDelete = await generateDeletionPlan(targetDirectory, excludePaths);

  const sortedItems = itemsToDelete.sort((a, b) => {
    const aDepth = a.split(path.sep).length;
    const bDepth = b.split(path.sep).length;
    return aDepth - bDepth;
  });

  for (const item of sortedItems) {
    if (fs.existsSync(item)) {
      const containsExcluded = excludePaths.some(
        (excludePath) => excludePath.startsWith(item + path.sep) || excludePath === item,
      );

      if (!containsExcluded) {
        await rimrafAsync(item);
      }
    }
  }
}

const runExecutor: PromiseExecutor<CleanExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const targetDirectory = path.join(
    absoluteProjectRoot,
    options.targetDirectory || DEFAULT_TARGET_DIR,
  );
  const excludePatterns = options.excludePatterns || [];

  logger.verbose(
    `Cleaning ${targetDirectory}${excludePatterns.length > 0 ? ` with ${excludePatterns.length} exclusions` : ' completely'}...`,
  );

  if (excludePatterns.length > 0) {
    logger.verbose(`Excluding patterns: ${excludePatterns.join(', ')}`);
  }

  try {
    const absoluteExcludePaths = resolveExcludePatterns(excludePatterns, absoluteProjectRoot);

    if (excludePatterns.length === 0) {
      await removeDirectoryCompletely(targetDirectory);
      logger.verbose(`Removed directory: ${targetDirectory}`);
    } else {
      if (!fs.existsSync(targetDirectory)) {
        logger.verbose(`Directory does not exist: ${targetDirectory}`);
        return { success: true };
      }

      await removeDirectoryWithExclusions(targetDirectory, absoluteExcludePaths);

      logger.verbose(
        `Cleaned directory: ${targetDirectory} with ${absoluteExcludePaths.length} exclusions preserved`,
      );
    }

    return { success: true };
  } catch (error) {
    logError(`Failed to clean ${targetDirectory}`, error);
    return { success: false };
  }
};

export default runExecutor;
