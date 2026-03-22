import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage, isMaterial, isMaterialBased } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
  const OVERLAY_CLASS = 'dx-overlay-content';

  const stylingModes = ['outlined', 'underlined', 'filled'];
  const labelModes = ['static', 'floating', 'hidden', 'outside'];

  test('Popup should not be closed if lookup is placed at the page bottom (T1018037)', async ({ page }) => {
    await createWidget(page, 'dxLookup', {
    items: [1, 2, 3],
    usePopover: false,
  });

    const lookup = page.locator('#container');

    const { getInstance } = lookup;
    await page.evaluate(() => {
      const $element = (getInstance() as any).$element();
      $element.css({ top: window.innerHeight - $element.height() });
    });

    await lookup.open();

    await page.expect(await lookup.isOpened())
      .ok();

    });

  if (isMaterial()) {
    test('Popup should be flipped if lookup is placed at the page bottom', async ({ page }) => {

      await ClientFunction(() => {
        const $element = $('#container');
        $element.css({ top: $(window).height() - $element.height() });
      })();

      await createWidget(page, 'dxLookup', {
        items: [1, 2, 3],
        usePopover: false,
        opened: true,
        dropDownOptions: {
          hideOnParentScroll: false,
        },
      });


      const popupWrapper = page.locator('.dx-overlay-wrapper');
      const popupContent = page.locator('.dx-overlay-content');

      const popupWrapperTop = await popupWrapper.getBoundingClientRectProperty('top');
      const popupContentTop = await popupContent.getBoundingClientRectProperty('top');

      expect(popupContentTop).toBeLessThan(popupWrapperTop);

    });
  }

  if (!isMaterialBased()) {
    test('Popover should have correct vertical position (T1048128)', async ({ page }) => {
    await createWidget(page, 'dxLookup', {
      items: Array.from(Array(100).keys()),
    });

      const lookup = page.locator('#container');
      await lookup.open();

      const popoverArrow = page.locator('.dx-popover-arrow');

      const lookupElementBottom = await lookup.element.getBoundingClientRectProperty('bottom');
      const popoverArrowTop = await popoverArrow.getBoundingClientRectProperty('top');

      expect(lookupElementBottom).toBe(popoverArrowTop);

    });
  }

  test('Check popup height with no found data option', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: [], searchEnabled: true });

    await page.locator(`.${LOOKUP_FIELD_CLASS}`).click();
    await hover(`.${OVERLAY_CLASS}`);

    await testScreenshot(page, 'Lookup with no found data.png');

    });

  test('Check popup height in loading state', async ({ page }) => {
    await createWidget(page, 'dxLookup', {
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

    await page.locator(`.${LOOKUP_FIELD_CLASS}`).click();
    await hover(`.${OVERLAY_CLASS}`);

    await testScreenshot(page, 'Lookup in loading.png');

    });

  test('Lookup appearance', async ({ page }) => {

    await testScreenshot(page, 'Lookup appearance.png');

    for (const id of t.ctx.ids) {
      await setStyleAttribute(page, `#${id}`, 'width: fit-content;');
    }

    await testScreenshot(page, 'Lookup width adjust to fit its content.png');

    for (const id of t.ctx.ids) {
      await setStyleAttribute(page, `#${id}`, 'width: 100px;');
    }

    await testScreenshot(page, 'Lookup appearance with limited width.png');

    });.before(async ({ page }) => {
    t.ctx.ids = [];

    await insertStylesheetRulesToPage(page, '#container { display: grid; align-items: end; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 5px; }');

    for (const stylingMode of stylingModes) {
      for (const labelMode of labelModes) {
        for (const rtlEnabled of [true, false]) {
          for (const value of [null, 'Item_text_2']) {
            const id = `${`dx${new Guid()}`}`;

            t.ctx.ids.push(id);
            await appendElementTo(page, '#container', 'div', id, { });

            const options: any = {
              items: ['Item_text_1', 'Item_text_2'],
              label: 'label text',
              labelMode,
              stylingMode,
              rtlEnabled,
              value,
            };

            await createWidget(page, 'dxLookup', options, `#${id}`);
          }
        }
      }
    }
  });
});
