import { describe, expect, it } from '@jest/globals';

import { addGroupingOffset } from './add_grouping_offset';

describe('addGroupingOffset', () => {
  it('should add grouping offset for vertical grouping', () => {
    const entity = { left: 7, top: 9, groupIndex: 2 } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'vertical',
      isGroupByDate: false,
      isTimeline: false,
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    });

    expect(entity).toEqual({ left: 7, top: 6 * 80 + 9, groupIndex: 2 });
  });

  it('should add grouping offset for horizontal grouping', () => {
    const entity = { left: 7, top: 9, groupIndex: 2 } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'horizontal',
      isGroupByDate: false,
      isTimeline: false,
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    });

    expect(entity).toEqual({ left: 2 * 800 + 7, top: 9, groupIndex: 2 });
  });

  it('should add grouping offset for horizontal grouping by date', () => {
    const entity = {
      left: 207, top: 89, columnIndex: 1, groupIndex: 2,
    } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'horizontal',
      isGroupByDate: true,
      isTimeline: false,
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    });

    expect(entity).toEqual({
      left: 1307, top: 89, columnIndex: 1, groupIndex: 2,
    });
  });

  it('should add grouping offset for horizontal grouping in timeline view', () => {
    const entity = { left: 7, top: 9, groupIndex: 2 } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'horizontal',
      isGroupByDate: false,
      isTimeline: true,
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    });

    expect(entity).toEqual({ left: 8 * 800 + 7, top: 9, groupIndex: 2 });
  });

  it('should add grouping offset for horizontal grouping by date in timeline view', () => {
    const entity = {
      left: 207, top: 89, columnIndex: 1, rowIndex: 1, groupIndex: 2,
    } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'horizontal',
      isGroupByDate: true,
      isTimeline: true,
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    });

    expect(entity).toEqual({
      left: 8507, top: 89, columnIndex: 1, rowIndex: 1, groupIndex: 2,
    });
  });
});
