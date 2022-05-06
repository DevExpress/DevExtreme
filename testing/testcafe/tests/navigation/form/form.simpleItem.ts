import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  ['left', 'right', 'top'].forEach((labelLocation) => {
    [1, 2, 3].forEach((colCount) => {
      [1, 2, 3, 4, 5, 6].forEach((itemsCount) => {
        const testName = `SimpleItem,rtl_${rtlEnabled},labelLocation_${labelLocation},colCount_${colCount},itemsCount_${itemsCount}`;
        test(testName, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          await t
            .expect(await takeScreenshot(`${testName}.png`, '#container'))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => createWidget('dxForm', {
          width: 500,
          colCount,
          rtlEnabled,
          labelLocation,
          items: Array(itemsCount).fill(null).map((_, i) => ({ dataField: `item_${i + 1}` })),
        }));
      });
    });
  });
});

test('widget alignment (T1086611)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('widget alignment (T1086611).png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  colCount: 2,
  with: 1000,
  formData: {},
  items: [{
    dataField: 'FirstName',
    editorType: 'dxTextBox',
  }, {
    dataField: 'Position',
    editorType: 'dxSelectBox',
  }, {
    dataField: 'BirthDate',
    editorType: 'dxDateBox',
  }, {
    dataField: 'Notes',
    editorType: 'dxTextArea',
  }],
}));
