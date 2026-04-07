import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import tar from 'tar-fs';
import yargs from 'yargs';
import { createUnzip } from 'zlib';
import { npm } from './npm-utils';
import { ensureEmptyDir } from './fs-utils';

export interface ChangePackageScopeOptions {
  tgz: string;
  scope?: string;
  removeScope?: boolean;
}

export function parseChangePackageScopeArgs(argv: string[]): ChangePackageScopeOptions {
  return yargs(argv).strict().version(false).help(false)
    .option('tgz', { type: 'string', demandOption: true, nargs: 1 })
    .option('scope', { type: 'string', nargs: 1, default: undefined, coerce(s: string) { return s?.toLowerCase(); } })
    .option('removeScope', { type: 'boolean', default: undefined })
    .conflicts('scope', 'removeScope')
    .parseSync();
}

export function changePackageScope(args: ChangePackageScopeOptions): Promise<string> {
  sh.set('-e');
  sh.config.silent = true;

  const dirName = path.basename(args.tgz).replace(/\.tgz$/, '');
  ensureEmptyDir(dirName);

  return new Promise((resolve, reject) => {
    fs.createReadStream(args.tgz).pipe(createUnzip()).pipe(tar.extract(dirName, { strip: 1 })).on('finish', () => {
      sh.pushd(dirName);

      const name = npm.pkg.get('name')?.match(/^(@(.*)\/)?(.*)$/)?.[3];
      const version = npm.pkg.get('version');

      if (!name) {
        reject(new Error('Unable to get package name'));
        return;
      }

      if (!version) {
        reject(new Error('Unable to get package version'));
        return;
      }

      let newDirName: string | undefined;

      if (args.scope) {
        npm.pkg.set({ name: `@${args.scope}/${name}` });
        newDirName = `${args.scope}-${name}-${version}`;
      }

      if (args.removeScope) {
        npm.pkg.set({ name });
        newDirName = `${name}-${version}`;
      }

      sh.popd();

      if (newDirName) {
        if (fs.existsSync(newDirName)) {
          fs.rmSync(newDirName, { force: true, recursive: true });
        }
        fs.renameSync(dirName, newDirName);
      }

      resolve(newDirName ?? dirName);
    }).on('error', () => {
      reject(new Error(`Unexpected error occured during extracting from archive: ${args.tgz}`));
    });
  });
}

export async function runChangePackageScopeCli(argv: string[] = process.argv.slice(2)): Promise<string> {
  const args = parseChangePackageScopeArgs(argv);
  const result = await changePackageScope(args);
  console.log(result); // return value, used in GA
  return result;
}