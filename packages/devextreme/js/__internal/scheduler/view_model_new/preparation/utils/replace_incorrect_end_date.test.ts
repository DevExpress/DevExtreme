import { describe, expect, it } from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';

import { replaceIncorrectEndDate } from './replace_incorrect_end_date';

describe('replaceIncorrectEndDate', () => {
  it('should process endDate correctly', () => {
    const items = [
      {
        startDate: new Date(2019, 4, 3, 12),
        allDay: false,
      },
      {
        startDate: new Date(2019, 4, 3, 12),
        allDay: false,
        endDate: new Date('string'),
      },
      {
        startDate: new Date(2019, 4, 3, 12),
        allDay: true,
      },
      {
        startDate: new Date(2019, 4, 3, 12),
        endDate: new Date(2019, 4, 3, 13),
      },
    ];
    const expectedEndDates = [
      new Date(2019, 4, 3, 12, 30),
      new Date(2019, 4, 3, 12, 30),
      new Date(2019, 4, 3, 23, 59, 59, 999),
    ];

    expect(replaceIncorrectEndDate(
      items,
      30,
      mockAppointmentDataAccessor,
    )).toEqual([
      { ...items[0], endDate: expectedEndDates[0] },
      { ...items[1], endDate: expectedEndDates[1] },
      { ...items[2], endDate: expectedEndDates[2] },
      items[3],
    ]);
  });

  it('should return false for incorrect startDate', () => {
    const items = [
      {},
      { startDate: 'Invalid date format' },
    ];

    expect(replaceIncorrectEndDate(
      items,
      30,
      mockAppointmentDataAccessor,
    )).toEqual([]);
  });
});
