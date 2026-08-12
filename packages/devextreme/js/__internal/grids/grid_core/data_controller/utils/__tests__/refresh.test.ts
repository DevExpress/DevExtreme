import { describe, expect, it } from '@jest/globals';

import { getRefreshOptions } from '../refresh';

describe('getRefreshOptions', () => {
  it('should reload with changes only when options is true', () => {
    expect(getRefreshOptions(true)).toEqual({ reload: true, changesOnly: true });
  });

  it('should reload with lookup when options is falsy', () => {
    expect(getRefreshOptions()).toEqual({ reload: true, lookup: true });
    expect(getRefreshOptions(false)).toEqual({ reload: true, lookup: true });
  });

  it('should return the passed options object as is', () => {
    const options = { load: true, changesOnly: true };

    expect(getRefreshOptions(options)).toBe(options);
  });
});
