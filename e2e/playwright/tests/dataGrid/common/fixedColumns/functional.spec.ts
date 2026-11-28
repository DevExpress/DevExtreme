import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { collectWarnings } from '../../helpers/consoleWarnings';
import { typeText } from '../../helpers/typeText';

const mockCountries = [
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
];

test.describe('FixedColumns', () => {
  // T1156153
  test('Fixed columns should have same width as not fixed columns with columnAutoWidth: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
      page,
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

    const dataGridWidthFixedColumns = new DataGrid(page, DEFAULT_SELECTOR);
    const dataGridUsual = new DataGrid(page, '#otherContainer');

    const firstFixedCell = dataGridWidthFixedColumns.getDataCell(1, 0);
    const firstCell = dataGridUsual.getDataCell(1, 0);

    const fixedCellWidth = await firstFixedCell.element.evaluate((element) => element.clientWidth);
    const cellWidth = await firstCell.element.evaluate((element) => element.clientWidth);

    expect(fixedCellWidth).toBe(cellWidth);
  });

  test('DataGrid - Group summary is not updated when a column is fixed on the right side (T1223764)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const editCell = dataGrid.getDataRow(1).getDataCell(2);

    await editCell.element.click();
    await typeText(editCell.getEditor().element, '5', { replace: true });
    await page.keyboard.press('Enter');
    await expect(dataGrid.getGroupRow(0).element).toHaveText('A: group 0 (Count: 3, Sum of B is 7)');
  });

  test('Warning should be shown when trying to set fixed state for child columns', async ({ page }) => {
    const warnings = collectWarnings(page, 'W1028');

    await createWidget(
      page,
      'dxDataGrid',
      {
        dataSource: mockCountries,
        keyExpr: 'ID',
        columnAutoWidth: true,
        allowColumnReordering: true,
        width: 600,
        showBorders: true,
        columnChooser: { enabled: true },
        columns: [
          {
            dataField: 'Country',
            fixed: true,
            fixedPosition: 'left',
          },
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
        ],
      },
      DEFAULT_SELECTOR,
    );

    await expect.poll(() => warnings.length, { message: 'There is warning W1028' }).toBe(1);
  });

  test('Warning should work when columns changed in real time', async ({ page }) => {
    const warnings = collectWarnings(page, 'W1028');

    await createWidget(
      page,
      'dxDataGrid',
      {
        dataSource: [],
      },
      DEFAULT_SELECTOR,
    );

    const grid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => warnings.length, { message: 'There is not any warning W1028' }).toBe(0);

    await grid.option('columns', [
      {
        dataField: 'test3',
        caption: 'test3',
      },
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
    await expect.poll(() => warnings.length, { message: 'There is warning W1028' }).toBe(1);
  });

  test('Warning should be shown one time for every dataGrid instance', async ({ page }) => {
    const warnings = collectWarnings(page, 'W1028');

    await createWidget(
      page,
      'dxDataGrid',
      {
        dataSource: mockCountries,
        keyExpr: 'ID',
        columnAutoWidth: true,
        allowColumnReordering: true,
        width: 600,
        showBorders: true,
        columnChooser: { enabled: true },
        columns: [
          {
            dataField: 'Country',
            fixed: true,
            fixedPosition: 'left',
          },
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
        ],
      },
      DEFAULT_SELECTOR,
    );

    await createWidget(
      page,
      'dxDataGrid',
      {
        dataSource: [],
      },
      '#otherContainer',
    );

    const otherGrid = new DataGrid(page, '#otherContainer');

    await otherGrid.apiAddColumn({
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
    await expect.poll(() => warnings.length, { message: 'There are two warnings W1028' }).toBe(2);
  });
});
