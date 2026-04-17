import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const labelModes = ['floating', 'static', 'outside'];
  const stylingModes = ['outlined', 'underlined', 'filled'];

  test('Label scroll input dxTextArea', async ({ page }) => {
    await createWidget(page, 'dxTextArea', {
    height: 50,
    width: 200,
    text: `this content is ${'very '.repeat(10)}long`,
    label: 'label text',
  });

    const input = page.locator('#container .dx-texteditor-input');

    await input.evaluate((el) => { el.scrollTop = 20; });

    await testScreenshot(page, 'TextArea label after scroll.png', { element: '#container' });

    });

  stylingModes.forEach((stylingMode) => {
    labelModes.forEach((labelMode) => {
      test(`Label for dxTextArea labelMode=${labelMode} stylingMode=${stylingMode}`, async ({ page }) => {
        await page.setViewportSize({ width: 300, height: 400 });

        await appendElementTo(page, '#container', 'div', 'textArea1', { });
        await appendElementTo(page, '#container', 'div', 'textArea2', { });

        await createWidget(page, 'dxTextArea', {
          width: 100,
          label: 'label',
          text: '',
          labelMode,
          stylingMode,
        }, '#textArea1');

        await createWidget(page, 'dxTextArea', {
          label: `this label is ${'very '.repeat(10)}long`,
          text: `this content is ${'very '.repeat(10)}long`,
          items: ['item1', 'item2'],
          labelMode,
          stylingMode,
        }, '#textArea2');


        await page.locator('#textArea2').click();

        await testScreenshot(page, `TextArea with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`);

    });
    });
  });
});
