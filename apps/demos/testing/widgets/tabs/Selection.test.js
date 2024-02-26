import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TAB_CLASS = 'dx-tab';
const SELECT_BOX_CONTAINER_CLASS = 'select-box-container';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

fixture('Tabs.Selection')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 1200);
  });

runManualTest('Tabs', 'Selection', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Selection', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${TABS_WRAPPER_CLASS} .${TAB_CLASS}`).nth(1))
      .wait(200);

    await takeScreenshot('tabs_second_item_selection.png');

    await t
      .click($(`.${SELECT_BOX_CONTAINER_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(2))
      .wait(200);

    await takeScreenshot('tabs_third_item_selection.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
