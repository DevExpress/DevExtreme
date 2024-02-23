import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';
const CHECKBOX_CLASS = 'dx-checkbox';
const OPTIONS_CONTAINER_CLASS = 'options-container';
const TOOLBAR_CLASS = 'dx-toolbar';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';

fixture('Toolbar.Adaptability')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Toolbar', 'Adaptability', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Adaptability', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.drag($(`.${RESIZABLE_HANDLE_RIGHT_CLASS}`), -400, 0);
    await testScreenshot(t, takeScreenshot, 'toolbar_multiline_mode_minimize.png');

    await t.click($(`.${OPTIONS_CONTAINER_CLASS} .${CHECKBOX_CLASS}`));
    await testScreenshot(t, takeScreenshot, 'toolbar_singleline_mode_init.png');

    await t.click($(`.${TOOLBAR_CLASS} .${DROP_DOWN_MENU_BUTTON_CLASS}`));
    await testScreenshot(t, takeScreenshot, 'toolbar_singleline_mode_menu_open.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
