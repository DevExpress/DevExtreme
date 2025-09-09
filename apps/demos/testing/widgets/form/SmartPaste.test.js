import { Selector as $, ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const buttonGroupClass = 'buttons-group';
const buttonClass = 'dx-button';

fixture('Form.SmartPaste')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 1200];
  });

runManualTest('Form', 'SmartPaste', (test) => {
  test('SmartPaste loading', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const setClipboard = ClientFunction((text) => {
        navigator.clipboard.readText = () => Promise.resolve(text);
    });

    await setClipboard('some text');

    const smartPasteButton = $(`.${buttonGroupClass} .${buttonClass}`).nth(0);
    await t.click(smartPasteButton);

    await testScreenshot(t, takeScreenshot, 'form_smartpaste_loading.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
