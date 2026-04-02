import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import type { RowBorderExpectation } from '../../helpers/domUtils';
import {
  checkDataCellBorders, checkFilterCellBorders, checkHeaderCellBorders, checkSummaryCellBorders,
} from '../../helpers/domUtils';

fixture.disablePageReloads`Adaptivity.Matrix.Functional`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

const configs = [{
  showColumnLines: true,
  rtlEnabled: false,
}, {
  showColumnLines: false,
  rtlEnabled: false,
}, {
  showColumnLines: true,
  rtlEnabled: true,
}, {
  showColumnLines: false,
  rtlEnabled: true,
}];

// Check vertical borders of data cells
configs.forEach((
  { showColumnLines, rtlEnabled }: { showColumnLines: boolean; rtlEnabled: boolean },
): void => {
  test(`Headers and Filter cells should have correct borders when there is the first hidden header (showColumnLines: ${showColumnLines}, rtl: ${rtlEnabled})`, async (t) => {
    const dataGrid = new DataGrid(GRID_CONTAINER);
    const getExpectedBorders = (): RowBorderExpectation[] => {
      if (showColumnLines) {
        return [
          {
            rowIndex: 0,
            cells: [
              { columnIndex: 0, name: 'Col 1', expected: [0, 0] },
              { columnIndex: 1, name: 'Col 2', expected: rtlEnabled ? [1, 0] : [0, 1] },
              { columnIndex: 2, name: 'Col 3', expected: [1, 1] },
            ],
          },
        ];
      }

      return [
        {
          rowIndex: 0,
          cells: [
            { columnIndex: 0, name: 'Col 1', expected: [0, 0] },
            { columnIndex: 1, name: 'Col 2', expected: [0, 0] },
            { columnIndex: 2, name: 'Col 3', expected: [0, 0] },
          ],
        },
      ];
    };
    const expectedBorders = getExpectedBorders();

    await t.expect(dataGrid.isReady()).ok();
    await checkHeaderCellBorders(t, dataGrid, expectedBorders);
    await checkFilterCellBorders(t, dataGrid, expectedBorders);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          Col1: 'Data A', Col2: 'Desc A', Col3: 'Group 1', Col4: 'X', Col5: 100, Col6: 50,
        },
        {
          Col1: 'Data B', Col2: 'Desc B', Col3: 'Group 1', Col4: 'Y', Col5: 200, Col6: 20,
        },
        {
          Col1: 'Data C', Col2: 'Desc C', Col3: 'Group 2', Col4: 'Z', Col5: 300, Col6: 10,
        },
      ],
      columns: [
        { dataField: 'Col1', hidingPriority: 0 },
        { dataField: 'Col2' },
        { dataField: 'Col3' },
      ],
      width: 250,
      filterRow: { visible: true },
      showColumnLines,
      rtlEnabled,
      columnWidth: 100,
    });
  });

  test(`Data cells should have correct borders when there is the first hidden header (showColumnLines: ${showColumnLines}, rtl: ${rtlEnabled})`, async (t) => {
    const dataGrid = new DataGrid(GRID_CONTAINER);
    const getExpectedBorders = (): RowBorderExpectation[] => {
      if (showColumnLines) {
        return [
          {
            rowIndex: 0,
            cells: [
              { columnIndex: 0, name: 'Col 1', expected: [0, 0] },
              { columnIndex: 1, name: 'Col 2', expected: rtlEnabled ? [1, 0] : [0, 1] },
              // The last visible data column has the dx-last-data-cell class.
              // This class removes the border on the right. For some reason,
              // the headers don't have this class. But everything looks fine visually.
              { columnIndex: 2, name: 'Col 3', expected: [1, 0] },
            ],
          },
        ];
      }

      return [
        {
          rowIndex: 0,
          cells: [
            { columnIndex: 0, name: 'Col 1', expected: [0, 0] },
            { columnIndex: 1, name: 'Col 2', expected: [0, 0] },
            { columnIndex: 2, name: 'Col 3', expected: [0, 0] },
          ],
        },
      ];
    };
    const expectedBorders = getExpectedBorders();

    await t.expect(dataGrid.isReady()).ok();
    await checkDataCellBorders(t, dataGrid, expectedBorders);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          Col1: 'Data A', Col2: 'Desc A', Col3: 'Group 1', Col4: 'X', Col5: 100, Col6: 50,
        },
        {
          Col1: 'Data B', Col2: 'Desc B', Col3: 'Group 1', Col4: 'Y', Col5: 200, Col6: 20,
        },
        {
          Col1: 'Data C', Col2: 'Desc C', Col3: 'Group 2', Col4: 'Z', Col5: 300, Col6: 10,
        },
      ],
      columns: [
        { dataField: 'Col1', hidingPriority: 0 },
        { dataField: 'Col2' },
        { dataField: 'Col3' },
      ],
      width: 250,
      showColumnLines,
      rtlEnabled,
      columnWidth: 100,
    });
  });

  test(`Summary cells should have correct borders when there is the first hidden header (showColumnLines: ${showColumnLines}, rtl: ${rtlEnabled})`, async (t) => {
    const dataGrid = new DataGrid(GRID_CONTAINER);
    const expectedSummaryCellBorders: RowBorderExpectation[] = [{
      rowIndex: 0,
      cells: [
        { columnIndex: 0, name: 'Col 1', expected: [0, 0] },
        { columnIndex: 1, name: 'Col 2', expected: [0, 0] },
        { columnIndex: 2, name: 'Col 3', expected: [0, 0] },
      ],
    }];

    await t.expect(dataGrid.isReady()).ok();
    await checkSummaryCellBorders(t, dataGrid, expectedSummaryCellBorders);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          Col1: 'Data A', Col2: 'Desc A', Col3: 'Group 1', Col4: 'X', Col5: 100, Col6: 50,
        },
        {
          Col1: 'Data B', Col2: 'Desc B', Col3: 'Group 1', Col4: 'Y', Col5: 200, Col6: 20,
        },
        {
          Col1: 'Data C', Col2: 'Desc C', Col3: 'Group 2', Col4: 'Z', Col5: 300, Col6: 10,
        },
      ],
      columns: [
        { dataField: 'Col1', hidingPriority: 0 },
        { dataField: 'Col2' },
        { dataField: 'Col3' },
      ],
      width: 250,
      summary: {
        totalItems: [{
          column: 'Col2',
          summaryType: 'count',
        }],
      },
      showColumnLines,
      rtlEnabled,
      columnWidth: 100,
    });
  });
});
