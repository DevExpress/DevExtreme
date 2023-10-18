import sh from "shelljs";
import path from "node:path";

const version = process.argv[2];

const MONOREPO_ROOT = path.join(__dirname, '..');
const packagesPath = path.join(MONOREPO_ROOT, 'packages', '**', 'package.json');
const playgroundsPath = path.join(MONOREPO_ROOT, 'playgrounds', '**', 'package.json');

sh.exec(`npm version ${version} -ws --include-workspace-root --workspaces-update=false`);

const setStrictVersion = /.*-(build|alpha|beta).*/.test(version);

if (setStrictVersion) {
    sh.sed('-i', /"devextreme(-angular|-react|-vue)?": ".*"/, `"devextreme$1": "${version}"`, [packagesPath, playgroundsPath]);
}

sh.exec('npm i');
