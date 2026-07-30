import * as path from 'path';
import { logger } from '@nx/devkit';
import { glob } from 'glob';
import { createExecutor } from '../../utils/create-executor';
import { readJson, writeJson } from '../../utils/file-operations';
import { toPosixPath } from '../../utils/path-resolver';
import { GenerateExportsMapExecutorSchema } from './schema';

interface ShimFile {
  main?: string;
  module?: string;
  typings?: string;
}

interface ExportsConditions {
  import?: string;
  require?: string;
  types?: string;
}

type ExportsEntry = string | ExportsConditions;

export function resolveShimEntry(
  shimPath: string,
  shim: ShimFile,
  npmDir: string,
): { key: string; value: ExportsConditions } | null {
  if (!shim.module && !shim.main) {
    return null;
  }

  const shimDir = path.dirname(shimPath);
  const relativeDir = toPosixPath(path.relative(npmDir, shimDir));

  if (!relativeDir || relativeDir === '.') {
    return null;
  }

  const key = './' + relativeDir;
  const value: ExportsConditions = {};

  if (shim.module) {
    const abs = path.resolve(shimDir, shim.module);
    value.import = './' + toPosixPath(path.relative(npmDir, abs));
  }

  if (shim.main) {
    const abs = path.resolve(shimDir, shim.main);
    value.require = './' + toPosixPath(path.relative(npmDir, abs));
  }

  if (shim.typings) {
    const abs = path.resolve(shimDir, shim.typings);
    value.types = './' + toPosixPath(path.relative(npmDir, abs));
  }

  return { key, value };
}

export function buildExportsMap(
  entries: Array<{ key: string; value: ExportsConditions }>,
  assetWildcards: string[],
): Record<string, ExportsEntry> {
  const exportsMap: Record<string, ExportsEntry> = {
    './package.json': './package.json',
  };

  for (const { key, value } of entries) {
    exportsMap[key] = value;
  }

  for (const pattern of assetWildcards) {
    exportsMap[pattern] = pattern;
  }

  return exportsMap;
}

interface ResolvedGenerateExportsMap {
  npmDir: string;
  assetWildcards: string[];
}

export default createExecutor<GenerateExportsMapExecutorSchema, ResolvedGenerateExportsMap>({
  name: 'GenerateExportsMap',
  resolve: (options, { projectRoot }) => ({
    npmDir: path.resolve(projectRoot, options.npmDir),
    assetWildcards: options.assetWildcards ?? [],
  }),
  run: async ({ npmDir, assetWildcards }) => {
    const shimPattern = toPosixPath(path.join(npmDir, '**/package.json'));
    const rootPackageJsonPath = toPosixPath(path.join(npmDir, 'package.json'));

    const shimPaths = await glob(shimPattern, {
      nodir: true,
      absolute: true,
      ignore: [rootPackageJsonPath],
    });

    logger.verbose(`Found ${shimPaths.length} shim files in ${npmDir}`);

    const entries: Array<{ key: string; value: ExportsConditions }> = [];

    for (const shimPath of shimPaths.sort()) {
      const shim = await readJson<ShimFile>(shimPath);
      const entry = resolveShimEntry(shimPath, shim, npmDir);
      if (entry) {
        entries.push(entry);
      }
    }

    const exportsMap = buildExportsMap(entries, assetWildcards);

    const rootPkg = await readJson<Record<string, unknown>>(path.join(npmDir, 'package.json'));
    rootPkg['exports'] = exportsMap;
    await writeJson(path.join(npmDir, 'package.json'), rootPkg);

    logger.info(
      `Generated exports map: ${entries.length} subpath entries, ${assetWildcards.length} asset wildcards`,
    );
  },
});
