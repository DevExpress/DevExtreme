import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

fixture('TabPanel.Overview')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 1200];
  });

runManualTest('TabPanel', 'Overview', (test) => {
  test('Overview', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const $selectBox = $(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`);

    await t
      .click($selectBox.nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'tabpanel_tabsposition_top.png');

    await t
      .click($selectBox.nth(1))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'tabpanel_stylingmode_primary.png');

    await t
      .click($selectBox.nth(2))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'tabpanel_iconposition_start.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
