import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { screenshotTestFn } from '../../helpers/themeUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../containerQuill.html'));

['left', 'right', 'top'].forEach((labelLocation) => {
  [1, 2, 3, 4].forEach((colCount) => {
    const testItem1ColSpan2 = `SimpleItem,item1_cSpan_2,location_${labelLocation},cCount_${colCount}`;
    test(testItem1ColSpan2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await screenshotTestFn(t, takeScreenshot, `${testItem1ColSpan2}.png`, '#container');

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxForm', {
      width: 500,
      colCount,
      labelLocation,
      items: [{ dataField: 'item_1', colSpan: 2 }],
    }));

    const testItem1ColSpan2Item2 = `SimpleItem,item1_cSpan_2,item2_cSpan_1,location_${labelLocation},cCount_${colCount}`;
    test(testItem1ColSpan2Item2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await screenshotTestFn(t, takeScreenshot, `${testItem1ColSpan2Item2}.png`, '#container');

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxForm', {
      width: 500,
      colCount,
      labelLocation,
      items: [
        { dataField: 'item_1', colSpan: 2 },
        { dataField: 'item_2', colSpan: 1 },
      ],
    }));

    const testItem1Item2ColSpan2 = `SimpleItem,item1_cSpan_1,item2_cSpan_2,location_${labelLocation},cCount_${colCount}`;
    test(testItem1Item2ColSpan2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await screenshotTestFn(t, takeScreenshot, `${testItem1Item2ColSpan2}.png`, '#container');

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxForm', {
      width: 500,
      colCount,
      labelLocation,
      items: [
        { dataField: 'item_1', colSpan: 1 },
        { dataField: 'item_2', colSpan: 2 },
      ],
    }));

    const testItem1ColSpan2Item2ColSpan2 = `SimpleItem,item1_cSpan_2,item2_cSpan_2,location_${labelLocation},cCount_${colCount}`;
    test(testItem1ColSpan2Item2ColSpan2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await screenshotTestFn(t, takeScreenshot, `${testItem1ColSpan2Item2ColSpan2}.png`, '#container');

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxForm', {
      width: 500,
      colCount,
      labelLocation,
      items: [
        { dataField: 'item_1', colSpan: 2 },
        { dataField: 'item_2', colSpan: 2 },
      ],
    }));
  });
});
