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

export function formatVersion(version: string| undefined): string | undefined {
  return version?.match(/(\d+\.\d+\.\d+)(\D|$)/)?.[1];
}

function getDayNumber(date: Date): number {
  return Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime() - 1) / 1000 / 60 / 60 / 24,
  );
}

export function makeTimestampVersion(baseVersion: string | undefined, date: Date): string | undefined {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timestampVersion = `${baseVersion}-build-${date.getFullYear() % 100}${getDayNumber(date)}-${hours}${minutes}`;
  return timestampVersion;
}
