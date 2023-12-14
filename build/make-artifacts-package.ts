import sh from 'shelljs';
import fs from 'fs';
import path from 'path';

function recreateDir(path: string): void {
  if (fs.existsSync(path)) {
    sh.rm('-r', path)
  }
  sh.mkdir('-p', path)
}

const MONOREPO_ROOT = path.join(__dirname, '..');
const INTERNAL_TOOLS_ARTIFACTS = path.join(MONOREPO_ROOT, 'artifacts', 'internal-tools');

const ARTIFACTS_DIR = path.join(MONOREPO_ROOT, 'artifacts');
const ARTIFACTS_PACKAGE_DIR = path.join(ARTIFACTS_DIR, 'devextreme-artifacts');

import { version, license, author } from '../package.json';

recreateDir(ARTIFACTS_PACKAGE_DIR);

sh.cp('-r', INTERNAL_TOOLS_ARTIFACTS, ARTIFACTS_PACKAGE_DIR);
sh.pushd(ARTIFACTS_PACKAGE_DIR);
{
  fs.writeFileSync('package.json', JSON.stringify({}));

  sh.exec('npm pkg set name=devextreme-artifacts');
  sh.exec(`npm pkg set version=${version}`);
  sh.exec(`npm pkg set license=${license}`)
  sh.exec(`npm pkg set author="${author}"`);

  sh.exec('npm pack --pack-destination="../npm"');
}
sh.popd();
