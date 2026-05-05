import * as fs from 'fs-extra';
import * as path from 'path';
import * as babel from '@babel/core';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { writeFileText } from '../../utils/file-operations';
import { removeDirectoryRespectingExclusions } from '../clean/clean.impl';
import { StateManagerOptimizeExecutorSchema } from './schema';

const ESM_REEXPORT = "export * from './prod/index';";
const STATE_MANAGER_REL_PATH = path.join('__internal', 'core', 'state_manager');
const ERROR_BABEL_NO_CODE = 'Babel returned no code for CJS state_manager index.js';

const VARIANTS = ['esm', 'cjs'] as const;
type Variant = (typeof VARIANTS)[number];
type ContentBuilder = (indexPath: string) => string;

function transformReexportToCjs(indexPath: string): string {
  const result = babel.transformSync(ESM_REEXPORT, {
    filename: indexPath,
    plugins: [['@babel/plugin-transform-modules-commonjs']],
  });

  if (!result?.code) {
    throw new Error(ERROR_BABEL_NO_CODE);
  }

  return result.code;
}

const CONTENT_BUILDERS: Record<Variant, ContentBuilder> = {
  esm: () => ESM_REEXPORT,
  cjs: (indexPath) => transformReexportToCjs(indexPath),
};

async function optimizeVariant(variant: Variant, transpiledRoot: string): Promise<void> {
  const stateManagerDir = path.join(transpiledRoot, variant, STATE_MANAGER_REL_PATH);

  if (!fs.existsSync(stateManagerDir)) {
    logger.verbose(`Skipping ${variant} state_manager: ${stateManagerDir} does not exist`);
    return;
  }

  const indexPath = path.join(stateManagerDir, 'index.js');
  if (fs.existsSync(indexPath)) {
    await writeFileText(indexPath, CONTENT_BUILDERS[variant](indexPath));
  }

  await removeDirectoryRespectingExclusions(stateManagerDir, [
    indexPath,
    path.join(stateManagerDir, 'prod'),
  ]);
}

async function optimizeTranspiledDir(transpiledDir: string, projectRoot: string): Promise<void> {
  const transpiledRoot = path.join(projectRoot, transpiledDir);
  await Promise.all(VARIANTS.map((variant) => optimizeVariant(variant, transpiledRoot)));
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

    await Promise.all(
      resolved.transpiledDirs.map((transpiledDir) =>
        optimizeTranspiledDir(transpiledDir, resolved.projectRoot),
      ),
    );
  },
});
