import { test, expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const getAppointment = (page: Page, title: string, index = 0): Locator => page.locator('.dx-scheduler-appointment').filter({ hasText: title }).nth(index);

const checkAllDayAppointment = async (
  page: Page,
  title: string,
  index: number,
  reduceType: 'head' | 'body' | 'tail' | undefined,
  width: number,
): Promise<void> => {
  const appointment = getAppointment(page, title, index);
  const isReduced = reduceType !== undefined;

  const hasReducedIcon = await appointment.locator('.dx-scheduler-appointment-reduced-icon').count();
  expect(hasReducedIcon > 0).toBe(isReduced);

  const isHead = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-appointment-head'));
  expect(isHead).toBe(reduceType === 'head');

  const isBody = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-appointment-body'));
  expect(isBody).toBe(reduceType === 'body');

  const isTail = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-appointment-tail'));
  expect(isTail).toBe(reduceType === 'tail');

  const isAllDay = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-all-day-appointment'));
  expect(isAllDay).toBeTruthy();

  const clientWidth = await appointment.evaluate((el) => el.clientWidth);
  expect(clientWidth).toBeGreaterThanOrEqual(width - 1);
  expect(clientWidth).toBeLessThanOrEqual(width + 1);
};

const checkRegularAppointment = async (
  page: Page,
  title: string,
  index: number,
  reduceType: 'head' | 'body' | 'tail' | undefined,
  height: number,
): Promise<void> => {
  const appointment = getAppointment(page, title, index);
  const isReduced = reduceType !== undefined;

  const hasReducedIcon = await appointment.locator('.dx-scheduler-appointment-reduced-icon').count();
  expect(hasReducedIcon > 0).toBe(isReduced);

  const isHead = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-appointment-head'));
  expect(isHead).toBe(reduceType === 'head');

  const isBody = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-appointment-body'));
  expect(isBody).toBe(reduceType === 'body');

  const isTail = await appointment.evaluate((el) => el.classList.contains('dx-scheduler-appointment-tail'));
  expect(isTail).toBe(reduceType === 'tail');

  const clientHeight = await appointment.evaluate((el) => el.clientHeight);
  expect(clientHeight).toBeGreaterThanOrEqual(height - 1);
  expect(clientHeight).toBeLessThanOrEqual(height + 1);
};

test.describe('Scheduler - Multiday appointments', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should render multi-day and multi-view appointments correctly if allDayPanelMode is "hidden"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 900,
      height: 400,
      dataSource: [{
        text: 'appt-00',
        startDate: new Date(2021, 2, 22, 8),
        endDate: new Date(2021, 2, 22, 10, 30),
      }, {
        text: 'appt-01',
        startDate: new Date(2021, 2, 25, 9),
        endDate: new Date(2021, 3, 6, 8, 30),
      }],
      views: ['week', 'month', 'timelineMonth'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 21),
      startDayHour: 8,
      endDayHour: 10,
      allDayPanelMode: 'hidden',
    });

    let appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(4);

    await checkRegularAppointment(page, 'appt-00', 0, undefined, 200);
    await checkRegularAppointment(page, 'appt-01', 0, 'head', 100);
    for (let i = 1; i < appointmentCount - 2; i += 1) {
      await checkRegularAppointment(page, 'appt-01', i, 'body', 200);
    }

    await page.locator('.dx-scheduler-navigator-next').click();

    appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(7);

    for (let i = 0; i < appointmentCount; i += 1) {
      await checkRegularAppointment(page, 'appt-01', i, 'body', 200);
    }

    await page.locator('.dx-scheduler-navigator-next').click();

    appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(3);
    await checkRegularAppointment(page, 'appt-01', 0, 'body', 200);
    await checkRegularAppointment(page, 'appt-01', 1, 'body', 200);
    await checkRegularAppointment(page, 'appt-01', 2, 'tail', 50);
  });

  test('it should render all-day appointments if allDayPanelMode is "all"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 900,
      height: 400,
      dataSource: [{
        text: 'appt-00',
        startDate: new Date(2021, 2, 22, 8),
        endDate: new Date(2021, 2, 22, 10, 30),
        allDay: true,
      }, {
        text: 'appt-01',
        startDate: new Date(2021, 2, 25, 9),
        endDate: new Date(2021, 3, 6, 8, 30),
      }],
      views: ['week', 'month', 'timelineMonth'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 21),
      startDayHour: 8,
      endDayHour: 10,
      allDayPanelMode: 'all',
    });

    let appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(2);
    await checkAllDayAppointment(page, 'appt-00', 0, undefined, 109);
    await checkAllDayAppointment(page, 'appt-01', 0, 'head', 337);

    await page.locator('.dx-scheduler-navigator-next').click();

    appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(1);
    await checkAllDayAppointment(page, 'appt-01', 0, 'body', 793);

    await page.locator('.dx-scheduler-navigator-next').click();

    appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(1);
    await checkAllDayAppointment(page, 'appt-01', 0, 'tail', 337);
  });

  test('it should render all-day and multi-day appointments if allDayPanelMode is "allDay"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 900,
      height: 400,
      dataSource: [{
        text: 'allDay',
        startDate: new Date(2021, 2, 22),
        allDay: true,
      }, {
        text: 'multiDay',
        startDate: new Date(2021, 2, 22, 8),
        endDate: new Date(2021, 2, 25, 9, 30),
      }],
      views: ['week', 'month', 'timelineMonth'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 21),
      startDayHour: 8,
      endDayHour: 10,
      allDayPanelMode: 'allDay',
    });

    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(5);

    await checkAllDayAppointment(page, 'allDay', 0, undefined, 117);
    await checkRegularAppointment(page, 'multiDay', 0, 'head', 151);
    await checkRegularAppointment(page, 'multiDay', 1, 'body', 151);
    await checkRegularAppointment(page, 'multiDay', 2, 'body', 151);
    await checkRegularAppointment(page, 'multiDay', 3, 'tail', 113);
  });

  test('it should correctly change allDayPanelOption at runtime', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      dataSource: [
        {
          text: 'allDay',
          startDate: new Date(2021, 2, 22),
          allDay: true,
        },
        {
          text: 'multiDay',
          startDate: new Date(2021, 2, 22, 8),
          endDate: new Date(2021, 2, 25, 9, 30),
        }],
      views: ['week', 'workWeek'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 22),
      maxAppointmentsPerCell: 2,
      startDayHour: 8,
      endDayHour: 12,
    });

    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(2);
    await checkAllDayAppointment(page, 'allDay', 0, undefined, 103);
    await checkAllDayAppointment(page, 'multiDay', 0, undefined, 417);

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('option', 'allDayPanelMode', 'allDay');
    });
    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(5);
    await checkAllDayAppointment(page, 'allDay', 0, undefined, 103);
    await checkRegularAppointment(page, 'multiDay', 0, 'head', 303);
    await checkRegularAppointment(page, 'multiDay', 1, 'body', 303);
    await checkRegularAppointment(page, 'multiDay', 2, 'body', 303);
    await checkRegularAppointment(page, 'multiDay', 3, 'tail', 113);

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('option', 'allDayPanelMode', 'hidden');
    });
    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(5);
    await expect(page.locator('.dx-scheduler-all-day-table-cell')).toHaveCount(0);
    await checkRegularAppointment(page, 'allDay', 0, undefined, 303);
    await checkRegularAppointment(page, 'multiDay', 0, 'head', 303);
    await checkRegularAppointment(page, 'multiDay', 1, 'body', 303);
    await checkRegularAppointment(page, 'multiDay', 2, 'body', 303);
    await checkRegularAppointment(page, 'multiDay', 3, 'tail', 113);

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('option', 'allDayPanelMode', 'allDay');
    });
    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(5);
    await checkAllDayAppointment(page, 'allDay', 0, undefined, 103);
    await checkRegularAppointment(page, 'multiDay', 0, 'head', 303);
    await checkRegularAppointment(page, 'multiDay', 1, 'body', 303);
    await checkRegularAppointment(page, 'multiDay', 2, 'body', 303);
    await checkRegularAppointment(page, 'multiDay', 3, 'tail', 113);

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('option', 'allDayPanelMode', 'all');
    });
    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(2);
    await checkAllDayAppointment(page, 'allDay', 0, undefined, 103);
    await checkAllDayAppointment(page, 'multiDay', 0, undefined, 417);
  });

  test('it should correctly handle allDayPanelMode for the workspace', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 900,
      height: 400,
      dataSource: [{
        text: 'allDay',
        startDate: new Date(2021, 2, 22),
        allDay: true,
      }, {
        text: 'multiDay',
        startDate: new Date(2021, 2, 22, 8),
        endDate: new Date(2021, 2, 25, 9, 30),
      }],
      views: [
        'week',
        {
          type: 'week',
          name: 'weekAllDay',
          allDayPanelMode: 'allDay',
        },
      ],
      currentView: 'week',
      currentDate: new Date(2021, 2, 21),
      startDayHour: 8,
      endDayHour: 10,
    });

    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(2);

    await checkAllDayAppointment(page, 'allDay', 0, undefined, 109);
    await checkAllDayAppointment(page, 'multiDay', 0, undefined, 451);

    await page.locator('.dx-tabs-item').filter({ hasText: 'weekAllDay' }).click();
    expect(await page.locator('.dx-scheduler-appointment').count()).toBe(5);

    await checkAllDayAppointment(page, 'allDay', 0, undefined, 109);
    await checkRegularAppointment(page, 'multiDay', 0, 'head', 200);
    await checkRegularAppointment(page, 'multiDay', 1, 'body', 200);
    await checkRegularAppointment(page, 'multiDay', 2, 'body', 200);
    await checkRegularAppointment(page, 'multiDay', 3, 'tail', 150);
  });
});
