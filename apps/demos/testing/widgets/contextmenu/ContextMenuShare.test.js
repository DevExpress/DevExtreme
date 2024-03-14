import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const IMAGE_ID = 'image';
const MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text';

fixture('ContextMenu.Templates')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('ContextMenu', 'Templates', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Template Share Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`#${IMAGE_ID}`);

    await t.click($(`.${MENU_ITEM_TEXT_CLASS}`).withText('Share'));

    await testScreenshot(t, takeScreenshot, 'context_menu_templates_share_visible.png');

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  });
});
