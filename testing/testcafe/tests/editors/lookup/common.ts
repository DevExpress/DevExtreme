import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { isMaterial, testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import Lookup from '../../../model/lookup';
import createWidget from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

import { changeTheme } from '../../../helpers/changeTheme';

const LOOKUP_FIELD_CLASS = 'dx-lookup-field';

fixture.disablePageReloads`Lookup`
  .page(url(__dirname, '../../container.html'));

// test('Popup should not be closed if lookup is placed at the page bottom (T1018037)', async (t) => {
//   const lookup = new Lookup('#container');

//   const { getInstance } = lookup;
//   await ClientFunction(() => {
//     const $element = (getInstance() as any).$element();
//     $element.css({ top: window.innerHeight - $element.height() });
//   }, {
//     dependencies: { getInstance },
//   })();

//   await lookup.open();

//   await t
//     .expect(await lookup.isOpened())
//     .ok();
// }).before(async () => createWidget('dxLookup', {
//   items: [1, 2, 3],
//   usePopover: false,
// }));

// if (isMaterial()) {
test('Popup should be flipped if lookup is placed at the page bottom', async (t) => {
  const popupWrapper = Selector('.dx-overlay-wrapper');
  const popupContent = Selector('.dx-overlay-content');

  const popupWrapperTop = await popupWrapper.getBoundingClientRectProperty('top');
  const popupContentTop = await popupContent.getBoundingClientRectProperty('top');

  debugger;

  await t
    .expect(popupContentTop)
    .lt(popupWrapperTop);
}).before(async () => {
  await changeTheme('material.blue.light');

  await ClientFunction(() => {
    const $element = $('#container');
    $element.css({ top: $(window).height() - $element.height() });
  })();

  return createWidget('dxLookup', {
    items: [1, 2, 3],
    usePopover: false,
    opened: true,
    dropDownOptions: {
      hideOnParentScroll: false,
    },
  });
});
// }

// if (!isMaterial()) {
//   test('Popover should have correct vertical position (T1048128)', async (t) => {
//     const lookup = new Lookup('#container');
//     await lookup.open();

//     const popoverArrow = Selector('.dx-popover-arrow');

//     const lookupElementBottom = await lookup.element.getBoundingClientRectProperty('bottom');
//     const popoverArrowTop = await popoverArrow.getBoundingClientRectProperty('top');

//     await t
//       .expect(lookupElementBottom)
//       .eql(popoverArrowTop);
//   }).before(async () => createWidget('dxLookup', {
//     items: Array.from(Array(100).keys()),
//   }));
// }

// safeSizeTest('Check popup height with no found data option', async (t) => {
//   const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
//   await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

//   await testScreenshot(t, takeScreenshot, 'Lookup with no found data.png');

//   await t
//     .expect(compareResults.isValid())
//     .ok(compareResults.errorMessages());
// }, [300, 400]).before(async () => createWidget('dxLookup', { dataSource: [], searchEnabled: true }));

// safeSizeTest('Check popup height in loading state', async (t) => {
//   const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//   await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

//   await testScreenshot(t, takeScreenshot, 'Lookup in loading.png');

//   await t
//     .expect(compareResults.isValid())
//     .ok(compareResults.errorMessages());
// }, [300, 400]).before(async () => createWidget('dxLookup', {
//   dataSource: {
//     load() {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve([1, 2, 3]);
//         }, 5000);
//       });
//     },
//   },
//   valueExpr: 'id',
//   displayExpr: 'text',
// }));

// test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
//   const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
//   const lookup = new Lookup('#container');

//   await lookup.option('items', [1, 2, 3]);

//   await testScreenshot(t, takeScreenshot, 'Lookup placeholder if value is not choosen.png', { element: '#container' });

//   await t
//     .expect(compareResults.isValid())
//     .ok(compareResults.errorMessages());
// }).before(async () => createWidget('dxLookup', {
//   width: 300,
//   placeholder: 'Choose a value',
// }));
