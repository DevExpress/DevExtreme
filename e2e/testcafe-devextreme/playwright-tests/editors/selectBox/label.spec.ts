import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const labelMods = ['floating', 'static', 'outside'];
  const stylingModes = ['outlined', 'underlined', 'filled'];

  stylingModes.forEach((stylingMode) => {
    labelMods.forEach((labelMode) => {
      test(`Label for dxSelectBox labelMode=${labelMode} stylingMode=${stylingMode}`, async ({ page }) => {

        await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

        await appendElementTo(page, '#container', 'div', 'selectBox1');
        await appendElementTo(page, '#container', 'div', 'selectBox2');

        await createWidget(page, 'dxSelectBox', {
          width: 100,
          label: 'label',
          text: '',
          labelMode,
          stylingMode,
        }, '#selectBox1');

        await createWidget(page, 'dxSelectBox', {
          label: `this label is ${'very '.repeat(10)}long`,
          text: `this content is ${'very '.repeat(10)}long`,
          items: ['item1', 'item2'],
          labelMode,
          stylingMode,
        }, '#selectBox2');


        const selectBox2 = page.locator('#selectBox2');

        await page.locator('#selectBox2').click();

        await testScreenshot(page, `SelectBox with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`, { element: '#container' });

        await click(await selectBox2.getPopup());

    });
    });
  });
});
