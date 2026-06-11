import _ from 'lodash';
import { readFileText, writeFileText } from './file-operations';
import type { PackageJson } from './types';

export interface LicenseBannerOptions {
  templatePath: string;
  pkg: PackageJson;
  eulaUrl?: string;
  version?: string;
  commentType: '!' | '*';
  githubUrl?: string;
}

export function extractGitHubUrl(
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

export async function buildLicenseBannerRenderer(
  opts: LicenseBannerOptions,
): Promise<(fileRelative: string) => string> {
  const { templatePath, pkg, eulaUrl = '', commentType, githubUrl = '' } = opts;
  const resolvedVersion = opts.version ?? pkg.version;
  const now = new Date();

  const templateText = (await readFileText(templatePath)).replace(/\r\n/g, '\n');
  const compiled = _.template(templateText);
  return (fileRelative: string) =>
    compiled({
      commentType,
      version: resolvedVersion,
      eula: eulaUrl,
      file: { relative: fileRelative },
      date: now.toDateString(),
      year: now.getFullYear(),
      pkg,
      githubUrl,
    });
}

export async function renderLicenseBanner(
  opts: LicenseBannerOptions,
  fileRelative: string,
): Promise<string> {
  const renderer = await buildLicenseBannerRenderer(opts);
  return renderer(fileRelative);
}

export async function applyLicenseBannerToFile(
  filePath: string,
  banner: string,
  options: {
    separator?: string;
    prependAfterLicense?: string;
  } = {},
): Promise<void> {
  const content = await readFileText(filePath);
  const separator = options.separator ?? '';
  const prepend = options.prependAfterLicense ?? '';
  await writeFileText(filePath, banner + separator + prepend + content);
}
