import {
  describe, expect, it,
} from '@jest/globals';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import {
  isGroupNode, isGroupRow, isSameContinuationState, isSameExpandedState,
} from '../utils';

const groupRow = (partial: Partial<ProcessedItem> = {}): ProcessedItem => ({
  rowType: 'group',
  key: [1],
  data: {},
  values: [],
  ...partial,
});

describe('isGroupNode', () => {
  it('should return true for a group node with children', () => {
    expect(isGroupNode({ key: 'Alex', items: [{ id: 1 }] })).toBe(true);
  });

  it('should return true for a collapsed group node, whose items are null', () => {
    expect(isGroupNode({ key: 'Alex', items: null, count: 3 })).toBe(true);
  });

  it('should return true when the items key is present but undefined', () => {
    expect(isGroupNode({ key: 'Alex', items: undefined })).toBe(true);
  });

  it('should return false for a data row, which has no items key', () => {
    expect(isGroupNode({ id: 1, name: 'Alex' })).toBe(false);
  });
});

describe('isGroupRow', () => {
  it('should return true for a group row', () => {
    expect(isGroupRow({ rowType: 'group', groupIndex: 1 })).toBe(true);
  });

  it('should return true for a group footer row added by the summary module', () => {
    expect(isGroupRow({ rowType: 'groupFooter', groupIndex: 1 })).toBe(true);
  });

  it('should return true when groupIndex is zero', () => {
    expect(isGroupRow({ rowType: 'group', groupIndex: 0 })).toBe(true);
  });

  it('should return false when groupIndex is missing', () => {
    expect(isGroupRow({ rowType: 'group' })).toBe(false);
  });

  it('should return false when groupIndex is null', () => {
    expect(isGroupRow({ rowType: 'group', groupIndex: null })).toBe(false);
  });

  it('should return false when rowType is not a string', () => {
    expect(isGroupRow({ rowType: 1, groupIndex: 0 })).toBe(false);
  });

  it('should return false for a data row', () => {
    expect(isGroupRow({ rowType: 'data', groupIndex: 0 })).toBe(false);
  });

  it('should return false when rowType only contains group', () => {
    expect(isGroupRow({ rowType: 'detailGroup', groupIndex: 0 })).toBe(false);
  });

  it('should return false for a primitive item', () => {
    expect(isGroupRow('Alex' as unknown as RawItemData)).toBe(false);
  });
});

describe('isSameExpandedState', () => {
  it('should return true when both rows are expanded', () => {
    expect(isSameExpandedState(
      groupRow({ isExpanded: true }),
      groupRow({ isExpanded: true }),
    )).toBe(true);
  });

  it('should return true when both rows are collapsed', () => {
    expect(isSameExpandedState(
      groupRow({ isExpanded: false }),
      groupRow({ isExpanded: false }),
    )).toBe(true);
  });

  it('should return true when neither row carries the flag', () => {
    expect(isSameExpandedState(groupRow(), groupRow())).toBe(true);
  });

  it('should return false when the expanded state differs', () => {
    expect(isSameExpandedState(
      groupRow({ isExpanded: true }),
      groupRow({ isExpanded: false }),
    )).toBe(false);
  });

  it('should return false when only one row carries the flag', () => {
    expect(isSameExpandedState(groupRow(), groupRow({ isExpanded: false }))).toBe(false);
  });
});

describe('isSameContinuationState', () => {
  it('should return true when both continuation flags match', () => {
    expect(isSameContinuationState(
      groupRow({ data: { isContinuation: true, isContinuationOnNextPage: false } }),
      groupRow({ data: { isContinuation: true, isContinuationOnNextPage: false } }),
    )).toBe(true);
  });

  it('should return true when neither row carries the flags', () => {
    expect(isSameContinuationState(groupRow(), groupRow())).toBe(true);
  });

  it('should return false when isContinuation differs', () => {
    expect(isSameContinuationState(
      groupRow({ data: { isContinuation: false } }),
      groupRow({ data: { isContinuation: true } }),
    )).toBe(false);
  });

  it('should return false when isContinuationOnNextPage differs', () => {
    expect(isSameContinuationState(
      groupRow({ data: { isContinuationOnNextPage: false } }),
      groupRow({ data: { isContinuationOnNextPage: true } }),
    )).toBe(false);
  });

  it('should ignore the expanded state', () => {
    expect(isSameContinuationState(
      groupRow({ isExpanded: true }),
      groupRow({ isExpanded: false }),
    )).toBe(true);
  });
});
