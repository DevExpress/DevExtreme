import DataGrid from 'devextreme-testcafe-models/dataGrid';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture`Status areas tests`
  .page(url(__dirname, '../../container.html'));

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

test('Accessibility: DataGrid general status should contains correct text', async (t) => {
  const expectedStatusText = 'Data grid with 3 rows and 2 columns';
  const dataGrid = new DataGrid('#container');

  const statusText = await dataGrid.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  columns: ['label', 'value'],
}));

test('Accessibility: DataGrid general status should contains correct text after header filter interaction', async (t) => {
  const expectedStatusText = 'Data grid with 1 rows and 2 columns';
  const dataGrid = new DataGrid('#container');
  const headerFilter = new HeaderFilter();

  const headerFilterIcon = dataGrid
    .getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0)
    .getFilterIcon();
  const headerFilterList = headerFilter.getList();
  const headerFilterButtons = headerFilter.getButtons();

  await t.click(headerFilterIcon)
    .click(headerFilterList.getItem(1).element())
    .click(headerFilterButtons.nth(0));

  const statusText = await dataGrid.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  headerFilter: {
    visible: true,
  },
  columns: ['label', 'value'],
}));

test('Accessibility: DataGrid general status should contains correct text after filter row interaction', async (t) => {
  const expectedStatusText = 'Data grid with 1 rows and 2 columns';
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  // await t.debug();

  const applyFilterBtn = dataGrid.getHeaderPanel().getApplyFilterButton();
  await t.typeText(filterEditor.input(), 'A')
    .click(applyFilterBtn);

  const statusText = await dataGrid.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  filterRow: {
    visible: true,
    applyFilter: 'onClick',
  },
  columns: ['label', 'value'],
}));

test('Accessibility: DataGrid general status should contains correct text after search panel interaction', async (t) => {
  const expectedStatusText = 'Data grid with 1 rows and 2 columns';
  const dataGrid = new DataGrid('#container');

  const searchInput = dataGrid.getSearchBox();
  await t.typeText(searchInput.input(), 'A')
    // NOTE: Unfortunately DataGrid has hardcoded filter's timeout 700ms
    // (grid_core/search/m_search FILTERING_TIMEOUT)
    // So, we only can waiting 1s here
    .wait(1000);

  const statusText = await dataGrid.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  searchPanel: {
    visible: true,
  },
  columns: ['label', 'value'],
}));

test('Accessibility: DataGrid general status should contains correct text after column count change', async (t) => {
  const expectedStatusText = 'Data grid with 3 rows and 1 columns';
  const dataGrid = new DataGrid('#container');

  const columnChooserBtn = dataGrid.getColumnChooserButton();
  await t.click(columnChooserBtn);

  const columnChooser = dataGrid.getColumnChooser();
  const checkbox = columnChooser.getCheckboxIcon(1);
  await t.click(checkbox);

  const statusText = await dataGrid.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: DATA_SOURCE,
  keyExpr: 'id',
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  columns: ['label', 'value'],
}));
