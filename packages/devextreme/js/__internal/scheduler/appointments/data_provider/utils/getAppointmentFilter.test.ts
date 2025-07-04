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

  describe('single appointment', () => {
    it('should compare tiny appointment on one day view', () => {
      expect(getAppointmentFilter({
        ...viewportOptions,
        min: new Date(2000, 0, maxDay),
        max: new Date(2000, 0, maxDay),
        isTimeDateView: true,
      }, mockTimeZoneCalculator)({
        startDate: new Date(2000, 0, maxDay, startDayHour + 1),
        endDate: new Date(2000, 0, maxDay, endDayHour - 1),
        allDay: false,
      } as any)).toBe(true);
    });

    it('should compare tiny appointment starts and ends inside the gap', () => {
      expect(getAppointmentFilter({
        startDate: new Date(2000, 0, minDay + 1, endDayHour + 1),
        endDate: new Date(2000, 0, minDay + 2, startDayHour - 1),
        allDay: false,
      } as any, viewportOptions)).toBe(false);
    });

    it('should compare tiny appointment starts and ends inside the gap after (same day)', () => {
      expect(getAppointmentFilter({
        startDate: new Date(2000, 0, minDay + 1, endDayHour + 1),
        endDate: new Date(2000, 0, minDay + 1, endDayHour + 2),
        allDay: false,
      } as any, viewportOptions)).toBe(false);
    });

    it('should compare tiny appointment starts and ends inside the gap before (same day)', () => {
      expect(getAppointmentFilter({
        startDate: new Date(2000, 0, minDay + 1, startDayHour - 2),
        endDate: new Date(2000, 0, minDay + 1, startDayHour - 1),
        allDay: false,
      } as any, viewportOptions)).toBe(false);
    });

    it.each([
      { title: 'all day appointment', allDay: true },
      { title: 'several days appointment', allDay: false },
    ])('should compare $title starts and ends inside the gap', ({ allDay }) => {
      expect(getAppointmentFilter({
        startDate: new Date(2000, 0, minDay + 1, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay + 3, startDayHour - 1),
        allDay,
      } as any, { ...viewportOptions, isOnlyDateCheck: allDay })).toBe(true);
    });

    describe.each([
      {
        title: 'all day appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: true,
        },
        isTimeDateView: true,
        ignoreHours: true,
      },
      {
        title: 'several days appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        },
        isTimeDateView: true,
        ignoreHours: false,
      },
      {
        title: 'tiny appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 15, 11),
          allDay: false,
        },
        isTimeDateView: true,
        ignoreHours: false,
      },
      {
        title: 'tiny appointment in month view',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 15, 11),
          allDay: false,
        } as any,
        isTimeDateView: false,
        ignoreHours: true,
      },
    ])('$title', ({
      title, appointment, isTimeDateView, ignoreHours,
    }) => {
      const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

      it(`should compare ${title} less then start`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(appointment.startDate.getTime() - yearMs),
          endDate: new Date(appointment.endDate.getTime() - yearMs),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(false);
      });

      it(`should compare ${title} greater then end`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(appointment.startDate.getTime() + yearMs),
          endDate: new Date(appointment.endDate.getTime() + yearMs),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(false);
      });

      it(`should compare ${title} between start and date`, () => {
        expect(getAppointmentFilter(appointment, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(true);
      });

      it(`should compare ${title} ends in start date (same day)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
          endDate: new Date(2000, 0, minDay, startDayHour + 1, 30),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(true);
      });

      it(`should compare ${title} starts in end date (same day)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, maxDay, endDayHour - 1, 30),
          endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(true);
      });

      it(`should compare ${title} ends in start date (same hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
          endDate: new Date(2000, 0, minDay, startDayHour, 30),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(true);
      });

      it(`should compare ${title} starts in end date (same hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, maxDay, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
        }, {
          ...viewportOptions,
          endDayHour: endDayHour + 0.5,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(true);
      });

      it(`should compare ${title} ends in start date (out of hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 2),
          endDate: new Date(2000, 0, minDay, startDayHour - 1),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(ignoreHours);
      });

      it(`should compare ${title} starts in end date (out of hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, maxDay, endDayHour + 1),
          endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 2),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(ignoreHours);
      });

      it(`should compare ${title} ends in start date (same hours, out of minutes)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, minDay - daysDuration, startDayHour - 1),
          endDate: new Date(2000, 0, minDay, startDayHour, 10),
        }, {
          ...viewportOptions,
          startDayHour: startDayHour + 0.5,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(ignoreHours);
      });

      it(`should compare ${title} starts in end date (same hours, out of minutes)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, maxDay, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration, endDayHour + 1),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(ignoreHours);
      });
    });

    describe.each([
      {
        title: 'all day appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: true,
        },
        isTimeDateView: true,
      },
      {
        title: 'several days appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
        isTimeDateView: true,
      },
      {
        title: 'several days appointment in month view',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
        isTimeDateView: false,
      },
    ])('$title', ({
      title, appointment, isTimeDateView,
    }) => {
      it(`should compare ${title} starts and ends outside the view`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          startDate: new Date(2000, 0, minDay - 1, startDayHour + 1),
          endDate: new Date(2000, 0, maxDay + 1, startDayHour + 2),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        })).toBe(true);
      });
    });
  });

  describe('recurrence appointment', () => {
    it('should compare tiny appointment (occurrence) on one day view', () => {
      expect(getAppointmentFilter({
        recurrenceRule: 'FREQ=DAILY',
        startDate: new Date(2000, 0, maxDay - 2, startDayHour + 1),
        endDate: new Date(2000, 0, maxDay - 2, endDayHour - 1),
        allDay: false,
      } as any, {
        ...viewportOptions,
        min: new Date(2000, 0, maxDay),
        max: new Date(2000, 0, maxDay),
      }, mockTimeZoneCalculator)).toBe(false);
    });

    it('should compare tiny appointment (occurrence) starts and ends inside the gap', () => {
      expect(getAppointmentFilter({
        recurrenceRule: 'FREQ=DAILY',
        startDate: new Date(2000, 0, minDay - 2, endDayHour + 1),
        endDate: new Date(2000, 0, minDay - 3, startDayHour - 1),
        allDay: false,
      } as any, viewportOptions, mockTimeZoneCalculator)).toBe(false);
    });

    it.each([
      { title: 'all day appointment', allDay: true },
      { title: 'several days appointment', allDay: false },
    ])('should compare $title starts and ends inside the gap', ({ allDay }) => {
      expect(getAppointmentFilter({
        recurrenceRule: 'FREQ=DAILY',
        startDate: new Date(2000, 0, minDay - 3, endDayHour + 1),
        endDate: new Date(2000, 0, maxDay - 1, startDayHour - 1),
        allDay,
      } as any, { ...viewportOptions, isOnlyDateCheck: allDay }, mockTimeZoneCalculator)).toBe(true);
    });

    describe.each([
      {
        title: 'all day appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: true,
        },
        isTimeDateView: true,
        ignoreHours: true,
      },
      {
        title: 'several days appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        },
        isTimeDateView: true,
        ignoreHours: false,
      },
      {
        title: 'tiny appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 15, 11),
          allDay: false,
        },
        isTimeDateView: true,
        ignoreHours: false,
      },
      {
        title: 'tiny appointment in month view',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 15, 11),
          allDay: false,
        } as any,
        isTimeDateView: false,
        ignoreHours: true,
      },
    ])('1. $title', ({
      title, appointment, isTimeDateView, ignoreHours,
    }) => {
      const daysDuration = appointment.endDate.getDate() - appointment.startDate.getDate();

      it(`should compare ${title} less then start`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;COUNT=10',
          startDate: new Date(appointment.startDate.getTime() - yearMs),
          endDate: new Date(appointment.endDate.getTime() - yearMs),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(false);
      });

      it(`should compare ${title} greater then end`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY',
          startDate: new Date(appointment.startDate.getTime() + yearMs),
          endDate: new Date(appointment.endDate.getTime() + yearMs),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(false);
      });

      it(`should compare ${title} (occurrence) between start and date`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=5;COUNT=2',
          startDate: new Date(2000, 0, minDay - 4, startDayHour + 1),
          endDate: new Date(2000, 0, minDay + daysDuration - 4, startDayHour + 1, 30),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(true);
      });

      it(`should compare ${title} (occurrence) ends in start date (same day)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=5;COUNT=2',
          startDate: new Date(2000, 0, minDay - 5 - daysDuration, startDayHour - 1),
          endDate: new Date(2000, 0, minDay - 5, startDayHour + 1, 30),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(true);
      });

      it(`should compare ${title} (occurrence) starts in end date (same day)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, maxDay - 30, endDayHour - 1, 30),
          endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 1),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(true);
      });

      it(`should compare ${title} (occurrence) ends in start date (same hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, minDay - daysDuration - 30, startDayHour - 1),
          endDate: new Date(2000, 0, minDay - 30, startDayHour, 30),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(true);
      });

      it(`should compare ${title} (occurrence) starts in end date (same hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, maxDay - 30, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 1),
        }, {
          ...viewportOptions,
          endDayHour: endDayHour + 0.5,
          max: new Date(2000, 0, maxDay, endDayHour, 30),
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(true);
      });

      it(`should compare ${title} (occurrence) ends in start date (out of hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, minDay - daysDuration - 30, startDayHour - 2),
          endDate: new Date(2000, 0, minDay - 30, startDayHour - 1),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(ignoreHours);
      });

      it(`should compare ${title} (occurrence) starts in end date (out of hours)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, maxDay - 30, endDayHour + 1),
          endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 2),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(ignoreHours);
      });

      it(`should compare ${title} (occurrence) ends in start date (same hours, out of minutes)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, minDay - daysDuration - 30, startDayHour - 1),
          endDate: new Date(2000, 0, minDay - 30, startDayHour, 10),
        }, {
          ...viewportOptions,
          startDayHour: startDayHour + 0.5,
          min: new Date(2000, 0, minDay, startDayHour, 30),
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(ignoreHours);
      });

      it(`should compare ${title} (occurrence) starts in end date (same hours, out of minutes)`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, maxDay - 30, endDayHour, 10),
          endDate: new Date(2000, 0, maxDay + daysDuration - 30, endDayHour + 1),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(ignoreHours);
      });
    });

    describe.each([
      {
        title: 'all day appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: true,
        },
        isTimeDateView: true,
      },
      {
        title: 'several days appointment',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
        isTimeDateView: true,
      },
      {
        title: 'several days appointment in month view',
        appointment: {
          startDate: new Date(2000, 0, 15, 10, 30),
          endDate: new Date(2000, 0, 17, 10, 30),
          allDay: false,
        } as any,
        isTimeDateView: false,
      },
    ])('2. $title', ({
      title, appointment, isTimeDateView,
    }) => {
      it(`should compare ${title} (occurrence) starts and ends outside the view`, () => {
        expect(getAppointmentFilter({
          ...appointment,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=30;COUNT=2',
          startDate: new Date(2000, 0, minDay - 1 - 30, startDayHour + 1),
          endDate: new Date(2000, 0, maxDay + 1 - 30, startDayHour + 2),
        }, {
          ...viewportOptions,
          isOnlyDateCheck: !isTimeDateView || appointment.allDay,
        }, mockTimeZoneCalculator)).toBe(true);
      });
    });
  });
});
