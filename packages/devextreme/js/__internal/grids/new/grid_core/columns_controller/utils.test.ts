import { describe, expect, it } from '@jest/globals';

import { getVisibleIndexes } from './utils';

describe('getVisibleIndexes', () => {
  it('should create visible indexes if not present', () => {
    expect(getVisibleIndexes([
      undefined, undefined, undefined, undefined,
    ])).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('should preserve visible indexes if present', () => {
    expect(getVisibleIndexes([
      3, 1, 0, 2,
    ])).toEqual([
      3, 1, 0, 2,
    ]);
  });

  it('should fill in missing indexes', () => {
    expect(getVisibleIndexes([
      3, undefined, 0, undefined,
    ])).toEqual([
      3, 1, 0, 2,
    ]);
  });
});
