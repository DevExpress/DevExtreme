/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import Form from '../../model/form/form';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../containerQuill.html'));

const labelLocations = ['left', 'right', 'top'];

test('SimpleItem: item1_cSpan_2', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const form = new Form('#container');

  for (const labelLocation of labelLocations) {
    for (const colCount of [1, 2, 3, 4]) {
      await form.option({
        colCount,
        labelLocation,
      });

      await testScreenshot(t, takeScreenshot, `SimpleItem,item1_cSpan_2,location_${labelLocation},cCount_${colCount}.png`, { element: '#container' });
    }
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  height: 100,
  colCount: 1,
  labelLocation: 'left',
  items: [{ dataField: 'item_1', colSpan: 2 }],
}));

test('SimpleItem: item1_cSpan_2,item2_cSpan_1', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const form = new Form('#container');

  for (const labelLocation of labelLocations) {
    for (const colCount of [1, 2, 3, 4]) {
      await form.option({
        colCount,
        labelLocation,
      });

      await testScreenshot(t, takeScreenshot, `SimpleItem,item1_cSpan_2,item2_cSpan_1,location_${labelLocation},cCount_${colCount}.png`, { element: '#container' });
    }
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  height: 100,
  colCount: 1,
  labelLocation: 'left',
  items: [
    { dataField: 'item_1', colSpan: 2 },
    { dataField: 'item_2', colSpan: 1 },
  ],
}));

test('SimpleItem: item1_cSpan_1,item2_cSpan_2', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const form = new Form('#container');

  for (const labelLocation of labelLocations) {
    for (const colCount of [1, 2, 3, 4]) {
      await form.option({
        colCount,
        labelLocation,
      });

      await testScreenshot(t, takeScreenshot, `SimpleItem,item1_cSpan_1,item2_cSpan_2,location_${labelLocation},cCount_${colCount}.png`, { element: '#container' });
    }
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  height: 100,
  colCount: 1,
  labelLocation: 'left',
  items: [
    { dataField: 'item_1', colSpan: 1 },
    { dataField: 'item_2', colSpan: 2 },
  ],
}));

test('SimpleItem: item1_cSpan_1,item2_cSpan_2', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const form = new Form('#container');

  for (const labelLocation of labelLocations) {
    for (const colCount of [1, 2, 3, 4]) {
      await form.option({
        colCount,
        labelLocation,
      });

      await testScreenshot(t, takeScreenshot, `SimpleItem,item1_cSpan_2,item2_cSpan_2,location_${labelLocation},cCount_${colCount}.png`, { element: '#container' });
    }
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  height: 100,
  colCount: 1,
  labelLocation: 'left',
  items: [
    { dataField: 'item_1', colSpan: 2 },
    { dataField: 'item_2', colSpan: 2 },
  ],
}));
