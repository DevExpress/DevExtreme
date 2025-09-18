import { describe, expect, it } from '@jest/globals';

import { addGroupingOffset } from './add_grouping_offset';

describe('addGroupingOffset', () => {
  it('should add grouping offset for vertical grouping without all day panel', () => {
    const entity = { left: 7, top: 9, groupIndex: 2 } as any;
    addGroupingOffset(entity, {
      hasAllDayPanel: false,
      groupCount: 10,
      groupOrientation: 'vertical',
      isGroupByDate: false,
      isTimelineView: false,
      allDayPanelCellSize: { width: 100, height: 80 },
      cellSize: { width: 100, height: 80 },
      groupSize: { width: 80, height: 800 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    } as any);

    expect(entity).toEqual({ left: 7, top: 2 * 800 + 9, groupIndex: 2 });
  });

  it('should add grouping offset for vertical grouping with all day panel', () => {
    const entity = { left: 7, top: 9, groupIndex: 2 } as any;
    addGroupingOffset(entity, {
      hasAllDayPanel: true,
      groupCount: 10,
      groupOrientation: 'vertical',
      isGroupByDate: false,
      isTimelineView: false,
      allDayPanelCellSize: { width: 100, height: 80 },
      cellSize: { width: 100, height: 80 },
      groupSize: { width: 80, height: 800 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    } as any);

    expect(entity).toEqual({ left: 7, top: 2 * 800 + 3 * 80 + 9, groupIndex: 2 });
  });

  it('should add grouping offset for vertical grouping with all day panel, all day appointment', () => {
    const entity = {
      isAllDayPanelOccupied: true, left: 7, top: 9, groupIndex: 2,
    } as any;
    addGroupingOffset(entity, {
      hasAllDayPanel: true,
      groupCount: 10,
      groupOrientation: 'vertical',
      isGroupByDate: false,
      isTimelineView: false,
      allDayPanelCellSize: { width: 100, height: 50 },
      cellSize: { width: 100, height: 80 },
      groupSize: { width: 80, height: 800 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    } as any);

    expect(entity).toEqual({
      isAllDayPanelOccupied: true, left: 7, top: 2 * 800 + 2 * 50 + 9, groupIndex: 2,
    });
  });

  it('should add grouping offset for horizontal grouping', () => {
    const entity = { left: 7, top: 9, groupIndex: 2 } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'horizontal',
      isGroupByDate: false,
      isTimelineView: false,
      allDayPanelCellSize: { width: 100, height: 80 },
      cellSize: { width: 100, height: 80 },
      groupSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    } as any);

    expect(entity).toEqual({ left: 2 * 800 + 7, top: 9, groupIndex: 2 });
  });

  it('should add grouping offset for horizontal grouping by date', () => {
    const entity = {
      left: 207, top: 89, columnIndex: 1, rowIndex: 1, groupIndex: 2,
    } as any;
    addGroupingOffset(entity, {
      groupCount: 10,
      groupOrientation: 'horizontal',
      isGroupByDate: true,
      isTimelineView: false,
      allDayPanelCellSize: { width: 100, height: 80 },
      cellSize: { width: 100, height: 80 },
      groupSize: { width: 800, height: 80 },
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
    } as any);

    expect(entity).toEqual({
      left: 1307, top: 89, columnIndex: 1, rowIndex: 1, groupIndex: 2,
    });
  });
});
