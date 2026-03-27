import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, addFocusableElementBefore, removeAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ValidationMessage', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 200 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

  test('Validation Message position should be correct after change visibility of parent container (T1095900)', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 200 });

    await appendElementTo(page, '#container', 'div', 'textbox', {});

    await createWidget(page, 'dxTextBox', {
      value: 'a',
      validationMessageMode: 'always',
    }, '#textbox');

    await createWidget(page, 'dxValidator', {
      validationRules: [
        {
          type: 'required',
        },
      ],
    }, '#textbox');

    await addFocusableElementBefore(page, '#container');

    await page.locator(`.${TEXTEDITOR_INPUT_CLASS}`).click();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');
    await page.evaluate(() => {
      (document.getElementById('focusable-start') as HTMLElement)?.focus();
    });

    await setAttribute(page, '#container', 'hidden', 'true');
    await removeAttribute(page, '#container', 'hidden');

    await testScreenshot(page, 'Textbox validation message.png');

    });
});
