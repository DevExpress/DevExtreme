import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively discover TypeScript source files under `rootDir`,
 * excluding specified directories and file names.
 */
export function discoverSourceFiles(
  rootDir: string,
  excludedDirs: Set<string>,
  excludedFileNames: Set<string>,
): string[] {
  const results: string[] = [];

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!excludedDirs.has(entry.name)) {
          walk(fullPath);
        }
      } else if (
        entry.isFile()
        && !excludedFileNames.has(entry.name)
        && entry.name.endsWith('.ts')
        && !entry.name.includes('.test.')
      ) {
        results.push(fullPath);
      }
    });
  }

  walk(rootDir);
  return results.sort();
}

/**
 * Get a forward-slash-separated relative path from `rootDir` to `filePath`.
 */
export function getRelativePath(filePath: string, rootDir: string): string {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}
