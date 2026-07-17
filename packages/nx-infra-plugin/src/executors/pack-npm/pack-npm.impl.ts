import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import { glob } from 'glob';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { copyFile, ensureDir } from '../../utils/file-operations';
import { PackNpmExecutorSchema } from './schema';

const MSG_PACK_SUCCESS = 'pnpm pack completed successfully';
const ERROR_PACKAGE_DIR_NOT_FOUND = (dir: string) => `PackNpm: packageDir not found: ${dir}`;
const ERROR_SET_VERSION_FROM_NOT_FOUND = (file: string) =>
  `PackNpm: setVersionFrom package.json not found: ${file}`;
const ERROR_VERSION_MISSING = (file: string) =>
  `PackNpm: version field missing in ${file}`;
const ERROR_NO_TARBALLS = (dir: string) =>
  `PackNpm: no *.tgz files found in ${dir} after pnpm pack`;

interface ResolvedPackNpm {
  packageDir: string;
  destination?: string;
  versionToSet?: string;
}

function readVersion(packageJsonPath: string): string {
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(ERROR_SET_VERSION_FROM_NOT_FOUND(packageJsonPath));
  }

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { version?: string };
  if (!pkg.version) {
    throw new Error(ERROR_VERSION_MISSING(packageJsonPath));
  }

  return pkg.version;
}

export default createExecutor<PackNpmExecutorSchema, ResolvedPackNpm>({
  name: 'PackNpm',
  resolve: (options, { projectRoot }) => {
    const packageDir = path.resolve(projectRoot, options.packageDir ?? '.');
    if (!fs.existsSync(packageDir)) {
      throw new Error(ERROR_PACKAGE_DIR_NOT_FOUND(packageDir));
    }

    const destination = options.destination
      ? path.resolve(projectRoot, options.destination)
      : undefined;

    const versionToSet = options.setVersionFrom
      ? readVersion(path.resolve(projectRoot, options.setVersionFrom))
      : undefined;

    return { packageDir, destination, versionToSet };
  },
  run: async (resolved) => {
    if (resolved.versionToSet) {
      logger.verbose(
        `Setting version=${resolved.versionToSet} in ${resolved.packageDir}...`,
      );
      execSync(`pnpm pkg set version="${resolved.versionToSet}"`, {
        cwd: resolved.packageDir,
        stdio: 'inherit',
      });
    }

    logger.verbose(`Running pnpm pack from ${resolved.packageDir}...`);
    execSync('pnpm pack', {
      cwd: resolved.packageDir,
      stdio: 'inherit',
    });
    logger.verbose(MSG_PACK_SUCCESS);

    if (!resolved.destination) {
      return;
    }

    await ensureDir(resolved.destination);

    const tarballs = await glob('*.tgz', {
      cwd: toPosixPath(resolved.packageDir),
      nodir: true,
    });

    if (tarballs.length === 0) {
      throw new Error(ERROR_NO_TARBALLS(resolved.packageDir));
    }

    for (const tarball of tarballs) {
      const from = path.join(resolved.packageDir, tarball);
      const to = path.join(resolved.destination, tarball);
      await copyFile(from, to);
      logger.verbose(`Copied ${from} -> ${to}`);
    }
  },
});
