const path = require('path');
const sh = require("shelljs");

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
sh.exec(`npm run update-topics -- --declarations-path ${path.join(INTERNAL_TOOLS_ARTIFACTS, 'Declarations.json')} --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
sh.popd();

sh.exec('npm run devextreme:inject-descriptions');

// Build devextreme, devextreme-dist
sh.exec('npm run build-dist -w devextreme-main');

// npm version ${version} -ws --workspaces-update=false
// npm i devextreme@${version} --save-exact -w devextreme-angular -w devextreme-react -w devextreme-vue

const DEVEXTREME_NPM_DIR = path.join(MONOREPO_ROOT, 'packages/devextreme/artifacts/npm');
['devextreme', 'devextreme-dist'].forEach((pkg) => {
   sh.pushd(path.join(DEVEXTREME_NPM_DIR, pkg))
   sh.exec('npm pack');
   sh.cp('*.tgz', OUTPUT_DIR);
   sh.popd();
});

sh.pushd(path.join(MONOREPO_ROOT, 'packages', 'devextreme-themebuilder'))
sh.exec('npm run build && npm run pack');
sh.cp('dist/*.tgz', OUTPUT_DIR);
sh.popd();

// Build and pack wrappers
sh.exec('npm run pack --ws --if-present');
['devextreme-angular', 'devextreme-react', 'devextreme-vue'].forEach((pkg) => {
    sh.cp(path.join(MONOREPO_ROOT, 'packages', pkg, 'npm', '**', '*.tgz'), OUTPUT_DIR);
});
