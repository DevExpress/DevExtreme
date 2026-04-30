import _ from 'lodash';
import { readFileText, writeFileText } from './file-operations';

export interface LicenseBannerOptions {
  templatePath?: string;
  pkg: { name: string; version: string; repository?: string | { url?: string } };
  eulaUrl?: string;
  version?: string;
  commentType: '!' | '*';
}

const COMMENT_OPEN = '/*';
const COMMENT_END = ' */';
const COMMENT_PREFIX = ' *';
const NEWLINE = '\n';

const TEMPLATE_REGEX = /<%=\s*(\w+(?:\.\w+)*)\s*%>/g;

function buildDefaultBannerTemplate(commentType: string): string {
  return [
    `${COMMENT_OPEN}${commentType}`,
    `${COMMENT_PREFIX} <%= pkg.name %>`,
    `${COMMENT_PREFIX} Version: <%= pkg.version %>`,
    `${COMMENT_PREFIX} Build date: <%= date %>`,
    COMMENT_PREFIX,
    `${COMMENT_PREFIX} Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED`,
    COMMENT_PREFIX,
    `${COMMENT_PREFIX} This software may be modified and distributed under the terms`,
    `${COMMENT_PREFIX} of the MIT license. See the LICENSE file in the root of the project for details.`,
    COMMENT_PREFIX,
    `${COMMENT_PREFIX} <%= githubUrl %>`,
    COMMENT_END,
    '',
  ].join(NEWLINE);
}

function renderTemplate(template: string, data: unknown): string {
  return template.replace(TEMPLATE_REGEX, (_match, key: string) => {
    const keys = key.split('.');
    let value: unknown = data;
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

function extractGitHubUrl(repository: string | { url?: string } | undefined): string {
  if (!repository) {
    throw new Error("Missing 'repository' field in package.json");
  }
  const rawUrl = typeof repository === 'string' ? repository : repository.url;
  if (!rawUrl) {
    throw new Error("Invalid 'repository' format in package.json");
  }
  return rawUrl.replace(/^git\+/, '').replace(/\.git$/, '');
}

export async function buildLicenseBannerRenderer(
  opts: LicenseBannerOptions,
): Promise<(fileRelative: string) => string> {
  const { templatePath, pkg, eulaUrl = '', commentType } = opts;
  const resolvedVersion = opts.version ?? pkg.version;
  const now = new Date();

  if (templatePath) {
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

  const githubUrl = extractGitHubUrl(pkg.repository);
  const defaultTemplate = buildDefaultBannerTemplate(commentType);
  const templateData = {
    pkg,
    date: now.toDateString(),
    year: now.getFullYear(),
    githubUrl,
    eula: eulaUrl,
    version: resolvedVersion,
    commentType,
  };
  return (fileRelative: string) =>
    renderTemplate(defaultTemplate, { ...templateData, file: { relative: fileRelative } });
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
    commentType: '!' | '*';
    separator?: string;
    prependAfterLicense?: string;
  },
): Promise<void> {
  const content = await readFileText(filePath);
  if (content.startsWith(COMMENT_OPEN + options.commentType)) {
    return;
  }
  const separator = options.separator ?? '';
  const prepend = options.prependAfterLicense ?? '';
  await writeFileText(filePath, banner + separator + prepend + content);
}
