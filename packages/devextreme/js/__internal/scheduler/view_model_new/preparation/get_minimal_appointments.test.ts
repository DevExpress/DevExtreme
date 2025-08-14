import { describe, expect, it } from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';
import type { MinimalAppointmentEntity } from '@ts/scheduler/view_model_new/types';

import { createTimeZoneCalculator } from '../../r1/timezone_calculator';
import { getMinimalAppointments } from './get_minimal_appointments';

describe('getMinimalAppointments', () => {
  it('should prepare correct recurrence appointment', () => {
    const data = [{
      startDate: new Date(2021, 9, 8),
      endDate: new Date(2021, 9, 9),
      recurrenceRule: 'FREQ=WEEKLY',
    }];
    const expectedResult: MinimalAppointmentEntity = {
      allDay: false,
      isAllDayPanelOccupied: false,
      startDate: data[0].startDate.getTime(),
      endDate: data[0].endDate.getTime(),
      duration: 86400000,
      hasRecurrenceRule: true,
      itemData: data[0],
      recurrenceException: undefined,
      recurrenceRule: 'FREQ=WEEKLY',
      visible: true,
    } as any;
    const result = getMinimalAppointments(
      data,
      {
        allDayPanelMode: 'allDay',
        supportAllDayPanel: true,
        dataAccessors: mockAppointmentDataAccessor,
        cellDurationInMinutes: 30,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result)
      .toEqual([expectedResult]);
  });

  [null, undefined, ''].forEach((recurrenceRule) => {
    it(`should prepare correct data items if recurrenceRule=${recurrenceRule}`, () => {
      const data = [{
        startDate: new Date(2021, 9, 8),
        endDate: new Date(2021, 9, 9),
        recurrenceRule: recurrenceRule as any,
      }];
      const expectedResult: MinimalAppointmentEntity = {
        allDay: false,
        isAllDayPanelOccupied: false,
        startDate: data[0].startDate.getTime(),
        endDate: data[0].endDate.getTime(),
        duration: 86400000,
        hasRecurrenceRule: false,
        itemData: data[0],
        recurrenceException: undefined,
        recurrenceRule: recurrenceRule as any,
        visible: true,
      };
      const result = getMinimalAppointments(
        data as any,
        {
          allDayPanelMode: 'allDay',
          supportAllDayPanel: true,
          dataAccessors: mockAppointmentDataAccessor,
          cellDurationInMinutes: 30,
          timeZoneCalculator: createTimeZoneCalculator(''),
        },
      );

      expect(result)
        .toEqual([expectedResult]);
    });
  });

  [
    { visible: null, expected: true },
    { visible: undefined, expected: true },
    { visible: true, expected: true },
    { visible: false, expected: false },
  ].forEach(({ visible, expected }) => {
    it(`should correctly set visible if appointment visible is ${visible}`, () => {
      const data = [{
        startDate: new Date(2021, 9, 8),
        endDate: new Date(2021, 9, 9),
        visible,
      }];
      const result = getMinimalAppointments(
        data as any,
        {
          allDayPanelMode: 'allDay',
          supportAllDayPanel: true,
          dataAccessors: mockAppointmentDataAccessor,
          cellDurationInMinutes: 30,
          timeZoneCalculator: createTimeZoneCalculator(''),
        },
      );

      expect(result)
        .toMatchObject([{
          visible: expected,
        }]);
    });
  });

  it('should return empty array if no dataItems', () => {
    let result = getMinimalAppointments(
      undefined as any,
      {
        allDayPanelMode: 'allDay',
        supportAllDayPanel: true,
        dataAccessors: mockAppointmentDataAccessor,
        cellDurationInMinutes: 30,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result)
      .toEqual([]);

    result = getMinimalAppointments(
      [] as any,
      {
        allDayPanelMode: 'allDay',
        supportAllDayPanel: true,
        dataAccessors: mockAppointmentDataAccessor,
        cellDurationInMinutes: 30,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result)
      .toEqual([]);
  });

  it('should return empty array without startDate', () => {
    const data = [{
      endDate: new Date(2021, 9, 9),
    }];

    const result = getMinimalAppointments(
      data as any,
      {
        allDayPanelMode: 'allDay',
        supportAllDayPanel: true,
        dataAccessors: mockAppointmentDataAccessor,
        cellDurationInMinutes: 30,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result)
      .toEqual([]);
  });

  it('should correct endDate value if it doesn\'t set', () => {
    const data = [{
      startDate: new Date(2021, 9, 9, 17),
    }];

    const duration = 30 * 60000;
    const expectedResult: MinimalAppointmentEntity = {
      allDay: false,
      isAllDayPanelOccupied: false,
      startDate: data[0].startDate.getTime(),
      endDate: data[0].startDate.getTime() + duration,
      duration,
      hasRecurrenceRule: false,
      itemData: {
        ...data[0],
        endDate: new Date(2021, 9, 9, 17, 30),
      },
      recurrenceException: undefined,
      recurrenceRule: undefined,
      visible: true,
    };
    const result = getMinimalAppointments(
      data as any,
      {
        allDayPanelMode: 'allDay',
        supportAllDayPanel: true,
        dataAccessors: mockAppointmentDataAccessor,
        cellDurationInMinutes: 30,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result)
      .toEqual([expectedResult]);
  });

  it('should return timezones of start date and end date if them exists', () => {
    const expectedTimezones = {
      startDateTimeZone: 'Etc/GMT+10',
      endDateTimeZone: 'Etc/GMT-10',
    };
    const data = [{
      startDate: new Date(2021, 9, 8),
      endDate: new Date(2021, 9, 9),
      ...expectedTimezones,
    }];

    const result = getMinimalAppointments(
      data as any,
      {
        allDayPanelMode: 'allDay',
        supportAllDayPanel: true,
        dataAccessors: mockAppointmentDataAccessor,
        cellDurationInMinutes: 30,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result).toMatchObject([expectedTimezones]);
  });
});
