import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { Properties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';

const DATA = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, value: i }));

const createLegacyVirtualRowsGrid = async (
  scrolling: Record<string, unknown> = {},
): Promise<{ instance: DataGridInstance; changes: DataChange[] }> => {
  const changes: DataChange[] = [];
  const { instance } = await createDataGrid({
    dataSource: DATA,
    height: 200,
    paging: { pageSize: 10 },
    scrolling: {
      mode: 'standard',
      rowRenderingMode: 'virtual',
      legacyMode: true,
      ...scrolling,
    } as Properties['scrolling'],
    onInitialized: ({ component }) => {
      (component as unknown as DataGridInstance).getController('data').changed.add((change) => {
        changes.push(change);
      });
    },
  });
  await flushAsync();

  return { instance, changes };
};

describe('Virtual scrolling data controller — rows loader changes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should fire a refresh with the visible items when the loader passes no change', async () => {
    const { instance, changes } = await createLegacyVirtualRowsGrid();

    expect(changes).toHaveLength(1);
    expect(changes[0].changeType).toBe('refresh');
    expect(changes[0].items).toBe(instance.getController('data').items());
  });

  describe('when invisible pages are kept', () => {
    it('should keep the delayed flag on the refresh of a delayed change', async () => {
      const { changes } = await createLegacyVirtualRowsGrid({ removeInvisiblePages: false });

      const delayedChanges = changes.filter((change) => 'isDelayed' in change);
      expect(delayedChanges).toHaveLength(1);
      expect(delayedChanges[0]).toMatchObject({ changeType: 'refresh', isDelayed: true });
      expect(delayedChanges[0].items).toHaveLength(10);
    });

    it('should keep the change type and the items of an appended page', async () => {
      const { changes } = await createLegacyVirtualRowsGrid({ removeInvisiblePages: false });

      const appendChanges = changes.filter((change) => change.changeType === 'append');
      expect(appendChanges).toHaveLength(1);
      expect(appendChanges[0].items).toHaveLength(5);
      expect(appendChanges[0]).not.toHaveProperty('isDelayed');
    });
  });
});
