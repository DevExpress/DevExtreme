import sh from 'shelljs';
import pkg from '../../package.json';
import { formatVersion, makeVersion } from './common/monorepo-tools';
import { updateVersion, updateVersionJs } from './common/version';

const formattedVersion = formatVersion(pkg.version);
if(formattedVersion === undefined) {
  console.error(`Unable to generate timestamp version from ${pkg.version}`);
  process.exit(1);
}
const timestampVersion = makeVersion(formattedVersion, true, new Date());

sh.set('-e');

updateVersionJs(timestampVersion.baseVersion, timestampVersion.build);
updateVersion(timestampVersion.fullVersion);
