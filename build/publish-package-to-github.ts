import sh from 'shelljs';
import path from 'path';
import { npm } from './common/npm-utils';

sh.set('-e');

const [,, tgzPath, authorName] = process.argv;

if (tgzPath == null) {
  console.error('1st argument missing: specify .tgz file name');
  process.exit(1);
}

if (authorName == null) {
  console.error('2nd argument missing: specify author name');
  process.exit(1);
}

sh.pushd(path.dirname(tgzPath));
{
  const packageDir = 'package';
  sh.exec(`tar -xzf ${path.basename(tgzPath)};`);

  sh.pushd(packageDir); {
    npm.init({yes: true, scope: authorName})
    npm.pkg.delete('repository')
    npm.publish({ quiet: true, dryRun: true, registry: 'https://npm.pkg.github.com'})
  }; sh.popd();
  sh.rm('-r', packageDir);
}
sh.popd();
