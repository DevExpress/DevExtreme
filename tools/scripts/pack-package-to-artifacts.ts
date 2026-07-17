import fs from 'node:fs';
import sh from 'shelljs';
import path from 'node:path';
import yargs from 'yargs';
import { NPM_DIR, ROOT_DIR } from './common/paths';

const args = yargs(process.argv.slice(2))
  .option('dir', { type: 'string', demandOption: true, nargs: 1 })
  .option('setVersionFrom', { type: 'string', nargs: 1 })
  .strict()
  .parseSync();

const packageDir = path.resolve(ROOT_DIR, args.dir);

sh.set('-e');
sh.mkdir('-p', NPM_DIR);
sh.pushd(packageDir);

if (args.setVersionFrom) {
  const pkgPath = path.resolve(ROOT_DIR, args.setVersionFrom);
  const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version: string };
  sh.exec(`pnpm pkg set version="${version}"`);
}

sh.exec('pnpm pack', { silent: true });
sh.cp('*.tgz', NPM_DIR);
sh.popd();
