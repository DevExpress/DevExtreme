import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../../container.html'));

test('GroupItem', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Group caption template.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  items: [
    {
      itemType: 'group',
      items: ['item1'],
      captionTemplate: () => $('<i class="dx-icon dx-icon-user"></i><span>Custom caption template</span>'),
    },
  ],
}));

test('TabbedItem', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TabbedItem.png', { element: '#container' });

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
