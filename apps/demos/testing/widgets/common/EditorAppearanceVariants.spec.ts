import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Common', 'EditorAppearanceVariants', { width: 900, height: 800 }, () => {
  test('EditorAppearanceVariants', async ({ page }) => {
    const SELECTBOX_CLASS = 'dx-selectbox';
    const stylingModes = ['outlined', 'filled', 'underlined'];
    const labelModes = ['static', 'floating', 'hidden', 'outside'];

    const clickSaveButton = async (): Promise<void> => {
      await page.locator('#validate').click();
    };

    const changeLabelMode = async (labelMode: string): Promise<void> => {
      await page.locator(`.${SELECTBOX_CLASS}`).nth(1).click();
      await page.locator('.dx-item').filter({ hasText: labelMode }).first().click();
    };

    const changeStylingMode = async (stylingMode: string): Promise<void> => {
      await page.locator(`.${SELECTBOX_CLASS}`).nth(0).click();
      await page.locator('.dx-item').filter({ hasText: stylingMode }).first().click();
    };

    for (const stylingMode of stylingModes) {
      for (const labelMode of labelModes) {
        await changeStylingMode(stylingMode);
        await changeLabelMode(labelMode);
        await clickSaveButton();

        await testScreenshot(page, `common_editor_appearance_variants_${stylingMode}_${labelMode}_desktop.png`);
      }
    }
  });
});
