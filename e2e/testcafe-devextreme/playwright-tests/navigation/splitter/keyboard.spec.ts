import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const CLASS = {
  resizeHandle: 'dx-resize-handle',
  focused: 'dx-state-focused',
  collapsePrev: 'dx-resize-handle-collapse-prev-pane',
};

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

    const resizeHandles = page.locator(`#container .${CLASS.resizeHandle}`);

    await resizeHandles.nth(0).click();

    await expect(resizeHandles.nth(0)).toHaveClass(new RegExp(CLASS.focused));
    expect(await resizeHandles.nth(1).evaluate((el, cls) => el.classList.contains(cls), CLASS.focused)).toBe(false);

    await page.keyboard.press('Tab');

    expect(await resizeHandles.nth(0).evaluate((el, cls) => el.classList.contains(cls), CLASS.focused)).toBe(false);
    await expect(resizeHandles.nth(1)).toHaveClass(new RegExp(CLASS.focused));

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

    const resizeHandles = page.locator(`#container .${CLASS.resizeHandle}`);

    await resizeHandles.nth(1).click();

    await expect(resizeHandles.nth(1)).toHaveClass(new RegExp(CLASS.focused));
    expect(await resizeHandles.nth(0).evaluate((el, cls) => el.classList.contains(cls), CLASS.focused)).toBe(false);

    await page.keyboard.press('Shift+Tab');

    expect(await resizeHandles.nth(1).evaluate((el, cls) => el.classList.contains(cls), CLASS.focused)).toBe(false);
    await expect(resizeHandles.nth(0)).toHaveClass(new RegExp(CLASS.focused));

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

      const resizeHandle = page.locator(`#container .${CLASS.resizeHandle}`).nth(0);
      const collapsePrevBtn = resizeHandle.locator(`.${CLASS.collapsePrev}`);

      await collapsePrevBtn.click();

      if (allowKeyboardNavigation) {
        await expect(resizeHandle).toHaveClass(new RegExp(CLASS.focused));
      } else {
        expect(await resizeHandle.evaluate((el, cls) => el.classList.contains(cls), CLASS.focused)).toBe(false);
      }

    });
  });
});
