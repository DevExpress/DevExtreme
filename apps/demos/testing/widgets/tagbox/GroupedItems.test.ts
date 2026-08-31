import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('TagBox.Grouping')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('TagBox', 'Grouping', (test) => {
  test('Grouping', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .pressKey('tab')
      .pressKey('alt+down');

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_first_opened.png');

    await t
      .pressKey('esc');

    await t
      .pressKey('tab')
      .pressKey('alt+down');

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_second_opened.png');

    await t
      .pressKey('esc');

    await t
      .pressKey('tab')
      .pressKey('alt+down');

    // Sub-pixel noise, measured 30.08.2026: the opened list re-renders its text a pixel off between
    // runs. The looser comparison is asked for here, for this screenshot, rather than being the
    // default for every screenshot in every theme.
    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_third_opened.png', undefined, {
      looksSameComparisonOptions: { tolerance: 20, antialiasingTolerance: 20 },
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
