import * as path from 'path';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import { containsGlobPattern } from './common';
import { toPosixPath } from './path-resolver';

export interface DiscoverFilesOptions {
  cwd: string;
  includePatterns: readonly string[];
  excludePatterns?: readonly string[];
  absolute?: boolean;
  nodir?: boolean;
}

export async function discoverFiles(options: DiscoverFilesOptions): Promise<string[]> {
  const cwd = toPosixPath(options.cwd);
  const ignore = options.excludePatterns?.map(toPosixPath) as string[] | undefined;
  const result = new Set<string>();
  for (const pattern of options.includePatterns) {
    const matches = await glob(pattern, {
      cwd,
      absolute: options.absolute ?? true,
      nodir: options.nodir ?? true,
      ignore,
    });
    for (const file of matches) {
      result.add(file);
    }
  }
  return [...result];
}

export interface ExpandEntriesOptions {
  projectRoot: string;
  excludePatterns?: readonly string[];
}

function isPathExcludedByPatterns(absolutePath: string, patterns: string[]): boolean {
  return patterns.some((pattern) => minimatch(toPosixPath(absolutePath), pattern, { dot: true }));
}

export async function expandEntries(
  entries: readonly string[],
  options: ExpandEntriesOptions,
): Promise<string[]> {
  const ignorePatterns = options.excludePatterns?.map((pattern) =>
    toPosixPath(path.resolve(options.projectRoot, pattern)),
  );

  const result = new Set<string>();
  for (const entry of entries) {
    const absolute = path.resolve(options.projectRoot, entry);
    if (containsGlobPattern(entry)) {
      const matches = await glob(toPosixPath(absolute), { nodir: true, ignore: ignorePatterns });
      for (const file of matches) {
        result.add(file);
      }
    } else if (!ignorePatterns || !isPathExcludedByPatterns(absolute, ignorePatterns)) {
      result.add(absolute);
    }
  }
  return [...result];
}
