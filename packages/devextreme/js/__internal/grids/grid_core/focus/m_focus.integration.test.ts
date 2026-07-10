import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { StoreChange } from '@js/data/store';

import {
  afterTest, beforeTest, createDataGrid, flushAsync,
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
});
