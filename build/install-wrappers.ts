import sh from 'shelljs';
import fs from 'fs';
import tar from 'tar-fs';
import { createUnzip } from 'zlib';

sh.set('-e');

console.log('This is a workaround for working with demos until the wrappers are reworked');
console.log('Please run "npm run all:build" before this script');
console.log('This script should be run again after each "npm install" and "npm run all:build"\n\n');

async function main() {
  const version = '24.1.0';
  const PACKAGES = ['devextreme-angular', 'devextreme-react', 'devextreme-vue'];

  await Promise.all(PACKAGES.map(packageName => new Promise((resolve) => {
    const tgzPath = `artifacts/npm/${packageName}-${version}.tgz`;
    const targetPath = `node_modules/${packageName}`;

    sh.rm('-rf', targetPath);
    sh.mkdir(targetPath);

    fs.createReadStream(tgzPath).pipe(createUnzip()).pipe(tar.extract(targetPath, { strip: 1 })).on('finish', () => {
      console.log(`Installed ${packageName}`);
      resolve(1);
    }).on('error', () => {
      throw new Error(`Unexpected error occured during extracting from archive: ${packageName}`);
    });
  })));

  console.log('\nDone!');
}

main();
