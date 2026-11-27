import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const IMAGE_ID = 'image';

describeManualTest('ContextMenu', 'Templates', { width: 900, height: 800 }, () => {
  test('Custom Template Appearance', async ({ page }) => {
    await page.locator(`#${IMAGE_ID}`).click({ button: 'right' });

    await testScreenshot(page, 'ccontext_menu_templates_custom_appearance.png');
  });
});
