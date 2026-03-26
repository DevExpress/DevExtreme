import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TagBox_Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const stylingModes = ['outlined', 'underlined', 'filled'];
  const labelModes = ['static', 'floating', 'hidden', 'outside'];

  stylingModes.forEach((stylingMode) => {
    test(`Label for dxTagBox stylingMode=${stylingMode}`, async ({ page }) => {
      await page.setViewportSize({ width: 300, height: 800 });

      const componentOptions = {
        label: 'label text',
        items: [...Array(10)].map((_, i) => `item${i}`),
        value: [...Array(5)].map((_, i) => `item${i}`),
        stylingMode,
      };

      if (isMaterial()) {
        await insertStylesheetRulesToPage(page, '#container .dx-widget { font-family: sans-serif }');
      }

      await appendElementTo(page, '#container', 'div', 'tagBox1', { });
      await appendElementTo(page, '#container', 'div', 'tagBox2', { });

      await createWidget(page, 'dxTagBox', {
        ...componentOptions,
        multiline: false,
      }, '#tagBox1');

      await createWidget(page, 'dxTagBox', {
        ...componentOptions,
        multiline: true,
      }, '#tagBox2');


      await page.locator('#tagBox2').click();

      await testScreenshot(page, `TagBox label with stylingMode=${stylingMode}.png`);

    });

    labelModes.forEach((labelMode) => {
      test(`Label shouldn't be cutted for dxTagBox in stylingMode=${stylingMode}, labelMode=${labelMode} (T1104913)`, async ({ page }) => {
        await page.setViewportSize({ width: 300, height: 400 });

        await setStyleAttribute(page, '#container', 'top: 250px;');

        await createWidget(page, 'dxTagBox', {
          width: 200,
          label: 'Label text',
          labelMode,
          stylingMode,
          dataSource: {
            load() {
              return new Promise((resolve) => {
                resolve([
                  { text: 'item_1' },
                  { text: 'item_2' },
                  { text: 'item_3' },
                  { text: 'item_4' },
                ]);
              });
            },
            paginate: true,
            pageSize: 20,
          },
        });


        const tagBox = page.locator('#container');

        await tagBox.click();

        const screenshotName = `TagBox label with stylingMode=${stylingMode},labelMode=${labelMode}.png`;

        await tagBox.click();
        await tagBox.click();

        await testScreenshot(page, screenshotName);

    });
    });
  });
});
