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
});
