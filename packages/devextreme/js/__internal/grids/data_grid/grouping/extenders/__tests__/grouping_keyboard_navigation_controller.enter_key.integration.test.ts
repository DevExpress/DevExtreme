import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import { triggerKeyDown, triggerPointerDown } from '@ts/grids/grid_core/keyboard_navigation/__tests__/helpers/utils';

import type { GroupingDataControllerExtension } from '../../types';

const DATA = [
  { id: 1, group: 'A', value: 10 },
  { id: 2, group: 'A', value: 20 },
  { id: 3, group: 'A', value: 30 },
  { id: 4, group: 'B', value: 40 },
];

const createGroupedGrid = (
  options: DataGridProperties = {},
): ReturnType<typeof createDataGrid> => createDataGrid({
  dataSource: DATA,
  columns: [{ dataField: 'group', groupIndex: 0 }, 'value'],
  grouping: { autoExpandAll: true },
  paging: { enabled: false },
  ...options,
});

const createMasterDetailGrid = (): ReturnType<typeof createDataGrid> => createDataGrid({
  dataSource: DATA,
  columns: ['group', 'value'],
  masterDetail: { enabled: true },
});

const focusCell = (cell: HTMLElement | null): void => {
  triggerPointerDown(cell as HTMLElement);
  jest.runAllTimers();
};

const pressEnter = async (instance: DataGridInstance): Promise<void> => {
  triggerKeyDown(instance, 'enter');
  await flushAsync();
};

describe('Grouping keyboard navigation — Enter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('collapses and then expands a focused group row', async () => {
    const onRowCollapsing = jest.fn();
    const onRowExpanding = jest.fn();
    const { instance, component } = await createGroupedGrid({ onRowCollapsing, onRowExpanding });
    focusCell(component.getGroupRow(0).getExpandCell());

    await pressEnter(instance);

    expect(instance.isRowExpanded(['A'])).toBe(false);
    expect(onRowCollapsing).toHaveBeenCalledTimes(1);

    await pressEnter(instance);

    expect(instance.isRowExpanded(['A'])).toBe(true);
    expect(onRowExpanding).toHaveBeenCalledTimes(1);
  });

  it('keeps a group row expanded when grouping.allowCollapsing is false', async () => {
    const { instance, component } = await createGroupedGrid({
      grouping: { autoExpandAll: true, allowCollapsing: false },
    });
    focusCell(component.getGroupRow(0).getExpandCell());

    await pressEnter(instance);

    expect(instance.isRowExpanded(['A'])).toBe(true);
  });

  it('opens and then closes the detail row from a focused expand cell', async () => {
    const { instance, component } = await createMasterDetailGrid();
    focusCell(component.getDataRow(0).getCell(0));

    await pressEnter(instance);

    expect(instance.isRowExpanded(1)).toBe(true);

    await pressEnter(instance);

    expect(instance.isRowExpanded(1)).toBe(false);
  });

  it('keeps a group row continued from the previous page expanded', async () => {
    const onRowCollapsing = jest.fn();
    const { instance, component } = await createGroupedGrid({
      paging: { pageSize: 3, pageIndex: 1 },
      onRowCollapsing,
    });
    await flushAsync();

    expect(instance.getVisibleRows()[0]).toMatchObject({
      rowType: 'group',
      key: ['A'],
      data: { isContinuation: true },
    });

    focusCell(component.getGroupRow(0).getExpandCell());

    await pressEnter(instance);

    expect(instance.isRowExpanded(['A'])).toBe(true);
    expect(onRowCollapsing).not.toHaveBeenCalled();
  });

  it('calls changeRowExpand with the group key only', async () => {
    const { instance, component } = await createGroupedGrid();
    const dataController = instance.getController('data') as DataController
      & GroupingDataControllerExtension;
    const changeRowExpand = jest.spyOn(dataController, 'changeRowExpand');
    focusCell(component.getGroupRow(0).getExpandCell());

    await pressEnter(instance);

    expect(changeRowExpand.mock.calls).toStrictEqual([[['A']]]);
  });

  it('starts and then ends editing of a data cell in a grouped grid', async () => {
    const { instance, component } = await createGroupedGrid({
      editing: { mode: 'cell', allowUpdating: true },
    });
    focusCell(component.getDataCell(1, 1).getElement());

    await pressEnter(instance);

    expect(component.getDataCell(1, 1).isEditCell).toBe(true);

    await pressEnter(instance);

    expect(component.getDataCell(1, 1).isEditCell).toBe(false);
  });
});
