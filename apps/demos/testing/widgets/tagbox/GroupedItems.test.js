import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('TagBox.GroupedItems')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('TagBox', 'GroupedItems', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('GroupedItems', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .pressKey('tab')
      .pressKey('alt+down');

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_first_opened.png');

    await t
      .pressKey('esc');

    await t
      .pressKey('tab')
      .pressKey('alt+down');

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_second_opened.png');

    await t
      .pressKey('esc');

    await t
      .pressKey('tab')
      .pressKey('alt+down');

    await testScreenshot(t, takeScreenshot, 'tagbox_groupeditems_third_opened.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
