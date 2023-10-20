
import { readFileSync } from 'fs';

import { LOCK_FILE_PATH, getBrowsersLockChecksum } from './tools/browsers-lock';

describe('browserslist lock file', () => {
  
  it('is complient with .browserslistrc', () => {
    const actual = JSON.parse(readFileSync(LOCK_FILE_PATH, 'utf-8')).sha1;
    const expected = getBrowsersLockChecksum();

    // npm run update-browsers-lock script to update lock file
    expect(actual).toBe(expected);
  });
});
