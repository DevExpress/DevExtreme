import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { takeScreenshotInTheme } from '../../helpers/themeUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../container.html'));

const testName = 'TabbedItem';
test(testName, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, `${testName}.png`, '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  items: [
    {
      itemType: 'tabbed',
      tabPanelOptions: { deferRendering: false },
      tabs: [
        {
          title: 'tab1',
          items: ['item1'],
        },
      ],
    },
  ],
}));
