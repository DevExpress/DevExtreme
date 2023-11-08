import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import List from '../../../model/list';
import createWidget from '../../../helpers/createWidget';

fixture.disablePageReloads`Grouping`
  .page(url(__dirname, '../../container.html'));

test('Grouped list appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const list = new List('#container');

  await t.click(list.getGroup(0).header);
  await t.click(list.getGroup(2).header);

  await testScreenshot(t, takeScreenshot, 'Grouped list appearance.png', { element: '#container' });

  await list.option('collapsibleGroups', false);

  await testScreenshot(t, takeScreenshot, 'Grouped list appearance,collapsibleGroups=false.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxList', {
  width: 300,
  height: 500,
  dataSource: [{
    key: 'group_1',
    items: ['item_1_1', 'item_1_2', 'item_1_3'],
    expanded: false,
  }, {
    key: 'group_2',
    items: ['item_2_1', 'item_2_2', 'item_2_3'],
  }, {
    key: 'group_3',
    items: ['item_3_1', 'item_3_2', 'item_3_3'],
    expanded: false,
  }],
  collapsibleGroups: true,
  grouped: true,
}));
