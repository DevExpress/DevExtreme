import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { generateRowValues } from '../row_values';

// Column literals here are deliberately hand-built: through the widget every
// column is given a generated calculateCellValue by the columns controller, so
// the dataField / no-accessor branches are only reachable from a unit test.
const col = (partial: Partial<Column>): Column => partial as Column;

const DATA = { name: 'Alex', age: 15 };

describe('generateRowValues', () => {
  it('should return one value per column, preserving order', () => {
    const values = generateRowValues(DATA, [
      col({ dataField: 'age' }),
      col({ dataField: 'name' }),
    ]);

    expect(values).toEqual([15, 'Alex']);
  });

  it('should read a plain dataField', () => {
    expect(generateRowValues(DATA, [col({ dataField: 'name' })])).toEqual(['Alex']);
  });

  it('should prefer calculateCellValue over dataField', () => {
    const column = col({
      dataField: 'name',
      calculateCellValue: () => 'computed',
    });

    expect(generateRowValues(DATA, [column])).toEqual(['computed']);
  });

  it('should call calculateCellValue with the column as `this`', () => {
    const column = col({
      name: 'myColumn',
      calculateCellValue(this: Column) {
        return this.name;
      },
    });

    expect(generateRowValues(DATA, [column])).toEqual(['myColumn']);
  });

  it('should call calculateCellValue with exactly one argument', () => {
    const calls: unknown[][] = [];
    const column = col({
      dataField: 'name',
      calculateCellValue: (...args: unknown[]): unknown => {
        calls.push(args);
        return null;
      },
    } as unknown as Partial<Column>);

    generateRowValues(DATA, [column, column]);

    expect(calls).toHaveLength(2);
    expect(calls[0]).toHaveLength(1);
    expect(calls[0][0]).toBe(DATA);
  });

  describe('columns without an accessor', () => {
    it('should yield null', () => {
      expect(generateRowValues(DATA, [col({ caption: 'No accessor' })])).toEqual([null]);
    });

    it('should yield undefined when isModified is set', () => {
      expect(generateRowValues(DATA, [col({ caption: 'No accessor' })], true)).toEqual([undefined]);
    });
  });

  describe('command columns', () => {
    it('should be skipped and yield null', () => {
      const values = generateRowValues(DATA, [
        col({ command: 'select', dataField: 'name' }),
        col({ dataField: 'name' }),
      ]);

      expect(values).toEqual([null, 'Alex']);
    });

    it('should yield undefined instead of null when isModified is set', () => {
      const values = generateRowValues(DATA, [
        col({ command: 'select', dataField: 'name' }),
        col({ dataField: 'missing' }),
      ], true);

      expect(values).toEqual([undefined, undefined]);
    });

    it('should not call calculateCellValue on a skipped command column', () => {
      let called = false;
      const column = col({
        command: 'edit',
        calculateCellValue: () => {
          called = true;
          return 'should not happen';
        },
      });

      expect(generateRowValues(DATA, [column])).toEqual([null]);
      expect(called).toBe(false);
    });
  });

  describe('AI column', () => {
    it('should be computed despite being a command column', () => {
      const column = col({
        command: 'ai',
        type: 'ai',
        name: 'myAiColumn',
        calculateCellValue(this: Column) {
          return `AI:${this.name}`;
        },
      });

      expect(generateRowValues(DATA, [column])).toEqual(['AI:myAiColumn']);
    });

    it('should still be computed when isModified is set', () => {
      const column = col({
        command: 'ai',
        type: 'ai',
        calculateCellValue: () => 'AI value',
      });

      expect(generateRowValues(DATA, [column], true)).toEqual(['AI value']);
    });
  });
});
