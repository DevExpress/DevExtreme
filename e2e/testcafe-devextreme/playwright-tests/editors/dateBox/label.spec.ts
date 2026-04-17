import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../playwright-helpers';
import path from 'path';
const Guid = () => ({ toString: () => Math.random().toString(36).slice(2, 10) });

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox_Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const DATEBOX_CLASS = 'dx-datebox';

  const stylingModes = ['outlined', 'underlined', 'filled'];
  const visibleLabelModes = ['floating', 'static', 'outside'];

  test('Symbol parts in label should not be cropped', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'dateBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 600px; padding: 8px;');

    for (const stylingMode of stylingModes) {
      for (const labelMode of visibleLabelModes) {
        const id = `${`dx${new Guid()}`}`;

        await appendElementTo(page, '#container', 'div', id);

        await createWidget(page, 'dxDateBox', {
          label: 'qwerty QWERTY 1234567890',
          stylingMode,
          labelMode,
          value: new Date(1900, 0, 1),
        }, `#${id}`);
      }
    }

    await testScreenshot(page, 'Datebox label symbols.png', { element: '#container' });

    });

  test('DateBox with buttons container', async ({ page }) => {

    for (const stylingMode of stylingModes) {
      for (const buttons of [
        ['clear'],
        ['clear', 'dropDown'],
        [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'dropDown'],
        ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'dropDown'],
        ['clear', 'dropDown', { name: 'custom', location: 'after', options: { icon: 'home' } }],
      ]) {
        for (const isValid of [true, false]) {
          const id = `${`dx${new Guid()}`}`;

          await appendElementTo(page, '#container', 'div', id);

          await createWidget(page, 'dxDateBox', {
            value: new Date(2021, 9, 17),
            stylingMode,
            buttons,
            showClearButton: true,
            isValid,
          }, `#${id}`);
        }
      }
    }

    await insertStylesheetRulesToPage(page, `#container { display: flex; flex-wrap: wrap; } .${DATEBOX_CLASS} { width: 220px; margin: 2px; }`);

    await testScreenshot(page, 'DateBox render with buttons container.png');

    await removeStylesheetRulesFromPage(page, );

    });
});
