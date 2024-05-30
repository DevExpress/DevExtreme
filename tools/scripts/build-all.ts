import sh from 'shelljs';
import path from 'node:path';
import yargs from 'yargs';
import { ARTIFACTS_DIR, INTERNAL_TOOLS_ARTIFACTS, ROOT_DIR, NPM_DIR, JS_ARTIFACTS, CSS_ARTIFACTS } from './common/paths';

const argv = yargs
    .option('dev', { type: 'boolean', default: false })
    .parseSync();

const devMode = argv.dev;

const DEVEXTREME_NPM_DIR = path.join(ROOT_DIR, 'packages/devextreme/artifacts/npm');

sh.set('-e');

sh.mkdir('-p', NPM_DIR);

const packAndCopy = (outputDir: string) => {
    sh.exec('npm pack', { silent: true });
    sh.cp('*.tgz', outputDir);
}

const injectDescriptions = () => {
    sh.pushd(ROOT_DIR);
    // Inject descriptions
    const DOCUMENTATION_TEMP_DIR = path.join(ARTIFACTS_DIR, 'doc_tmp');
    sh.exec(`git clone -b ${MAJOR_VERSION} --depth 1 --config core.longpaths=true https://github.com/DevExpress/devextreme-documentation.git ${DOCUMENTATION_TEMP_DIR}`);

    sh.pushd(DOCUMENTATION_TEMP_DIR);
    sh.exec('npm i');
    sh.exec(`npm run update-topics -- --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
    sh.popd();

    sh.rm('-rf', DOCUMENTATION_TEMP_DIR);

    sh.exec('npm run devextreme:inject-descriptions');
    sh.popd();
}

const monorepoVersion = sh.exec('npm pkg get version', { silent: true }).stdout.replaceAll('"', '');
const MAJOR_VERSION = monorepoVersion.split('.').slice(0, 2).join('_');

// Prepare metadata
sh.cd(ROOT_DIR);
sh.exec('npm run tools:discover-declarations');
sh.exec(`npm run tools -- make-aspnet-metadata --version ${MAJOR_VERSION}`);

if (!devMode) {
    injectDescriptions();
}

if (devMode) {
    sh.exec('npx nx build devextreme-main');
} else {
    sh.exec('npm run build-dist -w devextreme-main', {
        env: {
            ...sh.env,
            BUILD_INTERNAL_PACKAGE: 'false'
        }
    });
}

if (devMode) {
    sh.exec(`npx nx build devextreme-themebuilder`);
} else {
    sh.exec('npm run build -w devextreme-themebuilder');
}

// Copy artifacts for DXBuild (Installation)
sh.pushd(path.join(ROOT_DIR, 'packages/devextreme/artifacts'));
    sh.cp('-r', ['ts', 'js', 'css'], ARTIFACTS_DIR);
sh.popd();

// TODO: maybe we should add bootstrap to vendors
const BOOTSTRAP_DIR = path.join(ROOT_DIR, 'node_modules', 'bootstrap', 'dist');
sh.cp([path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.js'), path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.min.js')], JS_ARTIFACTS);
sh.cp([path.join(BOOTSTRAP_DIR, 'css', 'bootstrap.css'), path.join(BOOTSTRAP_DIR, 'css', 'bootstrap.min.css')], CSS_ARTIFACTS);

const { devextreme: devextremeNpmVersion } = JSON.parse(sh.exec('npm pkg get version -ws --json').stdout);

sh.exec('npm run all:pack-and-copy');

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme'));
    packAndCopy(NPM_DIR);
sh.popd();

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist'));
    packAndCopy(NPM_DIR);
sh.popd();

sh.pushd(path.join(ROOT_DIR, 'packages', 'devextreme-themebuilder', 'dist'));
    sh.exec(`npm pkg set version="${devextremeNpmVersion}"`);
    packAndCopy(NPM_DIR);
sh.popd();

sh.exec('npm run pack -w devextreme-react -w devextreme-vue', { silent: true });

sh.pushd('packages/devextreme-angular');
    const additionalArgs = devMode ? '' : ' -- --with-descriptions';
    sh.exec('npm run pack' + additionalArgs, { silent: true });
sh.popd();

sh.cp(path.join(ROOT_DIR, 'packages', 'devextreme-angular', 'npm', 'dist', '*.tgz'), NPM_DIR);
sh.cp(path.join(ROOT_DIR, 'packages', 'devextreme-react', 'npm', '*.tgz'), NPM_DIR);
sh.cp(path.join(ROOT_DIR, 'packages', 'devextreme-vue', 'npm', '*.tgz'), NPM_DIR);

if (sh.env.BUILD_INTERNAL_PACKAGE === 'true') {
    sh.exec('npm run build-dist -w devextreme-main');

    sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-internal'));
        sh.exec(`npm pkg set version="${devextremeNpmVersion}"`);
        packAndCopy(NPM_DIR);
    sh.popd();

    sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist-internal'));
        packAndCopy(NPM_DIR);
    sh.popd();
}
