import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DropDownBox.MultipleSelection')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('DropDownBox', 'MultipleSelection', ['jQuery'/* , 'React', 'Vue', 'Angular'*/], (test) => {
  test('MultipleSelection', async (t) => {
    const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${DROP_DOWN_BOX_CLASS}`).nth(0))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'dropdownbox_multiple_selection_treebox.png');

    await t
      .click($(`.${DROP_DOWN_BOX_CLASS}`).nth(0))
      .wait(200);

    await t
      .click($(`.${DROP_DOWN_BOX_CLASS}`).nth(1))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'dropdownbox_multiple_selection_gridbox.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
