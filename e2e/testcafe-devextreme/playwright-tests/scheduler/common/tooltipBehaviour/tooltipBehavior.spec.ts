import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const tooltipDataSource = [{
  text: 'Brochure Design Review',
  startDate: new Date(2019, 3, 1, 10, 0),
  endDate: new Date(2019, 3, 1, 12, 0),
}];

const defaultSchedulerOptions = {
  views: ['day'],
  dataSource: [],
  width: 600,
  height: 600,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
};

test.describe('Appointment tooltip behavior during scrolling in the Scheduler (T755449)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('The tooltip of collector should not scroll page and immediately hide', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: [{
        type: 'week',
        name: 'week',
        maxAppointmentsPerCell: '0',
      }],
      currentDate: new Date(2017, 4, 25),
      startDayHour: 9,
      currentView: 'week',
      dataSource: [
        { text: 'A', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
        { text: 'B', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
        { text: 'C', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
        { text: 'D', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
        { text: 'E', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
        { text: 'F', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
        { text: 'G', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
      ],
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '7' });
    await collector.click();

    const tooltip = page.locator('.dx-scheduler-appointment-tooltip');
    await expect(tooltip).toBeVisible();
  });

  test('The tooltip should not hide after automatic scrolling during an appointment click', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      dataSource: tooltipDataSource,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    await appointment.click();

    const tooltip = page.locator('.dx-scheduler-appointment-tooltip');
    await expect(tooltip).toBeVisible();
  });

  test('The tooltip should hide after manually scrolling in the browser', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      dataSource: tooltipDataSource,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    await appointment.click();

    const tooltip = page.locator('.dx-scheduler-appointment-tooltip');
    await expect(tooltip).toBeVisible();

    await page.evaluate(() => { window.scroll(0, 100); });
    await page.waitForTimeout(500);

    await expect(tooltip).not.toBeVisible();
  });

  [false, true].forEach((adaptivityEnabled) => {
    test(`The tooltip screenshot (adaptivityEnabled=${adaptivityEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
        views: ['week'],
        currentView: 'week',
        dataSource: tooltipDataSource,
        adaptivityEnabled,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      await appointment.click();

      const tooltipNamePrefix = adaptivityEnabled ? 'mobile' : 'desktop';
      const scheduler = page.locator('.dx-scheduler');
      await testScreenshot(page, `appointment-${tooltipNamePrefix}-tooltip-screenshot.png`, { element: scheduler });
    });
  });

  test('Collector tooltip focused list item screenshot', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'Text', startDate: new Date(2017, 4, 22, 9, 30, 0, 0), endDate: new Date(2017, 4, 22, 10, 30, 0, 0) },
        { text: 'Text2', startDate: new Date(2017, 4, 22, 9, 30, 0, 0), endDate: new Date(2017, 4, 22, 10, 30, 0, 0) },
        { text: 'Text3', startDate: new Date(2017, 4, 22, 9, 30, 0, 0), endDate: new Date(2017, 4, 22, 10, 30, 0, 0) },
      ],
      views: [{
        type: 'month',
        maxAppointmentsPerCell: 1,
      }],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '2 more' });
    await expect(collector).toBeVisible();
    await collector.click();

    const tooltip = page.locator('.dx-scheduler-appointment-tooltip');
    await expect(tooltip).toBeVisible();

    await page.keyboard.press('Tab');

    const scheduler = page.locator('.dx-scheduler');
    await testScreenshot(page, 'collector-tooltip-focused-list-item.png', { element: scheduler });
  });
});
