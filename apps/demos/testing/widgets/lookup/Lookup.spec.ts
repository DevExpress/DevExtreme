import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const LOOKUP_CLASS = 'dx-lookup';

describeManualTest('Lookup', 'Basics', { width: 900, height: 600 }, () => {
  test('Custom Lookup Appearance', async ({ page }) => {
    await page.locator(`.${LOOKUP_CLASS}`).nth(0).click();

    // The popup of the first lookup covers the second one. TestCafe clicked the point anyway, which
    // picked the popup item under it ("John Heart"), and the etalon shows that.
    await page.locator(`.${LOOKUP_CLASS}`).nth(1).click({ force: true });

    await testScreenshot(page, 'lookup_templates_custom_appearance.png');
  });
});
