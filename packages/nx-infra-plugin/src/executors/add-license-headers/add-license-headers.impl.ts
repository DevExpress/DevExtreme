import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { discoverFiles } from '../../utils/glob-discovery';
import { readJson } from '../../utils/file-operations';
import {
  applyLicenseBannerToFile,
  buildLicenseBannerRenderer,
  extractGitHubUrl,
} from '../../utils/license-banner';
import type { PackageJson } from '../../utils/types';
import { AddLicenseHeadersExecutorSchema } from './schema';
import {
  DEFAULT_EULA_URL,
  DEFAULT_EXCLUDE_PATTERNS,
  DEFAULT_INCLUDE_PATTERNS,
  DEFAULT_LICENSE_TEMPLATE_MIT,
  DEFAULT_PACKAGE_JSON,
  DEFAULT_TARGET_DIR,
  LicenseMode,
  resolveLicenseTemplate,
} from './defaults';

const FORWARD_SLASH = '/';
const BACKSLASH_REGEX = /\\/g;
const UNKNOWN_PACKAGE_JSON = '<unknown package.json>';
const DEFAULT_SEPARATOR = '\n';
const DEFAULT_PREPEND_AFTER_LICENSE = '';

export type CommentType = '!' | '*';
export type FilenameMode = 'relative' | 'basename';

const DEFAULT_COMMENT_TYPE: CommentType = '!';
const DEFAULT_FILENAME_MODE: FilenameMode = 'relative';

export interface BannerInputs {
  pkg: PackageJson;
  templatePath: string;
  eulaUrl?: string;
  mode?: LicenseMode;
  packageJsonPath?: string;
  version?: string;
  commentType?: CommentType;
}

export interface BannerApplyOptions {
  separator?: string;
  prependAfterLicense?: string;
  filenameMode?: FilenameMode;
}

type RenderBannerFn = (fileName: string) => string;

function computeFilename(
  filenameMode: FilenameMode | undefined,
  baseDir: string,
  file: string,
): string {
  if (filenameMode === 'basename') {
    return path.basename(file);
  }
  return path.relative(baseDir, file).replace(BACKSLASH_REGEX, FORWARD_SLASH);
}

async function buildBannerRenderer(inputs: BannerInputs): Promise<RenderBannerFn> {
  const githubUrl =
    inputs.templatePath === DEFAULT_LICENSE_TEMPLATE_MIT
      ? extractGitHubUrl(inputs.pkg.repository, inputs.packageJsonPath ?? UNKNOWN_PACKAGE_JSON)
      : '';

  return buildLicenseBannerRenderer({
    templatePath: inputs.templatePath,
    pkg: inputs.pkg,
    eulaUrl: inputs.eulaUrl ?? DEFAULT_EULA_URL,
    version: inputs.version,
    commentType: inputs.commentType ?? DEFAULT_COMMENT_TYPE,
    githubUrl,
  });
}

export async function renderLicenseBannerForName(
  inputs: BannerInputs,
  fileName: string,
): Promise<string> {
  const renderer = await buildBannerRenderer(inputs);
  return renderer(fileName);
}

export interface ApplyLicenseHeadersToFilesOptions extends BannerInputs, BannerApplyOptions {
  files: readonly string[];
  baseDir: string;
}

export async function applyLicenseHeadersToFiles(
  opts: ApplyLicenseHeadersToFilesOptions,
): Promise<void> {
  const renderer = await buildBannerRenderer(opts);
  await Promise.all(
    opts.files.map(async (file) => {
      const banner = renderer(computeFilename(opts.filenameMode, opts.baseDir, file));
      await applyLicenseBannerToFile(file, banner, {
        separator: opts.separator,
        prependAfterLicense: opts.prependAfterLicense,
      });
    }),
  );
}

export interface ApplyLicenseHeadersToDirectoryOptions extends BannerInputs, BannerApplyOptions {
  targetDir: string;
  includePatterns?: readonly string[];
  excludePatterns?: readonly string[];
}

export async function applyLicenseHeadersToDirectory(
  opts: ApplyLicenseHeadersToDirectoryOptions,
): Promise<number> {
  const files = await discoverFiles({
    cwd: opts.targetDir,
    includePatterns: opts.includePatterns ?? DEFAULT_INCLUDE_PATTERNS,
    excludePatterns: opts.excludePatterns ?? DEFAULT_EXCLUDE_PATTERNS,
  });

  await applyLicenseHeadersToFiles({
    ...opts,
    files,
    baseDir: opts.targetDir,
  });

  return files.length;
}

interface ResolvedAddLicenseHeaders {
  targetDir: string;
  pkg: PackageJson;
  templatePath: string;
  eulaUrl: string;
  mode?: LicenseMode;
  packageJsonPath: string;
  version?: string;
  commentType: CommentType;
  separator: string;
  prependAfterLicense: string;
  includePatterns: readonly string[];
  excludePatterns: readonly string[];
}

export default createExecutor<AddLicenseHeadersExecutorSchema, ResolvedAddLicenseHeaders>({
  name: 'AddLicenseHeaders',
  resolve: async (options, { projectRoot }) => {
    const packageJsonPath = path.join(projectRoot, options.packageJsonPath ?? DEFAULT_PACKAGE_JSON);
    const targetDir = path.join(projectRoot, options.targetDirectory ?? DEFAULT_TARGET_DIR);
    const templatePath = resolveLicenseTemplate(projectRoot, options);
    const pkg = await readJson<PackageJson>(packageJsonPath);

    return {
      targetDir,
      pkg,
      templatePath,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      mode: options.mode,
      packageJsonPath,
      version: options.version,
      commentType: options.commentType ?? DEFAULT_COMMENT_TYPE,
      separator: options.separatorBetweenBannerAndContent ?? DEFAULT_SEPARATOR,
      prependAfterLicense: options.prependAfterLicense ?? DEFAULT_PREPEND_AFTER_LICENSE,
      includePatterns: options.includePatterns ?? DEFAULT_INCLUDE_PATTERNS,
      excludePatterns: options.excludePatterns ?? DEFAULT_EXCLUDE_PATTERNS,
    };
  },
  run: async (resolved) => {
    const count = await applyLicenseHeadersToDirectory({
      targetDir: resolved.targetDir,
      pkg: resolved.pkg,
      templatePath: resolved.templatePath,
      eulaUrl: resolved.eulaUrl,
      mode: resolved.mode,
      packageJsonPath: resolved.packageJsonPath,
      version: resolved.version,
      commentType: resolved.commentType,
      separator: resolved.separator,
      prependAfterLicense: resolved.prependAfterLicense,
      includePatterns: resolved.includePatterns,
      excludePatterns: resolved.excludePatterns,
      filenameMode: DEFAULT_FILENAME_MODE,
    });
    logger.verbose(`Adding license headers to ${count} files...`);
    logger.verbose('License headers added successfully');
  },
});
