import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Slider.Overview')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t.resizeWindow(900, 800);
  });

runManualTest('Slider', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Slider Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, 'slider_overview.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
