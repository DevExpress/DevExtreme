import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Summary`
  .page(url(__dirname, '../../container.html'));

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

test('Focused total summary should have right appearance with sticky columns', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(dataGrid.getDataRow(3).element);
  await t
    .pressKey('tab');

  await t
    .expect(await takeScreenshot('total-summary-focused-with-sticky.png', dataGrid.element)).ok()
    .expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, value1: 1, value2: 2 },
    { id: 2, value1: 1, value2: 2 },
    { id: 3, value1: 1, value2: 2 },
    { id: 4, value1: 1, value2: 2 },
  ],
  columns: [
    { dataField: 'value1', fixed: true },
    { dataField: 'value2' },
  ],
  summary: {
    totalItems: [
      {
        column: 'value1',
        summaryType: 'count',
      },
      {
        column: 'value2',
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

test('The group summary should be displayed next to the grouped value when the grouped column has the showWhenGrouped option enabled', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(await takeScreenshot('group-summary-when-grouped-column-has-showWhenGrouped.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      id: 1, value1: 1, value2: 2, value3: 3,
    },
    {
      id: 2, value1: 4, value2: 5, value3: 6,
    },
    {
      id: 3, value1: 7, value2: 8, value3: 9,
    },
    {
      id: 4, value1: 10, value2: 11, value3: 12,
    },
  ],
  columns: [
    'id',
    'value1',
    'value2',
    {
      dataField: 'value3',
      groupIndex: 0,
      showWhenGrouped: true,
    },
  ],
  summary: {
    groupItems: [
      {
        column: 'value3',
        summaryType: 'count',
        displayFormat: '{0} VALUE3 GROUP COUNT',
        alignByColumn: true,
      },
    ],
  },
}));
