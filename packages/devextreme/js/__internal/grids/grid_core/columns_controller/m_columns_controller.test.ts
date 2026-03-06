import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../__tests__/__mock__/helpers/utils';

const dataSource = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

describe('Column Controller', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Expand columns in band columns layout', () => {
    it('detail expand column header should have rowspan equal to header row count when band columns are used', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        columns: [
          { caption: 'Band column 1', columns: ['id', 'name'] },
          { dataField: 'name', caption: 'Column 3', name: 'Column3' },
        ],
        masterDetail: {
          enabled: true,
        },
      });

      const columnsController = instance.getController('columns');
      const rowCount = columnsController.getRowCount();
      const firstRowColumns = columnsController.getVisibleColumns(0);

      expect(rowCount).toBe(2);

      const expandColumn = firstRowColumns.find((col) => col.command === 'expand');
      expect(expandColumn).toBeDefined();
      expect(expandColumn.rowspan).toBe(2);
    });

    it('should place expand columns only in the first header row with grouped columns', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          {
            TestField1: 'group1', TestField2: 'group2', TestField3: 'val3', TestField4: 'val4',
          },
        ],
        columns: [
          { dataField: 'TestField1', caption: 'Column 1', groupIndex: 0 },
          {
            caption: 'Band Column 1',
            columns: [
              { dataField: 'TestField2', caption: 'Column 2', groupIndex: 1 },
              { dataField: 'TestField3', caption: 'Column 3' },
              { caption: 'Band Column 2', columns: [{ dataField: 'TestField4', caption: 'Column 4' }] },
            ],
          },
        ],
      });

      const columnsController = instance.getController('columns');
      const rowCount = columnsController.getRowCount();

      // Row 0: expand columns + Band Column 1
      const firstRowColumns = columnsController.getVisibleColumns(0);
      const expandColumnsInFirstRow = firstRowColumns.filter((col) => col.command === 'expand');

      expect(rowCount).toBe(3);
      expect(firstRowColumns.length).toBe(3);
      expect(expandColumnsInFirstRow.length).toBe(2);

      expandColumnsInFirstRow.forEach((col) => {
        expect(col.rowspan).toBe(3);
      });

      const bandColumn = firstRowColumns.find((col) => col.caption === 'Band Column 1');

      expect(bandColumn).toBeDefined();
      expect(bandColumn.isBand).toBe(true);
      expect(bandColumn.rowspan).toBeUndefined();

      // Row 1: Column 3 + Band Column 2
      const secondRowColumns = columnsController.getVisibleColumns(1);
      const expandColumnsInSecondRow = secondRowColumns.filter((col) => col.command === 'expand');

      expect(secondRowColumns.length).toBe(2);
      expect(expandColumnsInSecondRow.length).toBe(0);

      const column3 = secondRowColumns.find((col) => col.caption === 'Column 3');

      expect(column3).toBeDefined();
      expect(column3.rowspan).toBe(2);

      const bandColumn2 = secondRowColumns.find((col) => col.caption === 'Band Column 2');

      expect(bandColumn2).toBeDefined();
      expect(bandColumn2.isBand).toBe(true);
      expect(bandColumn2.rowspan).toBeUndefined();

      // Row 2: Column 4
      const thirdRowColumns = columnsController.getVisibleColumns(2);
      const expandColumnsInThirdRow = thirdRowColumns.filter((col) => col.command === 'expand');
      const column4 = thirdRowColumns.find((col) => col.caption === 'Column 4');

      expect(expandColumnsInThirdRow.length).toBe(0);
      expect(column4).toBeDefined();
      expect(column4.rowspan).toBeUndefined();
    });

    it('should place expand columns only in the first header row with showWhenGrouped', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { field1: 'g1', field2: 'g2', field3: 'g3' },
        ],
        columns: [{
          dataField: 'field1',
          showWhenGrouped: true,
          groupIndex: 0,
        }, {
          caption: 'band2',
          columns: [{
            dataField: 'field2',
            showWhenGrouped: true,
            groupIndex: 1,
          }, {
            caption: 'band3',
            columns: [{
              dataField: 'field3',
              showWhenGrouped: true,
              groupIndex: 2,
            }],
          }],
        }],
      });

      const columnsController = instance.getController('columns');
      const rowCount = columnsController.getRowCount();

      expect(rowCount).toBe(3);

      // Row 0: expand columns with rowspan=3, data columns with rowspan=3, band column
      const firstRowColumns = columnsController.getVisibleColumns(0);
      const expandColumnsRow0 = firstRowColumns.filter((col) => col.command === 'expand');

      expect(expandColumnsRow0.length).toBe(3);
      expandColumnsRow0.forEach((col) => {
        expect(col.rowspan).toBe(3);
      });

      // showWhenGrouped data columns should be in the first row with rowspan=3
      const field1Col = firstRowColumns.find((col) => col.caption === 'Field 1' && !col.command);
      expect(field1Col).toBeDefined();
      expect(field1Col.rowspan).toBe(3);

      // band2 should be in the first row without rowspan (it has children)
      const band2Col = firstRowColumns.find((col) => col.caption === 'band2');
      expect(band2Col).toBeDefined();
      expect(band2Col.rowspan).toBeUndefined();

      // Row 1: no expand columns
      const secondRowColumns = columnsController.getVisibleColumns(1);
      const expandColumnsRow1 = secondRowColumns.filter((col) => col.command === 'expand');

      expect(expandColumnsRow1.length).toBe(0);

      // band3 should be in the second row
      const band3Col = secondRowColumns.find((col) => col.caption === 'band3');
      expect(band3Col).toBeDefined();

      // Row 2: no expand columns
      const thirdRowColumns = columnsController.getVisibleColumns(2);
      const expandColumnsRow2 = thirdRowColumns.filter((col) => col.command === 'expand');

      expect(expandColumnsRow2.length).toBe(0);
    });

    it('should not set rowspan on expand columns when there is only one header row with grouped showWhenGrouped columns', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          {
            field1: 'val1', field2: 'val2', field3: 'g1', field4: 'val4',
          },
        ],
        columns: [
          'field1',
          'field2',
          { dataField: 'field3', showWhenGrouped: true, groupIndex: 0 },
        ],
      });

      const columnsController = instance.getController('columns');
      const rowCount = columnsController.getRowCount();

      expect(rowCount).toBe(1);

      const visibleColumns = columnsController.getVisibleColumns(0);
      const expandColumn = visibleColumns.find((col) => col.command === 'expand' || col.type === 'groupExpand');

      expect(expandColumn).toBeDefined();
      expect(expandColumn.rowspan).toBeUndefined();
    });

    it('should not set rowspan on expand column when there is a single header row', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        columns: ['id', 'name'],
        masterDetail: {
          enabled: true,
        },
      });

      const columnsController = instance.getController('columns');
      const rowCount = columnsController.getRowCount();
      const firstRowColumns = columnsController.getVisibleColumns(0);

      const expandColumn = firstRowColumns.find((col) => col.command === 'expand');

      expect(rowCount).toBe(1);
      expect(expandColumn).toBeDefined();
      expect(expandColumn.rowspan).toBeUndefined();
    });
  });
});
