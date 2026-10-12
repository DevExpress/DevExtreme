import { describe, expect, it } from '@jest/globals';

import type { VisibleColumn } from '../columns_controller/types';
import { getColumnLayoutKey } from './utils';

const column = (overrides: Partial<VisibleColumn> = {}): VisibleColumn => ({
  dataField: 'a',
  caption: 'A',
  visible: true,
  ...overrides,
} as VisibleColumn);

describe('getColumnLayoutKey', () => {
  it('should change when a layout-affecting property changes', () => {
    expect(getColumnLayoutKey(column({ visible: true })))
      .not.toBe(getColumnLayoutKey(column({ visible: false })));
  });

  // These drive re-sorting and re-filtering, which reach the cards through
  // dataController.items instead. Including them in the key would recompute
  // the cards a second time for the same user action (T1306983, T1309423).
  it.each(['sortOrder', 'sortIndex', 'filterValues', 'filterType'])(
    'should ignore %s',
    (property) => {
      const before = getColumnLayoutKey(column());
      const after = getColumnLayoutKey(column({ [property]: 'changed' }));

      expect(after).toBe(before);
    },
  );

  it('should distinguish columns that differ only in a non-excluded property', () => {
    expect(getColumnLayoutKey(column({ caption: 'A' })))
      .not.toBe(getColumnLayoutKey(column({ caption: 'B' })));
  });
});
