import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';

const SIMPLE_DATA = [
  {
    text: 'Appointment 1',
    startDate: new Date(2017, 4, 24, 13, 0),
    endDate: new Date(2017, 4, 25, 12, 30),
  },
  {
    text: 'Appointment 2',
    startDate: new Date(2017, 4, 24, 15, 0),
    endDate: new Date(2017, 4, 24, 16, 30),
  },
  {
    text: 'Appointment 3',
    startDate: new Date(2017, 4, 25, 9, 0),
    endDate: new Date(2017, 4, 25, 10, 30),
  },
  {
    text: 'Appointment 4',
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 30),
  },
  {
    text: 'Appointment 5',
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 0),
    allDay: true,
  },
];

const ALL_DAY_DATA = [
  {
    text: 'Appointment 1',
    startDate: new Date(2017, 4, 21, 9, 0),
    endDate: new Date(2017, 4, 24, 10, 30),
    allDay: true,
  },
  {
    text: 'Appointment 2',
    startDate: new Date(2017, 4, 22, 11, 0),
    endDate: new Date(2017, 4, 22, 12, 0),
    allDay: true,
  },
  {
    text: 'Appointment 3',
    startDate: new Date(2017, 4, 25, 9, 0),
    endDate: new Date(2017, 4, 25, 10, 30),
  },
  {
    text: 'Appointment 4',
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 0),
    allDay: true,
  },
];

const SCHEDULER_DEFAULT_OPTIONS = {
  views: ['week'],
  width: 940,
  currentView: 'week',
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  height: 900,
};

const getTop = (element: Locator): Promise<number> => element
  .evaluate((node) => node.getBoundingClientRect().top);

test.describe('Appointment overlapping in Scheduler', () => {
  test('Multi-day appointment should not overlap other appointments when specific width is set, \'auto\' mode (T864456)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...SCHEDULER_DEFAULT_OPTIONS,
      dataSource: SIMPLE_DATA,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment 1', 1);

    await expect(scheduler.collectors.all).toHaveCount(3);

    await expect(appointment.element).toHaveCSS('height', /^266(\.\d+)?px$/);

    await expect(appointment.element).toHaveCSS('width', /^94(\.\d+)?px$/);
  });

  test('Simple appointment should not overlap allDay appointment when specific width is set, \'auto\' mode (T864456)', async ({ page, theme }) => {
    await createWidget(page, 'dxScheduler', {
      ...SCHEDULER_DEFAULT_OPTIONS,
      dataSource: ALL_DAY_DATA,
    });

    const scheduler = new Scheduler(page, '#container');
    const { element } = scheduler.getAppointment('Appointment 4');

    await expect(scheduler.collectors.all).toHaveCount(1);
    await expect.poll(() => getTop(element))
      .toBe(getThemeName(theme) === 'fluent-next' ? 140.828125 : 138.828125);
  });

  test.describe(() => {
    test.use({ theme: 'generic.light' });

    test('Crossing allDay appointments should not overlap each other (T893674)', async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...SCHEDULER_DEFAULT_OPTIONS,
        dataSource: ALL_DAY_DATA,
      });

      const scheduler = new Scheduler(page, '#container');
      const firstAppointment = scheduler.getAppointment('Appointment 1');
      const secondAppointment = scheduler.getAppointment('Appointment 2');

      expect(await getTop(firstAppointment.element))
        .not.toBe(await getTop(secondAppointment.element));
    });
  });
});
