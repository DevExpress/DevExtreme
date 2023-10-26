import sh from 'shelljs';
import path from 'node:path';

const MONOREPO_ROOT = path.join(__dirname, '..');
const INTERNAL_TOOLS_ARTIFACTS = path.join(MONOREPO_ROOT, 'artifacts', 'internal-tools');

const OUTPUT_DIR = path.join(MONOREPO_ROOT, 'artifacts');
const NPM_OUTPUT_DIR = path.join(OUTPUT_DIR, 'npm');

sh.set('-e');

sh.mkdir('-p', NPM_OUTPUT_DIR);

const monorepoVersion = sh.exec('npm pkg get version', { silent: true }).stdout.replaceAll('"', '');
const MAJOR_VERSION = monorepoVersion.split('.').slice(0, 2).join('_');

// Prepare metadata
sh.cd(MONOREPO_ROOT);
sh.exec('npm run tools:discover-declarations');
sh.exec(`npm run tools -- make-aspnet-metadata --version ${MAJOR_VERSION}`);

// Inject descriptions
const DOCUMENTATION_TEMP_DIR = path.join(OUTPUT_DIR, 'doc_tmp');
sh.exec(`git clone -b ${MAJOR_VERSION} --depth 1 --config core.longpaths=true https://github.com/DevExpress/devextreme-documentation.git ${DOCUMENTATION_TEMP_DIR}`);

sh.pushd(DOCUMENTATION_TEMP_DIR);
sh.exec('npm i');
sh.exec(`npm run update-topics -- --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
sh.popd();

sh.rm('-rf', DOCUMENTATION_TEMP_DIR);

sh.exec('npm run devextreme:inject-descriptions');

sh.exec('npm run build-dist -w devextreme-main');

// Copy artifacts for DXBuild (Installation)
sh.pushd(path.join(MONOREPO_ROOT, 'packages/devextreme/artifacts'));
sh.cp('-r', 'ts', OUTPUT_DIR);
sh.cp('-r', 'js', OUTPUT_DIR);
sh.cp('-r', 'css', OUTPUT_DIR);
sh.popd();

// TODO: maybe we should add bootstrap to vendors
const BOOTSTRAP_DIR = path.join(MONOREPO_ROOT, 'node_modules', 'bootstrap', 'dist');
sh.cp([path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.js'), path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.min.js')], path.join(OUTPUT_DIR, 'js'));
sh.cp([path.join(BOOTSTRAP_DIR, 'css', 'bootstrap.css'), path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.min.css')], path.join(OUTPUT_DIR, 'css'));

const { 'devextreme-main': devextremeVersion, devextreme: devextremeNpmVersion } = JSON.parse(sh.exec('npm pkg get version -ws --json').stdout);

// Update versions for non-semver builds (daily, alpha and beta)
if (devextremeVersion !== devextremeNpmVersion) {
    sh.exec(`npm run all:update-version -- ${devextremeNpmVersion}`);
}

const DEVEXTREME_NPM_DIR = path.join(MONOREPO_ROOT, 'packages/devextreme/artifacts/npm');

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme'))
sh.exec('npm pack', { silent: true });
sh.cp('*.tgz', NPM_OUTPUT_DIR);
sh.popd();

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist'))
sh.exec('npm pack', { silent: true });
sh.cp('*.tgz', NPM_OUTPUT_DIR);
sh.popd();

sh.pushd(path.join(MONOREPO_ROOT, 'packages', 'devextreme-themebuilder'))
sh.exec('npm run build');
sh.exec('npm run pack', { silent: true });
sh.cp('dist/*.tgz', NPM_OUTPUT_DIR);
sh.popd();

sh.exec('npm run pack --ws --if-present', { silent: true });

sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-angular', 'npm', 'dist', '*.tgz'), NPM_OUTPUT_DIR);
sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-react', 'npm', '*.tgz'), NPM_OUTPUT_DIR);
sh.cp(path.join(MONOREPO_ROOT, 'packages', 'devextreme-vue', 'npm', '*.tgz'), NPM_OUTPUT_DIR);
