import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import DataGrid from '../../model/dataGrid';

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
