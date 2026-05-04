import * as path from 'path';
import * as fs from 'fs/promises';
import { stat } from 'fs/promises';
import { logger } from '@nx/devkit';
import { glob } from 'glob';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { containsGlobPattern } from '../../utils/common';
import { copyFile, copyRecursive, ensureDir, exists } from '../../utils/file-operations';
import { CopyFilesExecutorSchema } from './schema';

const ERROR_FILES_MUST_BE_ARRAY = 'Files option must be an array';
const ERROR_NO_FILES_MATCH_PATTERN = (pattern: string) =>
  `No files found matching pattern: ${pattern}`;
const ERROR_SOURCE_NOT_FOUND = (source: string) => `Source file not found: ${source}`;

export interface CopyDirectoryOptions {
  include?: string[];
  exclude?: string[];
}

export async function copyDirectory(
  sourceDir: string,
  destDir: string,
  options: CopyDirectoryOptions = {},
): Promise<void> {
  const includePatterns = options.include ?? ['**/*'];
  const excludePatterns = options.exclude ?? [];
  const cwd = toPosixPath(sourceDir);

  const relPaths = new Set<string>();
  for (const pattern of includePatterns) {
    const matches = await glob(pattern, {
      cwd,
      nodir: true,
      ignore: excludePatterns,
    });
    matches.forEach((m) => relPaths.add(m));
  }

  await Promise.all(
    [...relPaths].map(async (relPath) => {
      const src = path.join(sourceDir, relPath);
      const dest = path.join(destDir, relPath);
      await ensureDir(path.dirname(dest));
      await fs.copyFile(src, dest);
    }),
  );
}

async function copyGlobPatternFiles(
  sourcePath: string,
  destPath: string,
  excludePatterns: string[] = [],
): Promise<void> {
  const globPattern = toPosixPath(sourcePath);
  const ignore = excludePatterns.map(toPosixPath);
  const files = await glob(globPattern, { nodir: true, ignore });

  if (files.length === 0) {
    throw new Error(ERROR_NO_FILES_MATCH_PATTERN(sourcePath));
  }

  await ensureDir(destPath);

  for (const file of files) {
    const fileName = path.basename(file);
    const destFile = path.join(destPath, fileName);
    await copyFile(file, destFile);
    logger.verbose(`Copied file ${file} -> ${destFile}`);
  }
}

async function copyDirectPath(sourcePath: string, destPath: string): Promise<void> {
  if (!(await exists(sourcePath))) {
    throw new Error(ERROR_SOURCE_NOT_FOUND(sourcePath));
  }

  const sourceStat = await stat(sourcePath);

  if (sourceStat.isDirectory()) {
    await copyRecursive(sourcePath, destPath);
    logger.verbose(`Copied directory ${sourcePath} -> ${destPath}`);
    return;
  }

  await copyFile(sourcePath, destPath);
  logger.verbose(`Copied file ${sourcePath} -> ${destPath}`);
}

interface ResolvedCopyFiles {
  projectRoot: string;
}

export default createExecutor<CopyFilesExecutorSchema, ResolvedCopyFiles>({
  name: 'CopyFiles',
  resolve: (options, { projectRoot }) => {
    if (!options.files || !Array.isArray(options.files)) {
      throw new Error(ERROR_FILES_MUST_BE_ARRAY);
    }
    return { projectRoot };
  },
  run: async ({ projectRoot }, options) => {
    for (const { from, to, excludePatterns } of options.files) {
      const sourcePath = path.resolve(projectRoot, from);
      const destPath = path.resolve(projectRoot, to);

      if (containsGlobPattern(from)) {
        await copyGlobPatternFiles(sourcePath, destPath, excludePatterns);
      } else {
        await copyDirectPath(sourcePath, destPath);
      }
    }
  },
});

export { ResolvedCopyFiles };
