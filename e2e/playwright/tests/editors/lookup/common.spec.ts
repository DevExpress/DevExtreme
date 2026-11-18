import { randomUUID } from 'node:crypto';
import type { Locator } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Lookup from '../../../models/lookup';

const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
const OVERLAY_CLASS = 'dx-overlay-content';

const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden', 'outside'];

const getRect = (locator: Locator): Promise<{ top: number; bottom: number }> => locator.evaluate(
  (element) => {
    const { top, bottom } = element.getBoundingClientRect();

    return { top, bottom };
  },
);

test.describe('Lookup', () => {
  test('Popup should not be closed if lookup is placed at the page bottom (T1018037)', async ({ page }) => {
    await createWidget(page, 'dxLookup', {
      items: [1, 2, 3],
      usePopover: false,
    });

    const lookup = new Lookup(page, '#container');

    await lookup.element.evaluate((element) => {
      const $element = $(element);

      $element.css({ top: window.innerHeight - ($element.height() ?? 0) });
    });

    await lookup.open();

    await expect.poll(() => lookup.isOpened()).toBe(true);
  });

  test.describe(() => {
    test.use({ theme: 'material.blue.light' });

    test('Popup should be flipped if lookup is placed at the page bottom', async ({ page }) => {
      await page.evaluate(() => {
        const $element = $('#container');

        $element.css({ top: ($(window).height() ?? 0) - ($element.height() ?? 0) });
      });

      await createWidget(page, 'dxLookup', {
        items: [1, 2, 3],
        usePopover: false,
        opened: true,
        dropDownOptions: {
          hideOnParentScroll: false,
        },
      });

      const popupWrapper = page.locator('.dx-overlay-wrapper').first();
      const popupContent = page.locator('.dx-overlay-content').first();

      await expect.poll(async () => {
        const wrapperTop = (await getRect(popupWrapper)).top;
        const contentTop = (await getRect(popupContent)).top;

        return contentTop < wrapperTop;
      }).toBe(true);
    });
  });

  test.describe(() => {
    test.use({ theme: 'generic.light' });

    test('Popover should have correct vertical position (T1048128)', async ({ page }) => {
      await createWidget(page, 'dxLookup', {
        items: Array.from(Array(100).keys()),
      });

      const lookup = new Lookup(page, '#container');

      await lookup.open();

      const popoverArrow = page.locator('.dx-popover-arrow');

      await expect.poll(async () => {
        const lookupElementBottom = (await getRect(lookup.element)).bottom;
        const popoverArrowTop = (await getRect(popoverArrow)).top;

        return popoverArrowTop - lookupElementBottom;
      }).toBe(0);
    });
  });

  test.describe(() => {
    test.use({ browserSize: [300, 400] });

    test('Check popup height with no found data option', async ({ page }) => {
      await createWidget(page, 'dxLookup', { dataSource: [], searchEnabled: true });

      await page.locator(`.${LOOKUP_FIELD_CLASS}`).click();
      await page.locator(`.${OVERLAY_CLASS}`).first().hover();

      await testScreenshot(page, 'Lookup with no found data.png');
    });

    test('Check popup height in loading state', async ({ page }) => {
      await insertStylesheetRulesToPage(page, `
        .${LOADINDICATOR_SEGMENT_CLASS},
        .${LOADINDICATOR_CONTENT_CLASS},
        .${LOADINDICATOR_ICON_CLASS},
        .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
          animation: none !important;
        }
      `);

      await createWidget(page, 'dxLookup', () => ({
        dataSource: {
          load: () => new Promise(() => {}),
        },
        valueExpr: 'id',
        displayExpr: 'text',
      }));

      await page.locator(`.${LOOKUP_FIELD_CLASS}`).click();
      await page.locator(`.${OVERLAY_CLASS}`).first().hover();

      await testScreenshot(page, 'Lookup in loading.png');
    });
  });

  test('Lookup appearance', async ({ page }) => {
    const ids: string[] = [];

    await insertStylesheetRulesToPage(page, '#container { display: grid; align-items: end; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 5px; }');

    for (const stylingMode of stylingModes) {
      for (const labelMode of labelModes) {
        for (const rtlEnabled of [true, false]) {
          for (const value of [null, 'Item_text_2']) {
            const id = `dx${randomUUID()}`;

            ids.push(id);
            await appendElementTo(page, '#container', 'div', id);

            await createWidget(page, 'dxLookup', {
              items: ['Item_text_1', 'Item_text_2'],
              label: 'label text',
              labelMode,
              stylingMode,
              rtlEnabled,
              value,
            }, `#${id}`);
          }
        }
      }
    }

    await testScreenshot(page, 'Lookup appearance.png');

    for (const id of ids) {
      await setStyleAttribute(page, `#${id}`, 'width: fit-content;');
    }

    await testScreenshot(page, 'Lookup width adjust to fit its content.png');

    for (const id of ids) {
      await setStyleAttribute(page, `#${id}`, 'width: 100px;');
    }

    await testScreenshot(page, 'Lookup appearance with limited width.png');
  });
});
