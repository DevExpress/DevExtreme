import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import tar from 'tar-fs';
import yargs from 'yargs';
import { createUnzip } from 'zlib';
import { npm } from './common/monorepo-tools';
import { ensureEmptyDir } from './common/monorepo-tools';

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

fs.createReadStream(args.tgz).pipe(createUnzip()).pipe(tar.extract(dirName, { strip: 1 })).on('finish', () => {
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
}).on('error', () => {
  throw new Error(`Unexpected error occured during extracting from archive: ${args.tgz}`);
});
