import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { expectClass } from '../../../models/internal/classMatcher';
import Menu from '../../../models/menu';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

const items = [{
  text: 'Item 1',
  items: [{
    text: 'item 1_1',
    items: [{
      text: 'item_1_1_1',
    }],
  }],
}];

test.describe('Menu_keyboard', () => {
  test('keyboard navigation should work after click on a root item if showFirstSubmenuMode is "onClick"', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items,
      showFirstSubmenuMode: 'onClick',
      hideSubmenuOnMouseLeave: true,
    });

    const menu = new Menu(page);

    await menu.getItem(0).click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');

    const focusedElement = menu.getItem(2);

    await expect(focusedElement).toHaveText('item_1_1_1', { useInnerText: true });
    await expectClass(focusedElement, FOCUSED_STATE_CLASS);
  });

  test('keyboard navigation should work after hover a root item if showFirstSubmenuMode is "onHover"', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items,
      showFirstSubmenuMode: 'onHover',
      hideSubmenuOnMouseLeave: true,
    });

    const menu = new Menu(page);

    await page.locator('body').click();
    await menu.getItem(0).hover();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');

    const focusedElement = menu.getItem(2);

    await expect(focusedElement).toHaveText('item_1_1_1', { useInnerText: true });
    await expectClass(focusedElement, FOCUSED_STATE_CLASS);
  });

  test('menu should be closed after press on "escape" key when submenu was shown by click, showFirstSubmenuMode="onClick" (T1115916)', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items,
      showFirstSubmenuMode: 'onClick',
      hideSubmenuOnMouseLeave: true,
    });

    const menu = new Menu(page);

    await page.locator('body').click();
    await menu.getItem(0).click();

    const submenu = menu.getSubMenu(menu.getItem(0));

    await expect.poll(() => submenu.option('visible')).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => submenu.option('visible')).toBe(false);
  });

  test('menu should be closed after press on "escape" key when submenu was shown by hover, showFirstSubmenuMode="onHover" (T1115916)', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items,
      showFirstSubmenuMode: 'onHover',
      hideSubmenuOnMouseLeave: true,
    });

    const menu = new Menu(page);

    await page.locator('body').click();
    await menu.getItem(0).hover();

    const submenu = menu.getSubMenu(menu.getItem(0));

    await expect.poll(() => submenu.option('visible')).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => submenu.option('visible')).toBe(false);
  });
});
