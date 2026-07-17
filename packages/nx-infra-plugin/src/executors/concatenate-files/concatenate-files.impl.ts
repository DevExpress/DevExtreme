import * as path from 'path';
import { logger } from '@nx/devkit';
import { glob } from 'glob';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { containsGlobPattern } from '../../utils/common';
import { exists, normalizeEol, readFileText, writeFileText } from '../../utils/file-operations';
import { watchWithChokidar } from '../../utils/watch';
import { ConcatenateFilesExecutorSchema, ConcatenatePass } from './schema';

const ERROR_SOURCE_FILES_EMPTY = 'sourceFiles must contain at least one file';
const ERROR_NO_FILES_RESOLVED = 'No source files found after resolving patterns';
const ERROR_SOURCE_NOT_FOUND = (source: string) => `Source file not found: ${source}`;
const NO_FILES_MATCH_PATTERN = (pattern: string) => `No files found matching pattern: ${pattern}`;

export interface ConcatTransform {
  find: string;
  replace: string;
  flags?: string;
}

export interface ConcatOptions {
  sourceFiles: string[];
  header?: string;
  footer?: string;
  extractPattern?: string;
  extractPatternFlags?: string;
  transforms?: ConcatTransform[];
  normalizeLineEndings?: boolean;
  separator?: string;
}

const DEFAULT_SEPARATOR = '\n';
const DEFAULT_EXTRACT_FLAGS = 'gm';
const DEFAULT_TRANSFORM_FLAGS = 'g';

function compileRegex(pattern: string, flags: string): RegExp {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    throw new Error(
      `Invalid regex pattern '${pattern}' (flags: '${flags}'): ${(error as Error).message}`,
    );
  }
}

function extractContent(content: string, pattern: string, flags: string): string {
  const regex = compileRegex(pattern, flags);
  const match = regex.exec(content);
  return match?.[1] ?? content;
}

function applyTransforms(content: string, transforms: ConcatTransform[]): string {
  return transforms.reduce((result, { find, replace, flags = DEFAULT_TRANSFORM_FLAGS }) => {
    return result.replace(compileRegex(find, flags), replace);
  }, content);
}

function applyHeaderFooter(content: string, header?: string, footer?: string): string {
  let result = content;
  if (header) result = header + result;
  if (footer) result = result + footer;
  return result;
}

export async function concatFiles(opts: ConcatOptions): Promise<string> {
  const contents = await Promise.all(
    opts.sourceFiles.map(async (filePath) => {
      const content = await readFileText(filePath);
      if (opts.extractPattern) {
        return extractContent(
          content,
          opts.extractPattern,
          opts.extractPatternFlags ?? DEFAULT_EXTRACT_FLAGS,
        );
      }
      return content;
    }),
  );

  let output = contents.join(opts.separator ?? DEFAULT_SEPARATOR);

  if (opts.normalizeLineEndings !== false) {
    output = normalizeEol(output);
  }

  output = applyHeaderFooter(output, opts.header, opts.footer);

  if (opts.transforms?.length) {
    output = applyTransforms(output, opts.transforms);
  }

  return output;
}

export async function concatToFile(outputFile: string, opts: ConcatOptions): Promise<void> {
  const content = await concatFiles(opts);
  await writeFileText(outputFile, content);
}

async function resolveGlobPattern(pattern: string, projectRoot: string): Promise<string[]> {
  const sourcePath = path.resolve(projectRoot, pattern);
  const globPattern = toPosixPath(sourcePath);
  const files = await glob(globPattern, { nodir: true });

  if (files.length === 0) {
    logger.verbose(NO_FILES_MATCH_PATTERN(pattern));
  }

  return files.sort();
}

async function resolveExactFile(source: string, projectRoot: string): Promise<string> {
  const sourcePath = path.resolve(projectRoot, source);
  if (!(await exists(sourcePath))) {
    throw new Error(ERROR_SOURCE_NOT_FOUND(source));
  }
  return sourcePath;
}

async function resolveSourceFiles(sourceFiles: string[], projectRoot: string): Promise<string[]> {
  const resolved: string[] = [];

  for (const source of sourceFiles) {
    if (containsGlobPattern(source)) {
      const files = await resolveGlobPattern(source, projectRoot);
      resolved.push(...files);
    } else {
      const file = await resolveExactFile(source, projectRoot);
      resolved.push(file);
    }
  }

  return resolved;
}

// Sources are resolved per pass at run time (not once in `resolve`) so that an
// additional pass can consume a file produced by an earlier pass, and so rebuilds
// re-resolve any glob patterns on each run.
async function runPass(projectRoot: string, pass: ConcatenatePass): Promise<void> {
  if (!pass.sourceFiles?.length) {
    throw new Error(ERROR_SOURCE_FILES_EMPTY);
  }

  const resolvedFiles = await resolveSourceFiles(pass.sourceFiles, projectRoot);
  if (resolvedFiles.length === 0) {
    throw new Error(ERROR_NO_FILES_RESOLVED);
  }

  const outputPath = path.resolve(projectRoot, pass.outputFile);
  logger.verbose(`Concatenating ${resolvedFiles.length} files...`);
  await concatToFile(outputPath, {
    sourceFiles: resolvedFiles,
    header: pass.header,
    footer: pass.footer,
    extractPattern: pass.extractPattern,
    extractPatternFlags: pass.extractPatternFlags,
    transforms: pass.transforms,
    normalizeLineEndings: pass.normalizeLineEndings,
    separator: pass.separator,
  });
  logger.verbose(`Created: ${path.relative(projectRoot, outputPath)}`);
}

async function runAllPasses(
  projectRoot: string,
  options: ConcatenateFilesExecutorSchema,
): Promise<void> {
  await runPass(projectRoot, options);
  for (const pass of options.additionalPasses ?? []) {
    await runPass(projectRoot, pass);
  }
}

async function runWatchBuild(
  projectRoot: string,
  options: ConcatenateFilesExecutorSchema,
): Promise<void> {
  // chokidar v4+ dropped glob support, so expand watch patterns to concrete files upfront.
  const watchTargets = options.watchPaths?.length ? options.watchPaths : options.sourceFiles;
  const watchFiles = await resolveSourceFiles(watchTargets, projectRoot);
  if (watchFiles.length === 0) {
    throw new Error('No watch files found after resolving watchPaths');
  }
  await runAllPasses(projectRoot, options);

  await watchWithChokidar({
    projectRoot,
    watchTargets: watchFiles,
    label: 'concatenate-files watch',
    onRebuild: () => runAllPasses(projectRoot, options),
  });
}

interface ResolvedConcatenate {
  projectRoot: string;
  options: ConcatenateFilesExecutorSchema;
}

export default createExecutor<ConcatenateFilesExecutorSchema, ResolvedConcatenate>({
  name: 'ConcatenateFiles',
  resolve: (options, { projectRoot }) => {
    if (!options.sourceFiles?.length) {
      throw new Error(ERROR_SOURCE_FILES_EMPTY);
    }

    return { projectRoot, options };
  },
  run: async ({ projectRoot, options }) => {
    if (options.watch) {
      await runWatchBuild(projectRoot, options);
      return;
    }

    await runAllPasses(projectRoot, options);
  },
});
