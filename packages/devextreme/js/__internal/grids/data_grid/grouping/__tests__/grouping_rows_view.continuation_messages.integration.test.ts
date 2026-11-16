import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { ColumnGroupCellTemplateData, Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const CONTINUES = 'continues';
const CONTINUED = 'continued';

const DATA = [
  { id: 1, group: 'A', value: 1 },
  { id: 2, group: 'A', value: 2 },
  { id: 3, group: 'A', value: 3 },
  { id: 4, group: 'A', value: 4 },
  { id: 5, group: 'A', value: 5 },
  { id: 6, group: 'B', value: 6 },
];

const createGroupedGrid = async (
  options: DataGridProperties = {},
): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({
    dataSource: DATA,
    height: 300,
    columns: [{ dataField: 'group', groupIndex: 0 }, 'value'],
    grouping: {
      autoExpandAll: true,
      texts: { groupContinuesMessage: CONTINUES, groupContinuedMessage: CONTINUED },
    },
    paging: { pageSize: 2 },
    ...options,
  });

  return instance;
};

const goToPage = (instance: DataGridInstance, pageIndex: number): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises -- settled by runAllTimers
  instance.pageIndex(pageIndex);
  jest.runAllTimers();
};

const getGroupRowTexts = (instance: DataGridInstance): string[] => Array.from(
  instance.element().querySelectorAll('.dx-group-row'),
  (row) => row.lastElementChild?.textContent ?? '',
);

describe('Grouping rows view — group continuation messages', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('in the standard scrolling mode', () => {
    it('should show the continues message on a group that goes on to the next page', async () => {
      const instance = await createGroupedGrid();

      expect(getGroupRowTexts(instance)).toEqual([`Group: A (${CONTINUES})`]);
    });

    it('should show both messages on a group that started before the page and goes on after it', async () => {
      const instance = await createGroupedGrid();

      goToPage(instance, 1);

      expect(getGroupRowTexts(instance)).toEqual([`Group: A (${CONTINUED}. ${CONTINUES})`]);
    });

    it('should show the continued message on a group that ends on the page', async () => {
      const instance = await createGroupedGrid();

      goToPage(instance, 4);

      expect(getGroupRowTexts(instance)).toEqual([`Group: A (${CONTINUED})`]);
    });

    it('should not show a message on groups that fit on the page', async () => {
      const instance = await createGroupedGrid({ paging: { pageSize: 20 } });

      expect(getGroupRowTexts(instance)).toEqual(['Group: A', 'Group: B']);
    });

    it.each([
      { pageIndex: 0, continues: CONTINUES, continued: undefined },
      { pageIndex: 1, continues: CONTINUES, continued: CONTINUED },
      { pageIndex: 4, continues: undefined, continued: CONTINUED },
    ])('should pass the messages of page $pageIndex to the group cell template', async ({ pageIndex, continues, continued }) => {
      const templateOptions: ColumnGroupCellTemplateData[] = [];
      const instance = await createGroupedGrid({
        columns: [{
          dataField: 'group',
          groupIndex: 0,
          groupCellTemplate: (_, options): void => { templateOptions.push(options); },
        }, 'value'],
      });

      goToPage(instance, pageIndex);

      const lastOptions = templateOptions[templateOptions.length - 1];
      expect(lastOptions.groupContinuesMessage).toBe(continues);
      expect(lastOptions.groupContinuedMessage).toBe(continued);
    });

    it('should not add the messages to the options of data cells', async () => {
      const cellOptions: object[] = [];
      const instance = await createGroupedGrid({
        columns: [
          { dataField: 'group', groupIndex: 0 },
          { dataField: 'value', cellTemplate: (_, options): void => { cellOptions.push(options); } },
        ],
      });
      cellOptions.length = 0;

      goToPage(instance, 1);

      expect(cellOptions).toHaveLength(1);
      expect(cellOptions[0]).not.toHaveProperty('groupContinuesMessage');
      expect(cellOptions[0]).not.toHaveProperty('groupContinuedMessage');
    });
  });

  it.each(['virtual', 'infinite'] as const)('should not show the messages in the %s scrolling mode', async (mode) => {
    const instance = await createGroupedGrid({
      dataSource: Array.from({ length: 50 }, (_, i) => ({ id: i + 1, group: 'A', value: i + 1 })),
      scrolling: { mode },
    });

    expect(getGroupRowTexts(instance)).toEqual(['Group: A']);
  });
});
