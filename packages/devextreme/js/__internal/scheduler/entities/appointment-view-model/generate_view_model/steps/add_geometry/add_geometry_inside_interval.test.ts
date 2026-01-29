import { describe, expect, it } from '@jest/globals';

import { addGeometryInsideInterval } from './add_geometry_inside_interval';

const intervals = [
  { min: 0, max: 20 },
  { min: 20, max: 40 },
  { min: 40, max: 60 },
];
const cells = [
  {
    min: 0, max: 10, rowIndex: 0, columnIndex: 0, cellIndex: 0,
  },
  {
    min: 10, max: 20, rowIndex: 0, columnIndex: 1, cellIndex: 1,
  },
  {
    min: 20, max: 30, rowIndex: 1, columnIndex: 0, cellIndex: 2,
  },
  {
    min: 30, max: 40, rowIndex: 1, columnIndex: 1, cellIndex: 3,
  },
  {
    min: 40, max: 50, rowIndex: 2, columnIndex: 0, cellIndex: 4,
  },
  {
    min: 50, max: 60, rowIndex: 2, columnIndex: 1, cellIndex: 5,
  },
];

describe('addGeometryInsideInterval', () => {
  it('should position appointment inside horizontal interval', () => {
    const entity = {
      rowIndex: 1,
      columnIndex: 1,
      cellIndex: 3,
      endCellIndex: 3,
      startDateUTC: 30,
      endDateUTC: 40,
      level: 0,
      maxLevel: 0,
      items: [],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals,
      cells,
      collectorPosition: 'start',
      cellSize: { width: 100, height: 80 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'horizontal',
    } as any)).toEqual({
      ...entity, top: 24, width: 100, height: 56, left: 100,
    });
  });

  it('should position appointment inside vertical interval', () => {
    const entity = {
      rowIndex: 2,
      columnIndex: 0,
      cellIndex: 4,
      endCellIndex: 5,
      startDateUTC: 40,
      endDateUTC: 60,
      duration: 20,
      level: 2,
      maxLevel: 4,
      items: [],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals,
      cells,
      collectorPosition: 'end',
      cellSize: { width: 100, height: 80 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'vertical',
    } as any)).toEqual({
      ...entity, top: 0, width: 20, height: 160, left: 40,
    });
  });

  it('should position collector with children inside horizontal interval', () => {
    const entity = {
      rowIndex: 1,
      columnIndex: 0,
      cellIndex: 2,
      endCellIndex: 2,
      startDateUTC: 20,
      endDateUTC: 30,
      duration: 10,
      level: 0,
      maxLevel: 0,
      items: [{ startDateUTC: 23, endDateUTC: 33, duration: 10 }],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals,
      cells,
      collectorPosition: 'start',
      cellSize: { width: 100, height: 80 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'horizontal',
    } as any)).toEqual({
      ...entity,
      top: 0,
      width: 18,
      height: 20,
      left: 0,
      items: [{
        startDateUTC: 23, endDateUTC: 33, width: 100, height: 56, duration: 10,
      }],
    });
  });

  it('should position collector with children inside vertical interval', () => {
    const entity = {
      rowIndex: 2,
      columnIndex: 0,
      cellIndex: 4,
      endCellIndex: 5,
      startDateUTC: 40,
      endDateUTC: 60,
      duration: 20,
      level: 2,
      maxLevel: 4,
      items: [{ startDateUTC: 23, endDateUTC: 38, duration: 15 }],
    };

    expect(addGeometryInsideInterval(entity as any, {
      intervals,
      cells,
      collectorPosition: 'end',
      cellSize: { width: 100, height: 80 },
      collectorSize: { width: 18, height: 20 },
      collectorWithMarginsSize: { width: 20, height: 24 },
      viewOrientation: 'vertical',
    } as any)).toEqual({
      ...entity,
      top: 0,
      width: 18,
      height: 20,
      left: 80,
      items: [{
        startDateUTC: 23, endDateUTC: 38, width: 20, height: 120, duration: 15,
      }],
    });
  });
});
