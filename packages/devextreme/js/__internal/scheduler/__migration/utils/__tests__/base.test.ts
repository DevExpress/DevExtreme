import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '@ts/scheduler/__migration/const';

import type { ViewType } from '../../types';
import {
  getAppointmentKey,
  getAppointmentTakesAllDay,
  getCellDuration,
  getDatesWithoutTime,
  getGroupPanelData,
  getIsGroupedAllDayPanel,
  getKeyByGroup,
  getSkippedHoursInRange,
  hasResourceValue,
  isDataOnWeekend, isGroupingByDate, isHorizontalGroupingApplied, isVerticalGroupingApplied,
} from '../index';

jest.mock(
  '../../../appointments/data_provider/m_appointment_filter',
  () => ({
    AppointmentFilterBaseStrategy: jest.fn(() => ({ strategy: 'base' })),
    AppointmentFilterVirtualStrategy: jest.fn(() => ({ strategy: 'virtual' })),
  }),
);

describe('getDatesWithoutTime', () => {
  it('should trim dates correctly', () => {
    expect(getDatesWithoutTime(
      new Date(2021, 10, 23, 11, 11),
      new Date(2021, 10, 24, 12, 12),
    )).toEqual([
      new Date(2021, 10, 23),
      new Date(2021, 10, 25),
    ]);
  });
});

describe('getAppointmentTakesAllDay', () => {
  describe('allDayPanelMode is all', () => {
    it('should return true if all day appointment', () => {
      const appointment = {
        allDay: true,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(true);
    });

    it('should return true if appointment takes all day', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 2, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(true);
    });

    it('should return false if appointment does not take all day', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 10),
        endDate: new Date(2022, 0, 1, 11),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(false);
    });

    it('should return false if appointment duration > view duration', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 13),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(false);
    });

    [
      undefined,
      null,
    ].forEach((endDate) => {
      it(`should return false if endDate is ${endDate}`, () => {
        const appointment = {
          allDay: false,
          startDate: new Date(2022, 0, 1, 8),
          endDate,
        };

        expect(getAppointmentTakesAllDay(appointment, 'all'))
          .toBe(false);
      });
    });
  });

  describe('allDayPanelMode is hidden', () => {
    it('should return true if all day appointment', () => {
      const appointment = {
        allDay: true,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'hidden'))
        .toBe(false);
    });
  });

  describe('allDayPanelMode is allDay', () => {
    it('should return true if all day appointment', () => {
      const appointment = {
        allDay: true,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'allDay'))
        .toBe(true);
    });

    it('should return true if appointment takes all day', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 2, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'allDay'))
        .toBe(false);
    });
  });
});

describe('getAppointmentKey', () => {
  const testViewModel = {
    key: '1-2-10-20',
    appointment: {
      startDate: new Date('2021-08-05T10:00:00.000Z'),
      endDate: new Date('2021-08-05T12:00:00.000Z'),
      text: 'Some text',
    },

    geometry: {
      empty: false,
      left: 1,
      top: 2,
      width: 10,
      height: 20,
      leftVirtualWidth: 1,
      topVirtualHeight: 2,
    },

    info: {
      appointment: {
        startDate: new Date('2021-08-05T10:00:00.000Z'),
        endDate: new Date('2021-08-05T12:00:00.000Z'),
      },
      sourceAppointment: {
        groupIndex: 99,
      },
      dateText: '1AM - 2PM',
      resourceColor: '#1A2BC',
    },
  };

  it('should generate correct key', () => {
    expect(getAppointmentKey(testViewModel.geometry))
      .toBe('1-2-10-20');
  });
});

describe('Resources Utils', () => {
  describe('hasResourceValue', () => {
    [
      {
        resourceValues: [
          { value: '1-2-3' },
        ],
        itemValue: { value: '1-2-3' },
        expected: true,
      },
      {
        resourceValues: [
          { value: '1-2-3' },
        ],
        itemValue: { value: 'Failed' },
        expected: false,
      },
      {
        resourceValues: ['1-2-3'],
        itemValue: '1-2-3',
        expected: true,
      },
      {
        resourceValues: ['1-2-3'],
        itemValue: 'Failed',
        expected: false,
      },
      {
        resourceValues: [123],
        itemValue: 123,
        expected: true,
      },
      {
        resourceValues: [123],
        itemValue: 'Failed',
        expected: false,
      },
      {
        resourceValues: [0],
        itemValue: 0,
        expected: true,
      },
      {
        resourceValues: [0],
        itemValue: 'Failed',
        expected: false,
      },
    ].forEach(({ resourceValues, itemValue, expected }) => {
      it(`should return correct value if itemValue=${JSON.stringify(itemValue)}`, () => {
        expect(hasResourceValue(resourceValues, itemValue))
          .toEqual(expected);
      });
    });
  });
});

describe('getCellDuration', () => {
  [
    ...[
      'day', 'week', 'workWeek',
      'timelineDay', 'timelineWeek', 'timelineWorkWeek',
    ].map((item) => ({
      viewType: item,
      expected: 90000000,
    })),
    {
      viewType: 'month',
      expected: 32400000,
    },
    {
      viewType: 'timelineMonth',
      expected: 86400000,
    },
  ].forEach(({ viewType, expected }) => {
    it(`should return correct result if ${viewType} view`, () => {
      expect(getCellDuration(viewType as ViewType, 9, 18, 25))
        .toEqual(expected);
    });
  });
});

describe('getSkippedHoursInRange', () => {
  describe('default', () => {
    it('should skip large interval', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => date.getDay() >= 6,
        getViewOptions: () => ({
          startDayHour: 0,
          endDayHour: 24,
        }),
        viewType: 'week',
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 9, 8, 23, 23),
        new Date(2021, 12, 28, 18, 18),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(384);
    });

    it('should skip 2 weekend days if startDate and endDate inside weekend', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 0,
          endDayHour: 24,
        }),
        viewType: 'week',
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 3, 3),
        new Date(2021, 3, 4, 0, 0, 0, 1),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(48);
    });
  });

  describe('border conditions', () => {
    const mockViewDataProvider = {
      isSkippedDate: (date: Date) => isDataOnWeekend(date),
      getViewOptions: () => ({
        startDayHour: 0,
        endDayHour: 24,
      }),
      viewType: 'week',
    };

    it('should not skip weekend if endDate at 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip weekend if endDate > 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 0, 0, 0, 1),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip 1 weekend day if endDate is at the end of the weekend day', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 23, 59, 59),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip 2 weekend days if endDate is at 0 border of the first week day', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 5, 0, 0, 0, 1),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(48);
    });
  });

  describe('startDayHour and endDayHour and allDay = false', () => {
    interface TestParams {
      startDate: Date;
      endDate: Date;
      startDayHour: number;
      endDayHour: number;
      expectedHours: number;
    }

    it.each<TestParams>([
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 0,
        endDayHour: 24,
        expectedHours: 48,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 7,
        endDayHour: 17,
        expectedHours: 20,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 0,
        endDayHour: 18,
        expectedHours: 36,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 8,
        endDayHour: 24,
        expectedHours: 32,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 4, 13),
        startDayHour: 10,
        endDayHour: 16,
        expectedHours: 6 + 3,
      },
      {
        startDate: new Date(2024, 1, 4, 12),
        endDate: new Date(2024, 1, 6),
        startDayHour: 10,
        endDayHour: 16,
        expectedHours: 4,
      },
      {
        startDate: new Date(2024, 1, 4, 8),
        endDate: new Date(2024, 1, 6),
        startDayHour: 10,
        endDayHour: 16,
        expectedHours: 6,
      },
      {
        startDate: new Date(2024, 1, 2, 13, 0),
        endDate: new Date(2024, 1, 3, 18, 0),
        startDayHour: 12,
        endDayHour: 16,
        expectedHours: 4,
      },
    ])('should return correct number of skipped hours', ({
      startDate,
      endDate,
      expectedHours,
      startDayHour,
      endDayHour,
    }) => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour,
          endDayHour,
        }),
        viewType: 'week',
      };

      const result = getSkippedHoursInRange(startDate, endDate, false, mockViewDataProvider as any);
      expect(result).toBe(expectedHours);
    });

    it.each<{ startDate: Date; endDate: Date; expectedHours: number }>([
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        expectedHours: 16,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 4),
        expectedHours: 8,
      },
      {
        startDate: new Date(2024, 1, 4),
        endDate: new Date(2024, 1, 6),
        expectedHours: 8,
      },
    ])('should return correct number of skipped hours for timeline view', ({
      startDate,
      endDate,
      expectedHours,
    }) => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 11,
          endDayHour: 19,
        }),
        viewType: 'timelineWeek',
      };

      const result = getSkippedHoursInRange(startDate, endDate, true, mockViewDataProvider as any);
      expect(result).toBe(expectedHours);
    });
  });
});

describe('getGroupPanelData', () => {
  const groupsBase = [{
    name: 'group 1',
    items: [{
      text: 'item 1', id: 1, color: 'color 1',
    }, {
      text: 'item 2', id: 2, color: 'color 2',
    }],
    data: [{
      text: 'item 1', id: 1, color: 'color 1',
    }, {
      text: 'item 2', id: 2, color: 'color 2',
    }],
  }, {
    name: 'group 2',
    items: [{
      text: 'item 3', id: 1, color: 'color 3',
    }, {
      text: 'item 4', id: 2, color: 'color 4',
    }],
    data: [{
      text: 'item 3', id: 1, color: 'color 3',
    }, {
      text: 'item 4', id: 2, color: 'color 4',
    }],
  }];

  it('should transform grouping data into group items', () => {
    const groupPanelData = getGroupPanelData(groupsBase, 1, false, 3);

    expect(groupPanelData)
      .toEqual({
        groupPanelItems: [[{
          ...groupsBase[0].items[0],
          data: groupsBase[0].data[0],
          resourceName: groupsBase[0].name,
          key: '0_group 1_1',
        }, {
          ...groupsBase[0].items[1],
          data: groupsBase[0].data[1],
          resourceName: groupsBase[0].name,
          key: '0_group 1_2',
        }], [{
          ...groupsBase[1].items[0],
          data: groupsBase[1].data[0],
          resourceName: groupsBase[1].name,
          key: '0_group 2_1',
        }, {
          ...groupsBase[1].items[1],
          data: groupsBase[1].data[1],
          resourceName: groupsBase[1].name,
          key: '0_group 2_2',
        }, {
          ...groupsBase[1].items[0],
          data: groupsBase[1].data[0],
          resourceName: groupsBase[1].name,
          key: '1_group 2_1',
        }, {
          ...groupsBase[1].items[1],
          data: groupsBase[1].data[1],
          resourceName: groupsBase[1].name,
          key: '1_group 2_2',
        }]],
        baseColSpan: 3,
      });
  });

  it('should work when data parameter is undefined', () => {
    const groups = [{
      name: 'group 1',
      items: [{
        text: 'item 1', id: 1, color: 'color 1',
      }, {
        text: 'item 2', id: 2, color: 'color 2',
      }],
    }] as any;
    const groupPanelData = getGroupPanelData(groups, 1, false, 5);

    expect(groupPanelData)
      .toEqual({
        groupPanelItems: [[{
          ...groups[0].items[0],
          resourceName: groups[0].name,
          key: '0_group 1_1',
        }, {
          ...groups[0].items[1],
          resourceName: groups[0].name,
          key: '0_group 1_2',
        }]],
        baseColSpan: 5,
      });
  });

  it('should transform grouping data into group items corectly when appointments are groupped by date', () => {
    const groupPanelData = getGroupPanelData(groupsBase, 2, true, 7);

    expect(groupPanelData)
      .toEqual({
        groupPanelItems: [[{
          ...groupsBase[0].items[0],
          data: groupsBase[0].data[0],
          resourceName: groupsBase[0].name,
          key: '0_group 1_1_group_by_date_0',
          isFirstGroupCell: true,
          isLastGroupCell: false,
        }, {
          ...groupsBase[0].items[1],
          data: groupsBase[0].data[1],
          resourceName: groupsBase[0].name,
          key: '0_group 1_2_group_by_date_0',
          isFirstGroupCell: false,
          isLastGroupCell: true,
        }, {
          ...groupsBase[0].items[0],
          data: groupsBase[0].data[0],
          resourceName: groupsBase[0].name,
          key: '0_group 1_1_group_by_date_1',
          isFirstGroupCell: true,
          isLastGroupCell: false,
        }, {
          ...groupsBase[0].items[1],
          data: groupsBase[0].data[1],
          resourceName: groupsBase[0].name,
          key: '0_group 1_2_group_by_date_1',
          isFirstGroupCell: false,
          isLastGroupCell: true,
        }], [{
          ...groupsBase[1].items[0],
          data: groupsBase[1].data[0],
          resourceName: groupsBase[1].name,
          key: '0_group 2_1_group_by_date_0',
          isFirstGroupCell: true,
          isLastGroupCell: false,
        }, {
          ...groupsBase[1].items[1],
          data: groupsBase[1].data[1],
          resourceName: groupsBase[1].name,
          key: '0_group 2_2_group_by_date_0',
          isFirstGroupCell: false,
          isLastGroupCell: false,
        }, {
          ...groupsBase[1].items[0],
          data: groupsBase[1].data[0],
          resourceName: groupsBase[1].name,
          key: '1_group 2_1_group_by_date_0',
          isFirstGroupCell: false,
          isLastGroupCell: false,
        }, {
          ...groupsBase[1].items[1],
          data: groupsBase[1].data[1],
          resourceName: groupsBase[1].name,
          key: '1_group 2_2_group_by_date_0',
          isFirstGroupCell: false,
          isLastGroupCell: true,
        }, {
          ...groupsBase[1].items[0],
          data: groupsBase[1].data[0],
          resourceName: groupsBase[1].name,
          key: '0_group 2_1_group_by_date_1',
          isFirstGroupCell: true,
          isLastGroupCell: false,
        }, {
          ...groupsBase[1].items[1],
          data: groupsBase[1].data[1],
          resourceName: groupsBase[1].name,
          key: '0_group 2_2_group_by_date_1',
          isFirstGroupCell: false,
          isLastGroupCell: false,
        }, {
          ...groupsBase[1].items[0],
          data: groupsBase[1].data[0],
          resourceName: groupsBase[1].name,
          key: '1_group 2_1_group_by_date_1',
          isFirstGroupCell: false,
          isLastGroupCell: false,
        }, {
          ...groupsBase[1].items[1],
          data: groupsBase[1].data[1],
          resourceName: groupsBase[1].name,
          key: '1_group 2_2_group_by_date_1',
          isFirstGroupCell: false,
          isLastGroupCell: true,
        }]],
        baseColSpan: 7,
      });
  });
});

describe('getKeyByGroup', () => {
  it('should generate key from group', () => {
    expect(getKeyByGroup(0, true))
      .toBe('0');
    expect(getKeyByGroup(1, true))
      .toBe('1');
  });

  it('should return 0 when group orientation is horizontal', () => {
    expect(getKeyByGroup(32, false))
      .toBe('0');
  });

  it('should return "0" when groupIndex is undefined', () => {
    expect(getKeyByGroup(undefined, false))
      .toBe('0');
  });
});

describe('getIsGroupedAllDayPanel', () => {
  it('should return false if all-day-panel is a part of the header', () => {
    expect(getIsGroupedAllDayPanel(false, false))
      .toBe(false);
    expect(getIsGroupedAllDayPanel(false, true))
      .toBe(false);
  });

  it('should return false in case of horizontal grouping', () => {
    expect(getIsGroupedAllDayPanel(true, false))
      .toBe(false);
  });

  it('should return true if all-day-panel is not a part of the header and vertical grouping is used', () => {
    expect(getIsGroupedAllDayPanel(true, true))
      .toBe(true);
  });
});

describe('isVerticalGroupingApplied', () => {
  const groups = [{
    name: 'groupId',
    items: [{ id: 1 }],
    data: [{ id: 1 }],
  }];

  it('should return true if group orientation is vertical', () => {
    expect(isVerticalGroupingApplied(groups, VERTICAL_GROUP_ORIENTATION))
      .toBe(true);
  });

  it('should return false if group orientation is not vertical', () => {
    expect(isVerticalGroupingApplied(groups, HORIZONTAL_GROUP_ORIENTATION))
      .toBe(false);
    expect(isVerticalGroupingApplied(groups))
      .toBe(false);
  });

  it('should return false if groups are empty', () => {
    expect(isVerticalGroupingApplied([], VERTICAL_GROUP_ORIENTATION))
      .toBe(false);
  });
});

describe('isHorizontalGroupingApplied', () => {
  const testGroups = [{}] as any;

  it('should return true if group orientation is horizontal and groups length is more than 0', () => {
    expect(isHorizontalGroupingApplied(testGroups, HORIZONTAL_GROUP_ORIENTATION))
      .toBe(true);
  });

  it('should return false if group orientation is not horizontal', () => {
    expect(isHorizontalGroupingApplied(testGroups, VERTICAL_GROUP_ORIENTATION))
      .toBe(false);
    expect(isHorizontalGroupingApplied(testGroups))
      .toBe(false);
  });

  it('should return false if groups length is 0', () => {
    expect(isHorizontalGroupingApplied([], HORIZONTAL_GROUP_ORIENTATION))
      .toBe(false);
  });
});

describe('isGroupingByDate', () => {
  const testGroups = [{}] as any;

  it('should return true if group orientation is horizontal and groupByDate is true', () => {
    expect(isGroupingByDate(testGroups, HORIZONTAL_GROUP_ORIENTATION, true))
      .toBe(true);
  });

  it('should return false if group orientation is horizontal and groupByDate is false', () => {
    expect(isGroupingByDate(testGroups, HORIZONTAL_GROUP_ORIENTATION, false))
      .toBe(false);
  });

  it('should return false if group orientation is vertical', () => {
    expect(isGroupingByDate(testGroups, VERTICAL_GROUP_ORIENTATION, false))
      .toBe(false);
  });
});
