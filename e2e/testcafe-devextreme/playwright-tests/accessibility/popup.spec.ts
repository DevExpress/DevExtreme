import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: true, title: 'title' });
    await a11yCheck(page, {}, '#container');
  });

  test('popup without title', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: false });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with showCloseButton', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: true, title: 'title', showCloseButton: true });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with dragEnabled', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: true, title: 'title', dragEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with toolbar items', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      visible: true,
      width: 300,
      height: 280,
      showTitle: true,
      title: 'title',
      toolbarItems: [
        { widget: 'dxButton', toolbar: 'bottom', location: 'before', options: { icon: 'email', text: 'Send' } },
        { widget: 'dxButton', toolbar: 'bottom', location: 'after', options: { text: 'Close' } },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('popup invisible', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: false, width: 300, height: 280 });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with locateInMenu toolbar item', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      visible: true,
      width: 300,
      height: 280,
      showTitle: true,
      title: 'title',
      toolbarItems: [
        { locateInMenu: 'always', widget: 'dxButton', toolbar: 'top', options: { text: 'More info' } },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('popup drag enabled without title', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: false, dragEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with close button and drag', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: true, showCloseButton: true, dragEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('popup fullscreen', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, fullScreen: true, showTitle: true, title: 'Fullscreen Popup' });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with resizing enabled', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 400, height: 300, showTitle: true, title: 'Resizable', resizeEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('popup with shading', async ({ page }) => {
    await createWidget(page, 'dxPopup', { visible: true, width: 300, height: 280, showTitle: true, title: 'Modal', shading: true });
    await a11yCheck(page, {}, '#container');
  });
});
