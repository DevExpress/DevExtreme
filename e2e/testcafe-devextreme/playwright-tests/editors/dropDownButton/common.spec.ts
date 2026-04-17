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

  test('Item collection should be updated after direct option changing (T817436)', async ({ page }) => {
    await page.evaluate(() => {
      const div1 = document.createElement('div');
      div1.id = 'dropDownButton1';
      document.querySelector('#container')?.appendChild(div1);

      const div2 = document.createElement('div');
      div2.id = 'dropDownButton2';
      document.querySelector('#container')?.appendChild(div2);
    });

    await createWidget(page, 'dxDropDownButton', {
      items: [{ text: 'text1' }, { text: 'text2' }],
      displayExpr: 'text',
    }, '#dropDownButton1');

    await createWidget(page, 'dxDropDownButton', {
      dataSource: [{ text: 'text1' }, { text: 'text2' }],
      displayExpr: 'text',
    }, '#dropDownButton2');

    await page.locator('#dropDownButton1').click();
    await page.locator('#dropDownButton2').click();

    const isFirstItemDisabled = (selector: string) => page.evaluate((sel) => {
      const list = document.querySelector(`${sel} .dx-list, .dx-popup-wrapper .dx-list`);
      if (!list) return false;
      const firstItem = list.querySelector('.dx-list-item');
      return firstItem?.classList.contains('dx-state-disabled') ?? false;
    }, selector);

    expect(await isFirstItemDisabled('#dropDownButton1')).toBe(false);
    expect(await isFirstItemDisabled('#dropDownButton2')).toBe(false);

    await page.evaluate(() => {
      ($('#dropDownButton1') as any).dxDropDownButton('instance').option('items[0].disabled', true);
      ($('#dropDownButton2') as any).dxDropDownButton('instance').option('dataSource[0].disabled', true);
    });

    await page.locator('#dropDownButton1').click();

    const list1ItemDisabled = await page.evaluate(() => {
      const popups = document.querySelectorAll('.dx-popup-wrapper');
      for (const popup of popups) {
        if (popup.querySelector('.dx-list')) {
          const item = popup.querySelector('.dx-list-item');
          return item?.classList.contains('dx-state-disabled') ?? false;
        }
      }
      return false;
    });
    expect(list1ItemDisabled).toBe(true);

    await page.locator('#dropDownButton2').click();

    const list2ItemDisabled = await page.evaluate(() => {
      const popups = document.querySelectorAll('.dx-popup-wrapper');
      let lastPopupWithList: Element | null = null;
      for (const popup of popups) {
        if (popup.querySelector('.dx-list')) {
          lastPopupWithList = popup;
        }
      }
      if (!lastPopupWithList) return false;
      const item = lastPopupWithList.querySelector('.dx-list-item');
      return item?.classList.contains('dx-state-disabled') ?? false;
    });
    expect(list2ItemDisabled).toBe(true);
  });

  test('DropDownButton renders correctly', async ({ page }) => {
    const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
    const BUTTON_GROUP_CLASS = 'dx-buttongroup';
    const stylingModes = ['text', 'outlined', 'contained'];

    for (const rtlEnabled of [false, true]) {
      for (const stylingMode of stylingModes) {
        const labelId = `label-${stylingMode}-${rtlEnabled}`;
        await page.evaluate(({ parentSel, elId, text }) => {
          const div = document.createElement('div');
          div.id = elId;
          div.style.fontSize = '10px';
          div.textContent = text;
          document.querySelector(parentSel)?.appendChild(div);
        }, { parentSel: '#container', elId: labelId, text: `StylingMode: ${stylingMode}, rtlEnabled: ${rtlEnabled}` });

        for (const splitButton of [true, false]) {
          for (const showArrowIcon of [true, false]) {
            for (const icon of ['image', '']) {
              for (const text of ['', 'Text']) {
                const id = `ddb-${stylingMode}-${rtlEnabled}-${splitButton}-${showArrowIcon}-${icon || 'noicon'}-${text || 'notext'}`;

                await page.evaluate(({ parentSel, elId }) => {
                  const div = document.createElement('div');
                  div.id = elId;
                  document.querySelector(parentSel)?.appendChild(div);
                }, { parentSel: '#container', elId: id });

                await createWidget(page, 'dxDropDownButton', {
                  rtlEnabled,
                  items: [{ text: 'text1' }, { text: 'text2' }],
                  displayExpr: 'text',
                  type: 'normal',
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

    await testScreenshot(page, 'DropDownButton render.png');
  });

  [false, true].forEach((splitButton) => {
    test(`Button template, splitButton=${splitButton}`, async ({ page }) => {
      await createWidget(page, 'dxDropDownButton', {
        splitButton,
        width: 200,
        template: () => $('<div>Custom text<i class="dx-icon-user"></i></div>'),
      });

      await testScreenshot(page, `Button template, splitButton=${splitButton}.png`, { element: '#container' });
    });
  });
});
