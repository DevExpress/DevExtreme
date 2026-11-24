import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../models/dataGrid';
import HeaderFilter from '../../../models/dataGrid/headers/headerFilter';
import { getData } from '../../dataGrid/helpers/generateDataSourceData';

const DATA_GRID_SELECTOR = '#container';

const a11yCheckConfig = {};

const expectReady = async (dataGrid: DataGrid): Promise<void> => {
  await expect.poll(() => dataGrid.isReady()).toBe(true);
};

test('Grid without config', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: [],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Grid without data', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: [],
    columns: [
      'test',
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Sorting and group panel', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    groupPanel: {
      visible: true,
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      {
        dataField: 'field_3',
        sortOrder: 'asc',
        sortIndex: 0,
      },
      {
        dataField: 'field_4',
        sortOrder: 'desc',
        sortIndex: 1,
      },
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Paging with displayMode is \'full\'', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(100, 5),
    keyExpr: 'field_0',
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
    paging: {
      pageSize: 5,
    },
    pager: {
      visible: true,
      allowedPageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      showInfo: true,
      showNavigationButtons: true,
      displayMode: 'full',
    },
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Paging with displayMode is \'compact\'', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(100, 5),
    keyExpr: 'field_0',
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
    paging: {
      pageSize: 5,
    },
    pager: {
      visible: true,
      allowedPageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      showInfo: true,
      showNavigationButtons: true,
      displayMode: 'compact',
    },
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Grouping and Summary', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(60, 5),
    keyExpr: 'field_0',
    columns: [
      'field_0',
      {
        dataField: 'field_1',
        groupIndex: 0,
      },
      {
        dataField: 'field_2',
        groupIndex: 1,
      },
      'field_3',
      'field_4',
    ],
    paging: {
      pageSize: 10,
    },
    groupPanel: {
      visible: true,
    },
    summary: {
      groupItems: [{
        column: 'field_3',
        summaryType: 'count',
        showInGroupFooter: true,
      }, {
        column: 'field_4',
        summaryType: 'count',
        showInGroupFooter: false,
        alignByColumn: true,
      }],
      totalItems: [{
        column: 'field_0',
        summaryType: 'count',
      }],
    },
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Filter row - filter menu', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5).map((item, index) => ({ ...item, index })),
    keyExpr: 'field_0',
    filterRow: {
      visible: true,
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
      {
        dataField: 'index',
        dataType: 'number',
        selectedFilterOperation: 'between',
        filterValue: [1, 7],
      },
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const filterCell = dataGrid.getFilterCell(0);

  await expectReady(dataGrid);

  await filterCell.menuButton.click();

  await expect(page.locator('.dx-datagrid.dx-context-menu .dx-submenu')).toBeVisible();

  await a11yCheck(page, {
    ...a11yCheckConfig,
    rules: {
      'aria-command-name': { enabled: true },
      // The filter menu is portalled into body, outside the role="main" landmark
      region: { enabled: false },
    },
  });
});

test('Header filter - filter menu', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    headerFilter: {
      visible: true,
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();

  await expectReady(dataGrid);

  await filterIconElement.click();

  await expect(new HeaderFilter(page).element.first()).toBeAttached();

  await a11yCheck(page);
});

test('Filter panel', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    filterPanel: {
      visible: true,
    },
    columns: [
      'field_0',
      {
        dataField: 'field_1',
        filterValue: 'val',
      },
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  // arrange
  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const filterPanel = dataGrid.getFilterPanel();

  await expectReady(dataGrid);
  await expect(filterPanel.getFilterText().element).toHaveText('[Field 1] Contains \'val\'');

  await a11yCheck(page);
});

test('Filter panel - popup with filter builder', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    filterPanel: {
      visible: true,
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const filterPanel = dataGrid.getFilterPanel();
  const filterPanelIcon = filterPanel.getIconFilter();

  await expectReady(dataGrid);

  await filterPanelIcon.element.click();

  await filterPanel.expectOpened();

  await a11yCheck(page, a11yCheckConfig);
});

test('Search panel', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    searchPanel: {
      visible: true,
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Search panel - highlight', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    searchPanel: {
      visible: true,
      text: 'val',
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Selection', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    selection: {
      mode: 'multiple',
      showCheckBoxesMode: 'always',
    },
    selectedRowKeys: ['val_1_0', 'val_2_0'],
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);
  await dataGrid.getDataRow(1).expectSelected();
  await dataGrid.getDataRow(2).expectSelected();

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Focused row', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    focusedRowEnabled: true,
    focusedRowKey: 'val_1_0',
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);
  await dataGrid.getDataRow(1).expectFocusedRow();

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Fixed columns', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 7),
    keyExpr: 'field_0',
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
    columns: [
      {
        dataField: 'field_0',
        fixed: true,
      },
      {
        dataField: 'field_1',
        fixed: true,
      },
      'field_2',
      'field_3',
      'field_4',
      {
        dataField: 'field_5',
        fixed: true,
        fixedPosition: 'right',
      },
      {
        dataField: 'field_6',
        fixed: true,
        fixedPosition: 'right',
      },
    ],
  });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Column chooser with the \'dragAndDrop\' mode', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 7),
    keyExpr: 'field_0',
    columnChooser: {
      enabled: true,
      mode: 'dragAndDrop',
    },
    columns: [
      {
        dataField: 'field_0',
        visible: false,
      },
      {
        dataField: 'field_1',
        visible: false,
      },
      'field_2',
      'field_3',
      'field_4',
      'field_5',
      'field_6',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const columnChooser = dataGrid.getColumnChooser();
  const columnChooserButton = dataGrid.getColumnChooserButton();

  await expectReady(dataGrid);

  await columnChooserButton.click();

  await columnChooser.expectOpened();

  await a11yCheck(page);
});

test('Column chooser with the \'select\' mode', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 7),
    keyExpr: 'field_0',
    columnChooser: {
      enabled: true,
      mode: 'select',
    },
    columns: [
      {
        dataField: 'field_0',
        visible: false,
      },
      {
        dataField: 'field_1',
        visible: false,
      },
      'field_2',
      'field_3',
      'field_4',
      'field_5',
      'field_6',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const columnChooser = dataGrid.getColumnChooser();
  const columnChooserButton = dataGrid.getColumnChooserButton();

  await expectReady(dataGrid);

  await columnChooserButton.click();

  await columnChooser.expectOpened();

  await a11yCheck(page, {
    ...a11yCheckConfig,
    rules: {
      'scrollable-region-focusable': { enabled: false },
    },
  });
});

test('Empty column chooser', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    columnChooser: {
      enabled: true,
    },
    columns: [
      'field_0',
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const columnChooser = dataGrid.getColumnChooser();
  const columnChooserButton = dataGrid.getColumnChooserButton();

  await expectReady(dataGrid);

  await columnChooserButton.click();

  await columnChooser.expectOpened();

  await a11yCheck(page, {
    ...a11yCheckConfig,
    rules: {
      'aria-required-children': { enabled: false },
    },
  });
});

[false, true].forEach((useIcons) => {
  test(`Row editing mode with useIcons=${useIcons}`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons,
      },
      columns: [
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    }, DATA_GRID_SELECTOR);

    const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

    await expectReady(dataGrid);

    await a11yCheck(page);
  });

  test(`Row in edit state with useIcons=${useIcons}`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons,
      },
      columns: [
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    }, DATA_GRID_SELECTOR);

    const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

    await expectReady(dataGrid);

    await dataGrid.apiEditRow(0);

    await dataGrid.getDataRow(0).expectEdited();

    await a11yCheck(page);
  });
});

test('Row editing mode - confirm delete message', async ({ page, theme }) => {
  test.skip(theme === 'fluent-next.blue.dark');

  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'row',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiDeleteRow(0);

  await expect(dataGrid.getDialog().first()).toBeAttached();

  await a11yCheck(page, a11yCheckConfig);
});

test('Batch editing mode - edit cell', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'batch',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiEditCell(0, 0);

  await dataGrid.getDataCell(0, 0).expectEditCell();

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Batch editing mode - modified cell', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'batch',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiCellValue(0, 0, 'test');

  await dataGrid.getDataCell(0, 0).expectModified();

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Batch editing mode - delete row', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'batch',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiDeleteRow(0);

  await dataGrid.getDataRow(0).expectRemoved();

  await a11yCheck(page);
});

test('Form editing mode', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'form',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiEditRow(0);

  await expect(dataGrid.getEditForm().element.first()).toBeAttached();

  await a11yCheck(page);
});

test('Popup editing mode', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'popup',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiEditRow(0);

  await expect(dataGrid.getPopupEditForm().element.first()).toBeAttached();

  await a11yCheck(page);
});

test('Validation in cell editing mode', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    editing: {
      mode: 'cell',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      },
      'field_2',
      'field_3',
      'field_4',
    ],
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.getDataCell(0, 0).element.click();
  await expect(dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input')).toBeFocused();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Enter');

  await expect(dataGrid.getRevertTooltip().first()).toBeAttached();
  await expect(dataGrid.getInvalidMessageTooltip().first()).toBeAttached();

  await a11yCheck(page);
});

test('Error row', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', (data) => ({
    dataSource: data,
    keyExpr: 'field_0',
    editing: {
      mode: 'row',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      'field_1',
      'field_2',
      'field_3',
      'field_4',
    ],
    onRowValidating(e) {
      e.isValid = false;
      e.errorText = 'Test';
    },
  }), DATA_GRID_SELECTOR, { arg: getData(10, 5) });

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiEditRow(0);

  await dataGrid.getDataRow(0).expectEdited();

  await dataGrid.apiCellValue(0, 0, 'test');
  await dataGrid.apiSaveEditData();

  await expect(dataGrid.getErrorRow()).toBeAttached();

  await a11yCheck(page);
});

test('Adaptability', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 10),
    keyExpr: 'field_0',
    columnWidth: 100,
    width: 800,
    columnHidingEnabled: true,
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await dataGrid.apiExpandAdaptiveDetailRow('val_0_0');

  await expect(dataGrid.getAdaptiveRow(0).element).toBeAttached();

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Row drag and drop', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    rowDragging: {
      allowReordering: true,
      showDragIcons: true,
    },
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);

  await expectReady(dataGrid);

  await a11yCheck(page, a11yCheckConfig, DATA_GRID_SELECTOR);
});

test('Export', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    export: {
      enabled: true,
      formats: ['xlsx', 'pdf'],
      allowExportSelectedData: true,
    },
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const headerPanel = dataGrid.getHeaderPanel();
  const exportButton = headerPanel.getExportButton();

  await expectReady(dataGrid);

  await exportButton.element.click();

  await exportButton.expectOpened();

  await a11yCheck(page, a11yCheckConfig);
});

test('Context menu', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 5),
    keyExpr: 'field_0',
    columnFixing: {
      enabled: true,
      // @ts-expect-error private option
      legacyMode: true,
    },
    sorting: {
      mode: 'multiple',
    },
  }, DATA_GRID_SELECTOR);

  const dataGrid = new DataGrid(page, DATA_GRID_SELECTOR);
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);

  await expectReady(dataGrid);

  await headerRow.element.click({ button: 'right' });

  await expect(page.locator('.dx-context-menu.dx-datagrid .dx-submenu')).toBeVisible();

  await a11yCheck(page, {
    ...a11yCheckConfig,
    rules: {
      region: { enabled: false },
    },
  });
});
