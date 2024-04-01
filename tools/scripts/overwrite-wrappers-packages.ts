import fs from 'fs';
import tar from 'tar-fs';
import pkg from '../../package.json';
import { createUnzip } from 'zlib';

console.log('This is a workaround for working with demos until the wrappers are reworked');
console.log('Please run "npm run all:build" before this script');
console.log('This script should be run again after each "npm install" and "npm run all:build"\n\n');

async function main() {
  const VERSION = pkg.version;
  const PACKAGES = ['devextreme-angular', 'devextreme-react', 'devextreme-vue'];

  await Promise.all(PACKAGES.map(packageName => new Promise<void>((resolve) => {
    const tgzPath = `artifacts/npm/${packageName}-${VERSION}.tgz`;
    const targetPath = `node_modules/${packageName}`;

    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(targetPath);

    fs.createReadStream(tgzPath)
      .pipe(createUnzip())
      .pipe(tar.extract(targetPath, { strip: 1 }))
      .on('finish', () => {
        console.log(`Installed ${packageName}`);
        resolve();
      }).on('error', () => {
        throw new Error(`Unexpected error occured during extracting from archive: ${packageName}`);
      });
  })));

  console.log('\nDone!');
}

main();
