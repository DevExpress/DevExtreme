import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import HeaderFilter from '../../../models/dataGrid/headers/headerFilter';
import TextBox from '../../../models/textBox';
import TreeList from '../../../models/treeList';

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

test('Accessibility: TreeList general status should contains correct text (rows expanded)', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
    dataSource: DATA_SOURCE,
    rootValue: -1,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: true,
    columns: ['label', 'value'],
  });

  const treeList = new TreeList(page, DEFAULT_SELECTOR);

  await expect(treeList.getGeneralStatusContainer()).toHaveText('');

  await a11yCheck(page);
});

test('Accessibility: TreeList general status should contains correct text (rows collapsed)', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
    dataSource: DATA_SOURCE,
    rootValue: -1,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: false,
    columns: ['label', 'value'],
  });

  const treeList = new TreeList(page, DEFAULT_SELECTOR);

  await expect(treeList.getGeneralStatusContainer()).toHaveText('');

  await a11yCheck(page);
});

test('Accessibility: TreeList general status should contains correct text after header filter interaction', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
    dataSource: DATA_SOURCE,
    rootValue: -1,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: true,
    headerFilter: {
      visible: true,
    },
    columns: ['label', 'value'],
  });

  const expectedStatusText = 'Tree list with 2 rows and 2 columns';
  const treeList = new TreeList(page, DEFAULT_SELECTOR);
  const headerFilter = new HeaderFilter(page);

  const headerFilterIcon = treeList
    .getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0)
    .getFilterIcon();
  const headerFilterListItems = headerFilter.element.locator('.dx-list-item');
  const headerFilterButtons = headerFilter.getButtons();

  await headerFilterIcon.click();
  await headerFilterListItems.nth(1).click();
  await headerFilterButtons.nth(0).click();

  await expect(treeList.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: TreeList general status should contains correct text after filter row interaction', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
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
  });

  const expectedStatusText = 'Tree list with 2 rows and 2 columns';
  const treeList = new TreeList(page, DEFAULT_SELECTOR);
  const filterEditor = treeList.getFilterEditor(0, TextBox);

  const applyFilterBtn = treeList.getHeaderPanel().getApplyFilterButton();
  await filterEditor.input.click();
  await filterEditor.input.pressSequentially('B');
  await applyFilterBtn.click();

  await expect(treeList.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: TreeList general status should contains correct text after search panel interaction', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
    dataSource: DATA_SOURCE,
    rootValue: -1,
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    autoExpandAll: true,
    searchPanel: {
      visible: true,
    },
    columns: ['label', 'value'],
  });

  const expectedStatusText = 'Tree list with 2 rows and 2 columns';
  const treeList = new TreeList(page, DEFAULT_SELECTOR);

  const searchInput = treeList.getSearchBox();
  await searchInput.input.click();
  await searchInput.input.pressSequentially('B');

  // NOTE: Unfortunately TreeList has hardcoded filter's timeout 700ms
  // (grid_core/search/search FILTERING_TIMEOUT)
  // So, we wait for the status text rather than for a fixed time
  await expect(treeList.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  await a11yCheck(page);
});

test('Accessibility: TreeList general status should contains correct text after column count change', async ({ page }) => {
  await createWidget(page, 'dxTreeList', {
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
  });

  const expectedStatusText = 'Tree list with 3 rows and 1 columns';
  const treeList = new TreeList(page, DEFAULT_SELECTOR);

  const columnChooserBtn = treeList.getColumnChooserButton();
  await columnChooserBtn.click();

  const columnChooser = treeList.getColumnChooser();
  const checkbox = columnChooser.getCheckbox(1);
  await checkbox.click();

  await expect(treeList.getGeneralStatusContainer()).toHaveText(expectedStatusText);

  // Not checked in this release: fails aria-required-parent (.dx-header-row)
  // and aria-valid-attr-value (div[role="treegrid"]).
});
