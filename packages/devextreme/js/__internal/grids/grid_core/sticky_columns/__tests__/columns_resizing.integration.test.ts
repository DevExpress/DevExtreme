import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const CURRENT_CELL_RECT = { left: 100, width: 300 };
const NEXT_CELL_RECT = { left: 250, width: 150 };

const mockCellRect = (
  $cell: dxElementWrapper,
  { left, width }: { left: number; width: number },
): dxElementWrapper => {
  const element = $cell.get(0) as HTMLElement;
  const rect = {
    left, right: left + width, width, top: 0, bottom: 0, height: 0,
  } as DOMRect;

  element.getBoundingClientRect = (): DOMRect => rect;
  element.getClientRects = (): DOMRectList => [rect] as unknown as DOMRectList;

  return $cell;
};

const getSeparatorOffsetX = async (options: DataGridProperties): Promise<number> => {
  const { instance } = await createDataGrid({
    dataSource: [{
      id: 1, a: 'a', b: 'b', c: 'c',
    }],
    allowColumnResizing: true,
    ...options,
  });
  const columnsResizer = instance.getController('columnsResizer');
  const $cells = $(instance.getView('columnHeadersView').getColumnElements());
  const $cell = mockCellRect($cells.eq(1), CURRENT_CELL_RECT);
  const $nextCell = mockCellRect($cells.eq(2), NEXT_CELL_RECT);

  // @ts-expect-error getSeparatorOffsetX is protected
  return columnsResizer.getSeparatorOffsetX($cell, $nextCell);
};

describe('ColumnsResizer separator position with sticky columns (T1335911)', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the next cell is fixed to the right', () => {
    it('should return the left edge of the next cell', async () => {
      const offsetX = await getSeparatorOffsetX({
        columnResizingMode: 'nextColumn',
        columns: ['a', 'b', { dataField: 'c', fixed: true, fixedPosition: 'right' }],
      });

      expect(offsetX).toBe(NEXT_CELL_RECT.left);
    });
  });

  describe('when the next cell is fixed to the left in RTL', () => {
    it('should return the right edge of the next cell', async () => {
      const offsetX = await getSeparatorOffsetX({
        columnResizingMode: 'nextColumn',
        rtlEnabled: true,
        columns: ['a', 'b', { dataField: 'c', fixed: true, fixedPosition: 'left' }],
      });

      expect(offsetX).toBe(NEXT_CELL_RECT.left + NEXT_CELL_RECT.width);
    });
  });

  describe('when the next cell is not fixed', () => {
    it('should return the right edge of the current cell', async () => {
      const offsetX = await getSeparatorOffsetX({
        columnResizingMode: 'nextColumn',
        columns: [{ dataField: 'a', fixed: true }, 'b', 'c'],
      });

      expect(offsetX).toBe(CURRENT_CELL_RECT.left + CURRENT_CELL_RECT.width);
    });
  });

  describe('when the resizing mode is widget', () => {
    it('should not take the next fixed cell into account', async () => {
      const offsetX = await getSeparatorOffsetX({
        columnResizingMode: 'widget',
        columns: ['a', 'b', { dataField: 'c', fixed: true, fixedPosition: 'right' }],
      });

      expect(offsetX).toBe(CURRENT_CELL_RECT.left + CURRENT_CELL_RECT.width);
    });
  });
});
