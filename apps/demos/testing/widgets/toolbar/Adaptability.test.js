import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';
const CHECKBOX_ICON_CLASS = 'dx-checkbox-icon';
const OPTIONS_CONTAINER_CLASS = 'options-container';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';

fixture('Toolbar.Adaptability')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Toolbar', 'Adaptability', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Adaptability', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .drag(Selector(`.${RESIZABLE_HANDLE_RIGHT_CLASS}`), -400, 0, { speed: 0.5 });

    await testScreenshot(t, takeScreenshot, 'toolbar_multiline_mode_minimize.png');

    await t
      .click(Selector(`.${OPTIONS_CONTAINER_CLASS}`).find(`.${CHECKBOX_ICON_CLASS}`))
      .wait(300);

    await testScreenshot(t, takeScreenshot, 'toolbar_singleline_mode_init.png');

    await t
      .click(Selector(`.${DROP_DOWN_MENU_BUTTON_CLASS}`));

    await testScreenshot(t, takeScreenshot, 'toolbar_singleline_mode_menu_open.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
