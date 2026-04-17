import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, Toolbar } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Toolbar_OverflowMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test("Click on overflow button should prevent popup's hideOnOutsideClick", async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'item1', locateInMenu: 'always' },
      ],
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    const popup = overflowMenu.getPopup();
    expect(await popup.isVisible()).toBe(true);

    await overflowMenu.click();
    expect(await popup.isVisible()).toBe(false);

    await overflowMenu.click();
    expect(await popup.isVisible()).toBe(true);
  });

  test('Toolbar buttons in menu appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'Button 1', locateInMenu: 'always', widget: 'dxButton', options: { text: 'Button 1', icon: 'home' } },
        { text: 'Button 2', locateInMenu: 'always', widget: 'dxButton', options: { text: 'Button 2', type: 'default' } },
        { text: 'Button 3', locateInMenu: 'always', widget: 'dxButton', options: { text: 'Button 3', stylingMode: 'outlined' } },
      ],
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    await testScreenshot(page, 'Toolbar buttons in menu.png');
  });

  test('Toolbar buttons as custom template appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        {
          locateInMenu: 'always',
          template() {
            return $('<div>').text('Custom template item');
          },
        },
      ],
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    await testScreenshot(page, 'Toolbar buttons as custom template in menu.png');
  });

  test('Toolbar button group appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        {
          locateInMenu: 'always',
          widget: 'dxButtonGroup',
          options: {
            items: [
              { text: 'Left', icon: 'alignleft' },
              { text: 'Center', icon: 'aligncenter' },
              { text: 'Right', icon: 'alignright' },
            ],
          },
        },
      ],
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    await testScreenshot(page, 'Toolbar buttonGroup in menu.png');
  });

  test('Toolbar button group as custom template appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        {
          locateInMenu: 'always',
          template() {
            return ($('<div>') as any).dxButtonGroup({
              items: [
                { text: 'Left' },
                { text: 'Center' },
                { text: 'Right' },
              ],
            });
          },
        },
      ],
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    await testScreenshot(page, 'Toolbar buttonGroup as custom template in menu.png');
  });
});
