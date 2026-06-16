const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const demosRoot = path.resolve(__dirname, '..', '..');
const pnpmStore = path.resolve(demosRoot, '..', '..', 'node_modules', '.pnpm');

function resolveNgcWithTs6() {
  const entries = fs.readdirSync(pnpmStore)
    .filter((name) => name.startsWith('@angular+compiler-cli@22.'));

  for (const entry of entries) {
    const tsLink = path.join(pnpmStore, entry, 'node_modules', 'typescript');
    if (!fs.existsSync(tsLink)) continue;

    const tsRealPath = fs.realpathSync(tsLink);
    if (!tsRealPath.includes('typescript@6.0')) continue;

    const ngcBin = path.join(
      pnpmStore,
      entry,
      'node_modules',
      '@angular',
      'compiler-cli',
      'bundles',
      'src',
      'bin',
      'ngc.js',
    );

    if (fs.existsSync(ngcBin)) return ngcBin;
  }

  return null;
}

const ngcBin = resolveNgcWithTs6();
if (!ngcBin) {
  console.error('Could not find @angular/compiler-cli@22 linked with TypeScript 6.0.x');
  process.exit(1);
}

const result = cp.spawnSync(
  process.execPath,
  [ngcBin, '--noEmit', '--project', 'tsconfig.ngc-check.json'],
  {
    cwd: demosRoot,
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
