import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Popup should be centered regarding the container even if container is animated (T920408)', async ({ page }) => {
    // skipped: requires .before() setup, asyncForEach, getBoundingClientRectProperty
  });

  test.skip('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async ({ page }) => {
    // skipped: requires .before() setup, asyncForEach, getBoundingClientRectProperty
  });

  test.skip('There should not be any errors when position.of is html (T946851)', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      position: { of: 'html' },
      visible: true,
    });

    expect(true).toBeTruthy();
  });

  test.skip('Popup should be centered regarding the window after position.boundary is set to window', async ({ page }) => {
    // skipped: requires ClientFunction, Popup page object, asyncForEach
  });
});
