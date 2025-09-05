import { describe, expect, it } from '@jest/globals';

import { addGeometryInsideInterval } from './add_geometry_inside_interval';

describe('addGeometryInsideInterval', () => {
  it('should position appointment inside horizontal interval', () => {
    const entity = {
      rowIndex: 1,
      startDate: 20,
      endDate: 30,
      level: 0,
      maxLevel: 0,
      items: [],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
      collectorPosition: 'start',
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 700, height: 80 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'horizontal',
    } as any)).toEqual({
      ...entity, top: 24, width: 350, height: 56, left: 0,
    });
  });

  it('should position appointment inside vertical interval', () => {
    const entity = {
      rowIndex: 2,
      startDate: 40,
      endDate: 60,
      level: 2,
      maxLevel: 4,
      items: [],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
      collectorPosition: 'end',
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 100, height: 800 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'vertical',
    } as any)).toEqual({
      ...entity, top: 0, width: 20, height: 800, left: 40,
    });
  });

  it('should position collector with children inside horizontal interval', () => {
    const entity = {
      rowIndex: 1,
      columnIndex: 2,
      startDate: 20,
      endDate: 30,
      level: 0,
      maxLevel: 0,
      items: [{ startDate: 23, endDate: 33 }],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
      collectorPosition: 'start',
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 700, height: 80 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'horizontal',
    } as any)).toEqual({
      ...entity,
      top: 0,
      width: 18,
      height: 20,
      left: 200,
      items: [{
        startDate: 23, endDate: 33, width: 350, height: 20,
      }],
    });
  });

  it('should position collector with children inside vertical interval', () => {
    const entity = {
      rowIndex: 2,
      columnIndex: 1,
      startDate: 40,
      endDate: 60,
      level: 2,
      maxLevel: 4,
      items: [{ startDate: 23, endDate: 38 }],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals: [
        { min: 0, max: 20 },
        { min: 20, max: 40 },
        { min: 40, max: 60 },
      ],
      collectorPosition: 'end',
      cellSize: { width: 100, height: 80 },
      intervalSize: { width: 100, height: 800 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'vertical',
    } as any)).toEqual({
      ...entity,
      top: 80,
      width: 18,
      height: 20,
      left: 82,
      items: [{
        startDate: 23, endDate: 38, width: 18, height: 600,
      }],
    });
  });
});
