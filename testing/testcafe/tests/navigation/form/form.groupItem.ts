import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

const testName = 'GroupItem';
test(testName, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, `${testName}.png`, '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  height: 200,
  items: [
    {
      itemType: 'group',
      caption: 'Group1',
      items: ['item1'],
    },
  ],
}));
