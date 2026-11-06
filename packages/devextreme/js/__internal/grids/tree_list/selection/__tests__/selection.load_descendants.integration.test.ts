import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { flushAsync } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, parentId: 0, name: 'Parent' },
  { id: 2, parentId: 1, name: 'Child' },
];

describe('TreeList selection: loadDescendants', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should not throw without a data source when selection is recursive', async () => {
    const { instance } = await createTreeList({
      columns: ['name'],
      selection: { mode: 'multiple', recursive: true },
    });

    expect(() => instance.loadDescendants()).not.toThrow();

    instance.option({ dataSource: DATA, selectedRowKeys: [1] });
    await flushAsync();

    expect(instance.isRowSelected(2)).toBe(true);
  });
});
