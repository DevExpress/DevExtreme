import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const RADIO_GROUP_CLASS = 'dx-radiogroup';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const TOOLBAR_CLASS = 'dx-toolbar';
const BUTTON_CLASS = 'dx-button';

fixture('Drawer.TopOrBottomPosition')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 1200);
  });

runManualTest('Drawer', 'TopOrBottomPosition', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('TopOrBottomPosition -> position: bottom -> openedStateMode: overlap -> open -> resize -> close', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const menuButton = $(`.${TOOLBAR_CLASS} .${BUTTON_CLASS}`);
    const optionsGroup = $(`.${RADIO_GROUP_CLASS}`);

    const openedStateModes = optionsGroup.nth(0).find(`.${RADIO_BUTTON_CLASS}`);
    const positions = optionsGroup.nth(1).find(`.${RADIO_BUTTON_CLASS}`);

    await t
      .click(positions.nth(1))
      .click(openedStateModes.nth(2));

    await takeScreenshot('drawer(overlap, bottom, expand).png');

    await t
      .click(menuButton)
      .wait(500);

    await takeScreenshot('drawer_opened(overlap, bottom, expand).png');

    await t
      .resizeWindow(900, 1000);

    await takeScreenshot('drawer_after_resize(overlap, bottom, expand).png');

    await t
      .resizeWindow(900, 1200);

    await t
      .click(menuButton)
      .wait(500);

    await takeScreenshot('drawer_closed(overlap, bottom, expand).png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test('TopOrBottomPosition -> openedStateMode: overlap -> position: bottom -> open -> resize -> close', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const menuButton = $(`.${TOOLBAR_CLASS} .${BUTTON_CLASS}`);
    const optionsGroup = $(`.${RADIO_GROUP_CLASS}`);

    const openedStateModes = optionsGroup.nth(0).find(`.${RADIO_BUTTON_CLASS}`);
    const positions = optionsGroup.nth(1).find(`.${RADIO_BUTTON_CLASS}`);

    await t
      .click(openedStateModes.nth(2))
      .click(positions.nth(1));

    await takeScreenshot('drawer(overlap, bottom, expand).png');

    await t
      .click(menuButton)
      .wait(500);

    await takeScreenshot('drawer_opened(overlap, bottom, expand).png');

    await t
      .resizeWindow(900, 1000);

    await takeScreenshot('drawer_after_resize(overlap, bottom, expand).png');

    await t
      .resizeWindow(900, 1200);

    await t
      .click(menuButton)
      .wait(500);

    await takeScreenshot('drawer_closed(overlap, bottom, expand).png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
