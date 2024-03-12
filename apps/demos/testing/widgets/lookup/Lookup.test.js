import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const LOOKUP_CLASS = 'dx-lookup';

fixture('Lookup.Basics')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Lookup', 'Basics', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Lookup Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${LOOKUP_CLASS}`).nth(0))
      .wait(200);

    await t
      .click($(`.${LOOKUP_CLASS}`).nth(1))
      .wait(200);

    await takeScreenshot('lookup_templates_custom_appearance.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
