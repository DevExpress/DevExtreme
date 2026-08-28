import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import {
  getFullThemeName, getThemeName, isMaterial, isMaterialBased,
} from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';

const VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT = '.dx-scheduler-view-switcher-dropdown-button-content';

test('dateNavigator buttons should have "text" styling mode', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentView: 'day',
    views: ['day'],
    height: 580,
  });

  const { toolbar } = new Scheduler(page, '#container');
  const expectedClass = isMaterialBased() ? /dx-button-mode-text/ : /dx-button-mode-contained/;

  await expect(toolbar.navigator.prevButton).toHaveClass(expectedClass);
  await expect(toolbar.navigator.caption).toHaveClass(expectedClass);
  await expect(toolbar.navigator.nextButton).toHaveClass(expectedClass);
});

test('viewSwitcher dropdown button popup should have a specified class', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  // The class is a material-based decoration, and the TestCafe test asserted its absence in the
  // one theme it named to run in.
  test.skip(getThemeName() !== 'generic', 'the check is written for the generic theme');

  await createWidget(page, 'dxScheduler', {
    currentView: 'day',
    views: ['day', 'week'],
    height: 580,
  });

  const { toolbar } = new Scheduler(page, '#container');

  await toolbar.viewSwitcher.getDropDownButton().element.click();

  await expect(page.locator(VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT))
    .toHaveCount(isMaterial() ? 1 : 0);
});

test('The toolbar should not display if the config is empty', {
  tag: ['@material.blue.light'],
}, async ({ page }) => {
  // The etalons of this test were recorded in the material theme only, the way the TestCafe test
  // named it as the one theme to run in.
  test.skip(getFullThemeName() !== 'material.blue.light', 'the etalons are material only');

  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2020, 2, 2),
    currentView: 'day',
    views: ['day', 'week'],
    height: 580,
    toolbar: { items: [] },
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'scheduler-with-empty-toolbar-config.png');

  await scheduler.option('toolbar', { items: ['viewSwitcher'] });

  await testScreenshot(page, 'scheduler-with-non-empty-toolbar-config.png');
});
