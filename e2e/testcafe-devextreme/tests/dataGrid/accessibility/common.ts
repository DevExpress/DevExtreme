import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { getData } from '../helpers/generateDataSourceData';
import { Themes } from '../../../helpers/themes';
import { changeTheme } from '../../../helpers/changeTheme';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';

fixture`Common tests with axe`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

[
  Themes.genericLight,
  Themes.genericDark,
  Themes.materialBlue,
  Themes.materialBlueDark,
  Themes.fluentBlue,
  Themes.fluentBlueDark,
].forEach((theme) => {
  const a11yCheckConfig = theme === Themes.genericLight ? {} : {
    runOnly: 'color-contrast',
  };
  const isFluent = theme === Themes.fluentBlue || theme === Themes.fluentBlueDark;
  const screenshotCheck = async (
    t: TestController,
    screenshotName: string,
    themeName: string,
    element: Selector,
  ) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`${screenshotName}_${themeName}.png`, element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  };

  test(`Grid without data in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'no-data', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: [],
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Sorting and group panel in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'sorting-and-group-panel', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Paging with displayMode is 'full' in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'paging-full-display-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Paging with displayMode is 'compact' in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'paging-compact-display-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Grouping and Summary in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'grouping-and-summary', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Filter row - filter menu in ${theme}`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await t.click(filterEditor.menuButton);

    // assert
    await t
      .expect(filterEditor.menu.isOpened)
      .ok();

    // act
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
      rules: {
        'aria-command-name': { enabled: true },
      },
    });
    if (isFluent) {
      await screenshotCheck(t, 'filter-row-menu', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Header filter - filter menu in ${theme}`, async (t) => {
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

    // act
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'header-filter-menu', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Filter panel in ${theme}`, async (t) => {
  // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const filterPanel = dataGrid.getFilterPanel();

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok()
      .expect(filterPanel.getFilterText().element.textContent)
      .eql('[Field 1] Contains \'val\'');

    // act
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'filter-panel', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Filter panel - popup with filter builder in ${theme}`, async (t) => {
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

    // act
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    if (isFluent) {
      await screenshotCheck(t, 'filter-builder', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Search panel in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'search-panel', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Search panel - highlight in ${theme}`, async (t) => {
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
    if (isFluent) {
      await screenshotCheck(t, 'search-panel-highlight', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Selection in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok()
      .expect(dataGrid.getDataRow(1).isSelected)
      .ok()
      .expect(dataGrid.getDataRow(2).isSelected)
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'selection', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Focused row in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok()
      .expect(dataGrid.getDataRow(1).isFocusedRow)
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'focused-row', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Fixed columns in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'fixed-columns', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(10, 7),
      keyExpr: 'field_0',
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Column chooser with the 'dragAndDrop' mode in ${theme}`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const columnChooser = dataGrid.getColumnChooser();
    const columnChooserButton = dataGrid.getColumnChooserButton();

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await t.click(columnChooserButton);

    // assert
    await t
      .expect(columnChooser.isOpened)
      .ok();

    // act, assert
    await a11yCheck(t, a11yCheckConfig);
    if (isFluent) {
      await screenshotCheck(t, 'column-chooser-drag_and_drop-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Column chooser with the 'select' mode in ${theme}`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const columnChooser = dataGrid.getColumnChooser();
    const columnChooserButton = dataGrid.getColumnChooserButton();

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await t.click(columnChooserButton);

    // assert
    await t
      .expect(columnChooser.isOpened)
      .ok();

    // act, assert
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
      rules: {
        'scrollable-region-focusable': { enabled: false },
      },
    });
    if (isFluent) {
      await screenshotCheck(t, 'column-chooser-select-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Empty column chooser in ${theme}`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const columnChooser = dataGrid.getColumnChooser();
    const columnChooserButton = dataGrid.getColumnChooserButton();

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act
    await t.click(columnChooserButton);

    // assert
    await t
      .expect(columnChooser.isOpened)
      .ok();

    // act, assert
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
      rules: {
        'aria-required-children': { enabled: false },
      },
    });
    if (isFluent) {
      await screenshotCheck(t, 'empty-column-chooser', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  [false, true].forEach((useIcons) => {
    test(`Row editing mode with useIcons=${useIcons} in ${theme}`, async (t) => {
    // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

      // assert
      await t
        .expect(dataGrid.isReady())
        .ok();

      // act, assert
      await a11yCheck(t);
      if (isFluent) {
        await screenshotCheck(t, `row-editing-mode-with-useIcons=${useIcons}`, theme, dataGrid.element);
      }
    }).before(async () => {
      await changeTheme(theme);

      return createWidget('dxDataGrid', {
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
      }, DATA_GRID_SELECTOR, {
        disableFxAnimation: true,
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });

    test(`Row in edit state with useIcons=${useIcons} in ${theme}`, async (t) => {
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

      // act, assert
      await a11yCheck(t);
      if (isFluent) {
        await screenshotCheck(t, `row-edit-state-with-useIcons=${useIcons}`, theme, dataGrid.element);
      }
    }).before(async () => {
      await changeTheme(theme);

      return createWidget('dxDataGrid', {
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
      }, DATA_GRID_SELECTOR, {
        disableFxAnimation: true,
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });

  test(`Row editing mode in ${theme} - confirm delete message`, async (t) => {
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

    // act, assert
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
    });
    if (isFluent) {
      await screenshotCheck(t, 'row-editing-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Batch editing mode in ${theme} - edit cell`, async (t) => {
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

    // act, assert
    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'batch-editing-mode-edit_cell', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Batch editing mode in ${theme} - modified cell`, async (t) => {
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

    // act, assert
    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'row-editing-mode-modified_cell', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Batch editing mode in ${theme} - delete row`, async (t) => {
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

    // act, assert
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'row-editing-mode-delete_row', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Form editing mode in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'form-editing-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Popup editing mode in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'popup-editing-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Validation in cell editing mode in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'validation-in-cell-editing-mode', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Error row in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t);
    if (isFluent) {
      await screenshotCheck(t, 'error-row', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
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
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Adaptability in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'adaptive-row', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(10, 10),
      keyExpr: 'field_0',
      columnWidth: 100,
      width: 800,
      columnHidingEnabled: true,
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Row drag and drop in ${theme}`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    // assert
    await t
      .expect(dataGrid.isReady())
      .ok();

    // act, assert
    await a11yCheck(t, a11yCheckConfig, DATA_GRID_SELECTOR);
    if (isFluent) {
      await screenshotCheck(t, 'row-drag-and-drop', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Export in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
    });
    if (isFluent) {
      await screenshotCheck(t, 'export-button', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      export: {
        enabled: true,
        formats: ['xlsx', 'pdf'],
        allowExportSelectedData: true,
      },
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Context menu in ${theme}`, async (t) => {
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

    // act, assert
    await a11yCheck(t, {
      ...a11yCheckConfig,
      runOnly: '',
      rules: {
        region: { enabled: false },
      },
    });
    if (isFluent) {
      await screenshotCheck(t, 'context-menu', theme, dataGrid.element);
    }
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      columnFixing: {
        enabled: true,
      },
      sorting: {
        mode: 'multiple',
      },
    }, DATA_GRID_SELECTOR, {
      disableFxAnimation: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
