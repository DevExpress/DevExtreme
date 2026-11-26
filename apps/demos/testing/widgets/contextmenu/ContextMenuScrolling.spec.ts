import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const TARGET_AREA = 'target-area';
const MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text';

describeManualTest('ContextMenu', 'Scrolling', { width: 900, height: 800 }, () => {
  test('Custom Template Appearance', async ({ page }) => {
    await page.locator(`.${TARGET_AREA}`).first().click({ button: 'right' });

    await testScreenshot(page, 'context_menu_scrolling_appearance.png');
  });

  test('Custom Template SubMenu Appearance', async ({ page }) => {
    await page.locator(`.${TARGET_AREA}`).first().click({ button: 'right' });

    await page.locator(`.${MENU_ITEM_TEXT_CLASS}`).filter({ hasText: 'Electronics' }).first().click();

    await page.locator(`.${MENU_ITEM_TEXT_CLASS}`).filter({ hasText: 'Computers' }).first().click();

    await testScreenshot(page, 'context_menu_templates_submenus_visible.png');
  });
});
