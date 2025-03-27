import { describe, expect, it } from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointmentDataAcessor.mock';

import { replaceWrongEndDate } from './m_utils';

describe('replaceWrongEndDate', () => {
  it('should process endDate correctly', () => {
    [
      {
        data: {
          startDate: new Date(2019, 4, 3, 12),
          allDay: false,
        },
        expectedEndDate: new Date(2019, 4, 3, 12, 30),
      },
      {
        data: {
          startDate: new Date(2019, 4, 3, 12),
          allDay: false,
          endDate: new Date('string'),
        },
        expectedEndDate: new Date(2019, 4, 3, 12, 30),
      },
      {
        data: {
          startDate: new Date(2019, 4, 3, 12),
          allDay: true,
        },
        expectedEndDate: new Date(2019, 4, 3, 23, 59),
      },
    ].forEach((item) => {
      replaceWrongEndDate(
        item.data,
        new Date(2019, 4, 3, 12),
        item.data.endDate,
        30,
        mockAppointmentDataAccessor,
      );

      expect((item.data.endDate as Date).getHours()).toBe(item.expectedEndDate.getHours());
      expect((item.data.endDate as Date).getMinutes()).toBe(item.expectedEndDate.getMinutes());
    });
  });
});
