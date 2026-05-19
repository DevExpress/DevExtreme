import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { escapeRegExpLiteral } from '../../utils/common';
import { readFileText } from '../../utils/file-operations';
import { LicenseCheckExecutorSchema, LicenseEntry } from './schema';

interface LicenseMiss {
  file: string;
  licenseName: string;
}

interface ResolvedLicenseCheck {
  projectRoot: string;
  files: { absolutePath: string; displayPath: string }[];
  licenses: LicenseEntry[];
}

const LICENSE_FIELD_SEPARATOR = '\\s*\\*\\s';
const ERROR_HEADER_SINGLE = 'issue';
const ERROR_HEADER_PLURAL = 'issues';

export function buildLicenseRegex(entry: LicenseEntry): RegExp {
  const name = escapeRegExpLiteral(entry.name);
  const homepageUrl = escapeRegExpLiteral(entry.homepageUrl);
  const copyright = escapeRegExpLiteral(entry.copyright);
  const licenseType = escapeRegExpLiteral(entry.licenseType);
  const licenseUrl = escapeRegExpLiteral(entry.licenseUrl);

  const pattern =
    `\\* !\\s*.*${name}${LICENSE_FIELD_SEPARATOR}`
    + `${homepageUrl}${LICENSE_FIELD_SEPARATOR}*\\*\\s`
    + `${copyright}${LICENSE_FIELD_SEPARATOR}`
    + `${licenseType}${LICENSE_FIELD_SEPARATOR}`
    + `${licenseUrl}`;
  return new RegExp(pattern);
}

function buildErrorMessage(misses: LicenseMiss[]): string {
  const label = misses.length === 1 ? ERROR_HEADER_SINGLE : ERROR_HEADER_PLURAL;
  const header = `License notice check failed (${misses.length} ${label}):`;
  const bullets = misses
    .map((miss) => `  - "${miss.licenseName}" not found in ${miss.file}`)
    .join('\n');
  return `${header}\n${bullets}`;
}

export default createExecutor<LicenseCheckExecutorSchema, ResolvedLicenseCheck>({
  name: 'LicenseCheck',
  resolve: (options, { projectRoot }) => {
    const files = options.files.map((fileEntry) => {
      const absolutePath = path.resolve(projectRoot, fileEntry);
      const displayPath = path.relative(projectRoot, absolutePath) || absolutePath;
      return { absolutePath, displayPath };
    });
    return { projectRoot, files, licenses: options.licenses };
  },
  run: async (resolved) => {
    const misses: LicenseMiss[] = [];
    for (const fileEntry of resolved.files) {
      const fileContent = await readFileText(fileEntry.absolutePath);
      for (const licenseEntry of resolved.licenses) {
        const licenseRegex = buildLicenseRegex(licenseEntry);
        if (fileContent.search(licenseRegex) === -1) {
          misses.push({ file: fileEntry.displayPath, licenseName: licenseEntry.name });
        }
      }
      logger.verbose(`Checked license notices in ${fileEntry.displayPath}`);
    }
    if (misses.length > 0) {
      throw new Error(buildErrorMessage(misses));
    }
  },
});
