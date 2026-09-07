import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { refreshRow } from '@ts/grids/grid_core/__tests__/__mock__/helpers/row_changes';
import {
  afterTest,
  beforeTest,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

interface GroupRowState {
  isExpanded?: boolean;
  isContinuation?: boolean;
  isContinuationOnNextPage?: boolean;
  values?: unknown[];
  cells?: ProcessedItem['cells'];
}

const groupRow = ({
  isExpanded = true,
  isContinuation = false,
  isContinuationOnNextPage = false,
  values = [],
  cells,
}: GroupRowState = {}): ProcessedItem => ({
  rowType: 'group',
  key: [1],
  data: { isContinuation, isContinuationOnNextPage },
  values,
  isExpanded,
  cells,
});

const renderedCells: ProcessedItem['cells'] = [
  { column: { type: 'groupExpand' } },
  {},
  { column: { dataField: 'name' } },
];

const dataRow = (partial: Partial<ProcessedItem> = {}): ProcessedItem => ({
  rowType: 'data',
  key: 1,
  data: { id: 1 },
  values: ['Alex', 15],
  ...partial,
});

describe('Grouping data controller row changes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should not report a group row when nothing changed', async () => {
    const change = await refreshRow(groupRow(), groupRow());

    expect(change.rowIndices).toEqual([]);
  });

  it('should report a group row when isExpanded changed', async () => {
    const change = await refreshRow(
      groupRow({ isExpanded: true, cells: renderedCells }),
      groupRow({ isExpanded: false }),
    );

    expect(change.rowIndices).toEqual([0]);
    expect(change.changeTypes).toEqual(['update']);
    expect(change.columnIndices).toEqual([undefined]);
  });

  it('should report a group row when isContinuation changed', async () => {
    const change = await refreshRow(groupRow(), groupRow({ isContinuation: true }));

    expect(change.rowIndices).toEqual([0]);
    expect(change.changeTypes).toEqual(['update']);
  });

  it('should report a group row when isContinuationOnNextPage changed', async () => {
    const change = await refreshRow(groupRow(), groupRow({ isContinuationOnNextPage: true }));

    expect(change.rowIndices).toEqual([0]);
    expect(change.changeTypes).toEqual(['update']);
  });

  it('should diff every group cell but the expand one when values changed', async () => {
    const change = await refreshRow(
      groupRow({ values: ['Alex'], cells: renderedCells }),
      groupRow({ values: ['Bob'] }),
    );

    expect(change.rowIndices).toEqual([0]);
    expect(change.columnIndices).toEqual([[1, 2]]);
  });

  it('should repaint the whole group row when it was never rendered', async () => {
    const change = await refreshRow(
      groupRow({ values: ['Alex'] }),
      groupRow({ values: ['Bob'] }),
    );

    expect(change.rowIndices).toEqual([0]);
    expect(change.columnIndices).toEqual([undefined]);
  });

  it('should not report a data row when isExpanded changed (master detail row)', async () => {
    const change = await refreshRow(
      dataRow({ isExpanded: false }),
      dataRow({ isExpanded: true }),
    );

    expect(change.rowIndices).toEqual([]);
  });
});
