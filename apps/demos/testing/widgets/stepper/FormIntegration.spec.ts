import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const PREV_BUTTON_ID = 'prevButton';
const NEXT_BUTTON_ID = 'nextButton';
const DATES_PICKER_ID = 'datesPicker';
const ADULTS_COUNT_ID = 'adultsCount';
const ROOM_SELECTBOX_ID = 'roomType';
const MEAL_SELECTBOX_ID = 'mealPlan';
const ADDITIONAL_REQUEST_ID = 'additionalRequest';
const INPUT_CLASS = 'dx-texteditor-input';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';

describeManualTest('Stepper', 'FormIntegration', { width: 900, height: 800 }, () => {
  test('Stepper and form integration', async ({ page }) => {
    const nextButton = page.locator(`#${NEXT_BUTTON_ID}`);
    const datesInputs = page.locator(`#${DATES_PICKER_ID} .${INPUT_CLASS}`);

    await nextButton.click();
    await testScreenshot(page, 'Form Integration-First step validation failed.png');

    await datesInputs.nth(0).click();
    await datesInputs.nth(0).pressSequentially('4/20/2025');
    await datesInputs.nth(1).click();
    await datesInputs.nth(1).pressSequentially('4/25/2025');
    await page.keyboard.press('Escape');
    await testScreenshot(page, 'Form Integration-First step form filled.png');

    await nextButton.click();
    // The id is on the NumberBox element; fill() needs its input. The Angular demo has more than one
    // element with the id, so the visible input is taken.
    const adultsCountInput = page.locator(`#${ADULTS_COUNT_ID} .${INPUT_CLASS}`).filter({ visible: true }).first();
    await adultsCountInput.fill('');
    await adultsCountInput.pressSequentially('2');
    await testScreenshot(page, 'Form Integration-Second step form filled.png');

    await nextButton.click();
    await page.locator(`#${ROOM_SELECTBOX_ID}`).click();
    await page.locator('.dx-list-item').filter({ hasText: /^Double$/ }).click();
    await page.locator(`#${MEAL_SELECTBOX_ID}`).click();
    await page.locator('.dx-list-item').filter({ hasText: /^Full Board$/ }).click();
    await testScreenshot(page, 'Form Integration-Third step form filled.png');

    await nextButton.click();
    await testScreenshot(page, 'Form Integration-Fourth optional step form empty.png');

    await nextButton.click();
    await testScreenshot(page, 'Form Integration-Fifth step summary.png');

    await page.locator(`#${PREV_BUTTON_ID}`).click();
    const additionalRequestInput = page.locator(`#${ADDITIONAL_REQUEST_ID} .${INPUT_CLASS}`).filter({ visible: true }).first();
    await additionalRequestInput.click();
    await additionalRequestInput.pressSequentially('No smoking room, please');
    await nextButton.click();
    await page.locator(`.${MULTIVIEW_ITEM_CLASS}`).nth(4).locator(':scope > *').first()
      .evaluate((element, [dx, dy]) => element.scrollBy(dx, dy), [0, 500]);
    await testScreenshot(page, 'Form Integration-Fifth step summary final.png');

    await nextButton.click();
    await testScreenshot(page, 'Form Integration-Fifth step confirmed.png');
  });
});
