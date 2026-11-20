import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Scrollable from '../../../models/scrollable';
import type { ScrollableDirection } from '../../../models/scrollable';

const PINNED_SCROLLBAR_THUMB_STYLE = '#scrollable .dx-scrollable-scroll { opacity: 1 !important; transition: none !important; }';

test.describe('Scrollable_visibility_integration', () => {
  (['both'] as ScrollableDirection[]).forEach((direction) => {
    [false, true].forEach((useNative) => {
      [false, true].forEach((rtlEnabled) => {
        [false, true].forEach((useSimulatedScrollbar) => {
          test(`Scroll should save position on dxhiding when scroll is hidden, dir: ${direction}, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtlEnabled: ${rtlEnabled}`, async ({ page }) => {
            if (useNative && useSimulatedScrollbar) {
              await insertStylesheetRulesToPage(page, PINNED_SCROLLBAR_THUMB_STYLE);
            }

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

            const expectedScrollOffsetValue = { left: 10, top: 20 };
            expect(await scrollable.scrollOffset()).toEqual(expectedScrollOffsetValue);

            await testScreenshot(page, `Scroll position before hide, useNative=${useNative},rtl=${rtlEnabled},useSimScrollbar=${useSimulatedScrollbar}.png`, { element: '#scrollable' });

            await scrollable.triggerHidingEvent();
            await scrollable.hide();
            await scrollable.scrollTo({ left: 0, top: 0 });
            await scrollable.show();
            await scrollable.triggerShownEvent();

            expect(await scrollable.scrollOffset()).toEqual(expectedScrollOffsetValue);
            await testScreenshot(page, `Scroll position after show, useNative=${useNative},rtl=${rtlEnabled},useSimScrollbar=${useSimulatedScrollbar}.png`, { element: '#scrollable' });
          });
        });
      });
    });
  });
});
