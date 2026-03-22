import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Splitter_keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The next resize handle should be focused after tab press', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
    width: 400,
    height: 400,
    dataSource: [
      { text: 'Pane_1' },
      { text: 'Pane_2' },
      { text: 'Pane_2' },
    ],
  });

    const splitter = page.locator('#container');

    await page.click(splitter.resizeHandles.nth(0));

    await page.expect(splitter.getResizeHandle(0).isFocused)
      .ok()
      .expect(splitter.getResizeHandle(1).isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(splitter.getResizeHandle(0).isFocused)
      .notOk()
      .expect(splitter.getResizeHandle(1).isFocused)
      .ok();

    });

  test('The previous resize handle should be focused after shift+tab press', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
    width: 400,
    height: 400,
    dataSource: [
      { text: 'Pane_1' },
      { text: 'Pane_2' },
      { text: 'Pane_2' },
    ],
  });

    const splitter = page.locator('#container');

    await page.click(splitter.resizeHandles.nth(1));

    await page.expect(splitter.getResizeHandle(1).isFocused)
      .ok()
      .expect(splitter.getResizeHandle(0).isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(splitter.getResizeHandle(1).isFocused)
      .notOk()
      .expect(splitter.getResizeHandle(0).isFocused)
      .ok();

    });

  [true, false].forEach((allowKeyboardNavigation) => {
    test(`The resize handle should not change its focused state after the pane collapses, allowKeyboardNavigation=${allowKeyboardNavigation}`, async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      width: 400,
      height: 400,
      allowKeyboardNavigation,
      dataSource: [
        { text: 'Pane_1', collapsible: true },
        { text: 'Pane_2' },
      ],
    });

      const splitter = page.locator('#container');

      await page.click(splitter.getResizeHandle(0).getCollapsePrev());

      if (allowKeyboardNavigation) {
        await page.expect(splitter.getResizeHandle(0).isFocused)
          .ok();
      } else {
        await page.expect(splitter.getResizeHandle(0).isFocused)
          .notOk();
      }

    });
  });
});
