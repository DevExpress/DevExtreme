import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';

fixture`Grouping Panel`
  .page(url(__dirname, '../container.html'));

test('Grouping Panel label should not overflow in a narrow grid (T1103925)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('groupingPanel', Selector('.dx-toolbar')))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: [
      {
        field1: '1', field2: '2', field3: '3', field4: '4', field5: '5',
      },
      {
        field1: '11', field2: '22', field3: '33', field4: '44', field5: '55',
      }],
  },
  width: 200,
  groupPanel: {
    emptyPanelText: 'Long long long long long long long long long long long text',
    visible: true,
  },
  editing: { allowAdding: true, mode: 'batch' },
  columnChooser: {
    enabled: true,
  },
}));
