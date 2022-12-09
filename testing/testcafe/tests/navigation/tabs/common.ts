import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { Item } from '../../../../../js/ui/tabs.d';

fixture.disablePageReloads`Tabs_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  test(`Tabs icon alignment,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, 'Tabs items alignment.png', '#container', true);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    const dataSource = [
      { text: 'user' },
      { text: 'comment', icon: 'comment' },
      { icon: 'user' },
      { icon: 'money' },
    ] as Item[];

    return createWidget('dxTabs', { dataSource });
  });
});
