import { describe, expect, it } from '@jest/globals';

import { addAdaptivityGeometryInsideInterval } from './add_adaptivity_geometry_inside_interval';

describe('addAdaptivityGeometryInsideInterval', () => {
  it('should position collector center bottom for horizontal view', () => {
    const entity = {
      columnIndex: 2, rowIndex: 2, isAllDayPanelOccupied: false, items: [{}],
    };

    expect(addAdaptivityGeometryInsideInterval(entity as any, {
      collectorSize: { width: 20, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 20 },
      cellSize: { width: 100, height: 80 },
      viewOrientation: 'horizontal',
    })).toEqual({
      ...entity, width: 20, height: 20, left: 240, top: 40, items: [{ width: 100, height: 80 }],
    });
  });

  it('should position collector center for all day panel entity', () => {
    const entity = {
      columnIndex: 0, rowIndex: 0, isAllDayPanelOccupied: true, items: [{}],
    };

    expect(addAdaptivityGeometryInsideInterval(entity as any, {
      collectorSize: { width: 20, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 20 },
      cellSize: { width: 100, height: 80 },
      viewOrientation: 'horizontal',
    })).toEqual({
      ...entity, width: 20, height: 20, left: 40, top: 30, items: [{ width: 100, height: 80 }],
    });
  });

  it('should position collector center for vertical view', () => {
    const entity = {
      columnIndex: 1, rowIndex: 0, items: [{}],
    };

    expect(addAdaptivityGeometryInsideInterval(entity as any, {
      collectorSize: { width: 20, height: 20 },
      collectorWithMarginsSize: { width: 30, height: 30 },
      cellSize: { width: 100, height: 80 },
      viewOrientation: 'vertical',
    })).toEqual({
      ...entity, width: 20, height: 20, left: 35, top: 105, items: [{ width: 100, height: 80 }],
    });
  });
});
