import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, group: 'A', name: 'A1' },
  { id: 2, group: 'A', name: 'A2' },
  { id: 3, group: 'B', name: 'B1' },
  { id: 4, group: 'B', name: 'B2' },
];

const createGroupedGrid = (
  options: DataGridProperties = {},
): ReturnType<typeof createDataGrid> => createDataGrid({
  dataSource: DATA,
  keyExpr: 'id',
  columns: [{ dataField: 'group', groupIndex: 0 }, 'name'],
  grouping: { autoExpandAll: true, expandMode: 'rowClick' },
  ...options,
});

const click = (element: HTMLElement, detail = 1): void => {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail }));
  jest.advanceTimersByTime(50);
};

describe('ColumnsView row events', () => {
  beforeEach(beforeTest);
  afterEach(() => {
    jest.advanceTimersByTime(600);
    afterTest();
  });

  it('should not raise onRowDblClick after clicks on a re-rendered group row and a different data row (T1338452)', async () => {
    const onRowDblClick = jest.fn();
    const { component } = await createGroupedGrid({ onRowDblClick });
    const groupRowCell = component.getGroupRow(0).getCells()[1];

    click(groupRowCell);

    expect(groupRowCell.isConnected).toBe(false);

    click(component.getDataRow(0).getCells()[1]);

    expect(onRowDblClick.mock.calls).toHaveLength(0);
  });

  it('should raise onRowDblClick after a native double-click on a group row that is re-rendered by the first click (T1338452)', async () => {
    const onRowDblClick = jest.fn();
    const { component } = await createGroupedGrid({ onRowDblClick });
    const groupRowCell = component.getGroupRow(0).getCells()[1];

    click(groupRowCell);

    expect(groupRowCell.isConnected).toBe(false);

    click(component.getGroupRow(0).getCells()[1], 2);

    expect(onRowDblClick.mock.calls).toHaveLength(1);
  });
});
