import {
  describe, expect, it,
} from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { getColumnFromMap, getSummaryCellIndex } from '../utils';

const makeColumn = (overrides: Partial<Column> = {}): Column => ({
  ...overrides,
});

describe('getSummaryCellIndex', () => {
  describe('when isGroupRow is false (default)', () => {
    it('should return column.index', () => {
      const column = makeColumn({ index: 5 });

      expect(getSummaryCellIndex(column)).toBe(5);
    });

    it('should return -1 when column.index is undefined', () => {
      const column = makeColumn();

      expect(getSummaryCellIndex(column)).toBe(-1);
    });

    it('should ignore prevColumn when isGroupRow is false', () => {
      const column = makeColumn({ index: 3 });
      const prevColumn = makeColumn({ index: 10, type: 'groupExpand' });

      expect(getSummaryCellIndex(column, prevColumn, false)).toBe(3);
    });
  });

  describe('when isGroupRow is true', () => {
    describe('groupExpand handling', () => {
      it('should return prevColumn.index when prevColumn.type is groupExpand', () => {
        const column = makeColumn({ index: 5 });
        const prevColumn = makeColumn({ index: 2, type: 'groupExpand' });

        expect(getSummaryCellIndex(column, prevColumn, true)).toBe(2);
      });

      it('should return prevColumn.index when column.type is groupExpand', () => {
        const column = makeColumn({ index: 5, type: 'groupExpand' });
        const prevColumn = makeColumn({ index: 7 });

        expect(getSummaryCellIndex(column, prevColumn, true)).toBe(7);
      });

      it('should return -1 when column.type is groupExpand and prevColumn is undefined', () => {
        const column = makeColumn({ index: 5, type: 'groupExpand' });

        expect(getSummaryCellIndex(column, undefined, true)).toBe(-1);
      });

      it('should return -1 when prevColumn.type is groupExpand and prevColumn.index is undefined', () => {
        const column = makeColumn({ index: 5 });
        const prevColumn = makeColumn({ type: 'groupExpand' });

        expect(getSummaryCellIndex(column, prevColumn, true)).toBe(-1);
      });
    });

    describe('groupIndex handling', () => {
      it('should return column.index when groupIndex is not defined', () => {
        const column = makeColumn({ index: 4 });

        expect(getSummaryCellIndex(column, undefined, true)).toBe(4);
      });

      it('should return -1 when groupIndex is defined', () => {
        const column = makeColumn({ index: 4, groupIndex: 0 });

        expect(getSummaryCellIndex(column, undefined, true)).toBe(-1);
      });

      it('should return -1 when groupIndex is 0 (falsy but defined)', () => {
        const column = makeColumn({ index: 8, groupIndex: 0 });

        expect(getSummaryCellIndex(column, undefined, true)).toBe(-1);
      });

      it('should return column.index when groupIndex is undefined and prevColumn has no groupExpand type', () => {
        const column = makeColumn({ index: 6 });
        const prevColumn = makeColumn({ index: 3 });

        expect(getSummaryCellIndex(column, prevColumn, true)).toBe(6);
      });
    });
  });
});

describe('getColumnFromMap', () => {
  const colA = makeColumn({ index: 0, dataField: 'fieldA' });
  const colB = makeColumn({ index: 1, dataField: 'fieldB' });
  const getColumnMap = (): Map<string | number, Column> => new Map<string | number, Column>([
    [0, colA],
    ['fieldA', colA],
    [1, colB],
    ['fieldB', colB],
  ]);

  it('should return column by numeric index', () => {
    const columnMap = getColumnMap();

    expect(getColumnFromMap(0, columnMap)).toBe(colA);
    expect(getColumnFromMap(1, columnMap)).toBe(colB);
  });

  it('should return column by string dataField', () => {
    const columnMap = getColumnMap();

    expect(getColumnFromMap('fieldA', columnMap)).toBe(colA);
    expect(getColumnFromMap('fieldB', columnMap)).toBe(colB);
  });

  it('should return undefined for undefined identifier', () => {
    const columnMap = getColumnMap();

    expect(getColumnFromMap(undefined, columnMap)).toBeUndefined();
  });

  it('should return undefined for identifier not in the map', () => {
    const columnMap = getColumnMap();

    expect(getColumnFromMap(999, columnMap)).toBeUndefined();
    expect(getColumnFromMap('nonExistent', columnMap)).toBeUndefined();
  });

  it('should work with an empty map', () => {
    const emptyMap = new Map<string | number, Column>();

    expect(getColumnFromMap(0, emptyMap)).toBeUndefined();
    expect(getColumnFromMap('fieldA', emptyMap)).toBeUndefined();
    expect(getColumnFromMap(undefined, emptyMap)).toBeUndefined();
  });
});
