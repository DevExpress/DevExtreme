import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

fixture`Form`
  .page(url(__dirname, '../containerQuill.html'));

const testName = 'GroupItem';
test(testName, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

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
