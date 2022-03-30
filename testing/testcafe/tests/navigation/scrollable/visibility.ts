/* eslint-disable max-len */
// import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
// import { Selector } from 'testcafe';
// import url from '../../../helpers/getPageUrl';
// import createWidget from '../../../helpers/createWidget';
// import Scrollable from '../../../model/scrollView/internal/scrollable';
// import { appendElementTo } from '../helpers/domUtils';
// import { ScrollableDirection } from '../../../../../js/renovation/ui/scroll_view/common/types';

// fixture`Scrollable_visibility_integration`
//   .page(url(__dirname, '../../container.html'));

// (['both'] as ScrollableDirection[]).forEach((direction) => {
//   [false, true].forEach((useNative) => {
//     [false, true].forEach((rtlEnabled) => {
//       [false, true].forEach((useSimulatedScrollbar) => {
//         test(`Scroll should save position on dxhiding when scroll is hidden, dir: ${direction}, useNative: ${useNative}, useSimulatedScrollbar: ${useSimulatedScrollbar}, rtlEnabled: ${rtlEnabled}`, async (t) => {
//           const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//           const scrollable = new Scrollable('#container', { direction, useNative, useSimulatedScrollbar });
//           await scrollable.apiScrollTo({ left: 10, top: 20 });

//           const expectedScrollOffsetValue = { left: 10, top: 20 };
//           await t.expect(await scrollable.apiScrollOffset()).eql(expectedScrollOffsetValue);

//           await t
//             .expect(await takeScreenshot(`Scroll position before hide, useNative=${useNative},rtl=${rtlEnabled},useSimScrollbar=${useSimulatedScrollbar}.png`, Selector('#container')))
//             .ok()
//             .expect(compareResults.isValid())
//             .ok(compareResults.errorMessages());

//           await scrollable.apiTriggerHidingEvent();
//           await scrollable.hide();
//           await scrollable.apiScrollTo({ left: 0, top: 0 });
//           await scrollable.show();
//           await scrollable.apiTriggerShownEvent();

//           await t.debug();
//           await t.expect(await scrollable.apiScrollOffset()).eql(expectedScrollOffsetValue);
//           await t
//             .expect(await takeScreenshot(`Scroll position after show, useNative=${useNative},rtl=${rtlEnabled},useSimScrollbar=${useSimulatedScrollbar}.png`, Selector('#container')))
//             .ok()
//             .expect(compareResults.isValid())
//             .ok(compareResults.errorMessages());
//         }).before(async () => {
//           await appendElementTo('#container', 'div', 'content', {
//             width: '200px', height: '200px', backgroundColor: 'skyblue',
//           });

//           return createWidget('dxScrollable', {
//             width: 100,
//             height: 100,
//             useNative,
//             rtlEnabled,
//             useSimulatedScrollbar,
//             direction,
//             showScrollbar: 'always',
//           });
//         });
//       });
//     });
//   });
// });
