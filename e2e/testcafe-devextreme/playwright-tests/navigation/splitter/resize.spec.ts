import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Splitter_integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('non resizable pane should not change its size during resize', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
    width: '100%',
    height: 300,
    dataSource: [{
      text: 'Pane_1',
    }, {
      text: 'Pane_1',
    }, {
      text: 'Pane_3',
      size: '300px',
      resizable: false,
    }],
  });

    const pane3Width = await page.evaluate(() => {
      const items = document.querySelectorAll('.dx-splitter-item');
      const item = items[2] as HTMLElement;
      return item ? item.clientWidth : null;
    });
    expect(pane3Width).toBe(300);

    await page.setViewportSize({ width: 400, height: 400 });

    const pane3WidthAfterResize = await page.evaluate(() => {
      const items = document.querySelectorAll('.dx-splitter-item');
      const item = items[2] as HTMLElement;
      return item ? item.clientWidth : null;
    });
    expect(pane3WidthAfterResize).toBe(145);

    });
});
