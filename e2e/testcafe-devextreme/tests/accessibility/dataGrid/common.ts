import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import { a11yCheck, defaultA11yCheckOptions } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../../dataGrid/helpers/generateDataSourceData';
import { isMaterialBased } from '../../../helpers/themeUtils';

fixture.disablePageReloads`DataGrid - Common`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

const a11yCheckConfig = isMaterialBased() ? { runOnly: 'color-contrast' } : { };

test('Grid without data', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
}));

test('Sorting and group panel', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Paging with displayMode is \'full\'', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Paging with displayMode is \'compact\'', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Grouping and Summary', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Filter row - filter menu', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(filterEditor.menuButton);

  await t
    .expect(filterEditor.menu.isOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
    rules: {
      'aria-command-name': { enabled: true },
    },
  });
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Header filter - filter menu', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(filterIconElement);

  await t
    .expect(new HeaderFilter().element.exists)
    .ok();

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Filter panel', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const filterPanel = dataGrid.getFilterPanel();

  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(filterPanel.getFilterText().element.textContent)
    .eql('[Field 1] Contains \'val\'');

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Filter panel - popup with filter builder', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const filterPanel = dataGrid.getFilterPanel();
  const filterPanelIcon = filterPanel.getIconFilter();

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(filterPanelIcon.element);

  await t
    .expect(filterPanel.isOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
    rules: {
      'color-contrast': { enabled: false },
    },
  });
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Search panel', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Search panel - highlight', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
    rules: {
      'color-contrast': { enabled: false },
    },
  }, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Selection', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataRow(1).isSelected)
    .ok()
    .expect(dataGrid.getDataRow(2).isSelected)
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Focused row', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataRow(1).isFocusedRow)
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Fixed columns', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Column chooser with the \'dragAndDrop\' mode', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const columnChooser = dataGrid.getColumnChooser();
  const columnChooserButton = dataGrid.getColumnChooserButton();

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(columnChooserButton);

  await t
    .expect(columnChooser.isOpened)
    .ok();

  await a11yCheck(t, a11yCheckConfig);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Column chooser with the \'select\' mode', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const columnChooser = dataGrid.getColumnChooser();
  const columnChooserButton = dataGrid.getColumnChooserButton();

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(columnChooserButton);

  await t
    .expect(columnChooser.isOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
    rules: {
      'scrollable-region-focusable': { enabled: false },
    },
  });
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Empty column chooser', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const columnChooser = dataGrid.getColumnChooser();
  const columnChooserButton = dataGrid.getColumnChooserButton();

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(columnChooserButton);

  await t
    .expect(columnChooser.isOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
    rules: {
      'aria-required-children': { enabled: false },
    },
  });
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

[false, true].forEach((useIcons) => {
  test(`Row editing mode with useIcons=${useIcons}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
  }).before(async () => createWidget('dxDataGrid', {
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
  }, DATA_GRID_SELECTOR));

  test(`Row in edit state with useIcons=${useIcons}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await dataGrid.apiEditRow(0);

    await t
      .expect(dataGrid.getDataRow(0).isEdited)
      .ok();

    await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
  }).before(async () => createWidget('dxDataGrid', {
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
  }, DATA_GRID_SELECTOR));
});

test('Row editing mode - confirm delete message', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const isDialogOpened = dataGrid.getDialog().exists;

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiDeleteRow(0);

  await t
    .expect(isDialogOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
  });
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Batch editing mode - edit cell', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiEditCell(0, 0);

  await t
    .expect(dataGrid.getDataCell(0, 0).isEditCell)
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Batch editing mode - modified cell', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiCellValue(0, 0, 'test');

  await t
    .expect(dataGrid.getDataCell(0, 0).isModified)
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Batch editing mode - delete row', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiDeleteRow(0);

  await t
    .expect(dataGrid.getDataRow(0).isRemoved)
    .ok();

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Form editing mode', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiEditRow(0);

  await t
    .expect(dataGrid.getEditForm().element.exists)
    .ok();

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Popup editing mode', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiEditRow(0);

  await t
    .expect(dataGrid.getPopupEditForm().element.exists)
    .ok();

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Validation in cell editing mode', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+a backspace enter');

  await t
    .expect(dataGrid.getRevertTooltip().exists)
    .ok()
    .expect(dataGrid.getInvalidMessageTooltip().exists)
    .ok();

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));

test('Error row', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiEditRow(0);

  await t
    .expect(dataGrid.getDataRow(0).isEdited)
    .ok();

  await dataGrid.apiCellValue(0, 0, 'test');
  await dataGrid.apiSaveEditData();

  await t
    .expect(dataGrid.getErrorRow().exists)
    .ok();

  await a11yCheck(t, defaultA11yCheckOptions, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
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
  onRowValidating(e) {
    e.isValid = false;
    e.errorText = 'Test';
  },
}, DATA_GRID_SELECTOR));

test('Adaptability', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await dataGrid.apiExpandAdaptiveDetailRow('val_0_0');

  await t
    .expect(dataGrid.getAdaptiveRow(0).element.exists)
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 10),
  keyExpr: 'field_0',
  columnWidth: 100,
  width: 800,
  columnHidingEnabled: true,
}, DATA_GRID_SELECTOR));

test('Row drag and drop', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 5),
  keyExpr: 'field_0',
  rowDragging: {
    allowReordering: true,
    showDragIcons: true,
  },
}, DATA_GRID_SELECTOR));

test('Export', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerPanel = dataGrid.getHeaderPanel();
  const exportButton = headerPanel.getExportButton();

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.click(exportButton.element);

  await t
    .expect(exportButton.isOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
  });
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 5),
  keyExpr: 'field_0',
  export: {
    enabled: true,
    formats: ['xlsx', 'pdf'],
    allowExportSelectedData: true,
  },
}, DATA_GRID_SELECTOR));

test('Context menu', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t.rightClick(headerRow.element);

  await t
    .expect(contextMenu.isOpened)
    .ok();

  await a11yCheck(t, {
    ...a11yCheckConfig,
    runOnly: '',
    rules: {
      region: { enabled: false },
    },
  });
}).before(async () => createWidget('dxDataGrid', {
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
}, DATA_GRID_SELECTOR));
