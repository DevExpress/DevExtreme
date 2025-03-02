import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const GRID_SELECTOR = '#container';

fixture.disablePageReloads`Validation`
  .page(url(__dirname, '../../container.html'));

// TODO: make this test stable
safeSizeTest('Validation popup screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t
    .maximizeWindow()
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+a backspace enter')
    // act
    .expect(await takeScreenshot('validation-popup.png', dataGrid.element))
    .ok()
    // assert
    .expect(dataGrid.getRevertTooltip().exists)
    .ok()
    .expect(dataGrid.getInvalidMessageTooltip().exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).meta({ unstable: true }).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  columns: [{
    dataField: 'field_0',
    validationRules: [{ type: 'required' }],
  }, {
    dataField: 'field_1',
    validationRules: [{ type: 'required' }],
  }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
}));

safeSizeTest('Validation popup with open master detail', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t
    .maximizeWindow()
    .click(dataGrid.getDataRow(5).getCommandCell(0).element)
    .click(dataGrid.getDataCell(5, 2).element)
    .pressKey('ctrl+a backspace enter');

  // act
  await takeScreenshot('validation-popup_master-detail.png', dataGrid.element);
  await dataGrid.scrollTo(t, { y: 150 });
  await takeScreenshot('validation-popup_master-detail_after-scroll.png', dataGrid.element);

  // assert
  await t.expect(dataGrid.getRevertTooltip().exists)
    .ok()
    .expect(dataGrid.getInvalidMessageTooltip().exists)
    .ok();

  await dataGrid.scrollTo(t, { y: 0 });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  columns: [{
    dataField: 'field_0',
    validationRules: [{ type: 'required' }],
  }, {
    dataField: 'field_1',
    validationRules: [{ type: 'required' }],
  }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  masterDetail: { enabled: true },
}));

safeSizeTest('Validation popup with open master detail and fixed columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t
    .maximizeWindow()
    .click(dataGrid.getFixedDataRow(5).getCommandCell(0).element)
    .click(dataGrid.getDataCell(5, 2).element)
    .pressKey('ctrl+a backspace enter');

  // act
  await takeScreenshot('validation-popup_master-detail_fixed-column.png', dataGrid.element);
  await dataGrid.scrollTo(t, { y: 150 });
  await takeScreenshot('validation-popup_master-detail_fixed-column_after-scroll.png', dataGrid.element);

  // assert
  await t.expect(dataGrid.getRevertTooltip().exists)
    .ok()
    .expect(dataGrid.getInvalidMessageTooltip().exists)
    .ok();

  await dataGrid.scrollTo(t, { y: 0 });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
  columns: [{
    dataField: 'field_0',
    validationRules: [{ type: 'required' }],
    fixed: true,
  }, {
    dataField: 'field_1',
    validationRules: [{ type: 'required' }],
  }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  masterDetail: { enabled: true },
}));
