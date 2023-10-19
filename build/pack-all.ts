import sh from "shelljs";
import path from "node:path";

const MONOREPO_ROOT = path.join(__dirname, '..');
const INTERNAL_TOOLS_ARTIFACTS = path.join(MONOREPO_ROOT, 'artifacts', 'internal-tools');

const OUTPUT_DIR = path.join(MONOREPO_ROOT, 'artifacts');
const NPM_OUTPUT_DIR = path.join(OUTPUT_DIR, 'npm');

sh.mkdir('-p', OUTPUT_DIR);

const { "devextreme-main": devextremeVersion, devextreme: devextremeNpmVersion } = JSON.parse(sh.exec('npm pkg get version -ws --json').stdout);
const MAJOR_VERSION = devextremeVersion.split('.').slice(0, 2).join('_');

sh.cd(MONOREPO_ROOT);
sh.exec('npm run tools:discover-declarations');
sh.exec(`npm run tools -- make-aspnet-metadata --version ${MAJOR_VERSION}`);

// Descriptions
const DOCUMENTATION_DIR = path.join(OUTPUT_DIR, 'documentation');
sh.exec(`git clone -b ${MAJOR_VERSION} --depth 1 --config core.longpaths=true https://github.com/DevExpress/devextreme-documentation.git ${DOCUMENTATION_DIR}`);

sh.pushd(DOCUMENTATION_DIR);
sh.exec('npm i');
sh.exec(`npm run update-topics -- --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
sh.popd();

sh.exec('npm run devextreme:inject-descriptions');

sh.exec('npm run build-dist -w devextreme-main');

sh.pushd(path.join(MONOREPO_ROOT, 'packages/devextreme/artifacts'));
sh.cp('-r', 'ts', OUTPUT_DIR);
sh.cp('-r', 'js', OUTPUT_DIR);
sh.cp('-r', 'css', OUTPUT_DIR);
// TODO: copy bootstrap from node_modules
sh.popd();

if (devextremeVersion !== devextremeNpmVersion) {
    sh.exec(`npm run all:bump -- ${devextremeNpmVersion}`);
}

const DEVEXTREME_NPM_DIR = path.join(MONOREPO_ROOT, 'packages/devextreme/artifacts/npm');

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme'))
sh.exec('npm pack');
sh.cp('*.tgz', NPM_OUTPUT_DIR);
sh.popd();

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist'))
sh.exec('npm pack');
sh.cp('*.tgz', NPM_OUTPUT_DIR);
sh.popd();

sh.pushd(path.join(MONOREPO_ROOT, 'packages', 'devextreme-themebuilder'))
sh.exec('npm run build && npm run pack');
sh.cp('dist/*.tgz', NPM_OUTPUT_DIR);
sh.popd();

sh.exec('npm run pack --ws --if-present');

sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-angular', 'npm', 'dist', '*.tgz'), NPM_OUTPUT_DIR);
sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-react', 'npm', '*.tgz'), NPM_OUTPUT_DIR);
sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-vue', 'npm', '*.tgz'), NPM_OUTPUT_DIR);
