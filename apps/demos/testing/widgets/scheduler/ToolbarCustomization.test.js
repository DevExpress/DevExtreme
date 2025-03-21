import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const SCREEN_SIZES = {
  wide: [900, 600],
  medium: [490, 600],
  thin: [320, 600],
};

fixture('Scheduler.ToolbarCustomization')
  .before(async (ctx) => {
    ctx.initialWindowSize = SCREEN_SIZES.wide;
  });

runManualTest('Scheduler', 'ToolbarCustomization', (test) => {
  test('ToolbarCustomization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = $('#scheduler');
    const menuButtonSelector = $('.dx-toolbar').find('.dx-toolbar-menu-container').find('.dx-button');

    await testScreenshot(t, takeScreenshot, 'scheduler_toolbar_customization_wide.png', scheduler);

    await t
      .resizeWindow(...SCREEN_SIZES.medium)
      .click(menuButtonSelector);

    await testScreenshot(t, takeScreenshot, 'scheduler_toolbar_customization_medium.png', scheduler);

    await t
      .click($('body'), { offsetX: 0, offsetY: 0 }) // close menu by clicking outside
      .resizeWindow(...SCREEN_SIZES.thin)
      .click(menuButtonSelector); // open menu with additional items and updated dimensions

    await testScreenshot(t, takeScreenshot, 'scheduler_toolbar_customization_thin.png', scheduler);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
