import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`Summary`
  .page(url(__dirname, '../container.html'));

test('Group footer summary should be focusable', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(dataGrid.getDataRow(4).getDataCell(1).element);
  await t
    .pressKey('tab');

  await t
    .expect(await takeScreenshot('group-summary-focused.png', dataGrid.element)).ok()
    .expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, value: 1 },
    { id: 2, value: 1 },
    { id: 3, value: 1 },
    { id: 4, value: 1 },
  ],
  columns: [
    'id',
    {
      dataField: 'value',
      groupIndex: 0,
    },
  ],
  summary: {
    groupItems: [
      {
        column: 'id',
        summaryType: 'count',
        showInGroupFooter: true,
      },
    ],
  },
}));

test('Total summary should be focusable', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(dataGrid.getDataRow(3).element);
  await t
    .pressKey('tab');

  await t
    .expect(await takeScreenshot('total-summary-focused.png', dataGrid.element)).ok()
    .expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, value: 1 },
    { id: 2, value: 1 },
    { id: 3, value: 1 },
    { id: 4, value: 1 },
  ],
  summary: {
    totalItems: [
      {
        column: 'id',
        summaryType: 'count',
      },
    ],
  },
}));

test('Group footer navigation should work without keyboard trap', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getDataRow(4).getDataCell(1).element);
  await t
    .pressKey('down')
    .pressKey('tab');

  await t.expect(dataGrid.getFooterRow().focused).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, value1: 1, value2: 1 },
    { id: 2, value1: 1, value2: 1 },
    { id: 3, value1: 1, value2: 1 },
    { id: 4, value1: 1, value2: 1 },
  ],
  columns: [
    'id',
    {
      dataField: 'value1',
      groupIndex: 0,
    },
    'value2',
  ],
  summary: {
    groupItems: [
      {
        column: 'id',
        summaryType: 'count',
        showInGroupFooter: true,
      },
    ],
    totalItems: [
      {
        column: 'id',
        summaryType: 'count',
      },
    ],
  },
}));
