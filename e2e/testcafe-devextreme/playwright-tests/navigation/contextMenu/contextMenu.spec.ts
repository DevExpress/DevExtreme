import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ContextMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Context menu should be shown in the same position when item was added in runtime (T755681)', async ({ page }) => {

    const menuTargetID = 'menuTarget';
    await appendElementTo(page, '#container', 'div', 'contextMenu');
    await appendElementTo(page, '#container', 'button', menuTargetID, {
      width: '150px', height: '50px', backgroundColor: 'steelblue',
    });

    await createWidget(page, 'dxContextMenu', {
      items: [{ text: 'item1' }],
      showEvent: 'dxclick',
      target: `#${menuTargetID}`,
      onShowing: (e) => {
        if (!(window as any).isItemAdded) {
          setTimeout(() => {
            (window as any).isItemAdded = true;
            const items = e.component.option('items');
            items.push({ text: 'item 2' });
            e.component.option('items', items);
          }, 1000);
        }
      },
    }, '#contextMenu');

    const target = page.locator('#menuTarget');

    await target.click();
    await expect(page.locator('.dx-context-menu')).toBeVisible();

    const initialOverlayOffset = await page.evaluate(() => {
      const overlay = $('.dx-context-menu').dxContextMenu('instance')['_overlay'];
      if (overlay) {
        const el = overlay.content().get(0);
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      }
      return null;
    });

    await expect(page.locator('.dx-context-menu .dx-menu-item')).toHaveCount(1);

    await page.waitForFunction(() => {
      const items = ($('#contextMenu') as any).dxContextMenu('instance').option('items');
      return items && items.length === 2;
    }, { timeout: 5000 });

    await expect(page.locator('.dx-context-menu .dx-menu-item')).toHaveCount(2);

    const finalOverlayOffset = await page.evaluate(() => {
      const overlay = $('.dx-context-menu').dxContextMenu('instance')['_overlay'];
      if (overlay) {
        const el = overlay.content().get(0);
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      }
      return null;
    });

    if (initialOverlayOffset && finalOverlayOffset) {
      expect(finalOverlayOffset.top).toBe(initialOverlayOffset.top);
      expect(finalOverlayOffset.left).toBe(initialOverlayOffset.left);
    }

    });
});
