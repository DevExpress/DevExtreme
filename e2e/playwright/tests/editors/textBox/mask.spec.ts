import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import TextBox from '../../../models/textBox';

test.describe('TextBox_mask', () => {
  test('"!" character should not be accepted if mask restricts it (T1156419)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'textBox');
    await createWidget(page, 'dxTextBox', {
      mask: '9',
    }, '#textBox');

    const { input } = new TextBox(page, '#textBox');

    await input.click();
    await input.evaluate((element: HTMLInputElement) => { element.setSelectionRange(0, 0); });
    await input.pressSequentially('!');

    await expect(input).toHaveValue('_');
  });
});
