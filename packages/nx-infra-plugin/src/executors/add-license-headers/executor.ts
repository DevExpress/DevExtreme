import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { AddLicenseHeadersExecutorSchema } from './schema';
import { resolveProjectPath, toPosixPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readJson } from '../../utils/file-operations';
import {
  buildLicenseBannerRenderer,
  applyLicenseBannerToFile,
  extractGitHubUrl,
} from '../../utils/license-banner';
import type { PackageJson } from '../../utils/types';
import {
  DEFAULT_LICENSE_TEMPLATE_EULA,
  DEFAULT_LICENSE_TEMPLATE_MIT,
  DEFAULT_EULA_URL,
  DEFAULT_TARGET_DIR,
  DEFAULT_PACKAGE_JSON,
  DEFAULT_INCLUDE_PATTERNS,
  DEFAULT_EXCLUDE_PATTERNS,
} from './defaults';

function resolveTemplatePath(
  absoluteProjectRoot: string,
  options: { licenseTemplateFile?: string; mode?: 'eula' | 'mit' },
): string {
  if (options.licenseTemplateFile) {
    return path.join(absoluteProjectRoot, options.licenseTemplateFile);
  }
  if (options.mode === 'mit') {
    return DEFAULT_LICENSE_TEMPLATE_MIT;
  }
  return DEFAULT_LICENSE_TEMPLATE_EULA;
}

interface DiscoverFilesOptions {
  targetDirectory: string;
  includePatterns: readonly string[];
  excludePatterns: readonly string[];
}

async function discoverFiles(options: DiscoverFilesOptions): Promise<string[]> {
  const { targetDirectory, includePatterns, excludePatterns } = options;
  const cwd = toPosixPath(targetDirectory);

  const allFiles: string[] = [];
  for (const pattern of includePatterns) {
    const matchedFiles = await glob(pattern, {
      cwd,
      absolute: true,
      nodir: true,
      ignore: [...excludePatterns],
    });
    allFiles.push(...matchedFiles);
  }

  return [...new Set(allFiles)];
}

const runExecutor: PromiseExecutor<AddLicenseHeadersExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const targetDirectory = path.join(
    absoluteProjectRoot,
    options.targetDirectory ?? DEFAULT_TARGET_DIR,
  );
  const packageJsonPath = path.join(
    absoluteProjectRoot,
    options.packageJsonPath ?? DEFAULT_PACKAGE_JSON,
  );
  const separator = options.separatorBetweenBannerAndContent ?? '\n';
  const prependAfterLicense = options.prependAfterLicense ?? '';
  const commentType = options.commentType ?? '!';
  const templatePath = resolveTemplatePath(absoluteProjectRoot, options);

  let pkg: PackageJson;
  try {
    pkg = await readJson<PackageJson>(packageJsonPath);
  } catch (error) {
    logError('Failed to read package.json', error);
    return { success: false };
  }

  const githubUrl =
    templatePath === DEFAULT_LICENSE_TEMPLATE_MIT
      ? extractGitHubUrl(pkg.repository, packageJsonPath)
      : '';

  try {
    const files = await discoverFiles({
      targetDirectory,
      includePatterns: options.includePatterns ?? DEFAULT_INCLUDE_PATTERNS,
      excludePatterns: options.excludePatterns ?? DEFAULT_EXCLUDE_PATTERNS,
    });

    logger.verbose(`Adding license headers to ${files.length} files...`);

    const renderBanner = await buildLicenseBannerRenderer({
      templatePath,
      pkg,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      version: options.version,
      commentType,
      githubUrl,
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
