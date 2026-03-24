import { test, expect } from '@playwright/test';
import { createWidget, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('SelectBox as Toolbar item', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('SelectBox should correctly render its buttons if editor is rendered as a Toolbar item with fieldTemplate (T949859)', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
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
            fieldTemplate: (_: unknown, wrapper: any) => {
              ($('<div>').appendTo(wrapper) as any).dxTextBox();
            },
            items: [1, 2, 3, 4],
          },
        },
      ],
    });

    const buttonText = await page.locator('#container .dx-texteditor-button-container .dx-button .dx-button-text').innerText();
    expect(buttonText.toLowerCase()).toBe('test');
  });
});
