import sh from "shelljs";
import path from "node:path";

const MONOREPO_ROOT = path.join(__dirname, '..');
const INTERNAL_TOOLS_ARTIFACTS = path.join(MONOREPO_ROOT, 'artifacts', 'internal-tools');

const OUTPUT_DIR = path.join(MONOREPO_ROOT, 'npm');
sh.mkdir('-p', OUTPUT_DIR);

sh.cd(MONOREPO_ROOT);
sh.exec('npm run tools:discover-declarations');

// Descriptions
const DOCUMENTATION_DIR = path.join(OUTPUT_DIR, 'documentation');
sh.exec(`git clone -b 23_2 --depth 1 --config core.longpaths=true https://github.com/DevExpress/devextreme-documentation.git ${DOCUMENTATION_DIR}`);

sh.pushd(DOCUMENTATION_DIR);
sh.exec('npm i');
sh.exec(`npm run update-topics -- --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
sh.popd();

sh.exec('npm run devextreme:inject-descriptions');

sh.exec('npm run build-dist -w devextreme-main');

const DEVEXTREME_NPM_DIR = path.join(MONOREPO_ROOT, 'packages/devextreme/artifacts/npm');

/*
TODO: We might need this when running on farm to bump non-semver versions for all packages.
sh.exec(`npm version ${version} -ws --workspaces-update=false`);
sh.sed('-i', /"devextreme": ".*"/, `"devextreme": "${version}"`, path.join(MONOREPO_ROOT, 'packages', '**', 'package.json'));
sh.exec('npm i');
*/

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme'))
sh.exec('npm pack');
sh.cp('*.tgz', OUTPUT_DIR);
sh.popd();

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist'))
sh.exec('npm pack');
sh.cp('*.tgz', OUTPUT_DIR);
sh.popd();

sh.pushd(path.join(MONOREPO_ROOT, 'packages', 'devextreme-themebuilder'))
sh.exec('npm run build && npm run pack');
sh.cp('dist/*.tgz', OUTPUT_DIR);
sh.popd();

sh.exec('npm run pack --ws --if-present');

sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-angular', 'npm', 'dist', '*.tgz'), OUTPUT_DIR);
sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-react', 'npm', '*.tgz'), OUTPUT_DIR);
sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-vue', 'npm', '*.tgz'), OUTPUT_DIR);
