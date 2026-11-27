import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from './paths';
import { validateVersion } from './monorepo-tools';
import { stampFontVersion } from '../../../packages/devextreme-scss/tools/icons/font-version';

const ICONS_DIR = path.join(ROOT_DIR, 'packages/devextreme-scss/icons');
const FONT_EXTENSIONS = ['.ttf', '.woff', '.woff2'];

export function updateVersion(version: string | undefined): void {
  if (!version) {
    console.error(`Version can't be empty`);
    process.exit(1);
  }

  const workspacesFolders = ['packages', 'apps', 'e2e'];

  const rootWorkspacePath = path.join(ROOT_DIR, 'package.json')
  const workspacesPaths = workspacesFolders
      .map(folder => path.join(ROOT_DIR, folder, '*', 'package.json'))
      .concat([rootWorkspacePath]);

  sh.sed('-i', /"version": ".*"/, `"version": "${version}"`, workspacesPaths);
}

export function updateVersionJs(version: string | undefined, build?: string | undefined): void {
  const versionJsPath = path.join(ROOT_DIR, 'packages/devextreme/js/core/version.js');
  const validatedVersion = validateVersion(version);
  const fullVersion = build ? `${validatedVersion}.${build}` : validatedVersion;
  fs.writeFileSync(
    versionJsPath,
    `export const version = '${validatedVersion}';\n` +
    `export const fullVersion = '${fullVersion}';\n`
  );
}

export function updateVersionFonts(version: string | undefined): void {
  const validatedVersion = validateVersion(version);

  fs.readdirSync(ICONS_DIR)
    .filter((name) => FONT_EXTENSIONS.includes(path.extname(name)))
    .forEach((name) => {
      const fontPath = path.join(ICONS_DIR, name);
      const font = fs.readFileSync(fontPath);
      const stamped = stampFontVersion(font, validatedVersion);

      if (!stamped.equals(font)) {
        fs.writeFileSync(fontPath, stamped);
      }
    });
}
