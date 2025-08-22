import { describe, expect, it } from '@jest/globals';

import { addLevel } from './add_level';

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

    expect(addLevel(items, 3)).toEqual([
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

    expect(addLevel(items, 3)).toEqual([
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

    expect(addLevel(items, 3)).toEqual([
      { ...items[0], level: 0, maxLevel: 3 },
      { ...items[1], level: 1, maxLevel: 3 },
      { ...items[2], level: 2, maxLevel: 3 },
      { ...items[3], level: 1, maxLevel: 3 },
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

    expect(addLevel(items, 3)).toEqual([
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

    expect(addLevel(items, -1)).toEqual([
      { ...items[0], level: 0, maxLevel: 0 },
      { ...items[1], level: 0, maxLevel: 2 },
      { ...items[2], level: 1, maxLevel: 2 },
      { ...items[3], level: 0, maxLevel: 2 },
      { ...items[4], level: 0, maxLevel: 2 },
      { ...items[5], level: 0, maxLevel: 0 },
    ]);
  });
});
