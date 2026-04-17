import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

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

test.describe('Appointment overlapping in Scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Multi-day appointment should not overlap other appointments when specific width is set, \'auto\' mode (T864456)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...SCHEDULER_DEFAULT_OPTIONS,
      dataSource: SIMPLE_DATA,
    });

    const collectorsCount = await page.locator('.dx-scheduler-appointment-collector').count();
    expect(collectorsCount).toBe(3);

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment 1' }).nth(1);
    const box = await appointment.boundingBox();

    expect(Math.round(box!.height)).toBe(266);
    expect(Math.round(box!.width)).toBe(94);
  });

  test('Simple appointment should not overlap allDay appointment when specific width is set, \'auto\' mode (T864456)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...SCHEDULER_DEFAULT_OPTIONS,
      dataSource: ALL_DAY_DATA,
    });

    const collectorsCount = await page.locator('.dx-scheduler-appointment-collector').count();
    expect(collectorsCount).toBe(1);

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment 4' });
    const box = await appointment.boundingBox();
    expect(box!.y).toBeCloseTo(138.828125, 0);
  });

  test('Crossing allDay appointments should not overlap each other (T893674)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...SCHEDULER_DEFAULT_OPTIONS,
      dataSource: ALL_DAY_DATA,
    });

    const firstAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment 1' });
    const secondAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment 2' });

    const firstBox = await firstAppointment.boundingBox();
    const secondBox = await secondAppointment.boundingBox();

    expect(firstBox!.y).not.toBe(secondBox!.y);
  });
});
