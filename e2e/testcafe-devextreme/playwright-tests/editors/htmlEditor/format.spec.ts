import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container-extended.html')}`;

test.describe('HtmlEditor - formats', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

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

    const selectBox = page.locator('.dx-font-format');

    await selectBox.click();

    const list = await selectBox.getList();

    await list.getItem().element.click();

    expect(selectBox.value).toBe('Arial')
      .pressKey('k')
      .pressKey('enter')
      .expect(selectBox.value)
      .eql('Arial');

    });
});
