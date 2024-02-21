import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

fixture('TabPanel.Overview')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 1200);
  });

runManualTest('TabPanel', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Overview', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1))
      .wait(200);

    await takeScreenshot('tabpanel_tabsposition_top.png');

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(1))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1))
      .wait(200);

    await takeScreenshot('tabpanel_stylingmode_primary.png');

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(2))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1))
      .wait(200);

    await takeScreenshot('tabpanel_iconposition_start.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
