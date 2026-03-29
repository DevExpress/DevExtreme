import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, Scrollable } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Scrollable_visibility_integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

  (['both'] as ScrollableDirection[]).forEach((direction) => {
    [false, true].forEach((useNative) => {
      [false, true].forEach((rtlEnabled) => {
        [false, true].forEach((useSimulatedScrollbar) => {
          test(`Scroll should save position on dxhiding when scroll is hidden, dir: ${direction}, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtlEnabled: ${rtlEnabled}`, async ({ page }) => {

            await appendElementTo(page, '#container', 'div', 'scrollable');

            await appendElementTo(page, '#scrollable', 'div', 'content', {
              width: '200px', height: '200px', backgroundColor: 'skyblue',
            });

            await createWidget(page, 'dxScrollable', {
              width: 100,
              height: 100,
              useNative,
              rtlEnabled,
              useSimulatedScrollbar,
              direction,
              showScrollbar: 'always',
            }, '#scrollable');


            const scrollable = new Scrollable(page, '#scrollable', { direction, useNative, useSimulatedScrollbar });
            await scrollable.scrollTo({ left: 10, top: 20 });
            await page.waitForTimeout(100);

            const expectedScrollOffsetValue = { left: 10, top: 20 };
            await expect(await scrollable.scrollOffset()).eql(expectedScrollOffsetValue);

            await testScreenshot(page, `Scroll position before hide, useNative=${useNative},rtl=${rtlEnabled},useSimScrollbar=${useSimulatedScrollbar}.png`, { element: page.locator('#scrollable') });

            await scrollable.triggerHidingEvent();
            await scrollable.hide();
            await scrollable.scrollTo({ left: 0, top: 0 });
            await scrollable.show();
            await scrollable.triggerShownEvent();
            await page.waitForTimeout(100);

            await expect(await scrollable.scrollOffset()).eql(expectedScrollOffsetValue);
            await testScreenshot(page, `Scroll position after show, useNative=${useNative},rtl=${rtlEnabled},useSimScrollbar=${useSimulatedScrollbar}.png`, { element: page.locator('#scrollable') });

    });
        });
      });
    });
  });
});
