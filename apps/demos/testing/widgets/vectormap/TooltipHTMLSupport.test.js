import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('VectorMap.TooltipHTMLSupport')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 700);
  });

runManualTest('VectorMap', 'TooltipHTMLSupport', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Tooltip', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const label = $(() => Array.from(document.querySelectorAll('#vector-map tspan')).filter((s) => s.textContent === 'Canada')[0]);

    await t.hover(label);
    await takeScreenshot('vectormap_tooltip.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
