import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const STATIC_BUTTON_CLASS = 'dx-dropdownbutton';
const CUSTOM_BUTTON_SELECTOR = 'dx-dropdownbutton-toggle';

fixture('DropDownButton.Overview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('DropDownButton', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Overview Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${STATIC_BUTTON_CLASS}`).nth(0))
      .wait(200);

    await takeScreenshot('dropdown_button_overview_custom_static_text.png');

    await t
      .click($(`.${STATIC_BUTTON_CLASS}`).nth(0))
      .wait(200);

    await t
      .click($(`.${CUSTOM_BUTTON_SELECTOR}`))
      .wait(200);

    await takeScreenshot('dropdown_button_overview_custom_button_action.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
