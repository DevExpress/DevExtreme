import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const IMAGE_ID = 'image';
const MENU_ITEM_TEXT_CLASS = 'dx-menu-item-text';

describeManualTest('ContextMenu', 'Templates', { width: 900, height: 600 }, () => {
  test('Custom Template Share Appearance', async ({ page }) => {
    await page.locator(`#${IMAGE_ID}`).click({ button: 'right' });

    await page.locator(`.${MENU_ITEM_TEXT_CLASS}`).filter({ hasText: 'Share' }).first().click();

    await testScreenshot(page, 'context_menu_templates_share_visible.png');
  });
});
