import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { npm } from './common/npm-utils';
import { ensureEmptyDir } from './common/fs-utils';

const args = yargs.strict().version(false).help(false)
  .option('tgz', { type: 'string', demandOption: true, nargs: 1 })
  .option('scope', { type: 'string', nargs: 1, default: undefined, coerce(s: string) { return s?.toLowerCase(); } })
  .option('removeScope', { type: 'boolean', default: undefined })
  .conflicts('scope', 'removeScope')
  .parseSync();

sh.set('-e');
sh.config.silent = true;

const dirName = path.basename(args.tgz).replace(/\.tgz$/, '');
ensureEmptyDir(dirName);

sh.exec(`tar -xzf ${args.tgz} --strip-components=1  --directory ${dirName}`);
sh.pushd(dirName);

const name = npm.pkg.get('name')?.match(/^(@(.*)\/)?(.*)$/)?.[3];
const version = npm.pkg.get('version');

if(!name) {
  throw new Error('Unable to get package name');
}

if(!version) {
  throw new Error('Unable to get package version');
}

let newDirName: string | undefined;

if(args.scope) {
  npm.pkg.set({ name: `@${args.scope}/${name}` });
  newDirName = `${args.scope}-${name}-${version}`;
}

if(args.removeScope) {
  npm.pkg.set({ name });
  newDirName = `${name}-${version}`;
}

sh.popd();

if(newDirName) {
  if(fs.existsSync(newDirName)) {
    fs.rmSync(newDirName, { force: true, recursive: true })
  }
  fs.renameSync(dirName, newDirName);
}

console.log(newDirName ?? dirName); // return value, used in GA
