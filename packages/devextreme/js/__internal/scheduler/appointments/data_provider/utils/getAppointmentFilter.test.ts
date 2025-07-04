import {
  describe, expect, it,
} from '@jest/globals';

import { createTimeZoneCalculator } from '../../../r1/timezone_calculator';
import { ResourceLoader } from '../../../utils/loader/resource_loader';
import { getAppointmentFilter } from './getAppointmentFilter';

const minDay = 10;
const maxDay = 20;
const startDayHour = 10;
const endDayHour = 20;
const viewportOptions = {
  startDayHour,
  endDayHour,
  min: new Date(2000, 0, minDay, startDayHour),
  max: new Date(2000, 0, maxDay, endDayHour),
  isTimeDateView: true,
  viewOffset: 600,
  resources: [],
  firstDayOfWeek: 3,
  allDayPanelMode: 'all' as any,
};
const correctAppointment = {
  startDate: new Date(2000, 0, 15, 10),
  endDate: new Date(2000, 0, 15, 11),
  hasRecurrenceRule: false,
  allDay: false,
  visible: true,
  rawAppointment: {
    startDate: new Date(2000, 0, 15, 10),
    endDate: new Date(2000, 0, 15, 11),
  },
};
const correctAllDayAppointment = {
  startDate: new Date(2000, 0, 15, 10),
  endDate: new Date(2000, 0, 15, 11),
  hasRecurrenceRule: false,
  allDay: true,
  visible: true,
  rawAppointment: {
    startDate: new Date(2000, 0, 15, 10),
    endDate: new Date(2000, 0, 15, 11),
  },
};
const correctSeveralDaysAppointment = {
  startDate: new Date(2000, 0, 15, 10),
  endDate: new Date(2000, 0, 16, 11),
  hasRecurrenceRule: false,
  allDay: false,
  visible: true,
  rawAppointment: {
    startDate: new Date(2000, 0, 15, 10),
    endDate: new Date(2000, 0, 16, 11),
  },
};
const correctRecurrenceAppointment = {
  startDate: new Date(2000, 0, 1, 10),
  endDate: new Date(2000, 0, 1, 11),
  recurrenceRule: 'FREQ=DAILY',
  hasRecurrenceRule: true,
  allDay: false,
  visible: true,
  rawAppointment: {
    startDate: new Date(2000, 0, 1, 10),
    endDate: new Date(2000, 0, 1, 11),
    recurrenceRule: 'FREQ=DAILY',
  },
};
const mockTimeZoneCalculator = createTimeZoneCalculator(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);
const assignee = new ResourceLoader({
  fieldExpr: 'assigneeId',
  allowMultiple: true,
  dataSource: [{ id: 2 }],
});
const yearMs = new Date(2001, 0).getTime() - new Date(2000, 0).getTime();

describe('getAppointmentFilter', () => {
  it('should pass correct appointment', () => {
    expect(getAppointmentFilter(
      viewportOptions,
      mockTimeZoneCalculator,
    )(correctAppointment)).toBe(true);
  });

  it('should pass correct all day appointment', () => {
    expect(getAppointmentFilter(
      viewportOptions,
      mockTimeZoneCalculator,
    )(correctAllDayAppointment)).toBe(true);
  });

  it('should pass correct all day appointment with zero duration in day view', () => {
    expect(getAppointmentFilter(
      {
        ...viewportOptions,
        viewOffset: 0,
        min: new Date(2000, 0, 15, startDayHour),
        max: new Date(2000, 0, 15, endDayHour),
      },
      mockTimeZoneCalculator,
    )({
      ...correctAllDayAppointment,
      startDate: new Date(2000, 0, 15),
      endDate: new Date(2000, 0, 15),
    })).toBe(true);
  });

  it('should pass correct all day appointment with zero hours', () => {
    expect(getAppointmentFilter(
      {
        ...viewportOptions,
        viewOffset: 0,
        min: new Date(2000, 0, 16, startDayHour),
        max: new Date(2000, 0, 16, endDayHour),
      },
      mockTimeZoneCalculator,
    )({
      ...correctAllDayAppointment,
      startDate: new Date(2000, 0, 15),
      endDate: new Date(2000, 0, 16),
    })).toBe(true);
  });

  it('should pass correct several days appointment', () => {
    expect(getAppointmentFilter(
      viewportOptions,
      mockTimeZoneCalculator,
    )(correctSeveralDaysAppointment)).toBe(true);
  });

  it('should pass correct recurrence appointment', () => {
    expect(getAppointmentFilter(
      viewportOptions,
      mockTimeZoneCalculator,
    )(correctRecurrenceAppointment)).toBe(true);
  });

  it('should filter out invisible appointments', () => {
    expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
      visible: false,
    } as any)).toBe(false);
  });

  it.each([
    { title: 'allDay mode', allDayPanelMode: 'allDay', appointment: { allDay: true } },
    { title: 'allDay appointment', allDayPanelMode: 'all', appointment: { allDay: true } },
    {
      title: 'one day duration appointment',
      allDayPanelMode: 'all',
      appointment: {
        allDay: false,
        startDate: new Date(2000, 0, 1),
        endDate: new Date(2000, 1, 2),
      },
    },
  ] as const)('should filter out hidden all day appointments ($title)', ({ allDayPanelMode, appointment }) => {
    expect(getAppointmentFilter({
      ...viewportOptions,
      allDay: false,
      allDayPanelMode,
    }, mockTimeZoneCalculator)(appointment as any)).toBe(false);
  });

  it('should filter out all day resource incorrect appointment (hidden mode)', () => {
    expect(getAppointmentFilter({
      ...viewportOptions,
      resources: [assignee],
      allDay: false,
      allDayPanelMode: 'hidden',
    }, mockTimeZoneCalculator)(correctAllDayAppointment)).toBe(false);
  });

  it('should filter out resource incorrect appointment', () => {
    expect(getAppointmentFilter({
      ...viewportOptions,
      resources: [assignee],
    }, mockTimeZoneCalculator)(correctAppointment)).toBe(false);
  });

  describe.each([
    {
      title: 'all day', allDay: true, isTimeDateView: true, result: true,
    },
    {
      title: 'month view', allDay: false, isTimeDateView: false, result: true,
    },
    {
      title: 'day view', allDay: false, isTimeDateView: true, result: false,
    },
  ])('$title', ({
    title, allDay, isTimeDateView, result,
  }) => {
    it(`should filter out ${title} recurrence appointment`, () => {
      expect(getAppointmentFilter({
        ...viewportOptions,
        min: new Date(2000, 0, maxDay, startDayHour),
        max: new Date(2000, 0, maxDay, endDayHour),
        isTimeDateView,
      }, mockTimeZoneCalculator)({
        ...correctRecurrenceAppointment,
        recurrenceRule: 'FREQ=DAILY',
        startDate: new Date(2000, 0, 1, endDayHour + 1),
        endDate: new Date(2000, 0, 1, endDayHour + 2),
        allDay,
      })).toBe(result);
    });

    it(`should filter out ${title} appointment`, () => {
      expect(getAppointmentFilter({
        ...viewportOptions,
        min: new Date(2000, 0, maxDay, startDayHour),
        max: new Date(2000, 0, maxDay, endDayHour),
        isTimeDateView,
      }, mockTimeZoneCalculator)({
        ...correctAppointment,
        startDate: new Date(2000, 0, maxDay, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay, endDayHour + 2),
        allDay,
      })).toBe(result);
    });
  });

  describe.each([
    { title: 'single appointment', appointmentConfig: {}, dayShift: 0 },
    {
      title: 'recurrence appointment (occurrence)',
      appointmentConfig: {
        recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
      },
      dayShift: -30,
    },
  ])('$title', ({ appointmentConfig, dayShift }) => {
    it('should compare tiny appointment on one day view', () => {
      expect(getAppointmentFilter({
        ...viewportOptions,
        min: new Date(2000, 0, maxDay),
        max: new Date(2000, 0, maxDay),
        isTimeDateView: true,
      }, mockTimeZoneCalculator)({
        ...appointmentConfig,
        startDate: new Date(2000, 0, maxDay + dayShift, startDayHour + 1),
        endDate: new Date(2000, 0, maxDay + dayShift, endDayHour - 1),
        allDay: false,
      } as any)).toBe(true);
    });

    it('should compare tiny appointment starts and ends inside the gap', () => {
      expect(getAppointmentFilter(
        viewportOptions,
        mockTimeZoneCalculator,
      )({
        ...appointmentConfig,
        startDate: new Date(2000, 0, minDay + 1 + dayShift, endDayHour + 1),
        endDate: new Date(2000, 0, minDay + 2 + dayShift, startDayHour - 1),
        allDay: false,
      } as any)).toBe(false);
    });

    it('should compare tiny appointment starts and ends inside the gap after (same day)', () => {
      expect(getAppointmentFilter(
        viewportOptions,
        mockTimeZoneCalculator,
      )({
        ...appointmentConfig,
        startDate: new Date(2000, 0, minDay + 1 + dayShift, endDayHour + 1),
        endDate: new Date(2000, 0, minDay + 1 + dayShift, endDayHour + 2),
        allDay: false,
      } as any)).toBe(false);
    });

    it('should compare tiny appointment starts and ends inside the gap before (same day)', () => {
      expect(getAppointmentFilter(
        viewportOptions,
        mockTimeZoneCalculator,

      )({
        ...appointmentConfig,
        startDate: new Date(2000, 0, minDay + 1 + dayShift, startDayHour - 2),
        endDate: new Date(2000, 0, minDay + 1 + dayShift, startDayHour - 1),
        allDay: false,
      } as any)).toBe(false);
    });

    it.each([
      { title: '0. all day appointment', allDay: true },
      { title: '0. several days appointment', allDay: false },
    ])('should compare $title starts and ends inside the gap', ({ allDay }) => {
      expect(getAppointmentFilter(
        viewportOptions,
        mockTimeZoneCalculator,
      )({
        ...appointmentConfig,
        startDate: new Date(2000, 0, minDay + 1 + dayShift, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay + 3 + dayShift, startDayHour - 1),
        allDay,
      } as any)).toBe(true);
    });

    describe.each([
      {
        title: '1. all day appointment',
        appointment: {
          ...appointmentConfig,
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: true,
        },
        isTimeDateView: true,
        ignoreHours: true,
      },
      {
        title: '1. several days appointment',
        appointment: {
          ...appointmentConfig,
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        },
        isTimeDateView: true,
        ignoreHours: false,
      },
      {
        title: '1. tiny appointment',
        appointment: {
          ...appointmentConfig,
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 15, 11),
          allDay: false,
        },
        isTimeDateView: true,
        ignoreHours: false,
      },
      {
        title: '1. tiny appointment in month view',
        appointment: {
          ...appointmentConfig,
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 15, 11),
          allDay: false,
        } as any,
        isTimeDateView: false,
        ignoreHours: true,
      },
    ])('$title', ({
      appointment, isTimeDateView, ignoreHours,
    }) => {
      const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

      it('should compare appointment less then start', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(appointment.startDate.getTime() - yearMs),
          endDate: new Date(appointment.endDate.getTime() - yearMs),
        })).toBe(false);
      });

      it('should compare appointment greater then end', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(appointment.startDate.getTime() + yearMs),
          endDate: new Date(appointment.endDate.getTime() + yearMs),
        })).toBe(false);
      });

      it('should compare appointment between start and date', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay + dayShift, startDayHour + 1),
          endDate: new Date(2000, 0, minDay + daysDuration + dayShift, startDayHour + 1, 30),
        })).toBe(true);
      });

      it('should compare appointment ends in start date (same day)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 1),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour + 1, 30),
        })).toBe(true);
      });

      it('should compare appointment starts in end date (same day)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour - 1, 30),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 1),
        })).toBe(true);
      });

      it('should compare appointment ends in start date (same hours)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 1),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour, 30),
        })).toBe(true);
      });

      it('should compare appointment starts in end date (same hours)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          endDayHour: endDayHour + 0.5,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 1),
        })).toBe(true);
      });

      it('should compare appointment ends in start date (out of hours)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          allDayPanelMode: 'allDay',
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 2),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour - 1),
        })).toBe(ignoreHours);
      });

      it('should compare appointment starts in end date (out of hours)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          allDayPanelMode: 'allDay',
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour + 1),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 2),
        })).toBe(ignoreHours);
      });

      it('should compare appointment ends in start date (same hours, out of minutes)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          startDayHour: startDayHour + 0.5,
          allDayPanelMode: 'allDay',
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 1),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour, 10),
        })).toBe(ignoreHours);
      });

      it('should compare appointment starts in end date (same hours, out of minutes)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          allDayPanelMode: 'allDay',
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 1),
        })).toBe(ignoreHours);
      });
    });

    describe.each([
      {
        title: '2. all day appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: true,
        },
        isTimeDateView: true,
      },
      {
        title: '2. several days appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
        isTimeDateView: true,
      },
      {
        title: '2. several days appointment in month view',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
        isTimeDateView: false,
      },
    ])('$title', ({
      appointment, isTimeDateView,
    }) => {
      it('should compare appointment starts and ends outside the view', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          isTimeDateView,
        }, mockTimeZoneCalculator)({
          ...appointment,
          ...appointmentConfig,
          startDate: new Date(2000, 0, minDay - 1 + dayShift, startDayHour + 1),
          endDate: new Date(2000, 0, maxDay + 1 + dayShift, startDayHour + 2),
        })).toBe(true);
      });
    });
  });
});
