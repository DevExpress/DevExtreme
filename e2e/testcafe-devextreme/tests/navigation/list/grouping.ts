import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import List from 'devextreme-testcafe-models/list';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Grouping`
  .page(url(__dirname, '../../container.html'));

test('Grouped list appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const list = new List('#container');

  await t
    .click(list.getItem(2).element)
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Grouped list appearance, header focused.png', { element: '#container' });

  await t
    .click(list.getGroup(0).header)
    .click(list.getGroup(2).header)
    .click(list.getItem(4).element)
    .hover(list.getGroup(1).header);

  await testScreenshot(t, takeScreenshot, 'Grouped list appearance, item focused, header hovered.png', { element: '#container' });

  await list.option('collapsibleGroups', false);

  await testScreenshot(t, takeScreenshot, 'Grouped list appearance,collapsibleGroups=false.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxList', {
  width: 300,
  dataSource: [
    {
      key: 'group_1',
      items: ['item_1_1', 'item_1_2', 'item_1_3'],
      expanded: false,
    },
    {
      key: 'group_2',
      items: [
        { text: 'item_2_1', disabled: true },
        { text: 'item_2_2', icon: 'home' },
        { text: 'item_2_3', showChevron: true, badge: 'item_2_3' },
        { text: 'item_2_4', badge: 'item_2_4' },
        'item_2_5',
      ],
    },
    {
      key: 'group_3',
      items: ['item_3_1', 'item_3_2', 'item_3_3'],
      expanded: false,
    },
  ],
  collapsibleGroups: true,
  grouped: true,
  allowItemDeleting: true,
  itemDeleteMode: 'static',
  itemDragging: {
    allowReordering: true,
  },
}));

test('Grouped list appearance with template', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const list = new List('#list-rtl-false');
  const list2 = new List('#list-rtl-true');

  await t
    .click(list.getGroup(0).header)
    .click(list.getGroup(2).header)
    .click(list2.getGroup(0).header)
    .click(list2.getGroup(2).header)
    .click('#container');

  await testScreenshot(t, takeScreenshot, 'Grouped list appearance with template.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'display: flex; gap: 40px; padding: 8px; width: fit-content;');

  const dataSource = [
    { key: 'One', items: ['1_1', '1_2', '1_3'] },
    { key: 'Two', items: ['2_1', '2_2', '2_3'] },
    { key: 'Three', items: ['3_1', '3_2', '3_3'] },
  ];

  await Promise.all([false, true].map((rtlEnabled) => appendElementTo('#container', 'div', `list-rtl-${rtlEnabled}`)));
  await Promise.all([false, true].map((rtlEnabled) => createWidget('dxList', {
    dataSource,
    width: 300,
    groupTemplate(data) {
      const wrapper = $('<div>');

      $(`<span>${data.key}</span>`).appendTo(wrapper);
      $('<div>second row</div>').appendTo(wrapper);

      return wrapper;
    },
    collapsibleGroups: true,
    grouped: true,
    rtlEnabled,
  }, `#list-rtl-${rtlEnabled}`)));
});
