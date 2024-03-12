import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('Lookup.Basics')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t.resizeWindow(900, 800);
  });

runManualTest('Lookup', 'Basics', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Lookup Appearance', async (t) => {
    const LOOOKUP_BOX_CLASS = 'dx-lookup';
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${LOOOKUP_BOX_CLASS}`).nth(0))
      .wait(200);

    await t
      .click($(`.${LOOOKUP_BOX_CLASS}`).nth(1))
      .wait(200);

    await takeScreenshot('lookup_templates_custom_appearance.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
