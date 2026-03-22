import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Menu_keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('keyboard navigation should work after click on a root item if showFirstSubmenuMode is "onClick"', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
    items: [{
      text: 'Item 1',
      items: [{
        text: 'item 1_1',
        items: [{
          text: 'item_1_1_1',
        }],
      }],
    }],
    showFirstSubmenuMode: 'onClick',
    hideSubmenuOnMouseLeave: true,
  });

    const menu = new Menu();

    await page.click(menu.getItem(0))
      .pressKey('down')
      .pressKey('right')
      .pressKey('down');

    const focusedElement = menu.getItem(2);

    expect(focusedElement.innerText).toBe('item_1_1_1')
      .expect(menu.isElementFocused(focusedElement))
      .eql(true);

    });

  test('keyboard navigation should work after hover a root item if showFirstSubmenuMode is "onHover"', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
    items: [{
      text: 'Item 1',
      items: [{
        text: 'item 1_1',
        items: [{
          text: 'item_1_1_1',
        }],
      }],
    }],
    showFirstSubmenuMode: 'onHover',
    hideSubmenuOnMouseLeave: true,
  });

    const menu = new Menu();

    await page.locator('body').click()
      .hover(menu.getItem(0))
      .pressKey('down')
      .pressKey('right')
      .pressKey('down');

    const focusedElement = menu.getItem(2);

    expect(focusedElement.innerText).toBe('item_1_1_1')
      .expect(menu.isElementFocused(focusedElement))
      .eql(true);

    });

  test('menu should be closed after press on "escape" key when submenu was shown by click, showFirstSubmenuMode="onClick" (T1115916)', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
    items: [{
      text: 'Item 1',
      items: [{
        text: 'item 1_1',
        items: [{
          text: 'item_1_1_1',
        }],
      }],
    }],
    showFirstSubmenuMode: 'onClick',
    hideSubmenuOnMouseLeave: true,
  });

    const menu = new Menu();

    await page.locator('body').click()
      .click(menu.getItem(0));

    const submenu = menu.getSubMenuInstance(menu.getItem(0));

    await page.expect(submenu.option('visible'))
      .eql(true)
      .pressKey('esc')
      .expect(submenu.option('visible'))
      .eql(false);

    });

  test('menu should be closed after press on "escape" key when submenu was shown by hover, showFirstSubmenuMode="onHover" (T1115916)', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
    items: [{
      text: 'Item 1',
      items: [{
        text: 'item 1_1',
        items: [{
          text: 'item_1_1_1',
        }],
      }],
    }],
    showFirstSubmenuMode: 'onHover',
    hideSubmenuOnMouseLeave: true,
  });

    const menu = new Menu();

    await page.locator('body').click()
      .hover(menu.getItem(0));

    const submenu = menu.getSubMenuInstance(menu.getItem(0));

    await page.expect(submenu.option('visible'))
      .eql(true)
      .pressKey('esc')
      .expect(submenu.option('visible'))
      .eql(false);

    });
});
