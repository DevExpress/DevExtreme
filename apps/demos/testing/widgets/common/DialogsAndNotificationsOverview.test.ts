import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const IMAGES_CONTAINER_CLASS = 'images';
const ITEM_CONTENT_CLASS = 'item-content';

fixture('Common.PopupAndNotificationsOverview')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Common', 'PopupAndNotificationsOverview', (test) => {
  test('PopupAndNotificationsOverview', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($(`.${IMAGES_CONTAINER_CLASS} .${ITEM_CONTENT_CLASS}`));
    await testScreenshot(t, takeScreenshot, 'common_dialogs_and_notifications_overview_popup.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
