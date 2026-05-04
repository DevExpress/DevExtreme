import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { AddLicenseHeadersExecutorSchema } from './schema';
import { resolveProjectPath, toPosixPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readJson } from '../../utils/file-operations';
import { buildLicenseBannerRenderer, applyLicenseBannerToFile } from '../../utils/license-banner';
import { DEFAULT_LICENSE_TEMPLATE_FILE, DEFAULT_EULA_URL } from '../../license-defaults';

interface PackageJson {
  name: string;
  version: string;
  repository?: string | { url?: string };
}

const DEFAULTS = {
  TARGET_DIR: './npm',
  PACKAGE_JSON: './package.json',
  INCLUDE_PATTERNS: ['**/*.{ts,js}'],
  EXCLUDE_PATTERNS: ['**/*.json', '**/*.map'],
} as const;

interface DiscoverFilesOptions {
  targetDirectory: string;
  includePatterns: readonly string[];
  excludePatterns: readonly string[];
}

async function discoverFiles(options: DiscoverFilesOptions): Promise<string[]> {
  const { targetDirectory, includePatterns, excludePatterns } = options;

  const patterns = includePatterns.map((pattern) => {
    const fullPath = path.join(targetDirectory, pattern);
    return toPosixPath(fullPath);
  });

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    const matchedFiles = await glob(pattern, { ignore: [...excludePatterns] });
    allFiles.push(...matchedFiles);
  }

  return [...new Set(allFiles)];
}

const runExecutor: PromiseExecutor<AddLicenseHeadersExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const targetDirectory = path.join(
    absoluteProjectRoot,
    options.targetDirectory ?? DEFAULTS.TARGET_DIR,
  );
  const packageJsonPath = path.join(
    absoluteProjectRoot,
    options.packageJsonPath ?? DEFAULTS.PACKAGE_JSON,
  );
  const separator = options.separatorBetweenBannerAndContent ?? '\n';
  const prependAfterLicense = options.prependAfterLicense ?? '';
  const commentType = options.commentType ?? '!';
  const templatePath = path.join(
    absoluteProjectRoot,
    options.licenseTemplateFile ?? DEFAULT_LICENSE_TEMPLATE_FILE,
  );

  let pkg: PackageJson;
  try {
    pkg = await readJson<PackageJson>(packageJsonPath);
  } catch (error) {
    logError('Failed to read package.json', error);
    return { success: false };
  }

  try {
    const files = await discoverFiles({
      targetDirectory,
      includePatterns: options.includePatterns ?? DEFAULTS.INCLUDE_PATTERNS,
      excludePatterns: options.excludePatterns ?? DEFAULTS.EXCLUDE_PATTERNS,
    });

    logger.verbose(`Adding license headers to ${files.length} files...`);

    const renderBanner = await buildLicenseBannerRenderer({
      templatePath,
      pkg,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      version: options.version,
      commentType,
    });

    await Promise.all(
      files.map(async (file) => {
        const fileRelative = path.relative(targetDirectory, file).replace(/\\/g, '/');
        const banner = renderBanner(fileRelative);
        await applyLicenseBannerToFile(file, banner, {
          separator,
          prependAfterLicense,
        });
      }),
    );

    logger.verbose('License headers added successfully');
    return { success: true };
  } catch (error) {
    logError('Failed to add license headers', error);
    return { success: false };
  }
};

export default runExecutor;
