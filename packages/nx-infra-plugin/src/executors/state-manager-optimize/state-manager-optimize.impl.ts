import * as path from 'path';
import * as babel from '@babel/core';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { writeFileText } from '../../utils/file-operations';
import { removeDirectoryRespectingExclusions } from '../clean/clean.impl';
import { toPosixPath } from '../../utils/path-resolver';
import { StateManagerOptimizeExecutorSchema } from './schema';

const ESM_REEXPORT = "export * from './prod/index';";
const STATE_MANAGER_INDEX_GLOB = '**/__internal/core/state_manager/index.js';
const ERROR_BABEL_NO_CODE = 'Babel returned no code for CJS state_manager index.js';
const ERROR_NO_STATE_MANAGER_FOUND =
  'No state_manager/index.js found in any configured transpiledDirs';

export function transformReexportToCjs(indexPath: string): string {
  const result = babel.transformSync(ESM_REEXPORT, {
    filename: indexPath,
    plugins: [['@babel/plugin-transform-modules-commonjs']],
  });

  if (!result?.code) {
    throw new Error(ERROR_BABEL_NO_CODE);
  }

  return result.code;
}

function isCjsFile(filePath: string): boolean {
  return toPosixPath(filePath).includes('/cjs/');
}

async function optimizeIndexFile(indexPath: string): Promise<void> {
  const content = isCjsFile(indexPath) ? transformReexportToCjs(indexPath) : ESM_REEXPORT;
  await writeFileText(indexPath, content);

  const stateManagerDir = path.dirname(indexPath);
  await removeDirectoryRespectingExclusions(stateManagerDir, [
    indexPath,
    path.join(stateManagerDir, 'prod'),
  ]);
}

async function optimizeTranspiledDir(transpiledRoot: string): Promise<number> {
  const indexFiles = await glob(STATE_MANAGER_INDEX_GLOB, {
    cwd: toPosixPath(transpiledRoot),
    absolute: true,
    nodir: true,
  });

  logger.verbose(`Found ${indexFiles.length} state_manager index.js file(s) in ${transpiledRoot}`);

  await Promise.all(indexFiles.map(optimizeIndexFile));

  return indexFiles.length;
}

interface ResolvedStateManagerOptimize {
  projectRoot: string;
  transpiledDirs: string[];
}

export default createExecutor<StateManagerOptimizeExecutorSchema, ResolvedStateManagerOptimize>({
  name: 'StateManagerOptimize',
  resolve: (options, { projectRoot }) => ({
    projectRoot,
    transpiledDirs: options.transpiledDirs,
  }),
  run: async (resolved) => {
    logger.verbose(
      `Optimizing state_manager modules in ${resolved.transpiledDirs.length} transpiled tree(s)`,
    );

    const counts = await Promise.all(
      resolved.transpiledDirs.map((transpiledDir) =>
        optimizeTranspiledDir(path.join(resolved.projectRoot, transpiledDir)),
      ),
    );

    const totalFound = counts.reduce((sum, count) => sum + count, 0);

    if (totalFound === 0) {
      throw new Error(
        `${ERROR_NO_STATE_MANAGER_FOUND}: ${resolved.transpiledDirs.join(', ')}. Check transpile output layout or transpiledDirs option.`,
      );
    }
  },
});
