import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import { isMaterial, isMaterialBased } from '../../../../helpers/themeUtils';
import { classMatcher } from '../../../../models/internal/classMatcher';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

test.describe('Scheduler header: material theme', () => {
  // visual: material.blue.light
  test('dateNavigator buttons should have "text" styling mode', async ({ page, theme }) => {
    await createWidget(page, 'dxScheduler', {
      currentView: 'day',
      views: ['day'],
      height: 580,
    });

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    const expectedClass = isMaterialBased(theme) ? 'dx-button-mode-text' : 'dx-button-mode-contained';

    await expect(toolbar.navigator.prevButton).toHaveClass(classMatcher(expectedClass));
    await expect(toolbar.navigator.caption).toHaveClass(classMatcher(expectedClass));
    await expect(toolbar.navigator.nextButton).toHaveClass(classMatcher(expectedClass));
  });

  test.describe('generic theme', () => {
    test.use({ theme: 'generic.light' });

    test('viewSwitcher dropdown button popup should have a specified class', async ({ page, theme }) => {
      await createWidget(page, 'dxScheduler', {
        currentView: 'day',
        views: ['day', 'week'],
        height: 580,
      });

      const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);
      const dropDownButton = toolbar.viewSwitcher.getDropDownButton();

      const viewSwitcherDropDownButtonContent = '.dx-scheduler-view-switcher-dropdown-button-content';

      await dropDownButton.element.first().click();

      await expect(page.locator(viewSwitcherDropDownButtonContent))
        .toHaveCount(isMaterial(theme) ? 1 : 0);
    });
  });

  test.describe('material theme', () => {
    test.use({ theme: 'material.blue.light' });

    test('The toolbar should not display if the config is empty', async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2020, 2, 2),
        currentView: 'day',
        views: ['day', 'week'],
        height: 580,
        toolbar: { items: [] },
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      await testScreenshot(page, 'scheduler-with-empty-toolbar-config.png');

      await scheduler.option('toolbar', { items: ['viewSwitcher'] });

      await testScreenshot(page, 'scheduler-with-non-empty-toolbar-config.png');
    });
  });
});
