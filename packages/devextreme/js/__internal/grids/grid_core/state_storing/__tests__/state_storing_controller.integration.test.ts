import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { DataGridScrollMode } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const ITEMS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

describe('StateStoringController', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the state with a page size is applied', () => {
    it.each<{ mode: DataGridScrollMode; expected: number }>([
      { mode: 'standard', expected: 2 },
      { mode: 'virtual', expected: 4 },
      { mode: 'infinite', expected: 4 },
    ])('should set the page size to $expected in the $mode scrolling mode', async ({ mode, expected }) => {
      const { instance } = await createDataGrid({
        dataSource: ITEMS,
        paging: { pageSize: 4 },
        scrolling: { mode },
      });

      instance.state({ pageSize: 2 });

      expect(instance.option('paging.pageSize')).toBe(expected);
    });
  });
});
