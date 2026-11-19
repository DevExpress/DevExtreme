import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { isMaterial } from '../../../helpers/themeUtils';
import SelectBox from '../../../models/selectBox';

test.describe('SelectBox as Toolbar item', () => {
  test('SelectBox should correctly render its buttons if editor is rendered as a Toolbar item with fieldTemplate (T949859)', async ({ page, theme }) => {
    await createWidget(page, 'dxToolbar', () => ({
      items: [
        {
          widget: 'dxSelectBox',
          options: {
            buttons: [
              {
                name: 'test',
                options: {
                  text: 'test',
                },
              },
            ],
            fieldTemplate: (_, wrapper) => {
              ($('<div>').appendTo(wrapper) as any).dxTextBox();
            },
            items: [1, 2, 3, 4],
          },
        },
      ],
    }));

    const selectBox = new SelectBox(page, '#container');

    // innerText, as TestCafe read it: Material capitalizes the text with CSS.
    await expect(selectBox.getButton(0).text)
      .toHaveText(isMaterial(theme) ? 'TEST' : 'test', { useInnerText: true });
  });
});
