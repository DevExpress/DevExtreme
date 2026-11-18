import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../models/dataGrid';
import HeaderFilter from '../../../models/dataGrid/headers/headerFilter';
import TextBox from '../../../models/textBox';

const DATA_SOURCE = [
  {
    id: 0,
    label: 'A',
    value: 350,
  },
  {
    id: 1,
    label: 'B',
    value: 1200,
  },
  {
    id: 2,
    label: 'C',
    value: 750,
  },
];

test('Accessibility: DataGrid general status should contains correct text', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    columns: ['label', 'value'],
  });

  const expectedStatusText = '';
  const dataGrid = new DataGrid(page, '#container');

  await expect(dataGrid.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: DataGrid general status should contains correct text after header filter interaction', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    headerFilter: {
      visible: true,
    },
    columns: ['label', 'value'],
  });

  const expectedStatusText = 'Data grid with 1 rows and 2 columns';
  const dataGrid = new DataGrid(page, '#container');
  const headerFilter = new HeaderFilter(page);

  const headerFilterIcon = dataGrid
    .getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0)
    .getFilterIcon();
  const headerFilterListItems = headerFilter.element.locator('.dx-list-item');
  const headerFilterButtons = headerFilter.getButtons();

  await headerFilterIcon.click();
  await headerFilterListItems.nth(1).click();
  await headerFilterButtons.nth(0).click();

  await expect(dataGrid.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: DataGrid general status should contains correct text after filter row interaction', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    filterRow: {
      visible: true,
      applyFilter: 'onClick',
    },
    columns: ['label', 'value'],
  });

  const expectedStatusText = 'Data grid with 1 rows and 2 columns';
  const dataGrid = new DataGrid(page, '#container');
  const filterEditor = dataGrid.getFilterEditor(0, TextBox);

  const applyFilterBtn = dataGrid.getHeaderPanel().getApplyFilterButton();
  await filterEditor.input.click();
  await filterEditor.input.pressSequentially('A');
  await applyFilterBtn.click();

  await expect(dataGrid.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: DataGrid general status should contains correct text after search panel interaction', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    searchPanel: {
      visible: true,
    },
    columns: ['label', 'value'],
  });

  const expectedStatusText = 'Data grid with 1 rows and 2 columns';
  const dataGrid = new DataGrid(page, '#container');

  const searchInput = dataGrid.getSearchBox();
  await searchInput.input.click();
  await searchInput.input.pressSequentially('A');

  // NOTE: Unfortunately DataGrid has hardcoded filter's timeout 700ms
  // (grid_core/search/search FILTERING_TIMEOUT)
  // So, we wait for the status text rather than for a fixed time
  await expect(dataGrid.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: DataGrid general status should contains correct text after column count change', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: DATA_SOURCE,
    keyExpr: 'id',
    columnChooser: {
      enabled: true,
      mode: 'select',
    },
    columns: ['label', 'value'],
  });

  const expectedStatusText = 'Data grid with 3 rows and 1 columns';
  const dataGrid = new DataGrid(page, '#container');

  const columnChooserBtn = dataGrid.getColumnChooserButton();
  await columnChooserBtn.click();

  const columnChooser = dataGrid.getColumnChooser();
  const checkbox = columnChooser.getCheckbox(1);
  await checkbox.click();

  await expect(dataGrid.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});
