import { describe, expect, it } from '@jest/globals';

import type {
  AllDayPanelOccupation,
  MinimalAppointmentEntity,
} from '../../../types';
import { splitByParts } from './split_by_parts';

type Entity = MinimalAppointmentEntity & AllDayPanelOccupation;

const intervals = [
  {
    min: new Date(2000, 0, 10, 3).getTime(),
    max: new Date(2000, 0, 10, 10).getTime(),
  }, {
    min: new Date(2000, 0, 11, 3).getTime(),
    max: new Date(2000, 0, 11, 10).getTime(),
  }, {
    min: new Date(2000, 0, 12, 3).getTime(),
    max: new Date(2000, 0, 12, 10).getTime(),
  },
];

describe('splitByParts', () => {
  it('should not split appointments inside one interval', () => {
    const items = [
      {
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
      }, {
        startDate: new Date(2000, 0, 10, 7).getTime(),
        endDate: new Date(2000, 0, 10, 8).getTime(),
      }, {
        startDate: new Date(2000, 0, 10, 8).getTime(),
        endDate: new Date(2000, 0, 10, 10).getTime(),
      },
    ] as Entity[];

    expect(splitByParts(items, intervals)).toEqual([
      {
        ...items[0],
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 0,
      }, {
        ...items[1],
        startDate: new Date(2000, 0, 10, 7).getTime(),
        endDate: new Date(2000, 0, 10, 8).getTime(),
        duration: 3600_000,
        partIndex: 0,
        partCount: 0,
      }, {
        ...items[2],
        startDate: new Date(2000, 0, 10, 8).getTime(),
        endDate: new Date(2000, 0, 10, 10).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 0,
      },
    ]);
  });

  it('should add reduced and fix duration for appointments out of intervals', () => {
    const items = [
      {
        startDate: new Date(2000, 0, 9, 6).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
      }, {
        startDate: new Date(2000, 0, 12, 8).getTime(),
        endDate: new Date(2000, 0, 13, 7).getTime(),
      },
    ] as Entity[];

    expect(splitByParts(items, intervals)).toEqual([
      {
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 0,
        reduced: 'tail',
      }, {
        startDate: new Date(2000, 0, 12, 8).getTime(),
        endDate: new Date(2000, 0, 12, 10).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 0,
        reduced: 'head',
      },
    ]);
  });

  it('should split appointments', () => {
    const items = [
      {
        id: 1,
        startDate: new Date(2000, 0, 9, 6).getTime(),
        endDate: new Date(2000, 0, 11, 5).getTime(),
      }, {
        id: 2,
        startDate: new Date(2000, 0, 9, 23).getTime(),
        endDate: new Date(2000, 0, 11, 5).getTime(),
      }, {
        id: 3,
        startDate: new Date(2000, 0, 11, 8).getTime(),
        endDate: new Date(2000, 0, 13, 7).getTime(),
      }, {
        id: 4,
        startDate: new Date(2000, 0, 11, 9).getTime(),
        endDate: new Date(2000, 0, 13, 1).getTime(),
      },
    ] as (Entity & { id: number })[];

    expect(splitByParts(items, intervals)).toEqual([
      {
        ...items[0],
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'body',
      }, {
        ...items[0],
        startDate: new Date(2000, 0, 11, 3).getTime(),
        endDate: new Date(2000, 0, 11, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'tail',
      }, {
        ...items[1],
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'head',
      }, {
        ...items[1],
        startDate: new Date(2000, 0, 11, 3).getTime(),
        endDate: new Date(2000, 0, 11, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'tail',
      }, {
        ...items[2],
        startDate: new Date(2000, 0, 11, 8).getTime(),
        endDate: new Date(2000, 0, 11, 10).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'head',
      }, {
        ...items[2],
        startDate: new Date(2000, 0, 12, 3).getTime(),
        endDate: new Date(2000, 0, 12, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'body',
      }, {
        ...items[3],
        startDate: new Date(2000, 0, 11, 9).getTime(),
        endDate: new Date(2000, 0, 11, 10).getTime(),
        duration: 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'head',
      }, {
        ...items[3],
        startDate: new Date(2000, 0, 12, 3).getTime(),
        endDate: new Date(2000, 0, 12, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'tail',
      },
    ]);
  });

  it('should crop 24 hour appointment', () => {
    const items = [{
      startDate: new Date(2000, 0, 10, 0).getTime(),
      endDate: new Date(2000, 0, 11, 0).getTime(),
    }] as Entity[];

    expect(splitByParts(items, intervals)).toEqual([{
      startDate: new Date(2000, 0, 10, 3).getTime(),
      endDate: new Date(2000, 0, 10, 10).getTime(),
      duration: 7 * 3600_000,
      partIndex: 0,
      partCount: 0,
    }]);
  });

  it('should not split 24 hour appointment', () => {
    const items = [{
      startDate: new Date(2000, 0, 10, 0).getTime(),
      endDate: new Date(2000, 0, 11, 0).getTime(),
    }] as Entity[];

    expect(splitByParts(items, [{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 11).getTime(),
    }, {
      min: new Date(2000, 0, 11).getTime(),
      max: new Date(2000, 0, 12).getTime(),
    }])).toEqual([{
      startDate: new Date(2000, 0, 10).getTime(),
      endDate: new Date(2000, 0, 11).getTime(),
      duration: 24 * 3600_000,
      partIndex: 0,
      partCount: 0,
    }]);
  });
});
