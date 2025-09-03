/**
 * @timezone Europe/Belgrade
 */

import {
  describe, expect, it,
} from '@jest/globals';
import { getResourceManagerMock } from '@ts/scheduler/__mock__/resource_manager.mock';

import { mockUppercaseFieldExpressions } from '../__mock__/appointment_data_accessor.mock';
import { createTimeZoneCalculator } from '../r1/timezone_calculator/utils';
import { AppointmentDataAccessor } from './data_accessor/appointment_data_accessor';
import { getTargetedAppointment } from './get_targeted_appointment';

const dataAccessor = new AppointmentDataAccessor(mockUppercaseFieldExpressions, true);
const timeZoneCalculator = createTimeZoneCalculator('America/Los_Angeles');
const appointment: any = {
  StartDate: new Date(200, 0, 0),
  EndDate: new Date(200, 0, 1),
};
const appointmentRecurrence: any = {
  ...appointment,
  RecurrenceRule: 'FREQ=DAILY',
};
const getInfo = () => ({
  sourceAppointment: {
    startDate: new Date(200, 0, 5),
    endDate: new Date(200, 0, 6),
  },
  appointment: {
    startDate: new Date(200, 0, 5, 10),
    endDate: new Date(200, 0, 6, 11),
  },
});

describe('getTargetedAppointment', () => {
  it('should return collector targeted appointment', () => {
    expect(getTargetedAppointment(
      appointment,
      {} as any,
      dataAccessor,
      timeZoneCalculator,
      getResourceManagerMock(),
    )).toEqual({
      ...appointment,
      displayStartDate: new Date(200, 0, 0),
      displayEndDate: new Date(200, 0, 1),
    });
  });

  it('should return grid item targeted appointment', () => {
    expect(getTargetedAppointment(
      appointmentRecurrence,
      {
        info: getInfo(),
        groupIndex: 0,
      } as any,
      dataAccessor,
      timeZoneCalculator,
      getResourceManagerMock(),
    )).toEqual({
      ...appointmentRecurrence,
      StartDate: new Date(200, 0, 5),
      EndDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 10),
      displayEndDate: new Date(200, 0, 6, 11),
    });
  });

  it('should return grid item targeted appointment with resources', async () => {
    const resourceManager = getResourceManagerMock();
    await resourceManager.loadGroupResources(['roomId', 'assigneeId']);
    expect(getTargetedAppointment(
      appointmentRecurrence,
      {
        info: getInfo(),
        groupIndex: 5, // 0,1; 0,2; 0,3; 0,4; 1,1; 1,2; <- 5
      } as any,
      dataAccessor,
      timeZoneCalculator,
      resourceManager,
    )).toEqual({
      ...appointmentRecurrence,
      assigneeId: [2],
      roomId: 1,
      StartDate: new Date(200, 0, 5),
      EndDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 10),
      displayEndDate: new Date(200, 0, 6, 11),
    });
  });

  it('should return agenda item targeted recurrence appointment', () => {
    expect(getTargetedAppointment(
      appointmentRecurrence,
      {
        isAgendaModel: true,
        info: getInfo(),
        groupIndex: 0,
      } as any,
      dataAccessor,
      timeZoneCalculator,
      getResourceManagerMock(),
    )).toEqual({
      ...appointmentRecurrence,
      StartDate: new Date(200, 0, 5),
      EndDate: new Date(200, 0, 6),
      displayStartDate: new Date(200, 0, 5, 10),
      displayEndDate: new Date(200, 0, 6, 11),
    });
  });

  it('should return agenda item targeted full appointment', () => {
    expect(getTargetedAppointment(
      appointment,
      {
        isAgendaModel: true,
        info: getInfo(),
        groupIndex: 0,
      } as any,
      dataAccessor,
      timeZoneCalculator,
      getResourceManagerMock(),
    )).toEqual({
      ...appointment,
      displayStartDate: appointment.StartDate,
      displayEndDate: appointment.EndDate,
    });
  });

  it('should return agenda item targeted full appointment with resources', async () => {
    const resourceManager = getResourceManagerMock();
    await resourceManager.loadGroupResources(['roomId', 'assigneeId']);
    expect(getTargetedAppointment(
      appointment,
      {
        isAgendaModel: true,
        info: getInfo(),
        groupIndex: 3, // 0,1; 0,2; 0,3; 0,4; <- 3
      } as any,
      dataAccessor,
      timeZoneCalculator,
      resourceManager,
    )).toEqual({
      ...appointment,
      assigneeId: [4],
      roomId: 0,
      displayStartDate: appointment.StartDate,
      displayEndDate: appointment.EndDate,
    });
  });
});
