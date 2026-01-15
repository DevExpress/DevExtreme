import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { stat } from 'fs/promises';
import { glob } from 'glob';
import { CopyFilesExecutorSchema } from './schema';
import { resolveProjectPath, normalizeGlobPathForWindows } from '../../utils/path-resolver';
import { isWindowsOS } from '../../utils/common';
import { logError } from '../../utils/error-handler';
import { copyFile, copyRecursive, exists, ensureDir } from '../../utils/file-operations';

const ERROR_MESSAGES = {
  FILES_MUST_BE_ARRAY: 'Files option must be an array',
  FAILED_TO_COPY: 'Failed to copy files',
  NO_FILES_MATCH_PATTERN: (pattern: string) => `No files found matching pattern: ${pattern}`,
  SOURCE_NOT_FOUND: (source: string) => `Source file not found: ${source}`,
} as const;

function containsGlobPattern(pattern: string): boolean {
  return /[*?[\]{}]/.test(pattern);
}

async function copyGlobPatternFiles(
  sourcePath: string,
  destPath: string,
): Promise<{ success: boolean }> {
  const globPattern = isWindowsOS() ? normalizeGlobPathForWindows(sourcePath) : sourcePath;
  const files = await glob(globPattern, { nodir: true });

  if (files.length === 0) {
    logger.error(ERROR_MESSAGES.NO_FILES_MATCH_PATTERN(sourcePath));
    return { success: false };
  }

  await ensureDir(destPath);

  for (const file of files) {
    const fileName = path.basename(file);
    const destFile = path.join(destPath, fileName);
    await copyFile(file, destFile);
    logger.verbose(`Copied file ${file} -> ${destFile}`);
  }

  return { success: true };
}

async function copyDirectPath(sourcePath: string, destPath: string): Promise<{ success: boolean }> {
  if (!(await exists(sourcePath))) {
    logger.error(ERROR_MESSAGES.SOURCE_NOT_FOUND(sourcePath));
    return { success: false };
  }

  const sourceStat = await stat(sourcePath);

  if (sourceStat.isDirectory()) {
    await copyRecursive(sourcePath, destPath);
    logger.verbose(`Copied directory ${sourcePath} -> ${destPath}`);
    return { success: true };
  }

  await copyFile(sourcePath, destPath);
  logger.verbose(`Copied file ${sourcePath} -> ${destPath}`);
  return { success: true };
}

const runExecutor: PromiseExecutor<CopyFilesExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);

  if (!options.files || !Array.isArray(options.files)) {
    logger.error(ERROR_MESSAGES.FILES_MUST_BE_ARRAY);
    return { success: false };
  }

  try {
    for (const { from, to } of options.files) {
      const sourcePath = path.resolve(projectRoot, from);
      const destPath = path.resolve(projectRoot, to);

      const result = containsGlobPattern(from)
        ? await copyGlobPatternFiles(sourcePath, destPath)
        : await copyDirectPath(sourcePath, destPath);

      if (!result.success) {
        return { success: false };
      }
    }

    return { success: true };
  } catch (error) {
    logError(ERROR_MESSAGES.FAILED_TO_COPY, error);
    return { success: false };
  }
};

export default runExecutor;
