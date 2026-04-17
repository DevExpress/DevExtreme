import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const sampleData = [
  { text: 'Website Re-Design Plan', startDate: new Date(2017, 4, 22, 9, 30), endDate: new Date(2017, 4, 22, 11, 30) },
  { text: 'Website Re-Design Plan', startDate: new Date(2017, 4, 22, 9, 40), endDate: new Date(2017, 4, 22, 11, 40) },
  { text: 'Book Flights to San Fran for Sales Trip', startDate: new Date(2017, 4, 22, 12, 0), endDate: new Date(2017, 4, 22, 13, 0), allDay: true },
];

const sampleDataNotRoundedMinutes = [
  { text: 'Website Re-Design Plan', startDate: new Date(2017, 4, 22, 9, 10), endDate: new Date(2017, 4, 22, 11, 30) },
  { text: 'Website Re-Design Plan', startDate: new Date(2017, 4, 23, 9, 5), endDate: new Date(2017, 4, 23, 11, 40) },
  { text: 'Book Flights to San Fran for Sales Trip', startDate: new Date(2017, 4, 24, 12, 12), endDate: new Date(2017, 4, 24, 13, 30) },
];

const roughEqual = (actual: number, expected: number): boolean => {
  const epsilon = 1.5;
  return Math.abs(expected - actual) <= epsilon;
};

const createScheduler = async (page, data, width = '100%'): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: data,
    views: ['week'],
    currentView: 'week',
    adaptivityEnabled: true,
    currentDate: new Date(2017, 4, 25),
    startDayHour: 9,
    height: 600,
    width,
  });
};

test.describe.skip('Week view in adaptive mode', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Compact appointment should be center by vertical alignment', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    await createScheduler(page, sampleDataNotRoundedMinutes);

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(0);

    const collectorsCount = await page.locator('.dx-scheduler-appointment-collector').count();
    expect(collectorsCount).toBe(3);

    const firstCollector = page.locator('.dx-scheduler-appointment-collector').nth(0);
    const firstBox = await firstCollector.boundingBox();
    expect(roughEqual(firstBox!.y, 150)).toBeTruthy();

    const secondCollector = page.locator('.dx-scheduler-appointment-collector').nth(1);
    const secondBox = await secondCollector.boundingBox();
    expect(roughEqual(secondBox!.y, 150)).toBeTruthy();

    const thirdCollector = page.locator('.dx-scheduler-appointment-collector').nth(2);
    const thirdBox = await thirdCollector.boundingBox();
    expect(roughEqual(thirdBox!.y, 450)).toBeTruthy();
  });
});
