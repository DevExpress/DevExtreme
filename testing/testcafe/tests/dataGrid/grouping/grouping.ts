import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture.disablePageReloads`Grouping Panel`
  .page(url(__dirname, '../../container.html'));

test('Grouping Panel label should not overflow in a narrow grid (T1103925)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .expect(await takeScreenshot('groupingPanel', dataGrid.getToolbar()))
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

// T1112573
test('Content should be rendered correctly after setting the grouping.autoExpandAll property to true when dataRowTemplate is given', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiExpandAllGroups();

  await t
    .wait(100)
    .expect(await takeScreenshot('expanded-groups-content', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      field1: '1', field2: 'test1',
    },
    {
      field1: '2', field2: 'test1',
    },
    {
      field1: '3', field2: 'test2',
    },
  ],
  width: 700,
  columns: [
    'field1',
    { dataField: 'field2', groupIndex: 0 },
  ],
  dataRowTemplate(container, { data }) {
    return $(container).append($(`<tr><td>${data.field1}</td></tr>`));
  },
  groupPanel: {
    visible: true,
  },
  grouping: {
    autoExpandAll: false,
  },
}));
