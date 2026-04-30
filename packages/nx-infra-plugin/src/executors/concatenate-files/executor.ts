import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { ConcatenateFilesExecutorSchema } from './schema';
import { resolveProjectPath, toPosixPath } from '../../utils/path-resolver';
import { containsGlobPattern } from '../../utils/common';
import { logError } from '../../utils/error-handler';
import { exists } from '../../utils/file-operations';
import { concatToFile } from '../../utils/concat-content';

const ERROR_MESSAGES = {
  SOURCE_FILES_EMPTY: 'sourceFiles must contain at least one file',
  SOURCE_NOT_FOUND: (source: string) => `Source file not found: ${source}`,
  NO_FILES_MATCH_PATTERN: (pattern: string) => `No files found matching pattern: ${pattern}`,
  NO_FILES_RESOLVED: 'No source files found after resolving patterns',
  FAILED_TO_CONCATENATE: 'Failed to concatenate files',
} as const;

async function resolveGlobPattern(pattern: string, projectRoot: string): Promise<string[]> {
  const sourcePath = path.resolve(projectRoot, pattern);
  const globPattern = toPosixPath(sourcePath);
  const files = await glob(globPattern, { nodir: true });

  if (files.length === 0) {
    logger.verbose(ERROR_MESSAGES.NO_FILES_MATCH_PATTERN(pattern));
  }

  return files.sort();
}

async function resolveExactFile(source: string, projectRoot: string): Promise<string> {
  const sourcePath = path.resolve(projectRoot, source);
  if (!(await exists(sourcePath))) {
    throw new Error(ERROR_MESSAGES.SOURCE_NOT_FOUND(source));
  }
  return sourcePath;
}

async function resolveSourceFiles(sourceFiles: string[], projectRoot: string): Promise<string[]> {
  const resolvedFiles: string[] = [];

  for (const source of sourceFiles) {
    if (containsGlobPattern(source)) {
      const files = await resolveGlobPattern(source, projectRoot);
      resolvedFiles.push(...files);
    } else {
      const file = await resolveExactFile(source, projectRoot);
      resolvedFiles.push(file);
    }
  }

  return resolvedFiles;
}

const runExecutor: PromiseExecutor<ConcatenateFilesExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);

  if (!options.sourceFiles?.length) {
    logger.error(ERROR_MESSAGES.SOURCE_FILES_EMPTY);
    return { success: false };
  }

  try {
    const resolvedFiles = await resolveSourceFiles(options.sourceFiles, projectRoot);

    if (resolvedFiles.length === 0) {
      logger.error(ERROR_MESSAGES.NO_FILES_RESOLVED);
      return { success: false };
    }

    logger.verbose(`Concatenating ${resolvedFiles.length} files...`);

    const outputPath = path.resolve(projectRoot, options.outputFile);
    await concatToFile(outputPath, {
      sourceFiles: resolvedFiles,
      header: options.header,
      footer: options.footer,
      extractPattern: options.extractPattern,
      extractPatternFlags: options.extractPatternFlags,
      transforms: options.transforms,
      normalizeLineEndings: options.normalizeLineEndings,
      separator: options.separator,
    });
    logger.verbose(`Created: ${path.relative(projectRoot, outputPath)}`);

    return { success: true };
  } catch (error) {
    logError(ERROR_MESSAGES.FAILED_TO_CONCATENATE, error);
    return { success: false };
  }
};

export default runExecutor;
