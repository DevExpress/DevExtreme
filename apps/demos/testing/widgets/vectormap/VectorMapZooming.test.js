import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('VectorMap.DynamicViewport')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('VectorMap', 'DynamicViewport', ['jQuery'/* , 'React', 'Vue', 'Angular' */], (test) => {
  test('VectorMap.DynamicViewport', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const zoomButton = $($('#vector-map .dxm-control-bar g').nth(1)).find('circle').nth(0);
    const showSelectBoxItems = () => t.click($('.options .dx-dropdowneditor-input-wrapper input.dx-texteditor-input'));
    const selectItem = (index) => $('.dx-dropdowneditor-overlay .dx-list-item-content').nth(index);

    await t.click(zoomButton);
    await t.click(zoomButton);
    await testScreenshot(t, takeScreenshot, 'zoom_vector_map_by_control_bar.png');

    await showSelectBoxItems();
    await t.click(selectItem(4));
    await testScreenshot(t, takeScreenshot, 'vector_map_viewport-changing.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
