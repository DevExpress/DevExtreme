import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

['left', 'right', 'top'].forEach((labelLocation) => {
  [1, 2, 3, 4].forEach((colCount) => {
    const testItem1ColSpan2 = `SimpleItem,colCount_${colCount},item1_colSpan_2`;
    test(testItem1ColSpan2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(testItem1ColSpan2, '#container'))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxForm', {
      width: 500,
      colCount,
      labelLocation,
      items: [{ dataField: 'item_1', colSpan: 2 }],
    }));

    const testItem1ColSpan2Item2 = `SimpleItem,colCount_${colCount},item1_colSpan_2,item2_colSpan_1`;
    test(testItem1ColSpan2Item2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(testItem1ColSpan2Item2, '#container'))
        .ok()
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

    const testItem1Item2ColSpan2 = `SimpleItem,colCount_${colCount},item1_colSpan_1,item2_colSpan_2`;
    test(testItem1Item2ColSpan2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(testItem1Item2ColSpan2, '#container'))
        .ok()
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

    const testItem1ColSpan2Item2ColSpan2 = `SimpleItem,colCount_${colCount},item1_colSpan_2,item2_colSpan_2`;
    test(testItem1ColSpan2Item2ColSpan2, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(testItem1ColSpan2Item2ColSpan2, '#container'))
        .ok()
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
