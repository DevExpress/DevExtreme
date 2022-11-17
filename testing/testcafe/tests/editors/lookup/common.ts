import { ClientFunction, Selector } from 'testcafe';
import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import Lookup from '../../../model/lookup';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const LOOKUP_FIELD_CLASS = 'dx-lookup-field';

fixture`Lookup`
  .page(url(__dirname, '../../container.html'));

test('Popup should not be closed if lookup is placed at the page bottom (T1018037)', async (t) => {
  const lookup = new Lookup('#container');

  const { getInstance } = lookup;
  await ClientFunction(() => {
    const $element = (getInstance() as any).$element();
    $element.css({ top: window.innerHeight - $element.height() });
  }, {
    dependencies: { getInstance },
  })();

  await lookup.open();

  await t
    .expect(await lookup.isOpened())
    .ok();
}).before(async () => createWidget('dxLookup', {
  items: [1, 2, 3],
  usePopover: false,
}));

test('Popup should be flipped if lookup is placed at the page bottom', async (t) => {
  const popupWrapper = Selector('.dx-overlay-wrapper');
  const popupContent = Selector('.dx-overlay-content');

  const popupWrapperTop = await popupWrapper.getBoundingClientRectProperty('top');
  const popupContentTop = await popupContent.getBoundingClientRectProperty('top');

  await t
    .expect(popupContentTop)
    .lt(popupWrapperTop);
}).before(async () => {
  await ClientFunction(() => {
    const $element = $('#container');
    $element.css({ top: $(window).height() - $element.height() });
  }, {
    dependencies: { },
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

test('Popover should have correct vertical position (T1048128)', async (t) => {
  const lookup = new Lookup('#container');
  await lookup.open();

  const popoverArrow = Selector('.dx-popover-arrow');

  const lookupElementBottom = await lookup.element.getBoundingClientRectProperty('bottom');
  const popoverArrowTop = await popoverArrow.getBoundingClientRectProperty('top');

  await t
    .expect(lookupElementBottom)
    .eql(popoverArrowTop);
}).before(async () => createWidget('dxLookup', {
  items: Array.from(Array(100).keys()),
}));

test('Check popup height with no found data option', async (t) => {
  await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

  await t
    .expect(await compareScreenshot(t, `Lookup_with_no_found_data${getThemePostfix()}.png`))
    .ok();
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxLookup', { dataSource: [], searchEnabled: true });
}).after(async (t) => {
  await restoreBrowserSize(t);
});

test('Check popup height in loading state', async (t) => {
  await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

  await t
    .expect(await compareScreenshot(t, `Lookup_in_loading${getThemePostfix()}.png`))
    .ok();
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxLookup', {
    dataSource: {
      load() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([1, 2, 3]);
          }, 5000);
        });
      },
    },
    valueExpr: 'id',
    displayExpr: 'text',
  });
}).after(async (t) => {
  await restoreBrowserSize(t);
});

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const lookup = new Lookup('#container');

  await lookup.option('items', [1, 2, 3]);

  await t
    .expect(await compareScreenshot(t, `Lookup_placeholder_after_items_change_if_value_is_not_choosen${getThemePostfix}.png`, '#container'))
    .ok();
}).before(async () => createWidget('dxLookup', {
  width: 300,
  placeholder: 'Choose a value',
}));

// eslint-disable-next-line max-len
// const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
// themes.forEach((theme) => {
//   test(`Check popup height with no found data option, theme=${theme}`, async (t) => {
//     await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

//     await t
// eslint-disable-next-line max-len
//       .expect(await compareScreenshot(t, `Lookup_with_no_found_data,theme=${theme.replace(/\./g, '-')}.png`))
//       .ok();
//   }).before(async (t) => {
//     await t.resizeWindow(300, 400);
//     await changeTheme(theme);

//     return createWidget('dxLookup', { dataSource: [], searchEnabled: true });
//   }).after(async (t) => {
//     await restoreBrowserSize(t);
//     await changeTheme('generic.light');
//   });

//   test(`Check popup height in loading state, theme=${theme}`, async (t) => {
//     await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

//     await t
// eslint-disable-next-line max-len
//       .expect(await compareScreenshot(t, `Lookup_in_loading,theme=${theme.replace(/\./g, '-')}.png`))
//       .ok();
//   }).before(async (t) => {
//     await t.resizeWindow(300, 400);
//     await changeTheme(theme);

//     return createWidget('dxLookup', {
//       dataSource: {
//         load() {
//           return new Promise((resolve) => {
//             setTimeout(() => {
//               resolve([1, 2, 3]);
//             }, 5000);
//           });
//         },
//       },
//       valueExpr: 'id',
//       displayExpr: 'text',
//     });
//   }).after(async (t) => {
//     await restoreBrowserSize(t);
//     await changeTheme('generic.light');
//   });
// });
