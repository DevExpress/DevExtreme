import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const BUTTON_CLASS = 'dx-button';
const TOOLBAR_CLASS = 'dx-toolbar';
const BOTTOM_TOOLBAR_CLASS = 'dx-popup-bottom';

fixture('Popup.Scrolling')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Popup', 'Scrolling', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Scrolling', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(Selector(`.${BUTTON_CLASS}`).nth(0));
    await testScreenshot(t, takeScreenshot, 'popup with scrollable container.png');

    await t.click(Selector(`.${OVERLAY_WRAPPER_CLASS} .${TOOLBAR_CLASS}.${BOTTOM_TOOLBAR_CLASS} .${BUTTON_CLASS}`));

    await t.click(Selector(`.${BUTTON_CLASS}`).nth(1));
    await testScreenshot(t, takeScreenshot, 'popup with scrollview.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
