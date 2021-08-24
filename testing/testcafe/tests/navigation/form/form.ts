import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

test('Empty', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('Empty.png', Selector('#container')))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 100,
  height: 100,
}));

// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Configuration/#labelLocation
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/GroupItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/TabbedItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/ButtonItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/EmptyItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Configuration/#rtlEnabled

[false, true].forEach((rtlEnabled) => {
  ['left', 'right', 'top'].forEach((labelLocation) => {
    [1, 2, 3].forEach((colCount) => {
      [1, 2, 3, 4, 5, 6].forEach((itemNumber) => {
        const testName = `TextBox_${itemNumber},colCount_${colCount}`;
        test(testName, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          await t
            .expect(await takeScreenshot(`${testName}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => createWidget('dxForm', {
          width: 500,
          height: 500,
          colCount,
          rtlEnabled,
          labelLocation,
          items: Array(itemNumber).fill(null).map((_, i) => ({ dataField: `TextBox_${i}` })),
        }));
      });
    });
  });
});
