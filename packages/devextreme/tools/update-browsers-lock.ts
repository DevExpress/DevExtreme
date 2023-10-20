import {
  LOCK_FILE_PATH,
  getBrowsersLockChecksum,
  getTargets,
  writeBrowsersLock,
} from "./browsers-lock";

const result = {
  sha1: getBrowsersLockChecksum(),
  targets: getTargets(),
};
console.log(`${LOCK_FILE_PATH} updated:`);
console.log(result);
writeBrowsersLock(result);
