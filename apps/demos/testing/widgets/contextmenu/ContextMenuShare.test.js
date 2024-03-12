import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('ContextMenu.Share')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t.resizeWindow(900, 600);
  });

const IMAGE_ID = 'image';

runManualTest('ContextMenu', 'Templates', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Template Share Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`#${IMAGE_ID}`);

    await t.click($('.dx-menu-item-text').withText('Share'));

    await takeScreenshot('context_menu_templates_share_visible.png');

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  });
});
