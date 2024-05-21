import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const PANE_CONTENT_CLASS = 'dx-splitter-item-content';

fixture('Splitter.Overview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Splitter', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Correct Focus styles on every Item Panes', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${PANE_CONTENT_CLASS}`).nth(0));

    await testScreenshot(t, takeScreenshot, 'Splitter_Focused_Left_Pane.png');

    await t
      .pressKey('tab tab');

    await testScreenshot(t, takeScreenshot, 'Splitter_Focused_Central_Pane.png');

    await t
      .pressKey('tab tab');

    await testScreenshot(t, takeScreenshot, 'Splitter_Focused_Nested_Left_Pane.png');

    await t
      .pressKey('tab tab');

    await testScreenshot(t, takeScreenshot, 'Splitter_Focused_Nested_Central_Pane.png');

    await t
      .pressKey('tab tab');

    await testScreenshot(t, takeScreenshot, 'Splitter_Focused_Nested_Right_Pane.png');

    await t
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'Splitter_Focused_Right_Pane.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
