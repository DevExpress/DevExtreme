import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';

fixture('DropDownButton.Overview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('DropDownButton', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Overview Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${DROP_DOWN_BUTTON_CLASS}`).nth(0))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'dropdown_button_overview_custom_static_text.png');

    await t
      .click($(`.${DROP_DOWN_BUTTON_CLASS}`).nth(0))
      .wait(200);

    await t
      .click($(`.${DROP_DOWN_BUTTON_TOGGLE_CLASS}`))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'dropdown_button_overview_custom_button_action.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
