import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ensureDir } from './file-operations';
import { toPosixPath } from './path-resolver';

export async function copyDirectory(
  sourceDir: string,
  destDir: string,
  options: { include?: string[]; exclude?: string[] } = {},
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
