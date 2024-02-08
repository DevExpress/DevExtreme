import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('Charts.CustomLegendMarkers')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Charts', 'CustomLegendMarkers', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('CustomLegendMarkers', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.hover($('.dxl-marker').nth(1));
    await takeScreenshot('charts_custom_legend_marker.png', '.dxc-legend');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
