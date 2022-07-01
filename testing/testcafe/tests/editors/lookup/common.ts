import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import Lookup from '../../../model/lookup';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];

fixture`Lookup`
  .page(url(__dirname, '../../container.html'));

test('Popup should not be closed if lookup is placed at the page bottom in material theme (T1018037)', async (t) => {
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
  await changeTheme('material.blue.light');

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
}).after(async () => {
  await changeTheme('generic.light');
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

themes.forEach((theme) => {
  test(`Check popup height with no found data option, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

    await t
      .expect(await takeScreenshot(`Lookup_with_no_found_data,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    return createWidget('dxLookup', { dataSource: [], searchEnabled: true });
  }).after(async (t) => {
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });

  test(`Check popup height in loading state, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

    await t
      .expect(await takeScreenshot(`Lookup_in_loading,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

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
    await changeTheme('generic.light');
  });
});
