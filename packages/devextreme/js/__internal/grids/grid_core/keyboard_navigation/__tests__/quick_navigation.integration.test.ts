import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  getKeyboardNavigationController,
  triggerKeyDown,
  triggerPointerDown,
} from './helpers/utils';

const ROW_COUNT = 200;

const TOP_POSITION = 0;
const MIDDLE_POSITION = 1000;
const BOTTOM_POSITION = 3700;

const VIRTUAL_COLUMN_COUNT = 30;
const VIRTUAL_COLUMN_WIDTH = 100;
const GRID_WIDTH = 300;
const MAX_HORIZONTAL_OFFSET = (VIRTUAL_COLUMN_COUNT + 1) * VIRTUAL_COLUMN_WIDTH - GRID_WIDTH;

interface FocusedCell {
  rowKey: number;
  columnIndex: number;
}

const getFocusedCell = (): FocusedCell | undefined => {
  const cell = document.activeElement as HTMLTableCellElement | null;
  const row = cell?.closest<HTMLTableRowElement>('tr.dx-data-row');

  return row && cell
    ? {
      rowKey: Number(row.getAttribute('aria-rowindex')) - 1,
      columnIndex: Number(cell.getAttribute('aria-colindex')) - 1,
    }
    : undefined;
};

const renderRowsAt = (instance: DataGridInstance, position: number): void => {
  // @ts-expect-error
  instance.getController('data').setViewportPosition(position);
  jest.runAllTimers();
};

const focusCell = (instance: DataGridInstance, { rowKey, columnIndex }: FocusedCell): void => {
  const rowIndex = instance.getRowIndexByKey(rowKey);
  const cell = instance.getCellElement(rowIndex, columnIndex) as unknown as HTMLElement;

  triggerPointerDown(cell);
  jest.runAllTimers();
};

const pressCtrlKey = (instance: DataGridInstance, keyName: 'end' | 'home'): void => {
  triggerKeyDown(instance, keyName, document.activeElement, { ctrlKey: true });
  jest.runAllTimers();
};

const createGridWithRows = async (): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({
    dataSource: Array.from({ length: ROW_COUNT }, (_, id) => ({ id, name: `Row ${id}` })),
    height: 400,
    columns: ['id', 'name'],
    scrolling: { mode: 'virtual' },
  });

  return instance;
};

const createGridWithVirtualColumns = async (): Promise<DataGridInstance> => {
  const dataFields = Array.from({ length: VIRTUAL_COLUMN_COUNT }, (_, index) => `field${index}`);
  const { instance } = await createDataGrid({
    dataSource: Array.from({ length: ROW_COUNT }, (_, id) => ({
      id,
      ...Object.fromEntries(dataFields.map((dataField) => [dataField, `${id} ${dataField}`])),
    })),
    height: 400,
    width: GRID_WIDTH,
    columnWidth: VIRTUAL_COLUMN_WIDTH,
    columns: ['id', ...dataFields],
    scrolling: { mode: 'virtual', columnRenderingMode: 'virtual' },
  });

  return instance;
};

interface ScrollHandler {
  _handleScroll: (e: { component: unknown; scrollOffset: { top: number; left: number } }) => void;
}

const scrollRowsViewTo = (instance: DataGridInstance, top: number): void => {
  const rowsView = instance.getView('rowsView') as unknown as ScrollHandler;

  rowsView._handleScroll({
    component: instance.getScrollable(),
    scrollOffset: { top, left: 0 },
  });
  jest.runAllTimers();
};

describe('Quick navigation with virtual scrolling while the target row is not rendered', () => {
  beforeEach(() => {
    beforeTest();
    jest.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
  });

  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  interface QuickNavigationCase {
    keyName: 'end' | 'home';
    startPosition: number;
    start: FocusedCell;
    targetPosition: number;
    target: FocusedCell;
  }

  it.each<QuickNavigationCase>([
    {
      keyName: 'end',
      startPosition: TOP_POSITION,
      start: { rowKey: 0, columnIndex: 0 },
      targetPosition: BOTTOM_POSITION,
      target: { rowKey: ROW_COUNT - 1, columnIndex: 1 },
    },
    {
      keyName: 'home',
      startPosition: BOTTOM_POSITION,
      start: { rowKey: ROW_COUNT - 1, columnIndex: 1 },
      targetPosition: TOP_POSITION,
      target: { rowKey: 0, columnIndex: 0 },
    },
  ])('should focus the target cell after Ctrl+$keyName once its row is rendered', async ({
    keyName, startPosition, start, targetPosition, target,
  }) => {
    const instance = await createGridWithRows();
    renderRowsAt(instance, startPosition);
    focusCell(instance, start);

    pressCtrlKey(instance, keyName);
    renderRowsAt(instance, MIDDLE_POSITION);
    renderRowsAt(instance, targetPosition);

    expect(getFocusedCell()).toEqual(target);
  });

  it('should focus the last cell after Ctrl+End once both the virtual columns and the row are rendered', async () => {
    const instance = await createGridWithVirtualColumns();
    focusCell(instance, { rowKey: 0, columnIndex: 0 });
    jest.spyOn(getKeyboardNavigationController(instance), '_getMaxHorizontalOffset').mockReturnValue(MAX_HORIZONTAL_OFFSET);
    jest.spyOn(instance.getScrollable(), 'scrollLeft').mockReturnValue(MAX_HORIZONTAL_OFFSET);

    pressCtrlKey(instance, 'end');
    // @ts-expect-error
    instance.getController('columns').setScrollPosition(MAX_HORIZONTAL_OFFSET);
    jest.runAllTimers();
    renderRowsAt(instance, BOTTOM_POSITION);

    expect(getFocusedCell()).toEqual({ rowKey: ROW_COUNT - 1, columnIndex: VIRTUAL_COLUMN_COUNT });
  });

  it('should not move focus to the last cell when the user clicks before its row is rendered', async () => {
    const instance = await createGridWithRows();
    focusCell(instance, { rowKey: 0, columnIndex: 0 });

    pressCtrlKey(instance, 'end');
    triggerPointerDown(document.body);
    renderRowsAt(instance, BOTTOM_POSITION);

    expect(getFocusedCell()).toBeUndefined();
  });

  it('should not move focus to the last cell when the user scrolls away before its row is rendered', async () => {
    const instance = await createGridWithRows();
    focusCell(instance, { rowKey: 0, columnIndex: 0 });

    pressCtrlKey(instance, 'end');
    scrollRowsViewTo(instance, MIDDLE_POSITION);
    renderRowsAt(instance, BOTTOM_POSITION);

    expect(getFocusedCell()).toBeUndefined();
  });
});
