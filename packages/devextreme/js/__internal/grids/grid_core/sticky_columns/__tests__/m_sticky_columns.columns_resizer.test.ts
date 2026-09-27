import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';

import { GridCoreStickyColumnsDom } from '../dom';
import { stickyColumnsModule } from '../m_sticky_columns';

const SUPER_OFFSET = 540;
const CELL_LEFT = 419;
const NEXT_CELL_LEFT = 399;

const { columnsResizer } = stickyColumnsModule.extenders.controllers;

const $nextCell = {
  length: 1,
  offset: () => ({ left: NEXT_CELL_LEFT }),
} as unknown as dxElementWrapper;

const $cell = {
  offset: () => ({ left: CELL_LEFT }),
  next: () => $nextCell,
} as unknown as dxElementWrapper;

describe('sticky columns resizer separator offset', () => {
  let superGetSeparatorOffsetX: ReturnType<typeof jest.fn>;

  const createController = ({
    hasStickyColumns = true,
    columnResizingMode = 'nextColumn',
  }: {
    hasStickyColumns?: boolean;
    columnResizingMode?: string;
  } = {}): any => {
    superGetSeparatorOffsetX = jest.fn(() => SUPER_OFFSET);

    class Base {
      // eslint-disable-next-line class-methods-use-this
      public getSeparatorOffsetX(...args: unknown[]): number {
        return superGetSeparatorOffsetX(...args) as number;
      }
    }

    const Controller = columnsResizer(Base as any);
    const controller = new Controller() as any;

    controller._columnHeadersView = {
      hasStickyColumns: (): boolean => hasStickyColumns,
      getContent: (): undefined => undefined,
    };
    controller.option = (): string => columnResizingMode;
    controller.addWidgetPrefix = (name: string): string => name;

    return controller;
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the next column left edge when the next column is pinned to the right in nextColumn mode (T1335911)', () => {
    jest.spyOn(GridCoreStickyColumnsDom, 'isFixedCellPinnedToRight')
      .mockImplementation((cell) => cell === $nextCell);

    const controller = createController({ columnResizingMode: 'nextColumn' });

    expect(controller.getSeparatorOffsetX($cell)).toBe(NEXT_CELL_LEFT);
    expect(superGetSeparatorOffsetX).not.toHaveBeenCalled();
  });

  it('returns the cell left edge for a right-pinned column in widget mode (T1335911)', () => {
    jest.spyOn(GridCoreStickyColumnsDom, 'isFixedCellPinnedToRight')
      .mockImplementation((cell) => cell === $cell);

    const controller = createController({ columnResizingMode: 'widget' });

    expect(controller.getSeparatorOffsetX($cell)).toBe(CELL_LEFT);
    expect(superGetSeparatorOffsetX).not.toHaveBeenCalled();
  });

  it('falls back to the base offset when neither the cell nor its next column is pinned to the right (T1335911)', () => {
    jest.spyOn(GridCoreStickyColumnsDom, 'isFixedCellPinnedToRight').mockReturnValue(false);

    const controller = createController({ columnResizingMode: 'nextColumn' });

    expect(controller.getSeparatorOffsetX($cell)).toBe(SUPER_OFFSET);
    expect(superGetSeparatorOffsetX).toHaveBeenCalledWith($cell);
  });

  it('falls back to the base offset when there are no sticky columns (T1335911)', () => {
    const spy = jest.spyOn(GridCoreStickyColumnsDom, 'isFixedCellPinnedToRight');

    const controller = createController({ hasStickyColumns: false });

    expect(controller.getSeparatorOffsetX($cell)).toBe(SUPER_OFFSET);
    expect(spy).not.toHaveBeenCalled();
  });
});
