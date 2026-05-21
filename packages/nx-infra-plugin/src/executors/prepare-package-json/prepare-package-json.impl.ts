import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { ensureDir, readJson, writeJson } from '../../utils/file-operations';
import { NpmPackageExecutorSchema } from './schema';

const DEFAULT_SOURCE_PACKAGE_JSON = './package.json';
const DEFAULT_DIST_DIR = './npm';

const PACKAGE_JSON_FILE = 'package.json';
const PUBLISH_CONFIG_FIELD = 'publishConfig';

const JSON_INDENT = 2;

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
  const result: Record<string, unknown> = { ...pkg };

  if (transformations.setName !== undefined) {
    result['name'] = transformations.setName;
  }

  if (transformations.setVersion !== undefined) {
    result['version'] = transformations.setVersion;
  } else if (versionFromValue !== undefined) {
    result['version'] = versionFromValue;
  }

  if (transformations.renameInternalPattern !== undefined) {
    const { find, replace } = transformations.renameInternalPattern;
    result['name'] = String.prototype.replace.call(
      String(result['name']),
      new RegExp(find),
      replace,
    );
  }

  const fieldsToRemove = transformations.removeFields ?? [PUBLISH_CONFIG_FIELD];
  for (const field of fieldsToRemove) {
    delete result[field];
  }

  return result;
}

interface ResolvedPreparePackageJson {
  sourcePackageJson: string;
  distDirectory: string;
  outputFileName: string;
  versionFromPath?: string;
}

export default createExecutor<NpmPackageExecutorSchema, ResolvedPreparePackageJson>({
  name: 'PreparePackageJson',
  resolve: (options, { projectRoot }) => {
    const sourcePackageJson = path.join(
      projectRoot,
      options.sourcePackageJson || DEFAULT_SOURCE_PACKAGE_JSON,
    );
    const distDirectory = path.join(projectRoot, options.distDirectory || DEFAULT_DIST_DIR);
    const outputFileName = options.outputFileName ?? PACKAGE_JSON_FILE;
    const versionFromPath =
      options.setVersion === undefined && options.versionFrom !== undefined
        ? path.join(projectRoot, options.versionFrom)
        : undefined;

    return { sourcePackageJson, distDirectory, outputFileName, versionFromPath };
  },
  run: async (resolved, options) => {
    await ensureDir(resolved.distDirectory);

    const pkg = await readJson<Record<string, unknown>>(resolved.sourcePackageJson);

    let versionFromValue: unknown;
    if (resolved.versionFromPath !== undefined) {
      const versionSource = await readJson<Record<string, unknown>>(resolved.versionFromPath);
      if (versionSource['version'] === undefined) {
        throw new Error(`No 'version' field in ${resolved.versionFromPath}`);
      }
      versionFromValue = versionSource['version'];
    }

    const transformed = applyPackageJsonTransformations(pkg, options, versionFromValue);

    const distPackageJson = path.join(resolved.distDirectory, resolved.outputFileName);
    await writeJson(distPackageJson, transformed, JSON_INDENT);

    logger.verbose(`Created ${distPackageJson}`);
  },
});
