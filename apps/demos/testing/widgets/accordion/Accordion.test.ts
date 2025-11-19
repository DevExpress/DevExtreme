import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const CHECKBOX_CLASS = 'dx-checkbox';

fixture('Accordion.Overview')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 900];
  });

runManualTest('Accordion', 'Overview', (test) => {
  test('Custom Overview Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${ITEM_TITLE_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'accordion_overview_expanded_electronics.png');

    await t
      .click($(`.${ITEM_TITLE_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'accordion_overview_collapsed_electronics_disabled_collapsible.png');

    await t
      .click($(`.${CHECKBOX_CLASS}`).nth(0));

    await t
      .click($(`.${CHECKBOX_CLASS}`).nth(1));

    await t
      .click($(`.${ITEM_TITLE_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'accordion_overview_collapsed_electronics_enabled_multiple_and_collapsible.png');

    await t
      .click($(`.${ITEM_TITLE_CLASS}`).nth(2));

    await t
      .click($(`.${ITEM_TITLE_CLASS}`).nth(3));

    await testScreenshot(t, takeScreenshot, 'accordion_overview_expanded_ksmusic_and_tomsclub.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
