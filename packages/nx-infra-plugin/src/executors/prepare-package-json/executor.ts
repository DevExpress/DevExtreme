import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { NpmPackageExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { ensureDir, readJson, writeJson } from '../../utils/file-operations';

const DEFAULT_SOURCE_PACKAGE_JSON = './package.json';
const DEFAULT_DIST_DIR = './npm';

const PACKAGE_JSON_FILE = 'package.json';
const PUBLISH_CONFIG_FIELD = 'publishConfig';

const JSON_INDENT = 2;

const ERROR_PREPARE_PACKAGE_JSON = 'Failed to prepare package.json';

const runExecutor: PromiseExecutor<NpmPackageExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const sourcePackageJson = path.join(
    absoluteProjectRoot,
    options.sourcePackageJson || DEFAULT_SOURCE_PACKAGE_JSON,
  );
  const distDirectory = path.join(absoluteProjectRoot, options.distDirectory || DEFAULT_DIST_DIR);

  try {
    await ensureDir(distDirectory);

    const pkg = await readJson<Record<string, unknown>>(sourcePackageJson);
    delete pkg[PUBLISH_CONFIG_FIELD];

    const distPackageJson = path.join(distDirectory, PACKAGE_JSON_FILE);
    await writeJson(distPackageJson, pkg, JSON_INDENT);

    logger.info(`Created ${distPackageJson}`);

    return { success: true };
  } catch (error) {
    logError(ERROR_PREPARE_PACKAGE_JSON, error);
    return { success: false };
  }
};

export default runExecutor;
