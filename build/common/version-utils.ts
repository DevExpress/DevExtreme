import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from './paths';

function validateVersion(version: string | undefined): string {
  if (!version?.match(/(\d{2}\.\d+\.\d+)$/)) {
    throw new Error(`Error: Invalid version "${version}"! The version must satisfy devexpress version pattern (XX.X.X)`);
  }
  return version;
}

export function updateVersion(version: string | undefined): void {
  if (!version) {
    console.error(`Version can't be empty`);
    process.exit(1);
  }

  const packagesPath = path.join(ROOT_DIR, 'packages', '**', 'package.json');
  const appsPath = path.join(ROOT_DIR, 'apps', '**', 'package.json');

  sh.exec(`npm version ${version} -ws --allow-same-version --include-workspace-root --git-tag-version=false --workspaces-update=false`);

  sh.sed('-i', /"devextreme(-angular|-react|-vue|-dist)?": ".*"/, `"devextreme$1": "~${version}"`, [packagesPath, appsPath]);

  sh.exec('npm i --legacy-peer-deps');
}

export function updateVersionJs(version: string | undefined): void {
  const versionJsPath = path.join(ROOT_DIR, 'packages/devextreme/js/core/version.js');
  fs.writeFileSync(versionJsPath, `export const version = '${validateVersion(version)}';\n`);
}

export function formatVersion(version: string | undefined): string | undefined {
  return version?.match(/(\d+\.\d+\.\d+)(\D|$)/)?.[1];
}

const MSECS_IN_MIN = 1000 * 60;
const MINS_IN_DAY = 60 * 24;

function getDayNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor(
    ((date.getTime() - start.getTime()) + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 1000 * 60) / MSECS_IN_MIN / MINS_IN_DAY,
  );
}

export function makeTimestamp(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const year = (date.getFullYear() % 100).toString().padStart(2, '0');
  const day = getDayNumber(date).toString().padStart(3, '0');
  return `${year}${day}-${hours}${minutes}`;
}

type BuildStage = 'alpha' | 'beta' | 'build' | '';

export function makeVersion(baseVersion: string | undefined, daily: boolean, date: Date): string {
  let [major, minor, patch] = validateVersion(baseVersion)
      .split('.')
      .map(n => Number(n));

  const stage: BuildStage = daily ?
      patch <= 1 ? 'alpha' : 'build' :
      patch <= 2 ? 'beta' : '';

  if (daily) {
    patch += 1;
  }

  const base = [major, minor, patch].join('.');
  const fullVersion = [base, stage];

  if (daily) {
    const timestamp = makeTimestamp(date);
    fullVersion.push(timestamp);
  }

  return fullVersion.filter(v => v).join('-');
}
