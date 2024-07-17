import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('ContextMenu.Scrolling')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

const TARGET_AREA = 'target-area';
const MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text';

runManualTest('ContextMenu', 'Scrolling', ['jQuery'/* , 'React', 'Vue', 'Angular' */], (test) => {
  test('Custom Template Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`.${TARGET_AREA}`);

    await testScreenshot(t, takeScreenshot, 'context_menu_scrolling_appearance.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test('Custom Template SubMenu Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`.${TARGET_AREA}`);

    await t.click($(`.${MENU_ITEM_TEXT_CLASS}`).withText('Electronics'));

    await t.click($(`.${MENU_ITEM_TEXT_CLASS}`).withText('Computers'));

    await testScreenshot(t, takeScreenshot, 'context_menu_templates_submenus_visible.png');

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  });
});
