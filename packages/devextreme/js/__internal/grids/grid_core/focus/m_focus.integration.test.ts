import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { CustomStore, query } from '@js/common/data';
import $ from '@js/core/renderer';
import type { StoreChange } from '@js/data/store';
import DataGrid from '@js/ui/data_grid';

import {
  afterTest, beforeTest, createDataGrid, flushAsync, GRID_CONTAINER_ID,
} from '../__tests__/__mock__/helpers/utils';

describe('GridCore focus', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const testCases: [boolean, 'insert' | 'remove' | 'update', number][] = [
    [true, 'insert', 2],
    [true, 'remove', 0],
    [true, 'update', 2],
    [false, 'insert', 2],
    [false, 'remove', 0],
    [false, 'update', 2],
  ];

  // T1292991
  describe.each(testCases)(
    'when repaintChangesOnly=%s and performing %s operation',
    (repaintChangesOnly, operation, expectedFocusedRowIndex) => {
      it('should updates the focused row index correctly', async () => {
        const onFocusedRowChanged = jest.fn();
        const { instance } = await createDataGrid({
          dataSource: {
            store: {
              type: 'array',
              data: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' },
              ],
              key: 'id',
            },
            reshapeOnPush: true,
            pushAggregationTimeout: 0,
          },
          showBorders: true,
          focusedRowEnabled: true,
          focusedRowKey: 2,
          onFocusedRowChanged,
          repaintChangesOnly,
          columns: [
            { dataField: 'id', width: 80 },
            { dataField: 'name', caption: 'Name', sortOrder: 'asc' },
          ],
        });
        const store = instance.getDataSource().store();

        onFocusedRowChanged.mockClear();

        switch (operation) {
          case 'insert':
            store.push([{ type: 'insert', index: 0, data: { name: 'Item 0' } }]);
            break;
          case 'remove':
            store.push([{ type: 'remove', key: 1 }]);
            break;
          case 'update':
            store.push([{ type: 'update', key: 3, data: { id: 3, name: 'A Item 3' } }]);
            break;
          default:
            break;
        }

        await flushAsync();

        expect(onFocusedRowChanged.mock.calls.length).toBe(1);
        expect(instance.option('focusedRowKey')).toEqual(2);
        expect(instance.option('focusedRowIndex')).toEqual(expectedFocusedRowIndex);
      });
    },
  );

  const navigateToRowTestCases: [boolean, boolean][] = [
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ];

  describe.each(navigateToRowTestCases)(
    'when focusedRowEnabled=%s, reshapeOnPush=%s and rows are added via the store push API',
    (focusedRowEnabled, reshapeOnPush) => {
      it('navigateToRow should navigate to the page containing the target row', async () => {
        const { instance } = await createDataGrid({
          dataSource: {
            store: {
              type: 'array',
              data: Array.from({ length: 100 }, (_, index) => ({
                id: index + 1,
                name: `Item ${index + 1}`,
              })),
              key: 'id',
            },
            reshapeOnPush,
          },
          focusedRowEnabled,
          columns: [
            { dataField: 'id', width: 80 },
            { dataField: 'name', caption: 'Name' },
          ],
        });
        const changes: StoreChange[] = new Array(50)
          .fill(null)
          .map((_, index) => ({
            type: 'insert',
            data: { id: 101 + index, firstName: `First${101 + index}`, lastName: `Last${101 + index}` },
          }));
        const store = instance.getDataSource().store();

        store.push(changes);
        await flushAsync();

        const navigatePromise = instance.navigateToRow(81);
        await flushAsync();
        await navigatePromise;

        expect(instance.pageIndex()).toBe(4);
        expect(instance.getVisibleRows()[0].key).toBe(81);
      });
    },
  );

  // T1332109
  describe('when the dataSource is changed while the focused row position lookup is in flight', () => {
    const data = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
    }));

    let capturedErrors: unknown[] = [];
    const trackError = (error: unknown): void => {
      capturedErrors.push(error);
    };

    beforeEach(() => {
      jest.useRealTimers();
      capturedErrors = [];
      process.on('uncaughtException', trackError);
      process.on('unhandledRejection', trackError);
    });

    afterEach(() => {
      process.off('uncaughtException', trackError);
      process.off('unhandledRejection', trackError);
    });

    const wait = async (ms = 0): Promise<void> => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

    const waitFor = async (predicate: () => boolean): Promise<void> => {
      for (let attempt = 0; attempt < 200 && !predicate(); attempt += 1) {
        // eslint-disable-next-line no-await-in-loop
        await wait(5);
      }
    };

    const createStore = (
      items: { id: number; name: string }[],
      holdLookupLoads = false,
    ) => {
      const heldLookupLoads: (() => void)[] = [];
      const store = new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          let dataQuery = query(items);
          if (loadOptions.filter) {
            dataQuery = dataQuery.filter(loadOptions.filter);
          }
          const filteredItems = dataQuery.toArray();
          const skip = loadOptions.skip ?? 0;
          const take = loadOptions.take ?? filteredItems.length;
          const result = {
            data: filteredItems.slice(skip, skip + take),
            totalCount: filteredItems.length,
          };
          if (take === 1 && holdLookupLoads) {
            return new Promise<unknown>((resolve) => {
              heldLookupLoads.push(() => resolve(result));
            });
          }
          return Promise.resolve(result);
        },
      });

      return { store, heldLookupLoads };
    };

    const createGridWithHeldLookup = async () => {
      const { store, heldLookupLoads } = createStore(data, true);
      const $container = $('<div>')
        .attr('id', GRID_CONTAINER_ID)
        .appendTo(document.body);
      const instance = new DataGrid($container.get(0) as HTMLDivElement, {
        dataSource: store,
        remoteOperations: true,
        focusedRowEnabled: true,
        paging: { pageSize: 10 },
        columns: ['id', 'name'],
      });
      await waitFor(() => instance.getVisibleRows().length === 10);

      expect(instance.getVisibleRows()).toHaveLength(10);

      instance.option('focusedRowKey', 55);
      await waitFor(() => heldLookupLoads.length === 1);

      expect(heldLookupLoads).toHaveLength(1);

      return {
        instance,
        releaseLookupLoads: () => {
          heldLookupLoads.forEach((release) => release());
          heldLookupLoads.length = 0;
        },
      };
    };

    it('should not fail when the dataSource is cleared', async () => {
      const { instance, releaseLookupLoads } = await createGridWithHeldLookup();

      instance.option('dataSource', undefined);
      releaseLookupLoads();
      await wait(50);

      expect(capturedErrors).toEqual([]);
      expect(instance.option('focusedRowIndex')).toBe(-1);
      expect(instance.getVisibleRows()).toEqual([]);
    });

    it('should not apply the stale lookup result when the dataSource is replaced', async () => {
      const { instance, releaseLookupLoads } = await createGridWithHeldLookup();

      instance.option('dataSource', createStore(data.slice(45)).store);
      await waitFor(() => instance.option('focusedRowIndex') === 9);
      releaseLookupLoads();
      await wait(50);

      expect(capturedErrors).toEqual([]);
      expect(instance.pageIndex()).toBe(0);
      expect(instance.option('focusedRowIndex')).toBe(9);
    });
  });
});
