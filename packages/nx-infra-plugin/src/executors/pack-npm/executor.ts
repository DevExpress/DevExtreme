import { PromiseExecutor, logger } from '@nx/devkit';
import { execSync } from 'child_process';
import path from 'path';
import { PackNpmExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';

const DEFAULT_DIST_DIR = './npm';

const MSG_PACK_SUCCESS = 'pnpm pack completed successfully';
const MSG_PACK_FAILED = 'Failed to run pnpm pack';

const runExecutor: PromiseExecutor<PackNpmExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const distDirectory = options.workingDirectory || DEFAULT_DIST_DIR;
  const workspaceRoot = context.root;

  if (!context.projectName) {
    logError(MSG_PACK_FAILED, 'Project name is not defined in context');
    return { success: false };
  }

  try {
    logger.verbose(`Running pnpm pack from ${absoluteProjectRoot} (packaging ${distDirectory})...`);

    const projectPath = path.join(workspaceRoot, 'packages', context.projectName);

    execSync(`pnpm pack`, {
      cwd: projectPath,
      stdio: 'inherit',
    });

    logger.verbose(MSG_PACK_SUCCESS);
    return { success: true };
  } catch (error) {
    logError(MSG_PACK_FAILED, error);
    return { success: false };
  }
};

export default runExecutor;
