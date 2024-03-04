import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const IMAGES_CONTAINER_CLASS = 'images';
const ITEM_CONTENT_CLASS = 'item-content';

// NOTE: this test is broken
// TestCafe cannot interact with the <circle cx="0" cy="0" r="8" stroke-width="4"
// transform="translate(207,272.87511500032093)" fill="#ffffff" stroke="#f5564a"></circle>
// element because another element obstructs it.
fixture.skip('Common.DialogsAndNotificationsOverview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Common', 'DialogsAndNotificationsOverview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('DialogsAndNotificationsOverview', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($(`.${IMAGES_CONTAINER_CLASS} .${ITEM_CONTENT_CLASS}`));
    await testScreenshot(t, takeScreenshot, 'common_dialogs_and_notifications_overview_popup.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
