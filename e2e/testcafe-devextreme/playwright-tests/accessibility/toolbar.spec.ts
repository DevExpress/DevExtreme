import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxToolbar', { items: [{ text: 'item1', locateInMenu: 'always' }, { text: 'item2', locateInMenu: 'always' }] });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled toolbar', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [{ text: 'item1', locateInMenu: 'always' }, { text: 'item2', locateInMenu: 'always' }],
      disabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('toolbar with overflow menu open', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'item1', locateInMenu: 'always' },
        { text: 'item2', locateInMenu: 'always' },
        { text: 'item3', locateInMenu: 'always' },
      ],
      width: 50,
    });
    await page.locator('.dx-toolbar-menu-button').click();
    await a11yCheck(page, {}, '#container');
  });

  test('toolbar with mixed item locations', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'Before', location: 'before' },
        { text: 'Center', location: 'center' },
        { text: 'After', location: 'after', locateInMenu: 'always' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('toolbar with narrow width overflow menu', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'item0', locateInMenu: 'always' },
        { text: 'item1', locateInMenu: 'always' },
        { text: 'item2', locateInMenu: 'always' },
        { text: 'item3', locateInMenu: 'always' },
        { text: 'item4', locateInMenu: 'always' },
      ],
      width: 50,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled toolbar with narrow width', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'item1', locateInMenu: 'always' },
        { text: 'item2', locateInMenu: 'always' },
      ],
      width: 50,
      disabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('toolbar with button widget items', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { location: 'before', widget: 'dxButton', options: { icon: 'back', text: 'Back' } },
        { location: 'center', text: 'Page Title' },
        { location: 'after', widget: 'dxButton', options: { icon: 'search' } },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('toolbar with selectBox item', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        {
          location: 'before',
          widget: 'dxSelectBox',
          options: { dataSource: ['Option 1', 'Option 2'], value: 'Option 1', inputAttr: { 'aria-label': 'Options' } },
        },
        { location: 'after', widget: 'dxButton', options: { text: 'Submit' } },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('toolbar with menu always items', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'visible item', location: 'before' },
        { text: 'menu item 1', locateInMenu: 'always' },
        { text: 'menu item 2', locateInMenu: 'always' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });
});
