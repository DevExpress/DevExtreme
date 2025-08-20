import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { makeRowsViewTemplatesAsync } from '../helpers/asyncTemplates';

const DATA_GRID_SELECTOR = '#container';

fixture`FixedColumns`
  .page(url(__dirname, '../../container.html'));

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
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
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
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
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
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
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
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
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

// T1193153
safeSizeTest('The grid layout should be correct after resizing the window when there are fixed and band columns', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await takeScreenshot('T1193153-layout-with-fixed-and-band-columns-1.png', dataGrid.element);
  await t.resizeWindow(400, 400);
  await takeScreenshot('T1193153-layout-with-fixed-and-band-columns-2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
  columnAutoWidth: true,
  dataSource: [{}],
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
  columns: [{
    caption: 'Fixed column',
    fixed: true,
    columns: [{
      caption: 'Banded column',
      width: 150,
    }],
  }, {
    caption: 'Default column',
  }, {
    type: 'buttons',
    width: 50,
  }],
}));

test('DataGrid - Group summary is not updated when a column is fixed on the right side (T1223764)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const editCell = dataGrid.getDataRow(1).getDataCell(2);

  await t
    .click(editCell.element)
    .typeText(editCell.getEditor().element, '5', { replace: true })
    .pressKey('enter')
    .expect(dataGrid.getGroupRow(0).element.textContent)
    .eql('A: group 0 (Count: 3, Sum of B is 7)');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, A: 'group 0', B: 1 },
    { id: 1, A: 'group 0', B: 1 },
    { id: 2, A: 'group 0', B: 1 },
  ],
  keyExpr: 'id',
  repaintChangesOnly: true,
  columnFixing: {
    enabled: true,
    // @ts-expect-error private option
    legacyMode: true,
  },
  groupPanel: {
    visible: true,
  },
  summary: {
    recalculateWhileEditing: true,
    groupItems: [
      {
        column: 'B',
        summaryType: 'count',
      },
      {
        column: 'B',
        summaryType: 'sum',
      },
    ],
  },
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
    allowDeleting: true,
  },
  columns: [
    {
      dataField: 'id',
      width: 50,
    }, {
      dataField: 'A',
      groupIndex: 0,
    }, {
      dataField: 'B',
      dataType: 'number',
    },
  ],
}));

test(
  'Warning should be shown when trying to set fixed state for child columns. Warning should work when columns changed in real time. Warning should be shown one time for every dataGrid instance',
  async (t) => {
    const grid1 = new DataGrid('#container');
    const grid2 = new DataGrid('#otherContainer');

    let consoleMessages = await t.getBrowserConsoleMessages();

    let warnings = consoleMessages?.warn.filter((message) => message.startsWith('W1028')) || [];

    await t.expect(warnings.length).eql(1, 'There is one warning W1028');

    await grid2.option('columns', [
      { dataField: 'test3', caption: 'test3' },
      {
        caption: 'test3 group',
        columns: [
          {
            dataField: 'test4',
            caption: 'test4',
            fixed: true,
          },
          {
            dataField: 'test5',
            caption: 'test5',
            fixed: true,
          },
        ],
      },
    ]);

    consoleMessages = await t.getBrowserConsoleMessages();

    warnings = consoleMessages?.warn.filter((message) => message.startsWith('W1028')) || [];

    await t.expect(warnings.length).eql(2, 'There are two warnings W1028');

    await grid1.apiAddColumn({
      dataField: 'test',
      caption: 'test',
      columns: [
        {
          dataField: 'test1',
          caption: 'test1',
          fixed: true,
        },
        {
          dataField: 'test2',
          caption: 'test2',
          fixed: true,
        },
      ],
    });

    consoleMessages = await t.getBrowserConsoleMessages();

    warnings = consoleMessages?.warn.filter((message) => message.startsWith('W1028')) || [];

    await t
      .expect(warnings.length)
      .eql(2, 'There are still two warnings W1028');
  },
)
  .before(async () => {
    const countries = [
      {
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Rural: 0.15,
        Population_Total: 205809000,
        GDP_Agriculture: 0.054,
        GDP_Industry: 0.274,
        GDP_Services: 0.672,
        GDP_Total: 2353025,
      },
      {
        ID: 2,
        Country: 'China',
        Area: 9388211,
        Population_Urban: 0.54,
        Population_Rural: 0.46,
        Population_Total: 1375530000,
        GDP_Agriculture: 0.091,
        GDP_Industry: 0.426,
        GDP_Services: 0.483,
        GDP_Total: 10380380,
      },
      {
        ID: 3,
        Country: 'France',
        Area: 675417,
        Population_Urban: 0.79,
        Population_Rural: 0.21,
        Population_Total: 64529000,
        GDP_Agriculture: 0.019,
        GDP_Industry: 0.183,
        GDP_Services: 0.798,
        GDP_Total: 2846889,
      },
      {
        ID: 4,
        Country: 'Germany',
        Area: 357021,
        Population_Urban: 0.75,
        Population_Rural: 0.25,
        Population_Total: 81459000,
        GDP_Agriculture: 0.008,
        GDP_Industry: 0.281,
        GDP_Services: 0.711,
        GDP_Total: 3859547,
      },
      {
        ID: 5,
        Country: 'India',
        Area: 3287590,
        Population_Urban: 0.32,
        Population_Rural: 0.68,
        Population_Total: 1286260000,
        GDP_Agriculture: 0.174,
        GDP_Industry: 0.258,
        GDP_Services: 0.569,
        GDP_Total: 2047811,
      },
      {
        ID: 6,
        Country: 'Italy',
        Area: 301230,
        Population_Urban: 0.69,
        Population_Rural: 0.31,
        Population_Total: 60676361,
        GDP_Agriculture: 0.02,
        GDP_Industry: 0.242,
        GDP_Services: 0.738,
        GDP_Total: 2147952,
      },
      {
        ID: 7,
        Country: 'Japan',
        Area: 377835,
        Population_Urban: 0.93,
        Population_Rural: 0.07,
        Population_Total: 126920000,
        GDP_Agriculture: 0.012,
        GDP_Industry: 0.275,
        GDP_Services: 0.714,
        GDP_Total: 4616335,
      },
      {
        ID: 8,
        Country: 'Russia',
        Area: 17098242,
        Population_Urban: 0.74,
        Population_Rural: 0.26,
        Population_Total: 146544710,
        GDP_Agriculture: 0.039,
        GDP_Industry: 0.36,
        GDP_Services: 0.601,
        GDP_Total: 1857461,
      },
      {
        ID: 9,
        Country: 'United States',
        Area: 9147420,
        Population_Urban: 0.81,
        Population_Rural: 0.19,
        Population_Total: 323097000,
        GDP_Agriculture: 0.0112,
        GDP_Industry: 0.191,
        GDP_Services: 0.797,
        GDP_Total: 17418925,
      },
      {
        ID: 10,
        Country: 'United Kingdom',
        Area: 244820,
        Population_Urban: 0.82,
        Population_Rural: 0.18,
        Population_Total: 65097000,
        GDP_Agriculture: 0.007,
        GDP_Industry: 0.21,
        GDP_Services: 0.783,
        GDP_Total: 2945146,
      },
    ];

    await createWidget(
      'dxDataGrid',
      {
        dataSource: countries,
        keyExpr: 'ID',
        columnAutoWidth: true,
        allowColumnReordering: true,
        width: 600,
        showBorders: true,
        columnChooser: { enabled: true },
        columns: [
          { dataField: 'Country', fixed: true, fixedPosition: 'left' },
          {
            dataField: 'Area',
            fixed: true,
            fixedPosition: 'left',
          },
          {
            caption: 'Population',
            columns: [
              {
                caption: 'Total',
                dataField: 'Population_Total',
                format: 'fixedPoint',
                fixed: true,
                fixedPosition: 'left',
              },
              {
                caption: 'Urban',
                dataField: 'Population_Urban',
                format: 'percent',
                fixed: true,
                fixedPosition: 'left',
              },
            ],
          },
          {
            caption: 'Nominal GDP',
            columns: [
              {
                caption: 'Total, mln $',
                dataField: 'GDP_Total',
                format: 'fixedPoint',
                sortOrder: 'desc',
                fixed: true,
                fixedPosition: 'left',
              },
              {
                caption: 'By Sector',
                columns: [
                  {
                    caption: 'Agriculture',
                    dataField: 'GDP_Agriculture',
                    width: 95,
                    format: { type: 'percent', precision: 1 },
                    fixed: true,
                    fixedPosition: 'left',
                  },
                  {
                    caption: 'Industry',
                    dataField: 'GDP_Industry',
                    width: 80,
                    format: { type: 'percent', precision: 1 },
                  },
                  {
                    caption: 'Services',
                    dataField: 'GDP_Services',
                    width: 85,
                    format: { type: 'percent', precision: 1 },
                  },
                ],
              },
            ],
          },
        ],
      },
      '#container',
    );

    await createWidget(
      'dxDataGrid',
      {
        dataSource: [],
      },
      '#otherContainer',
    );
  });
