import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('PieWithResolvedLabelOverlapping')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'PieWithResolvedLabelOverlapping', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('PieWithResolvedLabelOverlapping', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const showSelectBoxItems = () => t.click($('.options .dx-dropdowneditor-input-wrapper input.dx-texteditor-input'));
    const selectItem = (index) => $('.dx-dropdowneditor-overlay .dx-list-item-content').nth(index);

    await showSelectBoxItems();
    await t.click(selectItem(1));
    await testScreenshot(t, takeScreenshot, 'pie_resolve_labels_overlapping_hide.png');

    await showSelectBoxItems();
    await t.click(selectItem(2));
    await testScreenshot(t, takeScreenshot, 'pie_resolve_labels_overlapping_none.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
