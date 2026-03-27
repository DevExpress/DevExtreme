import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 700 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Popup can not be dragged outside of the container (window)', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 700 });
    await createWidget(page, 'dxPopup', {
    width: 100,
    height: 100,
    visible: true,
    dragEnabled: true,
    animation: undefined,
  });

    const content = page.locator('.dx-overlay-content');
    const toolbar = page.locator('.dx-popup-title');

    const popupRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };

    await (async () => {
        const box = await toolbar.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + -10000, box.y + box.height / 2 + -10000, { steps: 10 });
          await page.mouse.up();
        }
      })();

    const rect1 = await content.evaluate((el) => el.getBoundingClientRect());
    popupRect.top = rect1.top;
    popupRect.left = rect1.left;
    popupRect.right = rect1.right;
    popupRect.bottom = rect1.bottom;

    expect(popupRect.top).toBe(0);

    expect(popupRect.left).toBe(0);

    await (async () => {
        const box = await toolbar.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 10000, box.y + box.height / 2 + 10000, { steps: 10 });
          await page.mouse.up();
        }
      })();

    const rect2 = await content.evaluate((el) => el.getBoundingClientRect());
    popupRect.top = rect2.top;
    popupRect.left = rect2.left;
    popupRect.right = rect2.right;
    popupRect.bottom = rect2.bottom;

    expect(popupRect.bottom).toBe(700);

    expect(popupRect.right).toBe(700);

    });

  test('Popup can not be dragged if content bigger than container', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'popup', {});
    await appendElementTo(page, '#container', 'div', 'popupContainer', { width: '99px', height: '99px' });

    await createWidget(page, 'dxPopup', {
      position: { of: '#popupContainer' },
      container: '#popupContainer',
      visible: true,
      width: 100,
      height: 100,
      animation: undefined,
    }, '#popup');

    const content = page.locator('.dx-overlay-content');
    const toolbar = page.locator('.dx-popup-title');

    const popupPosition: { top: number; left: number } = {
      top: 0, left: 0,
    };

    const newPopupPosition: { top: number; left: number } = {
      top: 0, left: 0,
    };

    const rect1 = await content.evaluate((el) => el.getBoundingClientRect());
    popupPosition.left = rect1.left;
    popupPosition.top = rect1.top;

    await (async () => {
        const box = await toolbar.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 50, { steps: 10 });
          await page.mouse.up();
        }
      })();

    const rect2 = await content.evaluate((el) => el.getBoundingClientRect());
    newPopupPosition.left = rect2.left;
    newPopupPosition.top = rect2.top;

    expect(popupPosition.top).toBe(newPopupPosition.top);

    expect(popupPosition.left).toBe(newPopupPosition.left);

    });

  test('Popup can be dragged outside of the container if dragOutsideBoundary is enabled', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 100,
    height: 100,
    visible: true,
    dragEnabled: true,
    dragOutsideBoundary: true,
    animation: undefined,
  });

    const content = page.locator('.dx-overlay-content');
    const toolbar = page.locator('.dx-popup-title');

    const popupPosition: { top: number; left: number } = {
      top: 0, left: 0,
    };

    await (async () => {
        const box = await toolbar.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + -10000, box.y + box.height / 2 + -10000, { steps: 10 });
          await page.mouse.up();
        }
      })();

    const rect = await content.evaluate((el) => el.getBoundingClientRect());
    popupPosition.left = rect.left;
    popupPosition.top = rect.top;

    expect(popupPosition.top).toBeLessThan(0);

    expect(popupPosition.left).toBeLessThan(0);

    });
});
