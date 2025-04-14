import { describe, expect, it } from '@jest/globals';
import { state } from '@ts/core/reactive/index';

import { getActualColumnSettings, getVisibleIndexes, preNormalizeColumns } from './utils';

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
describe('getActualColumnSettings', () => {
  it('should compute pre-normalized columns from configuration', () => {
    const columnsConfig = state([
      { dataField: 'id' },
      { name: 'username', dataField: 'user_name', visibleIndex: 2 },
    ]);

    const actualColumnSettings = getActualColumnSettings(columnsConfig);

    const expected = preNormalizeColumns([
      { dataField: 'id' },
      { name: 'username', dataField: 'user_name', visibleIndex: 2 },
    ]);

    // @ts-expect-error
    expect(actualColumnSettings.value).toEqual(expected);
  });

  it('should return empty array if configuration is undefined', () => {
    const columnsConfig = state(undefined);
    const actualColumnSettings = getActualColumnSettings(columnsConfig);

    // @ts-expect-error
    expect(actualColumnSettings.value).toEqual([]);
  });
});
