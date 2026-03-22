import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Splitter_events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Panes should not be able to resize when onResizeStart event canceled', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
    width: 408,
    height: 408,
    onResizeStart(e) {
      const { event } = e;
      event.cancel = true;
    },
    dataSource: [{ size: '200px' }, { size: '200px' }],
  });

    const splitter = page.locator('#container');

    await (async () => {
        const box = await splitter.resizeHandles.nth(0).boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 0, { steps: 10 });
          await page.mouse.up();
        }
      })();

    await expect(splitter.option('items[0].size')).eql(200);
    await expect(splitter.option('items[1].size')).eql(200);

    });
});
