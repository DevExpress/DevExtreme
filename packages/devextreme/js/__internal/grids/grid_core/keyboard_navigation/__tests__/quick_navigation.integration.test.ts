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
  triggerKeyDown,
  triggerPointerDown,
} from './helpers/utils';

const ROW_COUNT = 200;
const ROWS = Array.from({ length: ROW_COUNT }, (_, index) => ({ id: index, name: `Row ${index}` }));
const LAST_COLUMN_INDEX = 1;

const TOP_POSITION = 0;
const MIDDLE_POSITION = 1000;
const BOTTOM_POSITION = 3700;

interface FocusedCell {
  rowKey: number;
  columnIndex: number;
}

const getFocusedCell = (): FocusedCell | undefined => {
  const cell = document.activeElement as HTMLTableCellElement | null;
  const row = cell?.closest<HTMLTableRowElement>('tr.dx-data-row');

  return row && cell
    ? { rowKey: Number(row.cells[0].textContent), columnIndex: cell.cellIndex }
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
      target: { rowKey: ROW_COUNT - 1, columnIndex: LAST_COLUMN_INDEX },
    },
    {
      keyName: 'home',
      startPosition: BOTTOM_POSITION,
      start: { rowKey: ROW_COUNT - 1, columnIndex: LAST_COLUMN_INDEX },
      targetPosition: TOP_POSITION,
      target: { rowKey: 0, columnIndex: 0 },
    },
  ])('should focus the target cell after Ctrl+$keyName once its row is rendered', async ({
    keyName, startPosition, start, targetPosition, target,
  }) => {
    const { instance } = await createDataGrid({
      dataSource: ROWS,
      height: 400,
      columns: ['id', 'name'],
      scrolling: { mode: 'virtual' },
    });
    renderRowsAt(instance, startPosition);
    focusCell(instance, start);

    triggerKeyDown(instance, keyName, document.activeElement, { ctrlKey: true });
    jest.runAllTimers();
    renderRowsAt(instance, MIDDLE_POSITION);
    renderRowsAt(instance, targetPosition);

    expect(getFocusedCell()).toEqual(target);
  });
});
