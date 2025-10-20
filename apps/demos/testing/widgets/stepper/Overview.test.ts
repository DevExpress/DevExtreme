import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';
import asyncForEach from '../../../utils/visual-tests/helpers/async-for-each';

const ORIENTATION_BUTTON_GROUP_ID = 'orientation';
const NAVIGATION_MODE_BUTTON_GROUP_ID = 'navigationMode';
const RTL_MODE_CHECK_BOX_ID = 'rtlMode';
const SELECT_ON_FOCUS_CHECK_BOX_ID = 'selectOnFocus';
const STEP_LIST_CLASS = 'dx-step-list';
const STEP_CLASS = 'dx-step';
const STEP_SELECTED_CLASS = 'dx-step-selected';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

fixture('Stepper.Overview')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Stepper', 'Overview', (test) => {
  test('Stepper Overview Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`#${RTL_MODE_CHECK_BOX_ID}`));

    await testScreenshot(t, takeScreenshot, 'Stepper overview rtl=true, orientation=horizontal.png');

    await t
      .click($(`#${ORIENTATION_BUTTON_GROUP_ID}`).find('.dx-button').nth(1));

    await testScreenshot(t, takeScreenshot, 'Stepper overview rtl=true, orientation=vertical.png');

    await t
      .click($(`#${RTL_MODE_CHECK_BOX_ID}`))
      .click($(`#${ORIENTATION_BUTTON_GROUP_ID}`).find('.dx-button').nth(0));

    const steppers = $(`.${STEP_LIST_CLASS}`);

    await t
      .click($(`#${NAVIGATION_MODE_BUTTON_GROUP_ID}`).find('.dx-button').nth(1));

    await asyncForEach(steppers, async (stepper) => {
      await stepper
        .click($(`#${STEP_CLASS}`).nth(0))
        .expect($(`#${STEP_CLASS}`).nth(2).hasClass(STEP_SELECTED_CLASS))
        .eql(true);
    });

    await t
      .click($(`#${NAVIGATION_MODE_BUTTON_GROUP_ID}`).find('.dx-button').nth(0));

    await asyncForEach(steppers, async (stepper) => {
      await stepper
        .click($(`#${STEP_CLASS}`).nth(0))
        .expect($(`#${STEP_CLASS}`).nth(0).hasClass(STEP_SELECTED_CLASS))
        .eql(true);
    });

    await asyncForEach(steppers, async (stepper) => {
      await stepper
        .click($(`#${STEP_CLASS}`).nth(1))
        .pressKey('right')
        .expect($(`#${STEP_CLASS}`).nth(1).hasClass(STEP_SELECTED_CLASS))
        .eql(true)
        .expect($(`#${STEP_CLASS}`).nth(1).hasClass(FOCUSED_STATE_CLASS))
        .eql(true);
    });

    await t
      .click($(`#${SELECT_ON_FOCUS_CHECK_BOX_ID}`));

    await asyncForEach(steppers, async (stepper) => {
      await stepper
        .click($(`#${STEP_CLASS}`).nth(0))
        .pressKey('right right')
        .expect($(`#${STEP_CLASS}`).nth(2).hasClass(STEP_SELECTED_CLASS))
        .eql(false)
        .expect($(`#${STEP_CLASS}`).nth(2).hasClass(FOCUSED_STATE_CLASS))
        .eql(true);
    });

    // await t.wait(500);

    await testScreenshot(t, takeScreenshot, 'Stepper overview selectOnFocus=false.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
