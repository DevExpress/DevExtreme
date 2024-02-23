import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';
const CHECKBOX_CLASS = 'dx-checkbox';

fixture('Tabs.Overview')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 1200);
  });

runManualTest('Tabs', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Overview', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_orientation_vertical.png');

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(1))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_stylingmode_secondary.png');

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(2))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(2))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_iconposition_end.png');

    await t
      .click($(`.${OPTION_CLASS} .${CHECKBOX_CLASS}`).nth(3))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_rtlenabled_true.png');

    await t
      .click($(`.${OPTION_CLASS} .${CHECKBOX_CLASS}`).nth(3))
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(0))
      .wait(200);

    await t
      .click($(`.${OPTION_CLASS} .${CHECKBOX_CLASS}`).nth(0))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_shownavbuttons_true.png');

    await t
      .click($(`.${OPTION_CLASS} .${CHECKBOX_CLASS}`).nth(2))
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_orientation_vertical_without_strict_class.png');

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(0))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tabs_orientation_horizontal_with_strict_class.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
