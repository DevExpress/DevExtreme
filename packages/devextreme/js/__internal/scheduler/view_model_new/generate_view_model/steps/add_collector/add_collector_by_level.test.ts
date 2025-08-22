import { describe, expect, it } from '@jest/globals';

import { monthCells } from '../../__mock__/month.mock';
import { addCollectorByLevel } from './add_collector_by_level';

describe('addCollectorByLevel', () => {
  it('should add empty collector for non-overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 1, 1).getTime(),
      endDate: new Date(2025, 0, 1, 2, 15).getTime(),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    },
    {
      startDate: new Date(2025, 0, 1, 2, 15).getTime(),
      endDate: new Date(2025, 0, 1, 3).getTime(),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 1,
      level: 0,
      maxLevel: 0,
    }];

    expect(addCollectorByLevel(items as any[], {
      cells: monthCells,
      maxLevel: 3,
      isCompact: false,
    })).toEqual([
      { ...items[0], items: [], isCompact: false },
      { ...items[1], items: [], isCompact: false },
      { ...items[2], items: [], isCompact: false },
      { ...items[3], items: [], isCompact: false },
    ]);
  });

  it('should collect non-overlapping appointments with zero maxAppointmentsPerCell', () => {
    const items = [{
      startDate: new Date(2025, 0, 1, 1).getTime(),
      endDate: new Date(2025, 0, 1, 2, 15).getTime(),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    },
    {
      startDate: new Date(2025, 0, 1, 2, 15).getTime(),
      endDate: new Date(2025, 0, 1, 3).getTime(),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 1,
      level: 0,
      maxLevel: 0,
    }];

    expect(addCollectorByLevel(items as any[], {
      cells: monthCells,
      maxLevel: 0,
      isCompact: false,
    })).toEqual([
      { ...items[0], items: [items[0], items[1]], isCompact: false },
      { ...items[2], items: [items[2], items[3]], isCompact: false },
    ]);
  });

  it('should collect overlapping appointments with maxAppointmentsPerCell=2', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 4, 15).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 1,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 2,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 1,
      maxLevel: 2,
    }];

    expect(addCollectorByLevel(items as any[], {
      cells: monthCells,
      maxLevel: 2,
      isCompact: true,
    })).toEqual([
      { ...items[0], items: [], isCompact: false },
      { ...items[1], items: [], isCompact: false },
      { ...items[3], items: [], isCompact: false },
      { ...items[2], items: [items[2]], isCompact: true },
    ]);
  });

  it('should add empty collector for overlapping appointments with maxAppointmentsPerCell=-1', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 1).getTime(),
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 1,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 4).getTime(),
      endDate: new Date(2025, 0, 8, 7).getTime(),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: new Date(2025, 0, 8, 8).getTime(),
      endDate: new Date(2025, 0, 8, 9).getTime(),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }];

    expect(addCollectorByLevel(items as any[], {
      cells: monthCells,
      maxLevel: -1,
      isCompact: true,
    })).toEqual([
      { ...items[0], items: [], isCompact: false },
      { ...items[1], items: [], isCompact: false },
      { ...items[2], items: [], isCompact: false },
      { ...items[3], items: [], isCompact: false },
      { ...items[4], items: [], isCompact: false },
      { ...items[5], items: [], isCompact: false },
    ]);
  });
});
