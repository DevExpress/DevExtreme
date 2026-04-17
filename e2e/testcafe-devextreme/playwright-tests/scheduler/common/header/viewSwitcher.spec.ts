import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Scheduler header - View switcher', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should correctly switch a differently typed views (T1080992)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      views: [
        'day',
        {
          type: 'week',
          name: 'Some week',
        },
      ],
    });

    const dayButton = page.locator('.dx-scheduler-view-switcher .dx-buttongroup .dx-button').filter({ hasText: 'Day' });
    await dayButton.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const someWeekButton = page.locator('.dx-scheduler-view-switcher .dx-buttongroup .dx-button').filter({ hasText: 'Some week' });
    await someWeekButton.click();

    const isWeekView = await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      return instance.option('currentView') === 'Some week';
    });
    expect(isWeekView).toBe(true);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const isDayView = await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      return instance.option('currentView') === 'day';
    });
    expect(isDayView).toBe(true);
  });

  const defaultSelectBoxValue = 'Samantha Bright';

  test('Changing view does not reset toolbar items state', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['week', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 27),
      toolbar: {
        items: [
          {
            location: 'before',
            widget: 'dxSelectBox',
            options: { items: [defaultSelectBoxValue] },
          },
          'viewSwitcher',
        ],
      },
    });

    const selectBox = page.locator('.dx-selectbox');
    await selectBox.click();
    const listItem = page.locator('.dx-list-item').first();
    await listItem.click();

    const selectBoxValue = await selectBox.locator('input').inputValue();
    expect(selectBoxValue).toBe(defaultSelectBoxValue);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const monthButton = page.locator('.dx-scheduler-view-switcher .dx-buttongroup .dx-button').filter({ hasText: 'Month' });
    await monthButton.click();

    const isMonthView = await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      return instance.option('currentView') === 'month';
    });
    expect(isMonthView).toBe(true);

    const selectBoxValueAfter = await selectBox.locator('input').inputValue();
    expect(selectBoxValueAfter).toBe(defaultSelectBoxValue);
  });

  [true, false].forEach((useDropDownViewSwitcher) => {
    test(`view switcher should not be displayed if views has only one element when useDropDownViewSwitcher: ${useDropDownViewSwitcher}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2020, 2, 2),
        currentView: 'day',
        views: ['day'],
        useDropDownViewSwitcher,
        height: 580,
      });

      await testScreenshot(
        page,
        `toolbar-without-view-switcher-(useDropDownViewSwitcher=${useDropDownViewSwitcher}).png`,
        { element: page.locator('.dx-scheduler-header') },
      );
    });
  });
});
