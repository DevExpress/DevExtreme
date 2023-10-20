import { readFileSync, writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';

import { bytesToHex } from '../js/__internal/core/license/byte_utils';
import { sha1 } from '../js/__internal/core/license/sha1';

export const LOCK_FILE_PATH = '.browserslist-lock.json';
const BROWSERSLIST_FILE_PATH = '.browserslistrc';

type targetsFunc = (
  inputTargets?: {
    browsers?: any;
    esmodules?: any;
    [k: string]: any;
  }, options?: {
    configPath: any;
    configFile: any;
    browserslistEnv: any;
    ignoreBrowserslistConfig: boolean;
  }) => Record<string, string>;

const getBabelTargets: targetsFunc = require('@babel/helper-compilation-targets').default;

interface BrowsersLock {
  sha1: string;
  targets: Record<string, string>;
}
export function writeBrowsersLock(lock: BrowsersLock): void {
  writeFileSync(LOCK_FILE_PATH, JSON.stringify(lock, null, 2));
}

function readBrowsersLock(): BrowsersLock {
  return JSON.parse(readFileSync(resolvePath(LOCK_FILE_PATH), 'utf-8'));
}

export function getBrowsersLockChecksum() {
  const browserslistrc = readFileSync(resolvePath(BROWSERSLIST_FILE_PATH), 'utf-8');
  const browserslock = readBrowsersLock();
  return bytesToHex(sha1(`${browserslistrc}+${JSON.stringify(browserslock.targets)}`));
}

export function getTargets(): Record<string, string> {
  const babelTargets = getBabelTargets();

  return Object.keys(babelTargets).reduce((acc, key) => {
    acc[key] = babelTargets[key].replace(/(\.0)*$/, '');
    return acc;
  }, {} as Record<string, string>);
}
