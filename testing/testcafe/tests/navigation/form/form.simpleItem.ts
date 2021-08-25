import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/GroupItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/TabbedItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/ButtonItem/
// TODO: https://js.devexpress.com/Documentation/21_2/ApiReference/UI_Components/dxForm/Item_Types/EmptyItem/

[false].forEach((rtlEnabled) => { // TODO: false, true
  ['left'].forEach((labelLocation) => { // TODO: 'left', 'right', 'top'
    [1].forEach((colCount) => { // TODO: 1, 2, 3
      [1].forEach((itemNumber) => { // TODO: 1, 2, 3, 4, 5, 6
        const testName = `TextBox_${itemNumber},colCount_${colCount},labelLocation_${labelLocation},rtlEnabled_${rtlEnabled}`;
        test(testName, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          await t
            .expect(await takeScreenshot(`${testName}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          await ClientFunction(() => {
            $('#container').css({
              border: '1px solid black',
              width: '250px',
              height: '250px',
            });
          })();
          return createWidget('dxForm', {
            colCount,
            rtlEnabled,
            labelLocation,
            items: Array(itemNumber).fill(null).map((_, i) => ({ dataField: `TextBox_${i + 1}` })),
          });
        });
      });
    });
  });
});
