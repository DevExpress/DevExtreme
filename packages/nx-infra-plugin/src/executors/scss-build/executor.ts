import { PromiseExecutor, logger } from '@nx/devkit';
import { spawnSync } from 'child_process';
import { ScssBuildExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';

const DEFAULT_GULP_BINARY = 'gulp';
const DEFAULT_ALL_TASK = 'style-compiler-themes';
const DEFAULT_CI_TASK = 'style-compiler-themes-ci';

function resolveTaskName(options: ScssBuildExecutorSchema): string {
  const allTaskName = options.allTaskName || DEFAULT_ALL_TASK;
  const ciTaskName = options.ciTaskName || DEFAULT_CI_TASK;

  return options.mode === 'ci' ? ciTaskName : allTaskName;
}

const runExecutor: PromiseExecutor<ScssBuildExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const taskName = resolveTaskName(options);
  const gulpBinary = options.gulpBinary || DEFAULT_GULP_BINARY;

  logger.verbose(`Running SCSS build task "${taskName}" in mode "${options.mode}"`);

  const result = spawnSync('pnpm', ['exec', gulpBinary, taskName], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });

  if (result.error) {
    logger.error(`Failed to execute SCSS build task "${taskName}": ${result.error.message}`);
    return { success: false };
  }

  if (result.status !== 0) {
    logger.error(`SCSS build task "${taskName}" failed with exit code ${result.status ?? 1}`);
    return { success: false };
  }

  return { success: true };
};

export default runExecutor;
