import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const PREV_BUTTON_ID = 'prevButton';
const NEXT_BUTTON_ID = 'nextButton';
const DATES_PICKER_ID = 'datesPicker';
const ADULTS_COUNT_ID = 'adultsCount';
const ROOM_SELECTBOX_ID = 'roomType';
const MEAL_SELECTBOX_ID = 'mealPlan';
const ADDITIONAL_REQUEST_ID = 'additionalRequest';
const INPUT_CLASS = 'dx-texteditor-input';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';

fixture('Stepper.FormIntegration')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Stepper', 'FormIntegration', (test) => {
  test('Stepper and form integration', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const nextButtonSelector = Selector(`#${NEXT_BUTTON_ID}`);

    await t.click(nextButtonSelector);
    await testScreenshot(t, takeScreenshot, 'Form Integration-First step validation failed.png');

    await t
      .typeText(Selector(`#${DATES_PICKER_ID} .${(INPUT_CLASS)}`).nth(0), '4/20/2025')
      .typeText(Selector(`#${DATES_PICKER_ID} .${(INPUT_CLASS)}`).nth(1), '4/25/2025')
      .pressKey('Esc');
    await testScreenshot(t, takeScreenshot, 'Form Integration-First step form filled.png');

    await t
      .click(nextButtonSelector)
      .typeText(Selector(`#${ADULTS_COUNT_ID}`), '2', { replace: true });
    await testScreenshot(t, takeScreenshot, 'Form Integration-Second step form filled.png');

    await t
      .click(nextButtonSelector)
      .click(Selector(`#${ROOM_SELECTBOX_ID}`))
      .click(Selector('.dx-list-item').withExactText('Double'))
      .click(Selector(`#${MEAL_SELECTBOX_ID}`))
      .click(Selector('.dx-list-item').withExactText('Full Board'));
    await testScreenshot(t, takeScreenshot, 'Form Integration-Third step form filled.png');

    await t.click(nextButtonSelector);
    await testScreenshot(t, takeScreenshot, 'Form Integration-Fourth optional step form empty.png');

    await t.click(nextButtonSelector);
    await testScreenshot(t, takeScreenshot, 'Form Integration-Fifth step summary.png');

    await t
      .click(Selector(`#${PREV_BUTTON_ID}`))
      .typeText(Selector(`#${ADDITIONAL_REQUEST_ID}`), 'No smoking room, please.png')
      .click(nextButtonSelector)
      .scrollBy(Selector(`.${MULTIVIEW_ITEM_CLASS}`).nth(4).child(), 0, 500);
    await testScreenshot(t, takeScreenshot, 'Form Integration-Fifth step summary final.png');

    await t.click(nextButtonSelector);
    await testScreenshot(t, takeScreenshot, 'Form Integration-Fifth step confirmed.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
