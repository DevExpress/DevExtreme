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
    },
    {
      startDate: new Date(2025, 0, 3).getTime(),
      endDate: new Date(2025, 0, 4).getTime(),
      duration: 24 * 3600_000,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      {
        ...items[0], level: 0, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[1], level: 0, maxLevel: 3, inStackWithCollector: false,
      },
    ]);
  });

  it('should add 0 level for non-overlapping closed appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 1, 1).getTime(),
      endDate: new Date(2025, 0, 1, 2, 15).getTime(),
    },
    {
      startDate: new Date(2025, 0, 1, 2, 15).getTime(),
      endDate: new Date(2025, 0, 1, 3).getTime(),
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      {
        ...items[0], level: 0, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[1], level: 0, maxLevel: 3, inStackWithCollector: false,
      },
    ]);
  });

  it('should add levels for overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 4, 15).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      {
        ...items[0], level: 0, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[1], level: 1, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[2], level: 2, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[3], level: 1, maxLevel: 3, inStackWithCollector: false,
      },
    ]);
  });

  it('should add levels from min to max for overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 4, 15).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
    }, {
      startDate: new Date(2025, 0, 17).getTime(),
      endDate: new Date(2025, 0, 18).getTime(),
    }];

    expect(addLevel(items, { ...collectorOptions, maxLevel: 10 })).toEqual([
      {
        ...items[0], level: 0, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[1], level: 1, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[2], level: 2, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[3], level: 1, maxLevel: 3, inStackWithCollector: false,
      },
      {
        ...items[4], level: 0, maxLevel: 4, inStackWithCollector: false,
      },
      {
        ...items[5], level: 1, maxLevel: 4, inStackWithCollector: false,
      },
      {
        ...items[6], level: 2, maxLevel: 4, inStackWithCollector: false,
      },
      {
        ...items[7], level: 3, maxLevel: 4, inStackWithCollector: false,
      },
    ]);
  });

  it('should add auto levels for overlapping appointments', () => {
    const items = [{
      startDate: new Date(2025, 0, 7, 3, 15).getTime(),
      endDate: new Date(2025, 0, 8, 1).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 1).getTime(),
      endDate: new Date(2025, 0, 8, 2).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 1, 30).getTime(),
      endDate: new Date(2025, 0, 8, 5).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 2).getTime(),
      endDate: new Date(2025, 0, 8, 3).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 4).getTime(),
      endDate: new Date(2025, 0, 8, 7).getTime(),
    }, {
      startDate: new Date(2025, 0, 8, 8).getTime(),
      endDate: new Date(2025, 0, 8, 9).getTime(),
    }];

    expect(addLevel(items, { ...collectorOptions, maxLevel: -1 })).toEqual([
      {
        ...items[0], level: 0, maxLevel: 0, inStackWithCollector: false,
      },
      {
        ...items[1], level: 0, maxLevel: 2, inStackWithCollector: false,
      },
      {
        ...items[2], level: 1, maxLevel: 2, inStackWithCollector: false,
      },
      {
        ...items[3], level: 0, maxLevel: 2, inStackWithCollector: false,
      },
      {
        ...items[4], level: 0, maxLevel: 2, inStackWithCollector: false,
      },
      {
        ...items[5], level: 0, maxLevel: 0, inStackWithCollector: false,
      },
    ]);
  });

  it('should add levels for overlapping appointments with zero duration', () => {
    const items = [{
      id: 1,
      startDate: 0,
      endDate: 10,
    }, {
      id: 2,
      startDate: 0,
      endDate: 15,
    }, {
      id: 3,
      startDate: 10,
      endDate: 15,
    }, {
      id: 4,
      startDate: 10,
      endDate: 10,
    }, {
      id: 5,
      startDate: 10,
      endDate: 10,
    }, {
      id: 6,
      startDate: 10,
      endDate: 10,
    }];

    expect(addLevel(items, collectorOptions)).toEqual([
      {
        ...items[0], level: 0, maxLevel: 3, inStackWithCollector: true,
      },
      {
        ...items[1], level: 1, maxLevel: 3, inStackWithCollector: true,
      },
      {
        ...items[2], level: 0, maxLevel: 3, inStackWithCollector: true,
      },
      {
        ...items[3], level: 2, maxLevel: 3, inStackWithCollector: true,
      },
      {
        ...items[4], level: 3, maxLevel: 3, inStackWithCollector: true,
      },
      {
        ...items[5], level: 4, maxLevel: 3, inStackWithCollector: true,
      },
    ]);
  });
});
