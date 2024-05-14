import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('ContextMenu.Scrolling')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

const TARGET_AREA = 'target-area';

runManualTest('ContextMenu', 'Scrolling', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Template Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`.${TARGET_AREA}`);

    await testScreenshot(t, takeScreenshot, 'context_menu_scrolling_appearance.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
