import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const RADIO_GROUP_CLASS = 'dx-radiogroup';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const TOOLBAR_CLASS = 'dx-toolbar';
const BUTTON_CLASS = 'dx-button';

fixture('Drawer.LeftOrRightPosition')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 1200];
  });

runManualTest('Drawer', 'LeftOrRightPosition', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('LeftOrRightPosition -> openedStateMode: overlap -> toggle', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const menuButton = $(`.${TOOLBAR_CLASS} .${BUTTON_CLASS}`);
    const optionsGroup = $(`.${RADIO_GROUP_CLASS}`);

    const openedStateModes = optionsGroup.nth(0).find(`.${RADIO_BUTTON_CLASS}`);

    await testScreenshot(t, takeScreenshot, 'drawer_opened(shrink, left, slide).png');

    await t
      .click(openedStateModes.nth(2));

    await testScreenshot(t, takeScreenshot, 'drawer_opened(shrink -> overlap, left, slide).png');

    await t
      .click(menuButton)
      .wait(500);

    await testScreenshot(t, takeScreenshot, 'drawer_closed(overlap, left, slide).png');

    await t
      .click(menuButton)
      .wait(500);

    await testScreenshot(t, takeScreenshot, 'drawer_after_open(overlap, left, slide).png');

    await t
      .resizeWindow(900, 1000);

    await testScreenshot(t, takeScreenshot, 'drawer_after_resize(overlap, left, slide).png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
