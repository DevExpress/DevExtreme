import type { Page } from '@playwright/test';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { isMaterial } from '../../../helpers/themeUtils';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';

const setGlobalConfig = (page: Page): Promise<void> => page.evaluate(() => {
  (window as any).DevExpress.config({
    floatingActionButtonConfig: {
      icon: 'edit',
      shading: false,
      position: {
        of: '#container',
        my: 'right bottom',
        at: 'right bottom',
        offset: '-16 -16',
      },
    },
  });
});

test.describe('FloatingAction - default theme', () => {
  for (const label of ['Add Row', '']) {
    for (const icon of ['home', '']) {
      test(`FAB with two speed dial action buttons after opening, label: ${label}, icon: ${icon}`, async ({ page, theme }) => {
        await setStyleAttribute(page, '#container', 'width: 300px; height: 300px;');
        await appendElementTo(page, '#container', 'div', 'speed-dial-action');
        await appendElementTo(page, '#container', 'div', 'speed-dial-action-trash');

        await setGlobalConfig(page);
        if (isMaterial(theme)) {
          await insertStylesheetRulesToPage(page, '.dx-overlay-wrapper { font-family: sans-serif !important; }');
        }

        await createWidget(page, 'dxSpeedDialAction', {
          label,
          icon,
          index: 1,
          visible: true,
        }, '#speed-dial-action');

        await createWidget(page, 'dxSpeedDialAction', {
          label: 'Remove Row',
          icon: 'trash',
          index: 2,
          visible: true,
        }, '#speed-dial-action-trash');

        await page.locator('body').click();
        await page.locator(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`).click();

        await testScreenshot(page, `FAB is opened with two speed dial actions,label='${label}',icon='${icon}'.png`, {
          element: '#container',
        });
      });

      test(`FAB with one speed dial action button, label: ${label}, icon: ${icon}`, async ({ page, theme }) => {
        await setStyleAttribute(page, '#container', 'width: 300px; height: 300px;');
        if (isMaterial(theme)) {
          await insertStylesheetRulesToPage(page, '.dx-overlay-wrapper { font-family: sans-serif !important; }');
        }
        await appendElementTo(page, '#container', 'div', 'speed-dial-action');

        await setGlobalConfig(page);

        await createWidget(page, 'dxSpeedDialAction', {
          label,
          icon,
          visible: true,
        }, '#speed-dial-action');

        await testScreenshot(page, `FAB with one speed dial action button,label='${label}',icon='${icon}'.png`, { element: '#container' });
      });
    }
  }

  test('FAB with two speed dial action buttons', async ({ page, theme }) => {
    await setStyleAttribute(page, '#container', 'width: 300px; height: 300px;');
    if (isMaterial(theme)) {
      await insertStylesheetRulesToPage(page, '.dx-overlay-wrapper { font-family: sans-serif !important; }');
    }

    await appendElementTo(page, '#container', 'div', 'speed-dial-action');
    await appendElementTo(page, '#container', 'div', 'speed-dial-action-trash');

    await setGlobalConfig(page);

    await createWidget(page, 'dxSpeedDialAction', {
      label: 'Add row',
      icon: 'plus',
      index: 1,
      visible: true,
    }, '#speed-dial-action');

    await createWidget(page, 'dxSpeedDialAction', {
      label: 'Remove Row',
      icon: 'trash',
      index: 2,
      visible: true,
    }, '#speed-dial-action-trash');

    await testScreenshot(page, 'FAB with two speed dial action buttons.png', {
      element: '#container',
    });
  });
});
