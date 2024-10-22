import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Editing`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('The row edit mode: Edit row when there are sticky columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await dataGrid.apiEditRow(1);
  await t.click(dataGrid.getDataCell(1, 1).element);

  await takeScreenshot('edit_row_with_sticky_columns_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_row_with_sticky_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
}));

// TODO: We need to fix the issues with the validation message and the revert button
test.skip('The cell edit mode: Edit cell with validation rule when there are sticky columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await dataGrid.apiCellValue(1, 1, '');
  await t.click(dataGrid.getDataCell(1, 1).element);

  await takeScreenshot('edit_cell_with_validation_rule_and_sticky_columns_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_cell_with_validation_rule_and_sticky_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  customizeColumns(columns) {
    columns.forEach((column, index) => {
      if (index === 1) {
        column.validationRules = [{ type: 'required' }];
      }
    });
  },
}));

safeSizeTest('The form edit mode: Edit row when there are sticky columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await dataGrid.apiEditRow(1);

  await takeScreenshot('edit_form_with_sticky_columns_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_form_with_sticky_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'form',
    allowUpdating: true,
  },
}));

safeSizeTest('The batch edit mode: Edit cell whene there are sticky columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(dataGrid.getDataCell(0, 2).element);

  await takeScreenshot('edit_cell_with_sticky_columns_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_cell_with_sticky_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
  customizeColumns(columns) {
    columns[1].fixed = true;
    columns[1].fixedPosition = 'left';
  },
}));

safeSizeTest('The batch edit mode: Edit fixed cell', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(dataGrid.getDataCell(0, 1).element);

  await takeScreenshot('edit_fixed_cell_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_fixed_cell_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
  customizeColumns(columns) {
    columns[1].fixed = true;
    columns[1].fixedPosition = 'left';
  },
}));

safeSizeTest('The batch edit mode: Edit fixed cell with sticky position', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(dataGrid.getDataCell(0, 3).element);

  await takeScreenshot('edit_fixed_cell_with_sticky_position_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_fixed_cell_with_sticky_position_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
  customizeColumns(columns) {
    columns[1].fixed = true;
    columns[1].fixedPosition = 'left';
    columns[3].fixed = true;
    columns[3].fixedPosition = 'sticky';
  },
}));
