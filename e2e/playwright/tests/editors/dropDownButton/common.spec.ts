import { randomUUID } from 'node:crypto';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import DropDownButton from '../../../models/dropDownButton';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['normal', 'default', 'danger', 'success'];

test.describe('Drop Down Button', () => {
  test('Item collection should be updated after direct option changing (T817436)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'dropDownButton1');
    await appendElementTo(page, '#container', 'div', 'dropDownButton2');

    await createWidget(page, 'dxDropDownButton', {
      items: [{ text: 'text1' }, { text: 'text2' }],
      displayExpr: 'text',
    }, '#dropDownButton1');

    await createWidget(page, 'dxDropDownButton', {
      dataSource: [{ text: 'text1' }, { text: 'text2' }],
      displayExpr: 'text',
    }, '#dropDownButton2');

    const dropDownButton1 = new DropDownButton(page, '#dropDownButton1');
    const dropDownButton2 = new DropDownButton(page, '#dropDownButton2');

    await dropDownButton1.element.click();
    const list1 = await dropDownButton1.getList();
    await dropDownButton2.element.click();
    const list2 = await dropDownButton2.getList();

    await list1.getItem().expectDisabled(false);
    await list2.getItem().expectDisabled(false);

    await dropDownButton1.option('items[0].disabled', true);
    await dropDownButton2.option('dataSource[0].disabled', true);

    await dropDownButton1.element.click();
    await list1.getItem().expectDisabled();
    await dropDownButton2.element.click();
    await list2.getItem().expectDisabled();
  });

  [undefined, 120].forEach((width) => {
    types.forEach((type) => {
      if (width && type !== 'normal') {
        return;
      }

      test(`DropDownButton renders correctly, width=${width}, type=${type}`, async ({ page }) => {
        for (const rtlEnabled of [false, true]) {
          for (const stylingMode of stylingModes) {
            const captionId = `${stylingMode}-${rtlEnabled}`;

            await appendElementTo(page, '#container', 'div', captionId, { fontSize: '10px' });
            await page.evaluate(({ id, text }) => {
              $(`#${id}`).text(text);
            }, { id: captionId, text: `StylingMode: ${stylingMode}, rtlEnabled: ${rtlEnabled}` });

            for (const splitButton of [true, false]) {
              for (const showArrowIcon of [true, false]) {
                for (const icon of ['image', '']) {
                  for (const text of ['', 'Text']) {
                    const id = `dx${randomUUID()}`;

                    await appendElementTo(page, '#container', 'div', id);
                    await createWidget(page, 'dxDropDownButton', {
                      width,
                      rtlEnabled,
                      items: [{ text: 'text1' }, { text: 'text2' }],
                      displayExpr: 'text',
                      type,
                      text,
                      icon,
                      stylingMode,
                      showArrowIcon,
                      splitButton,
                    }, `#${id}`);
                  }
                }
              }
            }
          }
        }

        await insertStylesheetRulesToPage(page, `.${DROP_DOWN_BUTTON_CLASS}.dx-widget { display: inline-flex; vertical-align: middle; margin: 2px; } .${BUTTON_GROUP_CLASS} { vertical-align: middle; }`);

        await testScreenshot(page, `DropDownButton render${width ? ' with fixed width' : ''}${type !== 'normal' ? `, type=${type}` : ''}.png`);
      });
    });
  });

  [false, true].forEach((splitButton) => {
    test(`Button template, splitButton=${splitButton}`, async ({ page }) => {
      await createWidget(page, 'dxDropDownButton', (split) => ({
        splitButton: split,
        width: 200,
        template: () => $('<div>Custom text<i class="dx-icon-user"></i></div>'),
      }), '#container', { arg: splitButton });

      await testScreenshot(page, `Button template, splitButton=${splitButton}.png`, { element: '#container' });
    });
  });
});
