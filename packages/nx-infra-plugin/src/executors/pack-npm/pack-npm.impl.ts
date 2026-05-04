import * as path from 'path';
import { execSync } from 'child_process';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { PackNpmExecutorSchema } from './schema';

const DEFAULT_DIST_DIR = './npm';

const MSG_PACK_SUCCESS = 'pnpm pack completed successfully';
const ERROR_PROJECT_NAME_MISSING = 'Project name is not defined in context';

interface ResolvedPackNpm {
  projectRoot: string;
  projectPath: string;
  distDirectory: string;
}

export default createExecutor<PackNpmExecutorSchema, ResolvedPackNpm>({
  name: 'PackNpm',
  resolve: (options, { projectRoot, context }) => {
    if (!context.projectName) {
      throw new Error(ERROR_PROJECT_NAME_MISSING);
    }
    const distDirectory = options.workingDirectory || DEFAULT_DIST_DIR;
    const projectPath = path.join(context.root, 'packages', context.projectName);
    return { projectRoot, projectPath, distDirectory };
  },
  run: async (resolved) => {
    logger.verbose(
      `Running pnpm pack from ${resolved.projectRoot} (packaging ${resolved.distDirectory})...`,
    );

    execSync(`pnpm pack`, {
      cwd: resolved.projectPath,
      stdio: 'inherit',
    });

    logger.verbose(MSG_PACK_SUCCESS);
  },
});
