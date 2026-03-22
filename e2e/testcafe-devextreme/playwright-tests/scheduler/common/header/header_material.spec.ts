import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, isMaterialBased, isMaterial } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler header: material theme', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('dateNavigator buttons should have "text" styling mode', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentView: 'day',
      views: ['day'],
      height: 580,
    });

    const expectedClass = isMaterialBased() ? 'dx-button-mode-text' : 'dx-button-mode-contained';

    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const caption = page.locator('.dx-scheduler-navigator-caption');

    await expect(prevButton).toHaveClass(new RegExp(expectedClass));
    await expect(caption).toHaveClass(new RegExp(expectedClass));
    await expect(nextButton).toHaveClass(new RegExp(expectedClass));
  });

  test('viewSwitcher dropdown button popup should have a specified class', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentView: 'day',
      views: ['day', 'week'],
      height: 580,
    });

    const dropDownButton = page.locator('.dx-scheduler-view-switcher .dx-dropdownbutton');
    await dropDownButton.click();

    const viewSwitcherDropDownButtonContent = page.locator('.dx-scheduler-view-switcher-dropdown-button-content');
    const count = await viewSwitcherDropDownButtonContent.count();

    expect(count).toBe(isMaterial() ? 1 : 0);
  });

  test('The toolbar should not display if the config is empty', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2020, 2, 2),
      currentView: 'day',
      views: ['day', 'week'],
      height: 580,
      toolbar: { items: [] },
    });

    await testScreenshot(page, 'scheduler-with-empty-toolbar-config.png');

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').option('toolbar', { items: ['viewSwitcher'] });
    });

    await testScreenshot(page, 'scheduler-with-non-empty-toolbar-config.png');
  });
});
