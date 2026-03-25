import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { ConcatenateFilesExecutorSchema, TransformRule } from './schema';
import { resolveProjectPath, normalizeGlobPathForWindows } from '../../utils/path-resolver';
import { isWindowsOS } from '../../utils/common';
import { logError } from '../../utils/error-handler';
import { readFileText, writeFileText, exists } from '../../utils/file-operations';

const ERROR_MESSAGES = {
  SOURCE_FILES_EMPTY: 'sourceFiles must contain at least one file',
  SOURCE_NOT_FOUND: (source: string) => `Source file not found: ${source}`,
  NO_FILES_MATCH_PATTERN: (pattern: string) => `No files found matching pattern: ${pattern}`,
  NO_FILES_RESOLVED: 'No source files found after resolving patterns',
  FAILED_TO_CONCATENATE: 'Failed to concatenate files',
} as const;

function containsGlobPattern(pattern: string): boolean {
  return /[*?[\]{}]/.test(pattern);
}

function extractContent(content: string, pattern: string, flags: string): string {
  try {
    const regex = new RegExp(pattern, flags);
    const match = regex.exec(content);
    return match?.[1] ?? content;
  } catch {
    logger.verbose(`Invalid extractPattern: ${pattern}. Using original content.`);
    return content;
  }
}

function applyTransforms(content: string, transforms: TransformRule[]): string {
  return transforms.reduce((result, { find, replace, flags = 'g' }) => {
    try {
      return result.replace(new RegExp(find, flags), replace);
    } catch {
      logger.verbose(`Invalid transform pattern: ${find}. Skipping.`);
      return result;
    }
  }, content);
}

function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function applyHeaderFooter(content: string, header?: string, footer?: string): string {
  let result = content;
  if (header) result = header + result;
  if (footer) result = result + footer;
  return result;
}

async function resolveGlobPattern(pattern: string, projectRoot: string): Promise<string[]> {
  const sourcePath = path.resolve(projectRoot, pattern);
  const globPattern = isWindowsOS() ? normalizeGlobPathForWindows(sourcePath) : sourcePath;
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

async function processFileContent(
  filePath: string,
  extractPattern?: string,
  extractPatternFlags?: string,
): Promise<string> {
  const content = await readFileText(filePath);

  if (extractPattern) {
    return extractContent(content, extractPattern, extractPatternFlags || 'gm');
  }

  return content;
}

async function readAndProcessFiles(
  files: string[],
  projectRoot: string,
  options: Pick<ConcatenateFilesExecutorSchema, 'extractPattern' | 'extractPatternFlags'>,
): Promise<string[]> {
  return Promise.all(
    files.map(async (filePath) => {
      const content = await processFileContent(
        filePath,
        options.extractPattern,
        options.extractPatternFlags,
      );
      logger.verbose(`Processed: ${path.relative(projectRoot, filePath)}`);
      return content;
    }),
  );
}

function buildOutput(
  contents: string[],
  options: Pick<
    ConcatenateFilesExecutorSchema,
    'separator' | 'normalizeLineEndings' | 'header' | 'footer' | 'transforms'
  >,
): string {
  let output = contents.join(options.separator ?? '\n');

  if (options.normalizeLineEndings !== false) {
    output = normalizeLineEndings(output);
  }

  output = applyHeaderFooter(output, options.header, options.footer);

  if (options.transforms?.length) {
    output = applyTransforms(output, options.transforms);
  }

  return output;
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

    const contents = await readAndProcessFiles(resolvedFiles, projectRoot, options);
    const output = buildOutput(contents, options);

    const outputPath = path.resolve(projectRoot, options.outputFile);
    await writeFileText(outputPath, output);
    logger.verbose(`Created: ${path.relative(projectRoot, outputPath)}`);

    return { success: true };
  } catch (error) {
    logError(ERROR_MESSAGES.FAILED_TO_CONCATENATE, error);
    return { success: false };
  }
};

export default runExecutor;
