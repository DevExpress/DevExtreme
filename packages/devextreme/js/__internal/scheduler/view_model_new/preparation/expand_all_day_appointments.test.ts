import { describe, expect, it } from '@jest/globals';

import { expandAllDayAppointments } from './expand_all_day_appointments';

describe('expandAllDayAppointments', () => {
  it('should correct dates of all day appointment', () => {
    expect(expandAllDayAppointments([{
      startDate: new Date(2021, 9, 8, 1),
      endDate: new Date(2021, 9, 9, 2),
      allDay: true,
    }] as any, 0)).toEqual([{
      allDay: true,
      startDate: new Date(2021, 9, 8).getTime(),
      endDate: new Date(2021, 9, 10).getTime(),
      duration: 48 * 3600_000,
    }]);
  });

  it('should correct dates of 24 hours all day appointment', () => {
    expect(expandAllDayAppointments([{
      startDate: new Date(2021, 9, 8),
      endDate: new Date(2021, 9, 9),
      allDay: true,
    }] as any, 0)).toEqual([{
      allDay: true,
      startDate: new Date(2021, 9, 8).getTime(),
      endDate: new Date(2021, 9, 9).getTime(),
      duration: 24 * 3600_000,
    }]);
  });

  it('should correct dates of all day appointment with offset', () => {
    expect(expandAllDayAppointments([{
      startDate: new Date(2021, 9, 8, 1),
      endDate: new Date(2021, 9, 9, 2),
      allDay: true,
    }] as any, 60_000)).toEqual([{
      allDay: true,
      startDate: new Date(2021, 9, 8).getTime() + 60_000,
      endDate: new Date(2021, 9, 10).getTime() + 60_000,
      duration: 48 * 3600_000,
    }]);
  });
});
