import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('TagBox.GroupedItems')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('TagBox', 'GroupedItems', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('GroupedItems', async (t) => {
    const TAG_BOX_CLASS = 'dx-tagbox';
    const $tagBoxes = $(`.${TAG_BOX_CLASS} .dx-tag-container`);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($tagBoxes.nth(0))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_first_opened.png');

    await t
      .click($tagBoxes.nth(0))
      .wait(200);

    await t
      .click($tagBoxes.nth(1))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_second_opened.png');

    await t
      .click($tagBoxes.nth(1))
      .wait(200);

    await t
      .click($tagBoxes.nth(2))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_third_opened.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
