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

  await t.expect(dataGrid.isReady()).ok();

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

safeSizeTest('The form edit mode: Edit row when there are sticky columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

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

  await t.expect(dataGrid.isReady()).ok();

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

  await t.expect(dataGrid.isReady()).ok();

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

  await t.expect(dataGrid.isReady()).ok();

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

safeSizeTest('The cell edit mode: Edit fixed cell with validation rule', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiCellValue(0, 0, '');
  await t.click(dataGrid.getDataCell(0, 0).element);

  await takeScreenshot('edit_fixed_cell_with_validation_rule_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_fixed_cell_with_validation_rule_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columnWidth: 200,
  customizeColumns(columns) {
    columns[0].validationRules = [{ type: 'required' }];
  },
}));

safeSizeTest('The cell edit mode: Edit fixed cell with the sticky position and validation rule', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiCellValue(0, 2, '');
  await t.click(dataGrid.getDataCell(0, 2).element);

  await takeScreenshot('edit_fixed_cell_with_sticky_position_and_validation_rule_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('edit_fixed_cell_with_sticky_position_and_validation_rule_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columnWidth: 200,
  customizeColumns(columns) {
    columns[2].fixed = true;
    columns[2].fixedPosition = 'sticky';
    columns[2].validationRules = [{ type: 'required' }];
  },
}));

safeSizeTest('The cell edit mode: Edit cell with validation rule when there fixed columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiCellValue(0, 1, '');
  await t.click(dataGrid.getDataCell(0, 1).element);

  await takeScreenshot('edit_cell_with_validation_rule_and_fixed_columns_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 200 });

  await takeScreenshot('edit_cell_with_validation_rule_and_fixed_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columnWidth: 150,
  customizeColumns(columns) {
    columns[1].validationRules = [{ type: 'required' }];
  },
}));

safeSizeTest('The cell edit mode: Edit last unfixed cell with validation rule when there are fixed columns on the right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollTo(t, { x: 10000 });
  await dataGrid.apiCellValue(0, 5, '');
  await t.click(dataGrid.getDataCell(0, 5).element);

  await takeScreenshot('edit_last_unfixed_cell_with_validation_rule_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 350 });

  await takeScreenshot('edit_last_unfixed_cell_with_validation_rule_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columnWidth: 200,
  customizeColumns(columns) {
    columns[5].validationRules = [{ type: 'required' }];
  },
}));

safeSizeTest('The cell edit mode: The validation message and a revert button should scroll vertically', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiCellValue(5, 0, '');
  await t.click(dataGrid.getDataCell(5, 0).element);

  await takeScreenshot('vertical_scroll_and_fixed_column_with_validation_message_and_revert_button_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { y: 10000 });

  await takeScreenshot('vertical_scroll_and_fixed_column_with_validation_message_and_revert_button_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columnWidth: 200,
  customizeColumns(columns) {
    columns[0].validationRules = [{ type: 'required' }];
  },
}));

safeSizeTest('The cell edit mode: The focus overlay element should scroll vertically', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getDataCell(5, 0).element);

  await takeScreenshot('vertical_scroll_and_focused_fixed_column_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { y: 10000 });

  await takeScreenshot('vertical_scroll_and_focused_fixed_column_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columnWidth: 200,
}));
