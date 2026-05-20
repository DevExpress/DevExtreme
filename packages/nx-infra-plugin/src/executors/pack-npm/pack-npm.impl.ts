import * as path from 'path';
import { execSync } from 'child_process';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { PackNpmExecutorSchema } from './schema';

const MSG_PACK_SUCCESS = 'pnpm pack completed successfully';
const ERROR_PROJECT_NAME_MISSING = 'Project name is not defined in context';

interface ResolvedPackNpm {
  projectPath: string;
}

export default createExecutor<PackNpmExecutorSchema, ResolvedPackNpm>({
  name: 'PackNpm',
  resolve: (_options, { context }) => {
    if (!context.projectName) {
      throw new Error(ERROR_PROJECT_NAME_MISSING);
    }
    const projectPath = path.join(context.root, 'packages', context.projectName);
    return { projectPath };
  },
  run: async (resolved) => {
    logger.verbose(`Running pnpm pack from ${resolved.projectPath}...`);

    execSync(`pnpm pack`, {
      cwd: resolved.projectPath,
      stdio: 'inherit',
    });

    logger.verbose(MSG_PACK_SUCCESS);
  },
});
