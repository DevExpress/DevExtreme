import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Drop Down Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
  const BUTTON_GROUP_CLASS = 'dx-buttongroup';

  const stylingModes = ['text', 'outlined', 'contained'];
  const types = ['normal', 'default', 'danger', 'success'];

  test('Item collection should be updated after direct option changing (T817436)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dropDownButton1', { });
    await appendElementTo(page, '#container', 'div', 'dropDownButton2', { });

    await createWidget(page, 'dxDropDownButton', {
      items: [{ text: 'text1' }, { text: 'text2' }],
      displayExpr: 'text',
    }, '#dropDownButton1');

    await createWidget(page, 'dxDropDownButton', {
      dataSource: [{ text: 'text1' }, { text: 'text2' }],
      displayExpr: 'text',
    }, '#dropDownButton2');

    const dropDownButton1 = page.locator('#dropDownButton1');
    const dropDownButton2 = page.locator('#dropDownButton2');

    await dropDownButton1.click();
    const list1 = await dropDownButton1.getList();
    await dropDownButton2.click();
    const list2 = await dropDownButton2.getList();

    await page.expect(list1.getItem().isDisabled).notOk()
      .expect(list2.getItem().isDisabled).notOk();

    await dropDownButton1.option('items[0].disabled', true);
    await dropDownButton2.option('dataSource[0].disabled', true);

    await dropDownButton1.click()
      .expect(list1.getItem().isDisabled)
      .ok()
      .click(dropDownButton2.element)
      .expect(list2.getItem().isDisabled)
      .ok();

    });

  [undefined, 120].forEach((width) => {
    types.forEach((type) => {
      if (width && type !== 'normal') {
        return;
      }

      test('DropDownButton renders correctly', async ({ page }) => {

        await insertStylesheetRulesToPage(page, `.${DROP_DOWN_BUTTON_CLASS}.dx-widget { display: inline-flex; vertical-align: middle; margin: 2px; } .${BUTTON_GROUP_CLASS} { vertical-align: middle; }`);

        await testScreenshot(page, `DropDownButton render${width ? ' with fixed width' : ''}${type !== 'normal' ? `, type=${type}` : ''}.png`);

    });.before(async ({ page }) => {
        t.ctx.ids = [];

        for (const rtlEnabled of [false, true]) {
          for (const stylingMode of stylingModes) {
            await appendElementTo(page, '#container', 'div', `${stylingMode}-${rtlEnabled}`, { fontSize: '10px' });
            await page.evaluate(() => {
              $(`#${stylingMode}-${rtlEnabled}`).text(`StylingMode: ${stylingMode}, rtlEnabled: ${rtlEnabled}`);
            });

            for (const splitButton of [true, false]) {
              for (const showArrowIcon of [true, false]) {
                for (const icon of ['image', '']) {
                  for (const text of ['', 'Text']) {
                    const id = `${`dx${new Guid()}`}`;

                    t.ctx.ids.push(id);
                    await appendElementTo(page, '#container', 'div', id, { });
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
      });
    });
  });

  [false, true].forEach((splitButton) => {
    test('Button template', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', {
      splitButton,
      width: 200,
      template: () => $('<div>Custom text<i class="dx-icon-user"></i></div>'),
    });

      await testScreenshot(page, `Button template, splitButton=${splitButton}.png`, { element: '#container' });

    });
  });
});
