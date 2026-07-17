import sh from 'shelljs';
import { updateVersion, updateVersionJs } from './common/version';

const version = process.argv[2];

if (version == null) {
  console.error(`Usage: 'pnpm nx run workflows:update-version -- XX.X.X'`);
  process.exit(1);
}

sh.set('-e');

updateVersionJs(version);
updateVersion(version);
