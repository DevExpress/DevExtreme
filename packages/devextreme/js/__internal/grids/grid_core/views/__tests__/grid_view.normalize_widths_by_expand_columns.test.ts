import { describe, expect, it } from '@jest/globals';

import type { Column } from '../../columns_controller/types';
import { ResizingController } from '../m_grid_view';

type ColumnWidth = number | string | undefined;

// NOTE: the method is private, so it is picked from the prototype to be tested in isolation.
const resizingControllerPrototype = ResizingController.prototype as unknown as {
  _normalizeWidthsByExpandColumns: (
    resultWidths: ColumnWidth[],
    visibleColumns: Column[],
  ) => void;
};

const normalizeWidthsByExpandColumns = (
  resultWidths: ColumnWidth[],
  visibleColumns: Column[],
): ColumnWidth[] => {
  resizingControllerPrototype._normalizeWidthsByExpandColumns(resultWidths, visibleColumns);

  return resultWidths;
};

const expandColumn = (): Column => ({ type: 'groupExpand', command: 'expand' } as Column);
const dataColumn = (dataField: string): Column => ({ dataField } as Column);

describe('ResizingController._normalizeWidthsByExpandColumns', () => {
  it('leaves the widths as is when there are no expand columns', () => {
    const columns = [dataColumn('a'), dataColumn('b')];

    expect(normalizeWidthsByExpandColumns([100, 200], columns)).toEqual([100, 200]);
  });

  it('leaves the widths as is when there is a single expand column', () => {
    const columns = [expandColumn(), dataColumn('a')];

    expect(normalizeWidthsByExpandColumns([30, 200], columns)).toEqual([30, 200]);
  });

  // NOTE: all groupExpand columns share a single column id (command:expand), so the width
  // of the last one is the value that _setVisibleWidths actually applies to all of them.
  it('applies the width of the LAST expand column to every expand column', () => {
    const columns = [expandColumn(), expandColumn(), dataColumn('a')];

    expect(normalizeWidthsByExpandColumns([21, 30, 200], columns)).toEqual([30, 30, 200]);
  });

  it('normalizes expand columns that are not adjacent to each other', () => {
    const columns = [
      dataColumn('a'),
      expandColumn(),
      dataColumn('b'),
      expandColumn(),
      dataColumn('c'),
    ];

    expect(normalizeWidthsByExpandColumns([100, 21, 200, 30, 300], columns))
      .toEqual([100, 30, 200, 30, 300]);
  });

  it('ignores the detailExpand column', () => {
    const columns = [
      { type: 'detailExpand', command: 'expand' } as Column,
      expandColumn(),
      expandColumn(),
    ];

    expect(normalizeWidthsByExpandColumns([15, 21, 30], columns)).toEqual([15, 30, 30]);
  });

  // NOTE: a falsy width means the column could not be measured (e.g. the grid is hidden).
  it.each([
    ['zero', 0],
    ['undefined', undefined],
  ])('keeps the measured widths when the last expand column width is %s', (_, width) => {
    const columns = [expandColumn(), expandColumn(), dataColumn('a')];

    expect(normalizeWidthsByExpandColumns([21, width, 200], columns)).toEqual([21, width, 200]);
  });
});
