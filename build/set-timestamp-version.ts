import sh from 'shelljs';
import pkg from '../package.json';
import { formatVersion, makeTimestampVersion, updateVersion } from './common/version-utils';

const timestampVersion = makeTimestampVersion(formatVersion(pkg.version), new Date());
if(timestampVersion === undefined) {
  console.error(`Unable to generarte timestamp version from ${pkg.version}`);
  process.exit(1);
}

sh.set('-e');

updateVersion(timestampVersion);
