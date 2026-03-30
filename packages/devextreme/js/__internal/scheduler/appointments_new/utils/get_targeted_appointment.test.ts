import {
  describe, expect, it,
} from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';
import { getResourceManagerMock } from '@ts/scheduler/__mock__/resource_manager.mock';

import { getTargetedAppointment } from './get_targeted_appointment';

const appointment = {
  startDate: new Date(200, 0, 0),
  endDate: new Date(200, 0, 1),
};

const recurringAppointment = {
  ...appointment,
  recurrenceRule: 'FREQ=DAILY',
};

const info = {
  sourceAppointment: {
    startDate: new Date(200, 0, 5),
    endDate: new Date(200, 0, 6),
  },
  appointment: {
    startDate: new Date(200, 0, 5, 10),
    endDate: new Date(200, 0, 6, 11),
  },
};

describe('getTargetedAppointment', () => {
  it('should return grid item targeted appointment', () => {
    expect(getTargetedAppointment(
      {
        itemData: recurringAppointment,
        info,
        groupIndex: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      mockAppointmentDataAccessor,
      getResourceManagerMock([]),
    )).toEqual({
      ...recurringAppointment,
      startDate: new Date(200, 0, 5),
      endDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 10),
      displayEndDate: new Date(200, 0, 6, 11),
    });
  });

  it('should return grid item targeted appointment with resources', async () => {
    const resourceManager = getResourceManagerMock();
    await resourceManager.loadGroupResources(['roomId', 'assigneeId']);

    expect(getTargetedAppointment(
      {
        itemData: recurringAppointment,
        info,
        groupIndex: 5, // 0,1; 0,2; 0,3; 0,4; 1,1; 1,2; <- 5
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      mockAppointmentDataAccessor,
      resourceManager,
    )).toEqual({
      ...recurringAppointment,
      assigneeId: [2],
      roomId: 1,
      startDate: new Date(200, 0, 5),
      endDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 10),
      displayEndDate: new Date(200, 0, 6, 11),
    });
  });

  it('should return agenda item targeted partial dates', () => {
    expect(getTargetedAppointment(
      {
        isAgendaModel: true,
        itemData: recurringAppointment,
        info: {
          ...info,
          partialDates: {
            startDate: new Date(200, 0, 5, 3),
            endDate: new Date(200, 0, 7),
          },
        },
        groupIndex: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      mockAppointmentDataAccessor,
      getResourceManagerMock([]),
    )).toEqual({
      ...recurringAppointment,
      startDate: new Date(200, 0, 5),
      endDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 3),
      displayEndDate: new Date(200, 0, 7),
    });
  });

  it('should return agenda item targeted partial dates with resources', async () => {
    const resourceManager = getResourceManagerMock();
    await resourceManager.loadGroupResources(['roomId', 'assigneeId']);

    expect(getTargetedAppointment(
      {
        isAgendaModel: true,
        itemData: appointment,
        info: {
          ...info,
          partialDates: {
            startDate: new Date(200, 0, 5, 3),
            endDate: new Date(200, 0, 7),
          },
        },
        groupIndex: 3, // 0,1; 0,2; 0,3; 0,4; <- 3
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      mockAppointmentDataAccessor,
      resourceManager,
    )).toEqual({
      ...appointment,
      assigneeId: [4],
      roomId: 0,
      startDate: new Date(200, 0, 5),
      endDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 3),
      displayEndDate: new Date(200, 0, 7),
    });
  });
});
