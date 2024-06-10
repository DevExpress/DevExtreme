import sh from 'shelljs';
import path from 'path';

import { ARTIFACTS_DIR, INTERNAL_TOOLS_ARTIFACTS, JS_ARTIFACTS, TS_ARTIFACTS, CSS_ARTIFACTS, DEPS_SCANNER_ARTIFACTS } from './common/paths';
import { ensureEmptyDir } from './common/monorepo-tools';

import { version, license, author } from '../../package.json';
import { npm } from './common/monorepo-tools';

const ARTIFACTS_PACKAGE_DIR = path.join(ARTIFACTS_DIR, 'devextreme-artifacts');

ensureEmptyDir(ARTIFACTS_PACKAGE_DIR);

sh.cp('-r', [INTERNAL_TOOLS_ARTIFACTS, JS_ARTIFACTS, TS_ARTIFACTS, CSS_ARTIFACTS, DEPS_SCANNER_ARTIFACTS], ARTIFACTS_PACKAGE_DIR);
sh.pushd(ARTIFACTS_PACKAGE_DIR);
{
  npm.initEmpty();
  npm.pkg.set({ name: 'devextreme-artifacts', version, license, author });
  npm.pack({ destination: '../npm' });
}
sh.popd();
