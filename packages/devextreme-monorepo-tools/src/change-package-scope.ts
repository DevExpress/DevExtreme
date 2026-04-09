import sh from 'shelljs';
import fs from 'fs';
import path from 'path';
import tar from 'tar-fs';
import { createUnzip } from 'zlib';
import { npm } from './npm-utils';
import { ensureEmptyDir } from './fs-utils';

export interface ChangePackageScopeOptions {
  tgz: string;
  scope?: string;
  removeScope?: boolean;
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
      reject(new Error(`Unexpected error occurred during extracting from archive: ${args.tgz}`));
    });
  });
}

