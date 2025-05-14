import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import TreeList from 'devextreme-testcafe-models/treeList';
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
    parentId: 0,
    label: 'B',
    value: 1200,
  },
  {
    id: 2,
    parentId: 0,
    label: 'C',
    value: 750,
  },
];

test('Accessibility: TreeList general status should contains correct text (rows expanded)', async (t) => {
  const expectedStatusText = 'Tree list with 3 rows and 2 columns';
  const treeList = new TreeList('#container');

  const statusText = await treeList.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  rootValue: -1,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columns: ['label', 'value'],
}));

test('Accessibility: TreeList general status should contains correct text (rows collapsed)', async (t) => {
  const expectedStatusText = 'Tree list with 1 rows and 2 columns';
  const treeList = new TreeList('#container');

  const statusText = await treeList.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  rootValue: -1,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: false,
  columns: ['label', 'value'],
}));

test('Accessibility: TreeList general status should contains correct text after header filter interaction', async (t) => {
  const expectedStatusText = 'Tree list with 2 rows and 2 columns';
  const treeList = new TreeList('#container');
  const headerFilter = new HeaderFilter();

  const headerFilterIcon = treeList
    .getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0)
    .getFilterIcon();
  const headerFilterList = headerFilter.getList();
  const headerFilterButtons = headerFilter.getButtons();

  await t.click(headerFilterIcon)
    .click(headerFilterList.getItem(1).element())
    .click(headerFilterButtons.nth(0));

  const statusText = await treeList.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  rootValue: -1,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  headerFilter: {
    visible: true,
  },
  columns: ['label', 'value'],
}));

test('Accessibility: TreeList general status should contains correct text after filter row interaction', async (t) => {
  const expectedStatusText = 'Tree list with 2 rows and 2 columns';
  const treeList = new TreeList('#container');
  const filterEditor = treeList.getFilterEditor(0, FilterTextBox);

  const applyFilterBtn = treeList.getHeaderPanel().getApplyFilterButton();
  await t.typeText(filterEditor.input(), 'B')
    .click(applyFilterBtn);

  const statusText = await treeList.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  rootValue: -1,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  filterRow: {
    visible: true,
    applyFilter: 'onClick',
  },
  columns: ['label', 'value'],
}));

test('Accessibility: TreeList general status should contains correct text after search panel interaction', async (t) => {
  const expectedStatusText = 'Tree list with 2 rows and 2 columns';
  const treeList = new TreeList('#container');

  const searchInput = treeList.getSearchBox();
  await t.typeText(searchInput.input(), 'B')
    // NOTE: Unfortunately TreeList has hardcoded filter's timeout 700ms
    // (grid_core/search/m_search FILTERING_TIMEOUT)
    // So, we only can waiting 1s here
    .wait(1000);

  const statusText = await treeList.getGeneralStatusContainer().textContent;

  await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  rootValue: -1,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  searchPanel: {
    visible: true,
  },
  columns: ['label', 'value'],
}));

test('Accessibility: TreeList general status should contains correct text after column count change', async (t) => {
  const expectedStatusText = 'Tree list with 3 rows and 1 columns';
  const treeList = new TreeList('#container');

  const columnChooserBtn = treeList.getColumnChooserButton();
  await t.click(columnChooserBtn);

  const columnChooser = treeList.getColumnChooser();
  const checkbox = columnChooser.getCheckboxIcon(1);
  await t.click(checkbox);

  const statusText = await treeList.getGeneralStatusContainer().textContent;

  // Temporary commented
  // Fails with following errors:
  //   1) Certain ARIA roles must be contained by particular parents
  //   * https://dequeuniversity.com/rules/axe/4.8/aria-required-parent?application=axeAPI
  //   * cat.aria, wcag2a, wcag131, EN-301-549, EN-9.1.3.1
  //   * critical
  //   * aria-required-parent
  //   ".dx-header-row"
  //   2) ARIA attributes must conform to valid values
  //   * https://dequeuniversity.com/rules/axe/4.8/aria-valid-attr-value?application=axeAPI
  //   * cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2
  //   * critical
  //   * aria-valid-attr-value
  //   "div[role="treegrid"]"
  //
  //   {}
  // : expected false to be truthy
  // await a11yCheck(t);
  await t.expect(statusText).eql(expectedStatusText);
}).before(async () => createWidget('dxTreeList', {
  dataSource: DATA_SOURCE,
  rootValue: -1,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  autoExpandAll: true,
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  columns: ['label', 'value'],
}));
