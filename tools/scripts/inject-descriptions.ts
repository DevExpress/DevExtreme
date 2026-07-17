import sh from 'shelljs';
import path from 'node:path';
import { INTERNAL_TOOLS_ARTIFACTS, ROOT_DIR } from './common/paths';

const DEFAULT_BRANCH_NAME = 'main';

sh.set('-e');
sh.cd(ROOT_DIR);

const DOCUMENTATION_TEMP_DIR = path.join(ROOT_DIR, '..', 'doc_tmp');

sh.exec(
  `git clone -b ${DEFAULT_BRANCH_NAME} --depth 1 --config core.longpaths=true https://github.com/DevExpress/devextreme-documentation.git ${DOCUMENTATION_TEMP_DIR}`,
);

sh.pushd(DOCUMENTATION_TEMP_DIR);
sh.exec('pnpm i --frozen-lockfile');
sh.exec(`pnpm run update-topics --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
sh.popd();

sh.rm('-rf', DOCUMENTATION_TEMP_DIR);

sh.exec('pnpm run devextreme:inject-descriptions');
