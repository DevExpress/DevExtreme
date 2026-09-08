import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

export const SIMPLE_DATA = [
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

export const ALL_DAY_DATA = [
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

test('Multi-day appointment should not overlap other appointments when specific width is set, \'auto\' mode (T864456)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...SCHEDULER_DEFAULT_OPTIONS,
    dataSource: SIMPLE_DATA,
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('Appointment 1', 1);
  const size = await appointment.getSize();

  expect(await scheduler.collectors.count()).toBe(3);
  expect(parseInt(size.height, 10)).toBe(266);
  expect(parseInt(size.width, 10)).toBe(94);
});

test('Simple appointment should not overlap allDay appointment when specific width is set, \'auto\' mode (T864456)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...SCHEDULER_DEFAULT_OPTIONS,
    dataSource: ALL_DAY_DATA,
  });

  const scheduler = new Scheduler(page, '#container');
  const { element } = scheduler.getAppointment('Appointment 4');
  const box = await element.boundingBox();

  expect(await scheduler.collectors.count()).toBe(1);
  expect(box?.y).toBeCloseTo(138.828125, 3);
});

test('Crossing allDay appointments should not overlap each other (T893674)', { tag: ['@generic.light'] }, async ({ page }) => {
  test.skip(!process.env.THEME?.startsWith('generic'), 'the layout under test is the generic one');

  await createWidget(page, 'dxScheduler', {
    ...SCHEDULER_DEFAULT_OPTIONS,
    dataSource: ALL_DAY_DATA,
  });

  const scheduler = new Scheduler(page, '#container');
  const firstBox = await scheduler.getAppointment('Appointment 1').element.boundingBox();
  const secondBox = await scheduler.getAppointment('Appointment 2').element.boundingBox();

  expect(firstBox?.y).not.toBe(secondBox?.y);
});
