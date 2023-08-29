const path = require('path');
const sh = require('shelljs');

const MONOREPO_ROOT = path.join(__dirname, '..');
const src = path.join(MONOREPO_ROOT, 'artifacts/internal-tools', process.argv[2]);
const dest = path.join(MONOREPO_ROOT, process.argv[3]);

sh.mkdir(dest);
sh.cp(src, dest);
