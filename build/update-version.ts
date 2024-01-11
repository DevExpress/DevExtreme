import sh from 'shelljs';
import { updateVersion } from './common/version-utils';

const version = process.argv[2];

if (version == null) {
  console.error(`Usage: 'npm run all:update-version -- $version' (XX.X.X)`);
  process.exit(1);
}

sh.set('-e');

updateVersion(version);
