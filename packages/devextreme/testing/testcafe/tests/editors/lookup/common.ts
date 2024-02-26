/* eslint-disable no-restricted-syntax */
import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { isMaterial, isMaterialBased, testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import Lookup from '../../../model/lookup';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import {
  appendElementTo, insertStylesheetRulesToPage, setStyleAttribute,
} from '../../../helpers/domUtils';
import Guid from '../../../../../js/core/guid';
import { clearTestPage } from '../../../helpers/clearPage';

const LOOKUP_FIELD_CLASS = 'dx-lookup-field';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden', 'outside'];

fixture.disablePageReloads`Lookup`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

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

if (isMaterial()) {
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
}

if (!isMaterialBased()) {
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
}

safeSizeTest('Check popup height with no found data option', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

  await testScreenshot(t, takeScreenshot, 'Lookup with no found data.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxLookup', { dataSource: [], searchEnabled: true }));

safeSizeTest('Check popup height in loading state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(Selector(`.${LOOKUP_FIELD_CLASS}`));

  await testScreenshot(t, takeScreenshot, 'Lookup in loading.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxLookup', {
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
}));

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const lookup = new Lookup('#container');

  await lookup.option('items', [1, 2, 3]);

  await testScreenshot(t, takeScreenshot, 'Lookup placeholder if value is not choosen.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxLookup', {
  width: 300,
  placeholder: 'Choose a value',
}));

test('Lookup appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Lookup appearance.png', { shouldTestInCompact: true });

  for (const id of t.ctx.ids) {
    await setStyleAttribute(Selector(`#${id}`), 'width: fit-content;');
  }

  await testScreenshot(t, takeScreenshot, 'Lookup width adjust to fit its content.png', { shouldTestInCompact: true });

  for (const id of t.ctx.ids) {
    await setStyleAttribute(Selector(`#${id}`), 'width: 100px;');
  }

  await testScreenshot(t, takeScreenshot, 'Lookup appearance with limited width.png', { shouldTestInCompact: true });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  t.ctx.ids = [];

  await insertStylesheetRulesToPage('#container { display: grid; align-items: end; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 5px; }');

  for (const stylingMode of stylingModes) {
    for (const labelMode of labelModes) {
      for (const rtlEnabled of [true, false]) {
        for (const value of [null, 'Item_text_2']) {
          const id = `${`dx${new Guid()}`}`;

          t.ctx.ids.push(id);
          await appendElementTo('#container', 'div', id, { });

          const options: any = {
            items: ['Item_text_1', 'Item_text_2'],
            label: 'label text',
            labelMode,
            stylingMode,
            rtlEnabled,
            value,
          };

          await createWidget('dxLookup', options, `#${id}`);
        }
      }
    }
  }
});
