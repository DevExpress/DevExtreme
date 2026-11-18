import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { addFocusableElementBefore, appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

test.describe('ValidationMessage', () => {
  test.use({ browserSize: [300, 200] });

  test('TextBox ValidationMessage position is correct', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'textbox');
    await createWidget(page, 'dxTextBox', {
      value: 'a',
      validationMessageMode: 'always',
    }, '#textbox');
    await createWidget(page, 'dxValidator', {
      validationRules: [
        {
          type: 'required',
        },
      ],
    }, '#textbox');

    await addFocusableElementBefore(page, '#container');

    await page.locator(`.${TEXTEDITOR_INPUT_CLASS}`).click();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');
    await page.locator('#focusable-start').click();

    await testScreenshot(page, 'Textbox validation message.png');
  });
});
