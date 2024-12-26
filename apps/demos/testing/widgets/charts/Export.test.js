import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Charts.Export')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'ExportCustomMarkup', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Export', async (t) => {
    let dialogAppeared = false;

    await t.setNativeDialogHandler(() => {
      dialogAppeared = true;
      return false;
    });

    await t.click('dx-button[icon=export]');

    await t.expect(dialogAppeared).ok('Save dialog should appear');
  });
});
