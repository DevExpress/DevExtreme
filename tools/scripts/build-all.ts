import sh from 'shelljs';
import path from 'node:path';
import yargs from 'yargs';
import { ARTIFACTS_DIR, INTERNAL_TOOLS_ARTIFACTS, ROOT_DIR, NPM_DIR, JS_ARTIFACTS, CSS_ARTIFACTS } from './common/paths';
import { version as devextremeNpmVersion } from '../../packages/devextreme/package.json';

const argv = yargs
    .option('dev', { type: 'boolean', default: false })
    .parseSync();

const devMode = argv.dev;

console.log(`Dev mode: ${devMode}`);

const DEVEXTREME_NPM_DIR = path.join(ROOT_DIR, 'packages/devextreme/artifacts/npm');

const injectDescriptions = () => {
    sh.pushd(ROOT_DIR);

    const DOCUMENTATION_TEMP_DIR = path.join(ARTIFACTS_DIR, 'doc_tmp');
    sh.exec(`git clone -b ${MAJOR_VERSION} --depth 1 --config core.longpaths=true https://github.com/DevExpress/devextreme-documentation.git ${DOCUMENTATION_TEMP_DIR}`);

    sh.pushd(DOCUMENTATION_TEMP_DIR);
    sh.exec('npm i');
    sh.exec(`npm run update-topics -- --artifacts ${INTERNAL_TOOLS_ARTIFACTS}`);
    sh.popd();

    sh.rm('-rf', DOCUMENTATION_TEMP_DIR);

    sh.exec('pnpm run devextreme:inject-descriptions');
    sh.popd();
}

sh.set('-e');

sh.mkdir('-p', NPM_DIR);

const packAndCopy = (outputDir: string) => {
    sh.exec('pnpm pack', { silent: true });
    sh.cp('*.tgz', outputDir);
}

const monorepoVersion = sh.exec('pnpm pkg get version', { silent: true }).stdout.replaceAll('"', '');
const MAJOR_VERSION = monorepoVersion.split('.').slice(0, 2).join('_');

sh.cd(ROOT_DIR);

if (!devMode) {
    sh.exec('pnpm run tools:discover-declarations');
    // aspnet metadata will be used in Build custom-tasks to inject aspnet descriptions
    sh.exec(`pnpm run tools make-aspnet-metadata --version ${MAJOR_VERSION}`);

    injectDescriptions();
}

if (devMode) {
    sh.exec('pnpx nx build devextreme');
} else {
    sh.exec('pnpx nx build devextreme-scss');
    sh.exec('pnpx nx build-dist devextreme --skipNxCache', {
        env: {
            ...sh.env,
            BUILD_INTERNAL_PACKAGE: 'false'
        }
    });
}

sh.exec(`pnpx nx build devextreme-themebuilder${devMode ? '' : ' --skipNxCache'}`);

// Copy artifacts for DXBuild (Installation)
sh.pushd(path.join(ROOT_DIR, 'packages/devextreme/artifacts'));
    sh.cp('-r', ['ts', 'js', 'css'], ARTIFACTS_DIR);
sh.popd();

// TODO: maybe we should add bootstrap to vendors
const BOOTSTRAP_DIR = path.join(ROOT_DIR, 'packages', 'devextreme-themebuilder', 'node_modules', 'bootstrap', 'dist');
sh.cp([path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.js'), path.join(BOOTSTRAP_DIR, 'js', 'bootstrap.min.js')], JS_ARTIFACTS);
sh.cp([path.join(BOOTSTRAP_DIR, 'css', 'bootstrap.css'), path.join(BOOTSTRAP_DIR, 'css', 'bootstrap.min.css')], CSS_ARTIFACTS);

sh.exec('pnpm run all:pack-and-copy');

sh.exec('pnpx nx pack devextreme-react', { silent: true });
sh.exec('pnpx nx pack devextreme-vue', { silent: true });
sh.exec(`pnpx nx pack devextreme-angular${devMode ? '' : ' --with-descriptions'}`, { silent: true });

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme'));
    packAndCopy(NPM_DIR);
sh.popd();

sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist'));
    packAndCopy(NPM_DIR);
sh.popd();

sh.pushd(path.join(ROOT_DIR, 'packages', 'devextreme-themebuilder', 'dist'));
    sh.exec(`pnpm pkg set version="${devextremeNpmVersion}"`);
    packAndCopy(NPM_DIR);
sh.popd();

sh.cp(path.join(ROOT_DIR, 'packages', 'devextreme-angular', 'npm', 'dist', '*.tgz'), NPM_DIR);
sh.cp(path.join(ROOT_DIR, 'packages', 'devextreme-react', 'npm', '*.tgz'), NPM_DIR);
sh.cp(path.join(ROOT_DIR, 'packages', 'devextreme-vue', 'npm', '*.tgz'), NPM_DIR);

if (sh.env.BUILD_INTERNAL_PACKAGE === 'true') {
    sh.exec('pnpx nx build-dist devextreme');

    sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-internal'));
        sh.exec(`pnpm pkg set version="${devextremeNpmVersion}"`);
        packAndCopy(NPM_DIR);
    sh.popd();

    sh.pushd(path.join(DEVEXTREME_NPM_DIR, 'devextreme-dist-internal'));
        packAndCopy(NPM_DIR);
    sh.popd();
}
