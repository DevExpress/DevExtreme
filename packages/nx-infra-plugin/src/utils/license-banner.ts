import _ from 'lodash';
import { readFileText, writeFileText } from './file-operations';

export interface LicenseBannerOptions {
  templatePath: string;
  pkg: { name: string; version: string; repository?: string | { url?: string } };
  eulaUrl?: string;
  version?: string;
  commentType: '!' | '*';
}

export async function buildLicenseBannerRenderer(
  opts: LicenseBannerOptions,
): Promise<(fileRelative: string) => string> {
  const { templatePath, pkg, eulaUrl = '', commentType } = opts;
  const resolvedVersion = opts.version ?? pkg.version;
  const now = new Date();

  const templateText = await readFileText(templatePath);
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
      githubUrl: '',
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
