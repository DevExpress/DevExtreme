import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

const BUTTON_CLASS = 'dx-dropdowneditor-button';

test.describe('Drop Down Box\'s Popup', () => {
  test.use({ browserSize: [900, 600] });

  test('Popup should have correct height when DropDownBox is opened first time (T1130045)', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', {
      dropDownOptions: {
        templatesRenderAsynchronously: true,
      },
      contentTemplate: '<div style="height: 400px"></div>',
    });

    await page.locator(`.${BUTTON_CLASS}`).click();

    await testScreenshot(page, 'Popup has correct height on the first opening.png');
  });
});
