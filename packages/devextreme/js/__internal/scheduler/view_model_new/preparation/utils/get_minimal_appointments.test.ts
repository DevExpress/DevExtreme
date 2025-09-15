import { describe, expect, it } from '@jest/globals';

import {
  mockAppointmentDataAccessor, mockUppercaseFieldExpressions,
} from '../../../__mock__/appointment_data_accessor.mock';
import { createTimeZoneCalculator } from '../../../r1/timezone_calculator';
import { AppointmentDataAccessor } from '../../../utils/data_accessor/appointment_data_accessor';
import type { MinimalAppointmentEntity } from '../../types';
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
      source: {
        startDate: data[0].startDate.getTime(),
        endDate: data[0].endDate.getTime(),
      },
      hasRecurrenceRule: true,
      itemData: data[0],
      recurrenceException: undefined,
      recurrenceRule: 'FREQ=WEEKLY',
      visible: true,
      disabled: false,
    };
    const result = getMinimalAppointments(
      data,
      {
        dataAccessors: mockAppointmentDataAccessor,
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
        source: {
          startDate: data[0].startDate.getTime(),
          endDate: data[0].endDate.getTime(),
        },
        hasRecurrenceRule: false,
        itemData: data[0],
        recurrenceException: undefined,
        recurrenceRule: recurrenceRule as any,
        visible: true,
        disabled: false,
      };
      const result = getMinimalAppointments(
        data as any,
        {
          dataAccessors: mockAppointmentDataAccessor,
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
          dataAccessors: mockAppointmentDataAccessor,
          timeZoneCalculator: createTimeZoneCalculator(''),
        },
      );

      expect(result).toMatchObject([{
        visible: expected,
      }]);
    });
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
        dataAccessors: mockAppointmentDataAccessor,
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result).toMatchObject([expectedTimezones]);
  });

  it('should access appointment fields by accessor', () => {
    const data = [{
      AllDay: true,
      StartDate: new Date(2021, 9, 8),
      EndDate: new Date(2021, 9, 9),
      RecurrenceRule: 'FREQ=WEEKLY',
      RecurrenceException: '1324400000',
      StartDateTimeZone: 'Etc/GMT+10',
      EndDateTimeZone: 'Etc/GMT-10',
      Disabled: true,
      Visible: false,
    }];

    const result = getMinimalAppointments(
      data as any,
      {
        dataAccessors: new AppointmentDataAccessor(mockUppercaseFieldExpressions, true),
        timeZoneCalculator: createTimeZoneCalculator(''),
      },
    );

    expect(result).toEqual([{
      allDay: true,
      source: {
        startDate: data[0].StartDate.getTime(),
        endDate: data[0].EndDate.getTime(),
      },
      startDateTimeZone: 'Etc/GMT+10',
      endDateTimeZone: 'Etc/GMT-10',
      recurrenceRule: 'FREQ=WEEKLY',
      recurrenceException: '1324400000',
      hasRecurrenceRule: true,
      visible: false,
      disabled: true,
      itemData: data[0],
    }]);
  });
});
