import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const ITEMS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

const isPagerVisible = (instance: DataGridInstance): boolean => instance
  .getView('pagerView')
  .isVisible();

describe('PagerView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('without a data source', () => {
    it('reports one page and no items', async () => {
      const { component } = await createDataGrid({
        pager: { visible: true },
      });
      const pagination = component.getPager().getInstance();

      expect(pagination.option('pageCount')).toBe(1);
      expect(pagination.option('itemCount')).toBe(0);
      expect(pagination.option('hasKnownLastPage')).toBe(true);
    });

    it('is hidden in auto mode', async () => {
      const { instance } = await createDataGrid({
        pager: { visible: 'auto' },
      });

      expect(isPagerVisible(instance)).toBe(false);
    });
  });

  describe('with a data source', () => {
    it('reports the page count and the item count', async () => {
      const { component } = await createDataGrid({
        dataSource: ITEMS,
        paging: { pageSize: 2 },
        pager: { visible: true },
      });
      const pagination = component.getPager().getInstance();

      expect(pagination.option('pageCount')).toBe(3);
      expect(pagination.option('itemCount')).toBe(5);
      expect(pagination.option('hasKnownLastPage')).toBe(true);
    });

    it('is visible in auto mode when there is more than one page', async () => {
      const { instance } = await createDataGrid({
        dataSource: ITEMS,
        paging: { pageSize: 2 },
        pager: { visible: 'auto' },
      });

      expect(isPagerVisible(instance)).toBe(true);
    });

    it('is hidden in auto mode when a single page holds every item', async () => {
      const { instance } = await createDataGrid({
        dataSource: ITEMS,
        paging: { pageSize: 10 },
        pager: { visible: 'auto' },
      });

      expect(isPagerVisible(instance)).toBe(false);
    });
  });
});
