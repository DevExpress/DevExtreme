import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('FloatingAction - default theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
  const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';

  const setGlobalConfig = async () => page.evaluate(() => {
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

  for (const label of ['Add Row', '']) {
    for (const icon of ['home', '']) {
      test(`FAB with two speed dial action buttons after opening, label: ${label}, icon: ${icon}`, async ({ page }) => {

        await setStyleAttribute(page, '#container', 'width: 300px; height: 300px;');
        await appendElementTo(page, '#container', 'div', 'speed-dial-action');
        await appendElementTo(page, '#container', 'div', 'speed-dial-action-trash');

        await setGlobalConfig();
        if (isMaterial()) {
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


        await page.locator('body').click()
          .click(page.locator(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`));

        await testScreenshot(page, `FAB is opened with two speed dial actions,label='${label}',icon='${icon}'.png`, {
          element: '#container',
        });

    });

      test(`FAB with one speed dial action button, label: ${label}, icon: ${icon}`, async ({ page }) => {

        await setStyleAttribute(page, '#container', 'width: 300px; height: 300px;');
        if (isMaterial()) {
          await insertStylesheetRulesToPage(page, '.dx-overlay-wrapper { font-family: sans-serif !important; }');
        }
        await appendElementTo(page, '#container', 'div', 'speed-dial-action');

        await setGlobalConfig();

        await createWidget(page, 'dxSpeedDialAction', {
          label,
          icon,
          visible: true,
        }, '#speed-dial-action');


        await testScreenshot(page, `FAB with one speed dial action button,label='${label}',icon='${icon}'.png`, { element: '#container' });

    });
    }
  }

  test('FAB with two speed dial action buttons', async ({ page }) => {

    await setStyleAttribute(page, '#container', 'width: 300px; height: 300px;');
    if (isMaterial()) {
      await insertStylesheetRulesToPage(page, '.dx-overlay-wrapper { font-family: sans-serif !important; }');
    }

    await appendElementTo(page, '#container', 'div', 'speed-dial-action');
    await appendElementTo(page, '#container', 'div', 'speed-dial-action-trash');

    await setGlobalConfig();

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
