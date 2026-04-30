import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import _ from 'lodash';
import { AddLicenseHeadersExecutorSchema } from './schema';
import { resolveProjectPath, normalizeGlobPathForWindows } from '../../utils/path-resolver';
import { isWindowsOS } from '../../utils/common';
import { logError } from '../../utils/error-handler';
import { readJson, readFileText, writeFileText } from '../../utils/file-operations';

interface PackageJson {
  name: string;
  version: string;
  repository?: string | { url?: string };
}

interface BaseTemplateData {
  pkg: PackageJson;
  date: string;
  year: number;
  githubUrl: string;
  eula: string;
  version: string;
}

interface FileTemplateData extends BaseTemplateData {
  file: {
    relative: string;
  };
  commentType: string;
}

const DEFAULTS = {
  TARGET_DIR: './npm',
  PACKAGE_JSON: './package.json',
  INCLUDE_PATTERNS: ['**/*.{ts,js}'],
  EXCLUDE_PATTERNS: ['**/*.json', '**/*.map'],
} as const;

const COMMENT = {
  OPEN: '/*',
  END: ' */',
  PREFIX: ' *',
} as const;

const CHARS = {
  NEWLINE: '\n',
  EMPTY_LINE: '',
} as const;

const BANNER = {
  PKG_NAME: `${COMMENT.PREFIX} <%= pkg.name %>`,
  VERSION: `${COMMENT.PREFIX} Version: <%= pkg.version %>`,
  BUILD_DATE: `${COMMENT.PREFIX} Build date: <%= date %>`,
  COPYRIGHT: `${COMMENT.PREFIX} Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED`,
  LICENSE_LINE1: `${COMMENT.PREFIX} This software may be modified and distributed under the terms`,
  LICENSE_LINE2: `${COMMENT.PREFIX} of the MIT license. See the LICENSE file in the root of the project for details.`,
  GITHUB: `${COMMENT.PREFIX} <%= githubUrl %>`,
} as const;

const TEMPLATE_REGEX = /<%=\s*(\w+(?:\.\w+)*)\s*%>/g;

function extractGitHubUrl(
  repository: string | { url?: string } | undefined,
  packageJsonPath: string,
): string {
  if (!repository) {
    throw new Error(
      `Missing 'repository' field in ${packageJsonPath}. License headers require a repository URL.`,
    );
  }

  const rawUrl = typeof repository === 'string' ? repository : repository.url;

  if (!rawUrl) {
    throw new Error(
      `Invalid 'repository' format in ${packageJsonPath}. Expected string or object with 'url' property.`,
    );
  }

  return rawUrl.replace(/^git\+/, '').replace(/\.git$/, '');
}

function buildDefaultBannerTemplate(commentType: string): string {
  const marker = `${COMMENT.OPEN}${commentType}`;
  return [
    marker,
    BANNER.PKG_NAME,
    BANNER.VERSION,
    BANNER.BUILD_DATE,
    COMMENT.PREFIX,
    BANNER.COPYRIGHT,
    COMMENT.PREFIX,
    BANNER.LICENSE_LINE1,
    BANNER.LICENSE_LINE2,
    COMMENT.PREFIX,
    BANNER.GITHUB,
    COMMENT.END,
    CHARS.EMPTY_LINE,
  ].join(CHARS.NEWLINE);
}

function renderTemplate(template: string, data: unknown): string {
  return template.replace(TEMPLATE_REGEX, (_match, key) => {
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return '';
      }
    }

    return String(value);
  });
}

interface DiscoverFilesOptions {
  targetDirectory: string;
  includePatterns: readonly string[];
  excludePatterns: readonly string[];
}

async function discoverFiles(options: DiscoverFilesOptions): Promise<string[]> {
  const { targetDirectory, includePatterns, excludePatterns } = options;

  const patterns = includePatterns.map((pattern) => {
    const fullPath = path.join(targetDirectory, pattern);
    return isWindowsOS() ? normalizeGlobPathForWindows(fullPath) : fullPath;
  });

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    const matchedFiles = await glob(pattern, { ignore: [...excludePatterns] });
    allFiles.push(...matchedFiles);
  }

  return [...new Set(allFiles)];
}

interface ProcessFileOptions {
  file: string;
  targetDirectory: string;
  baseData: BaseTemplateData;
  bannerTemplate: string;
  compiledTemplate: ReturnType<typeof _.template> | null;
  useCustomTemplate: boolean;
  separatorBetweenBannerAndContent: string;
  prependAfterLicense: string;
  commentType: string;
}

async function processFile(options: ProcessFileOptions): Promise<void> {
  const {
    file,
    targetDirectory,
    baseData,
    bannerTemplate,
    compiledTemplate,
    useCustomTemplate,
    separatorBetweenBannerAndContent,
    prependAfterLicense,
    commentType,
  } = options;

  const content = await readFileText(file);

  if (content.startsWith(COMMENT.OPEN + commentType)) {
    return;
  }

  const relativePath = path.relative(targetDirectory, file).replace(/\\/g, '/');
  const fileData: FileTemplateData = {
    ...baseData,
    file: { relative: relativePath },
    commentType,
  };

  const banner = useCustomTemplate
    ? compiledTemplate!(fileData)
    : renderTemplate(bannerTemplate, fileData);

  const finalContent = banner + separatorBetweenBannerAndContent + prependAfterLicense + content;
  await writeFileText(file, finalContent);
}

interface LoadTemplateResult {
  success: true;
  template: string;
}

interface LoadTemplateError {
  success: false;
}

async function loadBannerTemplate(
  absoluteProjectRoot: string,
  licenseTemplateFile: string | undefined,
  commentType: string,
): Promise<LoadTemplateResult | LoadTemplateError> {
  if (!licenseTemplateFile) {
    return { success: true, template: buildDefaultBannerTemplate(commentType) };
  }

  const templatePath = path.join(absoluteProjectRoot, licenseTemplateFile);
  try {
    const template = await readFileText(templatePath);
    return { success: true, template };
  } catch (error) {
    logError(`Failed to read license template: ${templatePath}`, error);
    return { success: false };
  }
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
  const separatorBetweenBannerAndContent =
    options.separatorBetweenBannerAndContent ?? CHARS.NEWLINE;
  const prependAfterLicense = options.prependAfterLicense ?? '';
  const useCustomTemplate = !!options.licenseTemplateFile;
  const commentType = options.commentType ?? '!';

  let pkg: PackageJson;
  try {
    pkg = await readJson(packageJsonPath);
  } catch (error) {
    logError('Failed to read package.json', error);
    return { success: false };
  }

  const githubUrl = useCustomTemplate ? '' : extractGitHubUrl(pkg.repository, packageJsonPath);

  const templateResult = await loadBannerTemplate(
    absoluteProjectRoot,
    options.licenseTemplateFile,
    commentType,
  );
  if (!templateResult.success) {
    return { success: false };
  }
  const bannerTemplate = templateResult.template;

  const now = new Date();
  const baseData: BaseTemplateData = {
    pkg,
    date: now.toDateString(),
    year: now.getFullYear(),
    githubUrl,
    eula: options.eulaUrl ?? '',
    version: options.version ?? pkg.version,
  };

  try {
    const files = await discoverFiles({
      targetDirectory,
      includePatterns: options.includePatterns ?? DEFAULTS.INCLUDE_PATTERNS,
      excludePatterns: options.excludePatterns ?? DEFAULTS.EXCLUDE_PATTERNS,
    });

    logger.verbose(`Adding license headers to ${files.length} files...`);

    const compiledTemplate = useCustomTemplate ? _.template(bannerTemplate) : null;

    await Promise.all(
      files.map((file) =>
        processFile({
          file,
          targetDirectory,
          baseData,
          bannerTemplate,
          compiledTemplate,
          useCustomTemplate,
          separatorBetweenBannerAndContent,
          prependAfterLicense,
          commentType,
        }),
      ),
    );

    logger.verbose('License headers added successfully');
    return { success: true };
  } catch (error) {
    logError('Failed to add license headers', error);
    return { success: false };
  }
};

export default runExecutor;
