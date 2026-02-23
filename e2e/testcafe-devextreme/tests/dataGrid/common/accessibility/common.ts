import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { getData } from '../../helpers/generateDataSourceData';

fixture.disablePageReloads`Common tests`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

// visual: fluent.blue.light
// visual: fluent.blue.dark
const screenshotCheck = async (
  t: TestController,
  screenshotName: string,
) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, `${screenshotName}.png`);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

test('Grid without data', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await screenshotCheck(t, 'no-data');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
}));

test('Sorting and group panel', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await screenshotCheck(t, 'sorting-and-group-panel');
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

  await screenshotCheck(t, 'paging-full-display-mode');
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

  await screenshotCheck(t, 'paging-compact-display-mode');
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

  await screenshotCheck(t, 'grouping-and-summary');
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

  await screenshotCheck(t, 'filter-row-menu');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();

  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.click(filterIconElement);

  // assert
  await t
    .expect(new HeaderFilter().element.exists)
    .ok();

  await screenshotCheck(t, 'header-filter-menu');
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

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(filterPanel.getFilterText().element.textContent)
    .eql('[Field 1] Contains \'val\'');

  await screenshotCheck(t, 'filter-panel');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const filterPanel = dataGrid.getFilterPanel();
  const filterPanelIcon = filterPanel.getIconFilter();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.click(filterPanelIcon.element);

  // assert
  await t
    .expect(filterPanel.isOpened)
    .ok();

  await screenshotCheck(t, 'filter-builder');
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

  await screenshotCheck(t, 'search-panel');
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

  await screenshotCheck(t, 'search-panel-highlight');
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

  await screenshotCheck(t, 'selection');
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

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataRow(1).isFocusedRow)
    .ok();

  await screenshotCheck(t, 'focused-row');
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

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  await screenshotCheck(t, 'fixed-columns');
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

[false, true].forEach((useIcons) => {
  test(`Row editing mode with useIcons=${useIcons}`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    await screenshotCheck(t, `row-editing-mode-with-useIcons=${useIcons}`);
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
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await dataGrid.apiEditRow(0);

    // assert
    await t
      .expect(dataGrid.getDataRow(0).isEdited)
      .ok();

    await screenshotCheck(t, `row-edit-state-with-useIcons=${useIcons}`);
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const isDialogOpened = dataGrid.getDialog().exists;

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiDeleteRow(0);

  // assert
  await t
    .expect(isDialogOpened)
    .ok();

  await screenshotCheck(t, 'row-editing-mode');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiEditCell(0, 0);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isEditCell)
    .ok();

  await screenshotCheck(t, 'batch-editing-mode-edit_cell');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiCellValue(0, 0, 'test');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isModified)
    .ok();

  await screenshotCheck(t, 'row-editing-mode-modified_cell');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiDeleteRow(0);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isRemoved)
    .ok();

  await screenshotCheck(t, 'row-editing-mode-delete_row');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiEditRow(0);

  // assert
  await t
    .expect(dataGrid.getEditForm().element.exists)
    .ok();

  await screenshotCheck(t, 'form-editing-mode');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiEditRow(0);

  // assert
  await t
    .expect(dataGrid.getPopupEditForm().element.exists)
    .ok();

  await screenshotCheck(t, 'popup-editing-mode');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+a backspace enter');

  // assert
  await t
    .expect(dataGrid.getRevertTooltip().exists)
    .ok()
    .expect(dataGrid.getInvalidMessageTooltip().exists)
    .ok();

  await screenshotCheck(t, 'validation-in-cell-editing-mode');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiEditRow(0);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isEdited)
    .ok();

  // act
  await dataGrid.apiCellValue(0, 0, 'test');
  await dataGrid.apiSaveEditData();

  // assert
  await t
    .expect(dataGrid.getErrorRow().exists)
    .ok();

  await screenshotCheck(t, 'error-row');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.apiExpandAdaptiveDetailRow('val_0_0');

  // assert
  await t
    .expect(dataGrid.getAdaptiveRow(0).element.exists)
    .ok();

  await screenshotCheck(t, 'adaptive-row');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 10),
  keyExpr: 'field_0',
  columnWidth: 100,
  width: 800,
  columnHidingEnabled: true,
}, DATA_GRID_SELECTOR));

test('Row drag and drop', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  await screenshotCheck(t, 'row-drag-and-drop');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 5),
  keyExpr: 'field_0',
  rowDragging: {
    allowReordering: true,
    showDragIcons: true,
  },
}, DATA_GRID_SELECTOR));

test('Export', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerPanel = dataGrid.getHeaderPanel();
  const exportButton = headerPanel.getExportButton();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.click(exportButton.element);

  // assert
  await t
    .expect(exportButton.isOpened)
    .ok();

  await screenshotCheck(t, 'export-button');
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
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.rightClick(headerRow.element);

  // assert
  await t
    .expect(contextMenu.isOpened)
    .ok();

  await screenshotCheck(t, 'context-menu');
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
