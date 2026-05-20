import { execSync } from 'child_process';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { PackNpmExecutorSchema } from './schema';

const MSG_PACK_SUCCESS = 'pnpm pack completed successfully';

interface ResolvedPackNpm {
  projectPath: string;
}

export default createExecutor<PackNpmExecutorSchema, ResolvedPackNpm>({
  name: 'PackNpm',
  resolve: (_options, { projectRoot }) => ({ projectPath: projectRoot }),
  run: async (resolved) => {
    logger.verbose(`Running pnpm pack from ${resolved.projectPath}...`);

    execSync(`pnpm pack`, {
      cwd: resolved.projectPath,
      stdio: 'inherit',
    });

    logger.verbose(MSG_PACK_SUCCESS);
  },
});
