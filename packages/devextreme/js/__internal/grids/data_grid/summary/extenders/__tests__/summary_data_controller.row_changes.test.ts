import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { refreshRow } from '@ts/grids/grid_core/__tests__/__mock__/helpers/row_changes';
import {
  afterTest,
  beforeTest,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

import { DATAGRID_GROUP_FOOTER_ROW_TYPE } from '../../const';

interface SummaryRowState {
  count?: number;
  isContinuation?: boolean;
}

const summaryRow = (
  rowType: ProcessedItem['rowType'],
  { count = 1, isContinuation = false }: SummaryRowState = {},
): ProcessedItem => ({
  rowType,
  key: [1],
  data: { isContinuation, isContinuationOnNextPage: false },
  values: [],
  summaryCells: [[], [{ summaryType: 'count', value: count }]],
});

const groupRow = (state?: SummaryRowState): ProcessedItem => summaryRow('group', state);

const groupFooterRow = (state?: SummaryRowState): ProcessedItem => summaryRow(
  DATAGRID_GROUP_FOOTER_ROW_TYPE as ProcessedItem['rowType'],
  state,
);

describe('Summary data controller row changes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should not report a group footer when nothing changed', async () => {
    const change = await refreshRow(groupFooterRow(), groupFooterRow());

    expect(change.rowIndices).toEqual([]);
  });

  it('should report a group row when summaryCells changed', async () => {
    const change = await refreshRow(groupRow({ count: 1 }), groupRow({ count: 2 }));

    expect(change.rowIndices).toEqual([0]);
    expect(change.changeTypes).toEqual(['update']);
  });

  it('should report a group footer when summaryCells changed', async () => {
    const change = await refreshRow(groupFooterRow({ count: 1 }), groupFooterRow({ count: 2 }));

    expect(change.rowIndices).toEqual([0]);
    expect(change.changeTypes).toEqual(['update']);
    expect(change.columnIndices).toEqual([undefined]);
  });

  it('should report a group footer when isContinuation changed', async () => {
    const change = await refreshRow(groupFooterRow(), groupFooterRow({ isContinuation: true }));

    expect(change.rowIndices).toEqual([0]);
    expect(change.changeTypes).toEqual(['update']);
  });
});
