import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  addFocusableElementBefore, appendElementTo, removeAttribute, setAttribute, waitForNextFrame,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

test.describe('ValidationMessage', () => {
  test.use({ browserSize: [300, 200] });

  test('Validation Message position should be correct after change visibility of parent container (T1095900)', async ({ page }) => {
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

    await setAttribute(page, '#container', 'hidden', 'true');
    await waitForNextFrame(page);
    await removeAttribute(page, '#container', 'hidden');

    await testScreenshot(page, 'Textbox validation message.png');
  });
});
