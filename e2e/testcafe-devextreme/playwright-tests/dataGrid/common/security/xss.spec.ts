import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('XSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The XSS script does not run when the markup has been replaced with text', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).xssAttackResult = false;
    });

    await createWidget(page, 'dxFilterBuilder', {
      fields: [{
        dataField: 'field',
        caption: '<img src=x onerror="window.xssAttackResult=true">',
      }],
      value: ['field', '=', 'test'],
    });

    const xssResult = await page.evaluate(() => (window as any).xssAttackResult);
    expect(xssResult).toBe(false);

    const filterBuilderText = await page.locator('.dx-filterbuilder-item-field').textContent();
    expect(filterBuilderText).toContain('<img');
  });
});
