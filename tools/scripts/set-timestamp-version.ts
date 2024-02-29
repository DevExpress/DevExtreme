import sh from 'shelljs';
import pkg from '../../package.json';
import { formatVersion, makeVersion } from './common/monorepo-tools';
import { updateVersion } from './common/version';

const timestampVersion = makeVersion(formatVersion(pkg.version), true, new Date());
if(timestampVersion === undefined) {
  console.error(`Unable to generate timestamp version from ${pkg.version}`);
  process.exit(1);
}

sh.set('-e');

updateVersion(timestampVersion);
