import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns - Focus Overlay`
  .page(url(__dirname, '../../../container.html'));

test('Focus overlay should be displayed correctly if sticky columns are turned on', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t
    .click(dataGrid.getGroupRow(0).getCell(1).element)
    .pressKey('tab');

  await testScreenshot(t, takeScreenshot, 'datagrid_group_row_focused.png', { element: dataGrid.element });

  await t
    .click(dataGrid.getDataRow(2).getCommandCell(40).getAdaptiveButton())
    .pressKey('tab');

  await testScreenshot(t, takeScreenshot, 'datagrid_adaptive_item_focused.png', { element: dataGrid.element });

  await t
    .click(dataGrid.getGroupFooterRow().nth(0), { offsetX: 5, offsetY: 5 })
    .pressKey('tab');

  await testScreenshot(t, takeScreenshot, 'datagrid_group_footer_row_focused.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 40),
  columnFixing: {
    enabled: true,
  },
  groupPanel: {
    visible: true,
  },
  width: 800,
  showColumnHeaders: true,
  columnAutoWidth: true,
  allowColumnReordering: true,
  allowColumnResizing: true,
  summary: {
    totalItems: [{
      column: 'field_1',
      summaryType: 'count',
    }, {
      column: 'field_6',
      summaryType: 'count',
    }],
    groupItems: [{
      column: 'field_0',
      summaryType: 'count',
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      column: 'field_11',
      summaryType: 'count',
      showInGroupFooter: false,
      alignByColumn: true,
    }, {
      column: 'field_6',
      summaryType: 'count',
      showInGroupFooter: true,
    }],
  },
  customizeColumns(columns) {
    columns[5].fixed = true;
    columns[6].fixed = true;

    columns[11].fixed = true;
    columns[11].fixedPosition = 'right';
    columns[12].fixed = true;
    columns[12].fixedPosition = 'right';

    columns.splice(15, 5, {
      caption: 'Band column 1',
      columns: [{
        caption: 'Nested column 1',
        columns: ['field_15', 'field_16'],
      },
      'field_17',
      {
        caption: 'Nested column 2',
        columns: ['field_18', 'field_19'],
      }],
    });

    columns.splice(25, 4, {
      caption: 'Band column 2',
      columns: [
        'field_29',
        {
          caption: 'Nested column 3',
          columns: ['field_30', 'field_31'],
        },
        'field_32',
      ],
    });

    columns[0].hidingPriority = 0;
    columns[columns.length - 1].hidingPriority = 1;
    columns[columns.length - 2].hidingPriority = 2;
    columns[columns.length - 3].hidingPriority = 3;

    columns[1].groupIndex = 0;
    columns[2].groupIndex = 1;
  },
}));

test('Native scrollbar should not be shown when the focus overlay is visible (T1310336)', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupRow = dataGrid.getGroupRow(0);
  const firstDataRow = dataGrid.getDataRow(1);
  const secondDataCell = firstDataRow.getDataCell(2);
  const hasHorizontalScroll = async () => {
    const scrollableContainer = dataGrid.getScrollContainer();
    const scrollWidth = await scrollableContainer.scrollWidth;
    const clientWidth = await scrollableContainer.clientWidth;
    return scrollWidth > clientWidth;
  };

  // assert
  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.drag(secondDataCell.element, -2, 0, { offsetX: 1 });

  // assert
  await t
    .expect(firstDataRow.isFocusedRow)
    .ok()
    .expect(dataGrid.getFocusOverlay().visible)
    .notOk()
    .expect(await hasHorizontalScroll())
    .notOk();

  // act
  await t.pressKey('up');

  // assert
  await t
    .expect(firstGroupRow.isFocusedRow)
    .ok()
    .expect(dataGrid.getFocusOverlay().visible)
    .ok()
    .expect(await hasHorizontalScroll())
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 5),
  keyExpr: 'field_0',
  height: 300,
  focusedRowEnabled: true,
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[1].groupIndex = 0;
  },
  scrolling: {
    useNative: true,
  },
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
}));
