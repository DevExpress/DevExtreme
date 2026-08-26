import {
  describe, expect, it,
} from '@jest/globals';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

import { isSameContinuationState, isSameExpandedState } from '../utils';

const groupRow = (partial: Partial<ProcessedItem> = {}): ProcessedItem => ({
  rowType: 'group',
  key: [1],
  data: {},
  values: [],
  ...partial,
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
