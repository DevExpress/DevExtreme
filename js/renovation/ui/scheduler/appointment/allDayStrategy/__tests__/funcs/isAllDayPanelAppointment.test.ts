import * as utilsModule from '../../utils';
import isAllDayPanelAppointment from '../../funcs/isAllDayPanelAppointment';
import { EAllDayAppointmentStrategy } from '../../types';

describe('allDayStrategy functions: isAllDayPanelAppointment', () => {
  it('should return true if this is allDay appointment', () => {
    const expectedResult = true;
    const startDate = new Date(Date.UTC(2022, 1, 1, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 1, 14, 0, 0));
    const allDay = true;
    const strategy = EAllDayAppointmentStrategy.withoutAllDayAppointments;

    jest.spyOn(utilsModule, 'isAppointmentDurationAllDay').mockReturnValue(false);

    const result = isAllDayPanelAppointment(
      {
        startDate,
        endDate,
        allDay,
      },
      9,
      19,
      strategy,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return false if this is not allDay appointment'
    + ' and strategy not allLongAppointment', () => {
    const expectedResult = false;
    const startDate = new Date(Date.UTC(2022, 1, 1, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 1, 14, 0, 0));
    const allDay = false;
    const strategy = EAllDayAppointmentStrategy.separate;

    jest.spyOn(utilsModule, 'isAppointmentDurationAllDay').mockReturnValue(false);

    const result = isAllDayPanelAppointment(
      {
        startDate,
        endDate,
        allDay,
      },
      9,
      19,
      strategy,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return false if this is not allDay appointment,'
    + ' strategy is allLongAppointment, but end date not defined', () => {
    const expectedResult = false;
    const startDate = new Date(Date.UTC(2022, 1, 1, 10, 0, 0));
    const endDate = undefined;
    const allDay = false;
    const strategy = EAllDayAppointmentStrategy.allLongAppointment;

    jest.spyOn(utilsModule, 'isAppointmentDurationAllDay').mockReturnValue(false);

    const result = isAllDayPanelAppointment(
      {
        startDate,
        endDate,
        allDay,
      },
      9,
      19,
      strategy,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return result of the isAppointmentDurationAllDay utils func,'
    + ' if this is not allDay appointment, strategy is isAppointmentDurationAllDay', () => {
    const expectedResult = true;
    const startDate = new Date(Date.UTC(2022, 1, 1, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 1, 14, 0, 0));
    const allDay = false;
    const strategy = EAllDayAppointmentStrategy.allLongAppointment;

    jest.spyOn(utilsModule, 'isAppointmentDurationAllDay').mockReturnValue(expectedResult);

    const result = isAllDayPanelAppointment(
      {
        startDate,
        endDate,
        allDay,
      },
      9,
      19,
      strategy,
      false,
    );

    expect(result).toEqual(expectedResult);
  });
});
