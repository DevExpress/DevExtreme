import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Scrollable from '../../../model/scrollView/internal/scrollable';
import { appendElementTo } from '../helpers/domUtils';
import { ScrollableDirection } from '../../../../../js/renovation/ui/scroll_view/common/types';

fixture`Scrollable_visibility_integration`
  .page(url(__dirname, '../../container.html'));

(['both'] as ScrollableDirection[]).forEach((direction) => {
  [false, true].forEach((useNative) => {
    [false, true].forEach((rtlEnabled) => {
      [false, true].forEach((useSimulatedScrollbar) => {
        test(`Scroll should save position on visibility change, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtlEnabled: ${rtlEnabled},`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const scrollable = new Scrollable('#container', { direction, useNative, useSimulatedScrollbar });
          await scrollable.apiScrollTo({ left: 10, top: 20 });
          await t
            .expect(await takeScreenshot(`Scroll position before hide, useNative:${useNative},rtl:${rtlEnabled},useSimScrollbar:${useSimulatedScrollbar}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());

          await scrollable.hide();

          await scrollable.apiScrollTo({ left: 0, top: 0 });
          await scrollable.show();

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 10, top: 20 });
          await t
            .expect(await takeScreenshot(`Scroll position after show, useNative:${useNative},rtl:${rtlEnabled},useSimScrollbar:${useSimulatedScrollbar}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          await appendElementTo('#container', 'div', 'content', {
            width: '100px', height: '100px', backgroundColor: 'skyblue',
          });

          return createWidget('dxScrollable', {
            width: 50,
            height: 50,
            useNative,
            rtlEnabled,
            useSimulatedScrollbar,
            direction,
            showScrollbar: 'always',
          });
        });

        test(`Scroll should save position on dxhiding when scroll is hidden, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtlEnabled: ${rtlEnabled},`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const scrollable = new Scrollable('#container', { direction, useNative, useSimulatedScrollbar });
          await scrollable.apiScrollTo({ left: 10, top: 20 });
          await t
            .expect(await takeScreenshot(`Scroll position before hide, useNative:${useNative},rtl:${rtlEnabled},useSimScrollbar:${useSimulatedScrollbar}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());

          await scrollable.apiTriggerHidingEvent();
          await scrollable.hide();

          await scrollable.apiScrollTo({ left: 0, top: 0 });
          await scrollable.show();
          await scrollable.apiTriggerShownEvent();

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 10, top: 20 });
          await t
            .expect(await takeScreenshot(`Scroll position restored after show, useNative:${useNative},rtl: ${rtlEnabled},useSimScrollbar:${useSimulatedScrollbar}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          await appendElementTo('#container', 'div', 'content', {
            width: '100px', height: '100px', backgroundColor: 'skyblue',
          });

          return createWidget('dxScrollable', {
            width: 50,
            height: 50,
            useNative,
            rtlEnabled,
            useSimulatedScrollbar,
            direction,
            showScrollbar: 'always',
          });
        });
      });
    });
  });
});
