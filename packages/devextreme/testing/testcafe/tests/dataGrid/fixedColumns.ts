import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import DataGrid from '../../model/dataGrid';
import { makeRowsViewTemplatesAsync } from './helpers/asyncTemplates';
import { a11yCheck } from '../../helpers/accessibilityUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns`
  .page(url(__dirname, '../container.html'));

// T1156153
test('Fixed columns should have same width as not fixed columns with columnAutoWidth: true', async (t) => {
  const dataGridWidthFixedColumns = new DataGrid('#container');
  const dataGridUsual = new DataGrid('#otherContainer');

  const firstFixedCell = dataGridWidthFixedColumns.getDataCell(1, 0);
  const firstCell = dataGridUsual.getDataCell(1, 0);

  const fixedCellWidth = await firstFixedCell.element().clientWidth;
  const cellWidth = await firstCell.element().clientWidth;

  await t.expect(fixedCellWidth).eql(cellWidth);
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      {
        id: 0,
        // long group name causes the issue
        group: 'VERY LONG GROUP TEXT VERY LONG GROUP TEXT VERY LONG GROUP TEXT',
        dataA: 'DATA_A',
        dataB: 'DATA_B',
        dataC: 'DATA_C',
        dataD: 'DATA_D',
        dataE: 'DATA_E',
        dataF: 'DATA_F',
        dataG: 'DATA_G',
        dataH: 'DATA_H',
      }, {
        id: 1,
        group: 0,
        dataA: 'DATA_A',
        dataB: 'DATA_B',
        dataC: 'DATA_C',
        dataD: 'DATA_D',
        dataE: 'DATA_E',
        dataF: 'DATA_F',
        dataG: 'DATA_G',
        dataH: 'DATA_H',
      },
    ],
    keyExpr: 'id',
    allowColumnReordering: true,
    showBorders: true,
    grouping: {
      autoExpandAll: true,
    },
    columnAutoWidth: true,
    scrolling: { mode: 'standard', useNative: true },
    columns: [
      {
        dataField: 'dataA',
        fixed: true,
      },
      'dataB',
      'dataC',
      'dataD',
      'dataE',
      'dataF',
      'dataG',
      'dataH',
      {
        dataField: 'group',
        groupIndex: 0,
      },
    ],
  });

  await createWidget(
    'dxDataGrid',
    {
      dataSource: [
        {
          id: 0,
          group: 'VERY LONG GROUP TEXT VERY LONG GROUP TEXT VERY LONG GROUP TEXT',
          dataA: 'DATA_A',
          dataB: 'DATA_B',
          dataC: 'DATA_C',
          dataD: 'DATA_D',
          dataE: 'DATA_E',
          dataF: 'DATA_F',
          dataG: 'DATA_G',
          dataH: 'DATA_H',
        }, {
          id: 1,
          group: 0,
          dataA: 'DATA_A',
          dataB: 'DATA_B',
          dataC: 'DATA_C',
          dataD: 'DATA_D',
          dataE: 'DATA_E',
          dataF: 'DATA_F',
          dataG: 'DATA_G',
          dataH: 'DATA_H',
        },
      ],
      keyExpr: 'id',
      allowColumnReordering: true,
      showBorders: true,
      grouping: {
        autoExpandAll: true,
      },
      columnAutoWidth: true,
      scrolling: { mode: 'standard', useNative: true },
      columns: [
        'dataA',
        'dataB',
        'dataC',
        'dataD',
        'dataE',
        'dataF',
        'dataG',
        'dataH',
        {
          dataField: 'group',
          groupIndex: 0,
        },
      ],
    },
    '#otherContainer',
  );
});

// T1148937
test('Hovering over a row should work correctly when there is a fixed column and a column with a cellTemplate (React)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const firstDataRow = dataGrid.getDataRow(0);
  const firstFixedDataRow = dataGrid.getFixedDataRow(0);
  const secondDataRow = dataGrid.getDataRow(1);
  const secondFixedDataRow = dataGrid.getFixedDataRow(1);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.hover(firstDataRow.element);

  // assert
  await takeScreenshot('T1148937-grid-hover-row-1.png', dataGrid.element);

  await t
    .expect(firstDataRow.isHovered)
    .ok()
    .expect(firstFixedDataRow.isHovered)
    .ok();

  // act
  await t.hover(secondFixedDataRow.element);

  // assert
  await takeScreenshot('T1148937-grid-hover-row-2.png', dataGrid.element);

  await t
    .expect(secondDataRow.isHovered)
    .ok()
    .expect(secondFixedDataRow.isHovered)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
    keyExpr: 'id',
    renderAsync: false,
    hoverStateEnabled: true,
    templatesRenderAsynchronously: true,
    columns: [
      { dataField: 'id', fixed: true },
      { dataField: 'text', cellTemplate: '#test' },
    ],
    showBorders: true,
  });

  await t.wait(100);

  // simulating async rendering in React
  await ClientFunction(() => {
    const dataGrid = ($('#container') as any).dxDataGrid('instance');

    // eslint-disable-next-line no-underscore-dangle
    dataGrid.getView('rowsView')._templatesCache = {};

    // eslint-disable-next-line no-underscore-dangle
    dataGrid._getTemplate = () => ({
      render(options) {
        setTimeout(() => {
          ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
          options.deferred?.resolve();
        }, 100);
      },
    });

    dataGrid.repaint();
  })();

  await t.wait(200);
});

// T1177143
safeSizeTest('Fixed to the right columns should appear when any column has undefined or 0 width', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await takeScreenshot('T1177143-right-fixed-column-with-no-width-columns-1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 5000 });

  await takeScreenshot('T1177143-right-fixed-column-with-no-width-columns-2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  columnAutoWidth: false,
  dataSource: [{
    Column1: 'a',
    Column2: 'b',
    Column3: 'b',
    Column4: 'c',
    Column5: 'd',
    Column6: 'e',
    Column7: 'f',
    Column8: 'g',
  }],
  columns: [
    {
      dataField: 'Column1', fixed: true, fixedPosition: 'right', width: 100,
    },
    { dataField: 'Column2', width: undefined },
    { dataField: 'Column3', width: 0 },
    { dataField: 'Column4', width: 220 },
    { dataField: 'Column5', width: 240 },
    { dataField: 'Column6', width: 240 },
    { dataField: 'Column7', width: 0 },
    { dataField: 'Column8', width: 270 },
  ],
}));

// T1180834
test('Hovering over a row should work correctly after scrolling when there is a fixed column with a cellTemplate and virtual scrolling is used (React)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  let dataRow = dataGrid.getDataRow(1);
  let fixedDataRow = dataGrid.getDataRow(1);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.hover(dataRow.element);

  // assert
  await takeScreenshot('T1180834-grid-hover-row-after-scrolling-1.png', dataGrid.element);

  await t
    .expect(dataRow.isHovered)
    .ok()
    .expect(fixedDataRow.isHovered)
    .ok();

  // act
  await dataGrid.scrollTo(t, { y: 300 });
  dataRow = dataGrid.getDataRow(10);
  await t.hover(dataRow.element);

  // assert
  fixedDataRow = dataGrid.getDataRow(10);

  await takeScreenshot('T1180834-grid-hover-row-after-scrolling-2.png', dataGrid.element);

  await t
    .expect(dataRow.isHovered)
    .ok()
    .expect(fixedDataRow.isHovered)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(60)].map((_, index) => ({ id: index, text1: `item1 ${index}`, text2: `item2 ${index}` })),
    height: 500,
    keyExpr: 'id',
    renderAsync: false,
    hoverStateEnabled: true,
    templatesRenderAsynchronously: true,
    columns: [
      'id',
      {
        dataField: 'text1',
        cellTemplate: (_, { value }) => ($('<div/>') as any).text(value),
        fixed: true,
      },
      'text2',
    ],
    paging: {
      enabled: false,
    },
    scrolling: {
      useNative: false,
      rowRenderingMode: 'virtual',
    },
    showBorders: true,
  });

  await makeRowsViewTemplatesAsync(DATA_GRID_SELECTOR, 100);
});

test('Accessibility: Scrollable should always have focusable element when navigate through grid', async (t) => {
  const dataGrid = new DataGrid('#container');

  const columnsByFixing = await ClientFunction(
    () => (window as any).widget.getVisibleColumns().map((column) => column.fixed),
  )();
  const columnsLength = await ClientFunction(
    () => (window as any).widget.getVisibleColumns().length,
  )();

  const pressKey = async (key: string, times = 1) => {
    for (let i = 0; i < times; i += 1) {
      await t.pressKey(key);
    }
  };

  await a11yCheck(t);

  // focus through headers
  await pressKey('tab', columnsLength);

  // focus cells in first row
  for (let columnIndex = 0; columnIndex < columnsLength; columnIndex += 1) {
    await pressKey('tab');

    const isFixedCell = columnsByFixing[columnIndex];
    const cell = isFixedCell
      ? dataGrid.getFixedDataCell(0, columnIndex)
      : dataGrid.getDataCell(0, columnIndex);

    await t
      .expect(cell.isFocused)
      .ok();

    // it makes sense to check accessibility only if fixed column is focused
    const needCheckA11y = columnsByFixing[columnIndex];

    if (needCheckA11y) {
      await a11yCheck(t);
    }
  }

  // focus first cell in second row
  await pressKey('tab');

  await t
    .expect(dataGrid.getFixedDataCell(1, 0).isFocused)
    .ok();

  await a11yCheck(t);

  // focus last not fixed header cell
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(columnsLength - 3);

  await pressKey('shift+tab', 9);

  await t
    .expect(headerCell.isFocused)
    .ok();

  await a11yCheck(t);

  // focus out rows view by outside click
  const dataGridOffsetBottom = await dataGrid.element.getBoundingClientRectProperty('bottom');
  await t
    .click(Selector('body'), {
      offsetY: dataGridOffsetBottom + 10,
    });

  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', {
  columnWidth: 150,
  width: 800,
  keyExpr: 'id',
  scrolling: {
    useNative: true,
  },
  dataSource: [
    {
      id: 0, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
    },
    {
      id: 1, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
    },
  ],
  columns: [
    { dataField: 'column1', fixed: true },
    { dataField: 'column2', fixed: true },
    { dataField: 'column3' },
    { dataField: 'column4' },
    { dataField: 'column5' },
    { dataField: 'column6' },
    { dataField: 'column7', fixed: true, fixedPosition: 'right' },
    { dataField: 'column8', fixed: true, fixedPosition: 'right' },
  ],
}));

test('Accessibility: Scrollable should have focusable element when navigate out of the grid', async (t) => {
  const columnsLength = await ClientFunction(
    () => (window as any).widget.getVisibleColumns().length,
  )();

  const pressKey = async (key: string, times = 1) => {
    for (let i = 0; i < times; i += 1) {
      await t.pressKey(key);
    }
  };

  // focus through headers
  await pressKey('tab', columnsLength);

  // focus through data row
  await pressKey('tab', columnsLength);

  // focus button outside of the grid
  await pressKey('tab');

  await t
    .expect(Selector('#myButton').focused)
    .ok();

  await a11yCheck(t);
}).before(async () => {
  await ClientFunction(() => { $('<div id="myButton">').appendTo('body'); })();
  await createWidget('dxButton', { text: 'Focus' }, '#myButton');

  await createWidget('dxDataGrid', {
    columnWidth: 150,
    width: 800,
    keyExpr: 'id',
    scrolling: {
      useNative: true,
    },
    dataSource: [
      {
        id: 0, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
      },
    ],
    columns: [
      { dataField: 'column1', fixed: true },
      { dataField: 'column2', fixed: true },
      { dataField: 'column3' },
      { dataField: 'column4' },
      { dataField: 'column5' },
      { dataField: 'column6' },
      { dataField: 'column7', fixed: true, fixedPosition: 'right' },
      { dataField: 'column8', fixed: true, fixedPosition: 'right' },
    ],
  });
}).after(async () => {
  await ClientFunction(() => { $('#myButton').remove(); })();
});
