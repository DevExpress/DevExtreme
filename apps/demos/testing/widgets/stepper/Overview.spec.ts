import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const ORIENTATION_BUTTON_GROUP_ID = 'orientation';
const NAVIGATION_MODE_BUTTON_GROUP_ID = 'navigationMode';
const RTL_MODE_CHECK_BOX_ID = 'rtlMode';
const SELECT_ON_FOCUS_CHECK_BOX_ID = 'selectOnFocus';
const STEPPER_IDS = ['icons', 'numbers', 'customText'];
const STEP_SELECTED_CLASS = 'dx-step-selected';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const forEachStepper = async (
  page: Page,
  check: (step: (index: number) => Locator) => Promise<void>,
): Promise<void> => {
  for (const id of STEPPER_IDS) {
    await check((index) => page.locator(`#${id} .dx-step`).nth(index));
  }
};

describeManualTest('Stepper', 'Overview', { width: 900, height: 800 }, () => {
  test('Stepper Overview Appearance', async ({ page }) => {
    const rtlModeCheckBox = page.locator(`#${RTL_MODE_CHECK_BOX_ID}`);
    const orientationButtons = page.locator(`#${ORIENTATION_BUTTON_GROUP_ID} .dx-button`);
    const navigationModeButtons = page.locator(`#${NAVIGATION_MODE_BUTTON_GROUP_ID} .dx-button`);

    await rtlModeCheckBox.click();

    await testScreenshot(page, 'Stepper overview rtl=true, orientation=horizontal.png');

    await orientationButtons.nth(1).click();

    await testScreenshot(page, 'Stepper overview rtl=true, orientation=vertical.png');

    await rtlModeCheckBox.click();
    await orientationButtons.nth(0).click();

    await navigationModeButtons.nth(1).click();

    await forEachStepper(page, async (step) => {
      await step(0).click();
      await expect(step(2)).toContainClass(STEP_SELECTED_CLASS);
    });

    await navigationModeButtons.nth(0).click();

    await forEachStepper(page, async (step) => {
      await step(0).click();
      await expect(step(0)).toContainClass(STEP_SELECTED_CLASS);
    });

    await forEachStepper(page, async (step) => {
      await step(1).click();
      await page.keyboard.press('ArrowRight');
      await expect(step(2)).toContainClass(STEP_SELECTED_CLASS);
      await expect(step(2)).toContainClass(FOCUSED_STATE_CLASS);
    });

    await page.locator(`#${SELECT_ON_FOCUS_CHECK_BOX_ID}`).click();

    await forEachStepper(page, async (step) => {
      await step(0).click();
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await expect(step(2)).not.toContainClass(STEP_SELECTED_CLASS);
      await expect(step(2)).toContainClass(FOCUSED_STATE_CLASS);
    });

    await testScreenshot(page, 'Stepper overview selectOnFocus=false.png');
  });
});
