import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('KeyboardNavigation.DocumentScrollPrevented', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Document should not scroll on \'End\' press when appointment is focused', async ({ page }) => {
    await page.evaluate(() => {
      document.body.style.height = '2000px';
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 11) },
        { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 12), endDate: new Date(2015, 1, 9, 13) },
      ],
      height: 300,
      currentView: 'day',
      currentDate: new Date(2015, 1, 9),
    });

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment 1' }).click();
    const expectedScrollTop = await page.evaluate(() => document.documentElement.scrollTop);
    await page.keyboard.press('End');
    const actualScrollTop = await page.evaluate(() => document.documentElement.scrollTop);
    expect(actualScrollTop).toBe(expectedScrollTop);

    await page.evaluate(() => { document.body.style.height = ''; });
  });

  test('Document should not scroll on \'Home\' press when appointment is focused', async ({ page }) => {
    await page.evaluate(() => {
      document.body.style.height = '2000px';
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 11) },
        { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 12), endDate: new Date(2015, 1, 9, 13) },
      ],
      height: 300,
      currentView: 'day',
      currentDate: new Date(2015, 1, 9),
    });

    await page.evaluate(() => window.scrollTo(0, 100));
    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment 1' }).click();
    const expectedScrollTop = await page.evaluate(() => document.documentElement.scrollTop);
    await page.keyboard.press('Home');
    const actualScrollTop = await page.evaluate(() => document.documentElement.scrollTop);
    expect(actualScrollTop).toBe(expectedScrollTop);

    await page.evaluate(() => { document.body.style.height = ''; });
  });
});
