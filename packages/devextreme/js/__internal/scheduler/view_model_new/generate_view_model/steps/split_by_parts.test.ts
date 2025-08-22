import { describe, expect, it } from '@jest/globals';

import type {
  AllDayPanelOccupation,
  DateIntervalsExtended,
  MinimalAppointmentEntity,
} from '../../types';
import { splitByParts } from './split_by_parts';

type Entity = MinimalAppointmentEntity & AllDayPanelOccupation;

const filterOptions: {
  allDayPanel: DateIntervalsExtended;
  regularPanel: DateIntervalsExtended;
} = {
  regularPanel: {
    intervals: [
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
    ],
    prevIntervalEndDate: new Date(2000, 0, 9, 10).getTime(),
    nextIntervalStartDate: new Date(2000, 0, 13, 3).getTime(),
  },
  allDayPanel: {
    intervals: [{
      min: new Date(2000, 0, 10).getTime(),
      max: new Date(2000, 0, 12).getTime(),
    }],
    prevIntervalEndDate: new Date(2000, 0, 10).getTime(),
    nextIntervalStartDate: new Date(2000, 0, 12).getTime(),
  },
};

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

    expect(splitByParts(items, filterOptions)).toEqual([
      {
        ...items[0],
        originalAppointmentDates: items[0],
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 0,
      }, {
        ...items[1],
        originalAppointmentDates: items[1],
        startDate: new Date(2000, 0, 10, 7).getTime(),
        endDate: new Date(2000, 0, 10, 8).getTime(),
        duration: 3600_000,
        partIndex: 0,
        partCount: 0,
      }, {
        ...items[2],
        originalAppointmentDates: items[2],
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

    expect(splitByParts(items, filterOptions)).toEqual([
      {
        originalAppointmentDates: items[0],
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 0,
        reduced: 'tail',
      }, {
        originalAppointmentDates: items[1],
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

    expect(splitByParts(items, filterOptions)).toEqual([
      {
        ...items[0],
        originalAppointmentDates: {
          startDate: items[0].startDate,
          endDate: items[0].endDate,
        },
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'body',
      }, {
        ...items[0],
        originalAppointmentDates: {
          startDate: items[0].startDate,
          endDate: items[0].endDate,
        },
        startDate: new Date(2000, 0, 11, 3).getTime(),
        endDate: new Date(2000, 0, 11, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'tail',
      }, {
        ...items[1],
        originalAppointmentDates: {
          startDate: items[1].startDate,
          endDate: items[1].endDate,
        },
        startDate: new Date(2000, 0, 10, 3).getTime(),
        endDate: new Date(2000, 0, 10, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'head',
      }, {
        ...items[1],
        originalAppointmentDates: {
          startDate: items[1].startDate,
          endDate: items[1].endDate,
        },
        startDate: new Date(2000, 0, 11, 3).getTime(),
        endDate: new Date(2000, 0, 11, 5).getTime(),
        duration: 2 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'tail',
      }, {
        ...items[2],
        originalAppointmentDates: {
          startDate: items[2].startDate,
          endDate: items[2].endDate,
        },
        startDate: new Date(2000, 0, 11, 8).getTime(),
        endDate: new Date(2000, 0, 11, 10).getTime(),
        duration: 2 * 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'head',
      }, {
        ...items[2],
        originalAppointmentDates: {
          startDate: items[2].startDate,
          endDate: items[2].endDate,
        },
        startDate: new Date(2000, 0, 12, 3).getTime(),
        endDate: new Date(2000, 0, 12, 10).getTime(),
        duration: 7 * 3600_000,
        partIndex: 1,
        partCount: 2,
        reduced: 'body',
      }, {
        ...items[3],
        originalAppointmentDates: {
          startDate: items[3].startDate,
          endDate: items[3].endDate,
        },
        startDate: new Date(2000, 0, 11, 9).getTime(),
        endDate: new Date(2000, 0, 11, 10).getTime(),
        duration: 3600_000,
        partIndex: 0,
        partCount: 2,
        reduced: 'head',
      }, {
        ...items[3],
        originalAppointmentDates: {
          startDate: items[3].startDate,
          endDate: items[3].endDate,
        },
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

    expect(splitByParts(items, filterOptions)).toEqual([{
      originalAppointmentDates: items[0],
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
    const filterOptions24Hours: {
      allDayPanel: DateIntervalsExtended;
      regularPanel: DateIntervalsExtended;
    } = {
      regularPanel: {
        intervals: [{
          min: new Date(2000, 0, 10).getTime(),
          max: new Date(2000, 0, 11).getTime(),
        }, {
          min: new Date(2000, 0, 11).getTime(),
          max: new Date(2000, 0, 12).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 12).getTime(),
      },
      allDayPanel: filterOptions.allDayPanel,
    };

    expect(splitByParts(items, filterOptions24Hours)).toEqual([{
      originalAppointmentDates: items[0],
      startDate: new Date(2000, 0, 10).getTime(),
      endDate: new Date(2000, 0, 11).getTime(),
      duration: 24 * 3600_000,
      partIndex: 0,
      partCount: 0,
    }]);
  });

  it('should not split 24 hour all day appointment', () => {
    const items = [{
      isAllDayPanelOccupied: true,
      startDate: new Date(2000, 0, 10, 0).getTime(),
      endDate: new Date(2000, 0, 11, 0).getTime(),
    }] as Entity[];

    expect(splitByParts(items, filterOptions)).toEqual([{
      ...items[0],
      originalAppointmentDates: {
        startDate: items[0].startDate,
        endDate: items[0].endDate,
      },
      startDate: new Date(2000, 0, 10, 0).getTime(),
      endDate: new Date(2000, 0, 11, 0).getTime(),
      duration: 24 * 3600_000,
      partIndex: 0,
      partCount: 0,
    }]);
  });

  it('should split all day appointments', () => {
    const items = [
      {
        id: 1,
        isAllDayPanelOccupied: true,
        startDate: new Date(2000, 0, 9).getTime(),
        endDate: new Date(2000, 0, 11).getTime(),
      }, {
        id: 2,
        isAllDayPanelOccupied: true,
        startDate: new Date(2000, 0, 10).getTime(),
        endDate: new Date(2000, 0, 11).getTime(),
      }, {
        id: 3,
        isAllDayPanelOccupied: true,
        startDate: new Date(2000, 0, 10).getTime(),
        endDate: new Date(2000, 0, 12).getTime(),
      }, {
        id: 4,
        isAllDayPanelOccupied: true,
        startDate: new Date(2000, 0, 11).getTime(),
        endDate: new Date(2000, 0, 13).getTime(),
      },
    ] as (Entity & { id: number })[];

    expect(splitByParts(items, filterOptions)).toEqual([
      {
        ...items[0],
        originalAppointmentDates: {
          startDate: items[0].startDate,
          endDate: items[0].endDate,
        },
        startDate: new Date(2000, 0, 10).getTime(),
        endDate: new Date(2000, 0, 11).getTime(),
        duration: 24 * 3600_000,
        partIndex: 0,
        partCount: 0,
        reduced: 'tail',
      }, {
        ...items[1],
        originalAppointmentDates: {
          startDate: items[1].startDate,
          endDate: items[1].endDate,
        },
        startDate: new Date(2000, 0, 10).getTime(),
        endDate: new Date(2000, 0, 11).getTime(),
        duration: 24 * 3600_000,
        partIndex: 0,
        partCount: 0,
      }, {
        ...items[2],
        originalAppointmentDates: {
          startDate: items[2].startDate,
          endDate: items[2].endDate,
        },
        startDate: new Date(2000, 0, 10).getTime(),
        endDate: new Date(2000, 0, 12).getTime(),
        duration: 48 * 3600_000,
        partIndex: 0,
        partCount: 0,
      }, {
        ...items[3],
        originalAppointmentDates: {
          startDate: items[3].startDate,
          endDate: items[3].endDate,
        },
        startDate: new Date(2000, 0, 11).getTime(),
        endDate: new Date(2000, 0, 12).getTime(),
        duration: 24 * 3600_000,
        partIndex: 0,
        partCount: 0,
        reduced: 'head',
      },
    ]);
  });
});
