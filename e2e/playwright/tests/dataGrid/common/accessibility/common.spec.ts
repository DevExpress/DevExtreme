import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import HeaderFilter from '../../../../models/dataGrid/headers/headerFilter';
import { getData } from '../../helpers/generateDataSourceData';

const screenshotCheck = async (
  page: Page,
  screenshotName: string,
): Promise<void> => {
  await testScreenshot(page, `${screenshotName}.png`);
};

test.describe('Common tests', () => {
  test('Grid without data', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'no-data');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'sorting-and-group-panel');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'paging-full-display-mode');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'paging-compact-display-mode');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'grouping-and-summary');
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await filterCell.menuButton.click();

    await filterCell.menu.expectOpened();

    await screenshotCheck(page, 'filter-row-menu');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const filterIconElement = headerCell.getFilterIcon();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await filterIconElement.click();

    // assert
    await expect(new HeaderFilter(page).element.first()).toBeAttached();

    await screenshotCheck(page, 'header-filter-menu');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterPanel = dataGrid.getFilterPanel();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(filterPanel.getFilterText().element).toHaveText('[Field 1] Contains \'val\'');

    await screenshotCheck(page, 'filter-panel');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterPanel = dataGrid.getFilterPanel();
    const filterPanelIcon = filterPanel.getIconFilter();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await filterPanelIcon.element.click();

    // assert
    await filterPanel.expectOpened();

    await screenshotCheck(page, 'filter-builder');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'search-panel');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'search-panel-highlight');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.getDataRow(1).expectSelected();
    await dataGrid.getDataRow(2).expectSelected();

    await screenshotCheck(page, 'selection');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.getDataRow(1).expectFocusedRow();

    await screenshotCheck(page, 'focused-row');
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'fixed-columns');
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
      });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await screenshotCheck(page, `row-editing-mode-with-useIcons=${useIcons}`);
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
      });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // act
      await dataGrid.apiEditRow(0);

      // assert
      await dataGrid.getDataRow(0).expectEdited();

      await screenshotCheck(page, `row-edit-state-with-useIcons=${useIcons}`);
    });
  });

  test('Row editing mode - confirm delete message', async ({ page }) => {
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const dialog = dataGrid.getDialog();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiDeleteRow(0);

    // assert
    await expect(dialog).toBeAttached();

    await screenshotCheck(page, 'row-editing-mode');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiEditCell(0, 0);

    // assert
    await dataGrid.getDataCell(0, 0).expectEditCell();

    await screenshotCheck(page, 'batch-editing-mode-edit_cell');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiCellValue(0, 0, 'test');

    // assert
    await dataGrid.getDataCell(0, 0).expectModified();

    await screenshotCheck(page, 'row-editing-mode-modified_cell');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiDeleteRow(0);

    // assert
    await dataGrid.getDataRow(0).expectRemoved();

    await screenshotCheck(page, 'row-editing-mode-delete_row');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiEditRow(0);

    // assert
    await expect(dataGrid.getEditForm().element).toBeAttached();

    await screenshotCheck(page, 'form-editing-mode');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiEditRow(0);

    // assert
    await expect(dataGrid.getPopupEditForm().element).toBeAttached();

    await screenshotCheck(page, 'popup-editing-mode');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    // assert
    await expect(dataGrid.getRevertTooltip().first()).toBeAttached();
    await expect(dataGrid.getInvalidMessageTooltip().first()).toBeAttached();

    await screenshotCheck(page, 'validation-in-cell-editing-mode');
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
    }), DEFAULT_SELECTOR, { arg: getData(10, 5) });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiEditRow(0);

    // assert
    await dataGrid.getDataRow(0).expectEdited();

    // act
    await dataGrid.apiCellValue(0, 0, 'test');
    await dataGrid.apiSaveEditData();

    // assert
    await expect(dataGrid.getErrorRow()).toBeAttached();

    await screenshotCheck(page, 'error-row');
  });

  test('Adaptability', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 10),
      keyExpr: 'field_0',
      columnWidth: 100,
      width: 800,
      columnHidingEnabled: true,
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiExpandAdaptiveDetailRow('val_0_0');

    // assert
    await expect(dataGrid.getAdaptiveRow(0).element).toBeAttached();

    await screenshotCheck(page, 'adaptive-row');
  });

  test('Row drag and drop', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await screenshotCheck(page, 'row-drag-and-drop');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();
    const exportButton = headerPanel.getExportButton();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await exportButton.element.click();

    // assert
    await exportButton.expectOpened();

    await screenshotCheck(page, 'export-button');
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await headerRow.element.click({ button: 'right' });

    // assert
    await contextMenu.expectOpened();

    await screenshotCheck(page, 'context-menu');
  });
});
