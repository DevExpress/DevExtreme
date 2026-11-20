import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import SelectBox from '../../../models/selectBox';

test.describe('HtmlEditor - formats', () => {
  test('HtmlEditor should keep actual format after "enter" key pressed (T922236)', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 200,
      toolbar: {
        items: [
          'bold',
          {
            name: 'font',
            acceptedValues: ['Arial', 'Terminal'],
          },
        ],
      },
    });

    const selectBox = new SelectBox(page, '.dx-font-format');

    await selectBox.element.click();

    const list = await selectBox.getList();

    await list.getItem().element.click();

    await expect(selectBox.input).toHaveValue('Arial');

    await page.keyboard.press('k');
    await page.keyboard.press('Enter');

    await expect(selectBox.input).toHaveValue('Arial');
  });
});
