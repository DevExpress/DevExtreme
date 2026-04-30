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

interface PackageJsonTransformations {
  setName?: string;
  setVersion?: string;
  renameInternalPattern?: { find: string; replace: string };
  removeFields?: string[];
}

function applyPackageJsonTransformations(
  pkg: Record<string, unknown>,
  transformations: PackageJsonTransformations,
  versionFromValue?: unknown,
): Record<string, unknown> {
  if (transformations.setName !== undefined) {
    pkg['name'] = transformations.setName;
  }

  if (transformations.setVersion !== undefined) {
    pkg['version'] = transformations.setVersion;
  } else if (versionFromValue !== undefined) {
    pkg['version'] = versionFromValue;
  }

  if (transformations.renameInternalPattern !== undefined) {
    const { find, replace } = transformations.renameInternalPattern;
    pkg['name'] = String.prototype.replace.call(String(pkg['name']), new RegExp(find), replace);
  }

  const fieldsToRemove = transformations.removeFields ?? [PUBLISH_CONFIG_FIELD];
  for (const field of fieldsToRemove) {
    delete pkg[field];
  }

  return pkg;
}

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

    let versionFromValue: unknown;
    if (options.setVersion === undefined && options.versionFrom !== undefined) {
      const versionSourcePath = path.join(absoluteProjectRoot, options.versionFrom);
      const versionSource = await readJson<Record<string, unknown>>(versionSourcePath);
      if (versionSource['version'] === undefined) {
        throw new Error(`No 'version' field in ${versionSourcePath}`);
      }
      versionFromValue = versionSource['version'];
    }

    applyPackageJsonTransformations(pkg, options, versionFromValue);

    const outputFileName = options.outputFileName ?? PACKAGE_JSON_FILE;
    const distPackageJson = path.join(distDirectory, outputFileName);
    await writeJson(distPackageJson, pkg, JSON_INDENT);

    logger.verbose(`Created ${distPackageJson}`);

    return { success: true };
  } catch (error) {
    logError(ERROR_PREPARE_PACKAGE_JSON, error);
    return { success: false };
  }
};

export default runExecutor;
