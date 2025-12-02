import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Stepper.StepTemplate')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Stepper', 'StepTemplate', (test) => {
  test('Correct focus styles when focusing on the stepper', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click('body', {
        offsetX: 10,
        offsetY: 10,
      })
      .pressKey('tab tab');

    await testScreenshot(t, takeScreenshot, 'Second stepper is focused.png');

    await t
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'Third stepper is focused.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
