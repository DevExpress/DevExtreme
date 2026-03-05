import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';
const TREEVIEW_NODE_CLASS = 'dx-treeview-node';
const CHECKBOX_CLASS = 'dx-checkbox';

fixture('TreeView.ItemSelectionAndCustomization')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('TreeView', 'ItemSelectionAndCustomization', (test) => {
  test('Open select box', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0));

    await testScreenshot(t, takeScreenshot, 'treeview_selection_field_is_open.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test('Disabled Node Selection Mode', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const rootNodeCheckbox = $(`.${TREEVIEW_NODE_CLASS} .${CHECKBOX_CLASS}`).nth(0);

    await t
      .click(rootNodeCheckbox);

    await testScreenshot(t, takeScreenshot, 'treeview_disabled_node_selection_mode_never.png');

    await t
      .click(rootNodeCheckbox)
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(2))
      .click($(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'treeview_disabled_node_selection_mode_recursive_and_all.png');

    await t
      .click(rootNodeCheckbox);

    await testScreenshot(t, takeScreenshot, 'treeview_disabled_node_selection_mode_select_all_children.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
