import { describe, expect, it } from '@jest/globals';

import { addLevel } from './add_level';
import type { CollectorOptions } from './types';

const collectorOptions: CollectorOptions = {
  cells: [],
  minLevel: 3,
  maxLevel: 3,
  collectBy: 'byStartDate',
  isCompact: false,
};

describe('addLevel', () => {
  it('should add 0 level for non-overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 1).getTime(),
      endDate: new Date(2025, 0, 2).getTime(),
      duration: 24 * 3600_000,
      groupIndex: 0,
    },
    {
      startDate: new Date(2025, 0, 3).getTime(),
      endDate: new Date(2025, 0, 4).getTime(),
      duration: 24 * 3600_000,
      groupIndex: 0,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 0, maxLevel: 3 },
    ]);
  });

  it('should add 0 level for non-overlapping closed appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 1, 1).getTime(),
      endDate: new Date(2025, 0, 1, 2, 15).getTime(),
      groupIndex: 0,
    },
    {
      startDate: new Date(2025, 0, 1, 2, 15).getTime(),
      endDate: new Date(2025, 0, 1, 3).getTime(),
      groupIndex: 0,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 0, maxLevel: 3 },
    ]);
  });

  it('should add levels for overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 4, 15).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
      groupIndex: 0,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 1, maxLevel: 3 },
      { ...items[2], level: 2, maxLevel: 3 },
      { ...items[3], level: 1, maxLevel: 3 },
    ]);
  });

  it('should add levels from min to max for overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 4, 15).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
      groupIndex: 0,
    }];

    expect(addLevel(items, { ...collectorOptions, maxLevel: 10 })).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 1, maxLevel: 3 },
      { ...items[2], level: 2, maxLevel: 3 },
      { ...items[3], level: 1, maxLevel: 3 },
      { ...items[4], level: 0, maxLevel: 4 },
      { ...items[5], level: 1, maxLevel: 4 },
      { ...items[6], level: 2, maxLevel: 4 },
      { ...items[7], level: 3, maxLevel: 4 },
    ]);
  });

  it('should add 0 level for overlapping appointments but in different groups', () => {
    const items = [{
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      groupIndex: 1,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 0, maxLevel: 3 },
    ]);
  });

  it('should add auto levels for overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 1).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 4).getTime(),
      endDate: new Date(2025, 0, 8, 7).getTime(),
      groupIndex: 0,
    }, {
      startDate: new Date(2025, 0, 8, 8).getTime(),
      endDate: new Date(2025, 0, 8, 9).getTime(),
      groupIndex: 0,
    }];

    expect(addLevel(items, { ...collectorOptions, maxLevel: -1 })).toEqual([
      { ...items[0], level: 0, maxLevel: 0 },
      { ...items[1], level: 0, maxLevel: 2 },
      { ...items[2], level: 1, maxLevel: 2 },
      { ...items[3], level: 0, maxLevel: 2 },
      { ...items[4], level: 0, maxLevel: 2 },
      { ...items[5], level: 0, maxLevel: 0 },
    ]);
  });

  it('should add levels for overlapping appointments with zero duration', () => {
    const items = [{
      id: 1,
      startDate: 0,
      endDate: 10,
      groupIndex: 0,
    }, {
      id: 2,
      startDate: 0,
      endDate: 15,
      groupIndex: 0,
    }, {
      id: 3,
      startDate: 10,
      endDate: 15,
      groupIndex: 0,
    }, {
      id: 4,
      startDate: 10,
      endDate: 10,
      groupIndex: 0,
    }, {
      id: 5,
      startDate: 10,
      endDate: 10,
      groupIndex: 0,
    }, {
      id: 6,
      startDate: 10,
      endDate: 10,
      groupIndex: 0,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 1, maxLevel: 3 },
      { ...items[2], level: 0, maxLevel: 3 },
      { ...items[3], level: 2, maxLevel: 3 },
      { ...items[4], level: 3, maxLevel: 3 },
      { ...items[5], level: 4, maxLevel: 3 },
    ]);
  });
});
