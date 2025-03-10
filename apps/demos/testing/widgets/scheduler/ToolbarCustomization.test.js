import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Scheduler.ToolbarCustomization')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Scheduler', 'ToolbarCustomization', ['jQuery'], (test) => {
  test('ToolbarCustomization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const menuButtonSelector = $('.dx-toolbar').find('.dx-toolbar-menu-container').find('.dx-button');

    await testScreenshot(t, takeScreenshot, 'scheduler_toolbar_customization_wide.png');

    await t
      .resizeWindow(490, 600)
      .click(menuButtonSelector);

    await testScreenshot(t, takeScreenshot, 'scheduler_toolbar_customization_medium.png');

    await t
      .click($('body'), { offsetX: 0, offsetY: 0 })
      .resizeWindow(320, 600)
      .click(menuButtonSelector);

    await testScreenshot(t, takeScreenshot, 'scheduler_toolbar_customization_thin.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
