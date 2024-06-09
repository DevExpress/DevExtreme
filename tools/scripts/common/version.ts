import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from './paths';
import { validateVersion } from './monorepo-tools';

export function updateVersion(version: string | undefined): void {
  if (!version) {
    console.error(`Version can't be empty`);
    process.exit(1);
  }

  const workspacesFolders = ['packages', 'apps', 'e2e'];
  const workspacesPaths = workspacesFolders.map(folder => path.join(ROOT_DIR, folder, '**', 'package.json'));

  sh.exec(`npm version ${version} -ws --allow-same-version --include-workspace-root --git-tag-version=false --workspaces-update=false`);

  sh.sed('-i', /"devextreme(-angular|-react|-vue|-dist)?": ".*"/, `"devextreme$1": "~${version}"`, workspacesPaths);

  sh.exec('npm i --legacy-peer-deps');
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
