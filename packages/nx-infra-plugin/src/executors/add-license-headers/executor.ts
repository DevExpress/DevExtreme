import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { AddLicenseHeadersExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readJson, readFileText, writeFileText } from '../../utils/file-operations';

const DEFAULT_TARGET_DIR = './npm';
const DEFAULT_PACKAGE_JSON = './package.json';

const GLOB_PATTERN = '**/*.{ts,js}';

const LICENSE_MARKER = '/*!';
const COMMENT_END = ' */';
const COMMENT_PREFIX = ' *';
const NEWLINE = '\n';
const EMPTY_LINE = '';

const GITHUB_URL = 'https://github.com/DevExpress/devextreme-react';

const COPYRIGHT_START =
  ' * Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED';

const BANNER_PKG_NAME = COMMENT_PREFIX + ' ' + '<%= pkg.name %>';
const BANNER_VERSION = COMMENT_PREFIX + ' ' + 'Version: <%= pkg.version %>';
const BANNER_BUILD_DATE = COMMENT_PREFIX + ' ' + 'Build date: <%= date %>';
const BANNER_LICENSE_LINE1 =
  COMMENT_PREFIX + ' ' + 'This software may be modified and distributed under the terms';
const BANNER_LICENSE_LINE2 =
  COMMENT_PREFIX
  + ' '
  + 'of the MIT license. See the LICENSE file in the root of the project for details.';
const BANNER_GITHUB = COMMENT_PREFIX + ' ' + GITHUB_URL;

const TEMPLATE_REGEX = /<%=\s*(\w+(?:\.\w+)*)\s*%>/g;

const runExecutor: PromiseExecutor<AddLicenseHeadersExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const targetDirectory = path.join(
    absoluteProjectRoot,
    options.targetDirectory || DEFAULT_TARGET_DIR,
  );
  const packageJsonPath = path.join(
    absoluteProjectRoot,
    options.packageJsonPath || DEFAULT_PACKAGE_JSON,
  );

  let pkg;
  try {
    pkg = await readJson(packageJsonPath);
  } catch (error) {
    logError('Failed to read package.json', error);
    return { success: false };
  }

  const now = new Date();
  const data = {
    pkg,
    date: now.toDateString(),
    year: now.getFullYear(),
  };

  const bannerTemplate = [
    LICENSE_MARKER,
    BANNER_PKG_NAME,
    BANNER_VERSION,
    BANNER_BUILD_DATE,
    COMMENT_PREFIX,
    COPYRIGHT_START,
    COMMENT_PREFIX,
    BANNER_LICENSE_LINE1,
    BANNER_LICENSE_LINE2,
    COMMENT_PREFIX,
    BANNER_GITHUB,
    COMMENT_END,
    EMPTY_LINE,
  ].join(NEWLINE);

  const banner = renderTemplate(bannerTemplate, data);

  try {
    const pattern = path.join(targetDirectory, GLOB_PATTERN);
    const files = await glob(pattern);

    logger.info(`Adding license headers to ${files.length} files...`);

    await Promise.all(
      files.map(async (file) => {
        const content = await readFileText(file);

        if (content.startsWith(LICENSE_MARKER)) {
          return;
        }

        await writeFileText(file, banner + NEWLINE + content);
      }),
    );

    logger.info('License headers added successfully');
    return { success: true };
  } catch (error) {
    logError('Failed to add license headers', error);
    return { success: false };
  }
};

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

export default runExecutor;
