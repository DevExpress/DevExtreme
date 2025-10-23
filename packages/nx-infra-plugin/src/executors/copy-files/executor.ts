import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { CopyFilesExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { copyFile, exists } from '../../utils/file-operations';

const ERROR_FILES_MUST_BE_ARRAY = 'Files option must be an array';
const ERROR_FAILED_TO_COPY = 'Failed to copy files';

const runExecutor: PromiseExecutor<CopyFilesExecutorSchema> = async (
  options,
  context
) => {
  const projectRoot = resolveProjectPath(context);

  if (!options.files || !Array.isArray(options.files)) {
    logger.error(ERROR_FILES_MUST_BE_ARRAY);
    return { success: false };
  }

  try {
    for (const { from, to } of options.files) {
      const sourcePath = path.resolve(projectRoot, from);
      const destPath = path.resolve(projectRoot, to);

      if (!await exists(sourcePath)) {
        logger.error(`Source file not found: ${sourcePath}`);
        return { success: false };
      }

      await copyFile(sourcePath, destPath);
      logger.info(`Copied ${sourcePath} -> ${destPath}`);
    }

    return { success: true };
  } catch (error) {
    logError(ERROR_FAILED_TO_COPY, error);
    return { success: false };
  }
};

export default runExecutor;
