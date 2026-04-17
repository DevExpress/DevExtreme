import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('NumberBox_Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 450 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const NUMBERBOX_CLASS = 'dx-numberbox';

  const stylingModes = ['outlined', 'underlined', 'filled'];
  const buttonsList = [
    ['clear'],
    [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'spins'],
    ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'spins'],
    ['clear', 'spins', { name: 'custom', location: 'after', options: { icon: 'home' } }],
    [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'spins'],
  ];

  const createNumberBox = async (p: any, options?: Record<string, unknown>): Promise<string> => {
    const id = `dx${Math.random().toString(36).slice(2, 10)}`;

    await appendElementTo(p, '#container', 'div', id, {});
    await createWidget(p, 'dxNumberBox', {
      value: Math.PI,
      showClearButton: true,
      showSpinButtons: true,
      ...options,
    }, `#${id}`);

    return id;
  };
  test('Label for dxNumberBox', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 450 });

    await insertStylesheetRulesToPage(page, '#container { display: flex; flex-direction: column; width: 300px; height: 400px; gap: 8px; }');
    if (isMaterial()) {
      await insertStylesheetRulesToPage(page, '#container .dx-widget, #container .dx-widget input { font-family: sans-serif; }');
    }

      for (const stylingMode of stylingModes) {
      const options = {
        width: '100%',
        label: 'label text',
        stylingMode,
      };
      await createNumberBox(page, {
        ...options,
        value: 'text',
      });
      await createNumberBox(page, {
        ...options,
        value: 123,
      });
    }

    await testScreenshot(page, 'NumberBox label.png');

    });

  test('NumberBox with buttons container', async ({ page }) => {

    await insertStylesheetRulesToPage(page, `#container { display: flex; flex-wrap: wrap; } .${NUMBERBOX_CLASS} { width: 220px; margin: 2px; }`);

      for (const stylingMode of stylingModes) {
          for (const buttons of buttonsList) {
        await createNumberBox(page, { stylingMode, buttons });
      }

      await createNumberBox(page, { stylingMode, rtlEnabled: true });
      await createNumberBox(page, { stylingMode, isValid: false });
    }

    await testScreenshot(page, 'NumberBox render with buttons container.png');

    });
});
