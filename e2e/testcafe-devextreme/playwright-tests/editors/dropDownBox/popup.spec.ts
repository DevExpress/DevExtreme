import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Drop Down Box\'s Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 600 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const BUTTON_CLASS = 'dx-dropdowneditor-button';

  test('Popup should have correct height when DropDownBox is opened first time (T1130045)', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 600 });

    await createWidget(page, 'dxDropDownBox', {
    dropDownOptions: {
      templatesRenderAsynchronously: true,
    },
    contentTemplate: '<div style="height: 400px"></div>',
  });

    await page.locator(`.${BUTTON_CLASS}`).click();

    await testScreenshot(page, 'Popup has correct height on the first opening.png');

    });
});
