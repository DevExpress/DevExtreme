import sh from 'shelljs';
import { updateVersion, updateVersionJs } from './common/version';

const [, , version, ...pnpmArgs] = process.argv;

if (version == null) {
  console.error(`Usage: 'pnpm run all:update-version <version> <pnpm_args>' (XX.X.X)`);
  process.exit(1);
}

sh.set('-e');

updateVersionJs(version);
updateVersion(version, pnpmArgs);
