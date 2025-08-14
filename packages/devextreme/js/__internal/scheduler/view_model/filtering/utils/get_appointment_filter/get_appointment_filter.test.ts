import {
  describe, expect, it,
} from '@jest/globals';

import { createTimeZoneCalculator } from '../../../../r1/timezone_calculator';
import { ResourceLoader } from '../../../../utils/loader/resource_loader';
import { getVisibleDateTimeIntervals } from '../../../../view_model_new/utils/get_visible_date_time_intervals';
import type { FilterOptions } from '../type';
import { getAppointmentFilter } from './get_appointment_filter';

const minDay = 10;
const maxDay = 20;
const startDayHour = 10;
const endDayHour = 20;
const compareOptions = {
  startDayHour,
  endDayHour,
  min: new Date(2000, 0, minDay, startDayHour),
  max: new Date(2000, 0, maxDay, endDayHour),
};
const viewportOptions = {
  ...compareOptions,
  resources: [],
  viewOffset: 0,
  firstDayOfWeek: 3,
  allDayPanelMode: 'all' as any,
  supportAllDayRow: true,
  visibleDateIntervals: getVisibleDateTimeIntervals(compareOptions, true),
  visibleTimeIntervals: getVisibleDateTimeIntervals(compareOptions, false),
};
const getViewportOptions = (options: Partial<FilterOptions>): FilterOptions => ({
  ...viewportOptions,
  ...options,
  visibleDateIntervals: getVisibleDateTimeIntervals({
    ...compareOptions,
    ...options,
  }, true),
  visibleTimeIntervals: getVisibleDateTimeIntervals({
    ...compareOptions,
    ...options,
  }, false),
});
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
  ...correctAppointment,
  allDay: true,
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
  it('should pass long appointment ends before start day hour', () => {
    expect(getAppointmentFilter(
      getViewportOptions({ startDayHour: 10, endDayHour: 20 }),
      mockTimeZoneCalculator,
    )({
      ...correctAppointment,
      startDate: new Date(2000, 0, minDay - 1, 4),
      endDate: new Date(2000, 0, minDay, 8),
    })).toBe(true);
  });

  it('should filter out appointment for zero hours duration', () => {
    expect(getAppointmentFilter(
      getViewportOptions({ startDayHour: 20, endDayHour: 10 }),
      mockTimeZoneCalculator,
    )(correctAppointment)).toBe(false);
  });

  it('should ignore zero hours duration for all day appointment', () => {
    expect(getAppointmentFilter(
      getViewportOptions({ startDayHour: 20, endDayHour: 10 }),
      mockTimeZoneCalculator,
    )(correctAllDayAppointment)).toBe(true);
  });

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
      getViewportOptions({
        min: new Date(2000, 0, 15, startDayHour),
        max: new Date(2000, 0, 15, endDayHour),
      }),
      mockTimeZoneCalculator,
    )({
      ...correctAllDayAppointment,
      startDate: new Date(2000, 0, 15),
      endDate: new Date(2000, 0, 15),
    })).toBe(true);
  });

  it('should pass correct all day appointment with zero hours', () => {
    expect(getAppointmentFilter(
      getViewportOptions({
        min: new Date(2000, 0, 16, startDayHour),
        max: new Date(2000, 0, 16, endDayHour),
      }),
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

  describe.each([true, false])('allDayPanelFilter: %s', (allDayPanelFilter) => {
    it(`should filter all day appointment with allDayPanelFilter=${allDayPanelFilter}`, () => {
      expect(getAppointmentFilter(
        getViewportOptions({ allDayPanelFilter }),
        mockTimeZoneCalculator,
      )(correctAllDayAppointment)).toBe(allDayPanelFilter);
    });

    it(`should filter long appointment with allDayPanelFilter=${allDayPanelFilter}`, () => {
      expect(getAppointmentFilter(
        getViewportOptions({ allDayPanelFilter }),
        mockTimeZoneCalculator,
      )(correctSeveralDaysAppointment)).toBe(allDayPanelFilter);
    });

    it(`should filter appointment with allDayPanelFilter=${allDayPanelFilter}`, () => {
      expect(getAppointmentFilter(
        getViewportOptions({ allDayPanelFilter }),
        mockTimeZoneCalculator,
      )(correctAppointment)).toBe(!allDayPanelFilter);
    });
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
      allDayPanelFilter: false,
      allDayPanelMode,
    }, mockTimeZoneCalculator)(appointment as any)).toBe(false);
  });

  it('should filter out all day resource incorrect appointment (hidden mode)', () => {
    expect(getAppointmentFilter({
      ...viewportOptions,
      resources: [assignee],
      allDayPanelFilter: false,
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
      title: 'all day', allDay: true, result: true,
    },
    {
      title: 'month view', allDay: false, result: false,
    },
    {
      title: 'day view', allDay: false, result: false,
    },
  ])('$title', ({
    title, allDay, result,
  }) => {
    it(`should filter out ${title} recurrence appointment`, () => {
      expect(getAppointmentFilter(getViewportOptions({
        min: new Date(2000, 0, maxDay, startDayHour),
        max: new Date(2000, 0, maxDay, endDayHour),
      }), mockTimeZoneCalculator)({
        ...correctRecurrenceAppointment,
        recurrenceRule: 'FREQ=DAILY',
        startDate: new Date(2000, 0, 1, endDayHour + 1),
        endDate: new Date(2000, 0, 1, endDayHour + 2),
        allDay,
      })).toBe(result);
    });

    it(`should filter out ${title} appointment`, () => {
      expect(getAppointmentFilter(getViewportOptions({
        min: new Date(2000, 0, maxDay, startDayHour),
        max: new Date(2000, 0, maxDay, endDayHour),
      }), mockTimeZoneCalculator)({
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
      expect(getAppointmentFilter(getViewportOptions({
        min: new Date(2000, 0, maxDay),
        max: new Date(2000, 0, maxDay),
      }), mockTimeZoneCalculator)({
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
        ignoreHours: false,
      },
    ])('$title', ({
      appointment, ignoreHours,
    }) => {
      const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

      it('should compare appointment less then start', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(appointment.startDate.getTime() - yearMs),
          endDate: new Date(appointment.endDate.getTime() - yearMs),
        })).toBe(false);
      });

      it('should compare appointment greater then end', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(appointment.startDate.getTime() + yearMs),
          endDate: new Date(appointment.endDate.getTime() + yearMs),
        })).toBe(false);
      });

      it('should compare appointment between start and date', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay + dayShift, startDayHour + 1),
          endDate: new Date(2000, 0, minDay + daysDuration + dayShift, startDayHour + 1, 30),
        })).toBe(true);
      });

      it('should compare appointment ends in start date (same day)', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 1),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour + 1, 30),
        })).toBe(true);
      });

      it('should compare appointment starts in end date (same day)', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour - 1, 30),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 1),
        })).toBe(true);
      });

      it('should compare appointment ends in start date (same hours)', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 1),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour, 30),
        })).toBe(true);
      });

      it('should compare appointment starts in end date (same hours)', () => {
        expect(getAppointmentFilter(getViewportOptions({
          endDayHour: endDayHour + 0.5,
        }), mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 1),
        })).toBe(true);
      });

      it('should compare appointment ends in start date (out of hours)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          allDayPanelMode: 'allDay',
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
        }, mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, maxDay + dayShift, endDayHour + 1),
          endDate: new Date(2000, 0, maxDay + daysDuration + dayShift, endDayHour + 2),
        })).toBe(ignoreHours);
      });

      it('should compare appointment ends in start date (same hours, out of minutes)', () => {
        expect(getAppointmentFilter(getViewportOptions({
          startDayHour: startDayHour + 0.5,
          allDayPanelMode: 'allDay',
        }), mockTimeZoneCalculator)({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration + dayShift, startDayHour - 1),
          endDate: new Date(2000, 0, minDay + dayShift, startDayHour, 10),
        })).toBe(ignoreHours);
      });

      it('should compare appointment starts in end date (same hours, out of minutes)', () => {
        expect(getAppointmentFilter({
          ...viewportOptions,
          allDayPanelMode: 'allDay',
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
      },
      {
        title: '2. several days appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
      },
      {
        title: '2. several days appointment in month view',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
      },
    ])('$title', ({
      appointment,
    }) => {
      it('should compare appointment starts and ends outside the view', () => {
        expect(getAppointmentFilter(viewportOptions, mockTimeZoneCalculator)({
          ...appointment,
          ...appointmentConfig,
          startDate: new Date(2000, 0, minDay - 1 + dayShift, startDayHour + 1),
          endDate: new Date(2000, 0, maxDay + 1 + dayShift, startDayHour + 2),
        })).toBe(true);
      });
    });
  });
});
