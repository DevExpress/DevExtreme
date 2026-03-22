import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ButtonGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const typedItems: any[] = ['danger', 'default', 'normal', 'success'].map((type: any) => ({ type, text: type }));
  const iconItems: any[] = [
    { icon: 'find', text: 'find' },
    { icon: 'find' },
  ];
  const items: any[] = [
    ...typedItems,
    ...iconItems,
  ];

  test('ButtonGroup styling', async ({ page }) => {

    await setStyleAttribute(page, '#container', 'width: fit-content; padding: 8px; display: flex; gap: 16px; flex-direction: column;');
    await setAttribute(page, '#container', 'class', 'dx-theme-generic-typography');

    const stylingModes = ['text', 'outlined', 'contained'];

    await Promise.all(stylingModes.map((mode) => appendElementTo(page, '#container', 'div', `buttongroup-${mode}`, {})));
    await Promise.all(stylingModes.map((stylingMode) => createWidget(page, 'dxButtonGroup', {
      items,
      stylingMode,
      selectionMode: 'none',
    }, `#buttongroup-${stylingMode}`)));

    await testScreenshot(page, 'ButtonGroup styling.png', { element: '#container' });

    });
});
