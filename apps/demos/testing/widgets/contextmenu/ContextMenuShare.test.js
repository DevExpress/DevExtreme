import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('ContextMenu.Templates')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

const IMAGE_ID = 'image';

runManualTest('ContextMenu', 'Templates', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Template Share Appearance', async (t) => {
    const MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text';
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`#${IMAGE_ID}`);

    await t.click($(`.${MENU_ITEM_TEXT_CLASS}`).withText('Share'));

    await takeScreenshot('context_menu_templates_share_visible.png');

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  });
});
