import { describe, expect, it } from '@jest/globals';

import { addCollectorByLevel } from './add_collector_by_level';

const monthCells = Array.from({ length: 28 }).map((_, index) => ({
  min: Date.UTC(2025, 0, index + 1),
  max: Date.UTC(2025, 0, index + 2),
  cellIndex: index,
  rowIndex: Math.floor(index / 7),
  columnIndex: index % 7,
}));

describe('addCollectorByLevel', () => {
  it('should add empty collector for non-overlapping appointments', () => {
    const items = [{
      startDate: Date.UTC(2025, 0, 1, 1),
      endDate: Date.UTC(2025, 0, 1, 2, 15),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    },
    {
      startDate: Date.UTC(2025, 0, 1, 2, 15),
      endDate: Date.UTC(2025, 0, 1, 3),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1),
      endDate: Date.UTC(2025, 0, 8, 2),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1, 30),
      endDate: Date.UTC(2025, 0, 8, 5),
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
      minLevel: 3,
      maxLevel: 3,
      collectBy: 'byStartDate',
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
      startDate: Date.UTC(2025, 0, 1, 1),
      endDate: Date.UTC(2025, 0, 1, 2, 15),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    },
    {
      startDate: Date.UTC(2025, 0, 1, 2, 15),
      endDate: Date.UTC(2025, 0, 1, 3),
      duration: 3600_000,
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1),
      endDate: Date.UTC(2025, 0, 8, 2),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1, 30),
      endDate: Date.UTC(2025, 0, 8, 5),
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
      minLevel: 3,
      maxLevel: 0,
      collectBy: 'byStartDate',
      isCompact: false,
    })).toEqual([
      { ...items[0], items: [items[0], items[1]], isCompact: false },
      { ...items[2], items: [items[2], items[3]], isCompact: false },
    ]);
  });

  it('should collect overlapping appointments with maxAppointmentsPerCell=2', () => {
    const items = [{
      startDate: Date.UTC(2025, 0, 7, 3, 15),
      endDate: Date.UTC(2025, 0, 8, 4, 15),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1),
      endDate: Date.UTC(2025, 0, 8, 2),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 1,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1, 30),
      endDate: Date.UTC(2025, 0, 8, 5),
      duration: 3600_000,
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 2,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 2),
      endDate: Date.UTC(2025, 0, 8, 3),
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
      minLevel: 3,
      maxLevel: 2,
      collectBy: 'byStartDate',
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
      startDate: Date.UTC(2025, 0, 7, 3, 15),
      endDate: Date.UTC(2025, 0, 8, 1),
      cellIndex: 0,
      rowIndex: 0,
      columnIndex: 0,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1),
      endDate: Date.UTC(2025, 0, 8, 2),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 1, 30),
      endDate: Date.UTC(2025, 0, 8, 5),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 1,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 2),
      endDate: Date.UTC(2025, 0, 8, 3),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 4),
      endDate: Date.UTC(2025, 0, 8, 7),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 2,
    }, {
      startDate: Date.UTC(2025, 0, 8, 8),
      endDate: Date.UTC(2025, 0, 8, 9),
      cellIndex: 6,
      rowIndex: 0,
      columnIndex: 6,
      groupIndex: 0,
      level: 0,
      maxLevel: 0,
    }];

    expect(addCollectorByLevel(items as any[], {
      cells: monthCells,
      minLevel: 3,
      maxLevel: -1,
      collectBy: 'byStartDate',
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

  it('should collect overlapping appointments by occupation', () => {
    const items = [{
      startDateUTC: Date.UTC(2025, 0, 7),
      endDateUTC: Date.UTC(2025, 0, 12),
      duration: 3600_000,
      cellIndex: 6,
      endCellIndex: 11,
      rowIndex: monthCells[6].rowIndex,
      columnIndex: monthCells[6].columnIndex,
      groupIndex: 0,
      level: 0,
      maxLevel: 1,
    }, {
      startDateUTC: Date.UTC(2025, 0, 8, 2),
      endDateUTC: Date.UTC(2025, 0, 10, 3),
      duration: 3600_000,
      cellIndex: 7,
      endCellIndex: 9,
      rowIndex: monthCells[7].rowIndex,
      columnIndex: monthCells[7].columnIndex,
      groupIndex: 0,
      level: 3,
      maxLevel: 1,
    }, {
      startDateUTC: Date.UTC(2025, 0, 8, 1, 30),
      endDateUTC: Date.UTC(2025, 0, 9, 5),
      duration: 3600_000,
      cellIndex: 7,
      endCellIndex: 8,
      rowIndex: monthCells[7].rowIndex,
      columnIndex: monthCells[7].columnIndex,
      groupIndex: 0,
      level: 2,
      maxLevel: 1,
    }, {
      startDateUTC: Date.UTC(2025, 0, 8, 1),
      endDateUTC: Date.UTC(2025, 0, 8, 2),
      duration: 3600_000,
      cellIndex: 7,
      endCellIndex: 7,
      rowIndex: monthCells[7].rowIndex,
      columnIndex: monthCells[7].columnIndex,
      groupIndex: 0,
      level: 1,
      maxLevel: 1,
    }];

    expect(addCollectorByLevel(items as any[], {
      cells: monthCells,
      minLevel: 3,
      maxLevel: 1,
      collectBy: 'byOccupation',
      isCompact: true,
    })).toEqual([
      { ...items[0], items: [], isCompact: false },
      {
        ...items[1],
        items: [items[1], items[2], items[3]],
        isCompact: true,
      },
      {
        ...items[1],
        startDateUTC: monthCells[8].min,
        endDateUTC: monthCells[8].max,
        cellIndex: 8,
        endCellIndex: 8,
        rowIndex: monthCells[8].rowIndex,
        columnIndex: monthCells[8].columnIndex,
        items: [
          {
            ...items[1],
            startDateUTC: monthCells[8].min,
            endDateUTC: monthCells[8].max,
            cellIndex: 8,
            endCellIndex: 8,
            rowIndex: monthCells[8].rowIndex,
            columnIndex: monthCells[8].columnIndex,
          },
          {
            ...items[2],
            startDateUTC: monthCells[8].min,
            endDateUTC: monthCells[8].max,
            cellIndex: 8,
            endCellIndex: 8,
            rowIndex: monthCells[8].rowIndex,
            columnIndex: monthCells[8].columnIndex,
          },
        ],
        isCompact: true,
      },
      {
        ...items[1],
        startDateUTC: monthCells[9].min,
        endDateUTC: monthCells[9].max,
        cellIndex: 9,
        endCellIndex: 9,
        rowIndex: monthCells[9].rowIndex,
        columnIndex: monthCells[9].columnIndex,
        items: [
          {
            ...items[1],
            startDateUTC: monthCells[9].min,
            endDateUTC: monthCells[9].max,
            cellIndex: 9,
            endCellIndex: 9,
            rowIndex: monthCells[9].rowIndex,
            columnIndex: monthCells[9].columnIndex,
          },
        ],
        isCompact: true,
      },
    ]);
  });
});
