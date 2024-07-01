import sh from 'shelljs';
import path from 'path';

export function updateVersion(version: string | undefined): void {
  if (!version) {
    console.error(`Version can't be empty`);
    process.exit(1);
  }

  const MONOREPO_ROOT = path.join(__dirname, '../..');
  const packagesPath = path.join(MONOREPO_ROOT, 'packages', '**', 'package.json');
  const playgroundsPath = path.join(MONOREPO_ROOT, 'playgrounds', '**', 'package.json');

  sh.exec(`npm version ${version} -ws --allow-same-version --include-workspace-root --git-tag-version=false --workspaces-update=false`);

  sh.sed('-i', /"devextreme(-angular|-react|-vue)?": ".*"/, `"devextreme$1": "~${version}"`, [packagesPath, playgroundsPath]);

  sh.exec('npm i');
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

export function makeTimestampVersion(baseVersion: string | undefined, date: Date): string | undefined {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const year = (date.getFullYear() % 100).toString().padStart(2, '0');
  const day = getDayNumber(date).toString().padStart(3, '0');
  const timestampVersion = `${baseVersion}-build-${year}${day}-${hours}${minutes}`;
  return timestampVersion;
}
