import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import type { RowBorderExpectation } from '../../helpers/domUtils';
import { checkHeaderCellBorders } from '../../helpers/domUtils';

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
  { showColumnLines, rtlEnabled }: { showColumnLines: boolean; rtlEnabled: boolean; },
): void => {
  test(`First visible cell should have correct borders when there is the first hidden cell (showColumnLines: ${showColumnLines}, rtl: ${rtlEnabled})`, async (t) => {
    const dataGrid = new DataGrid(GRID_CONTAINER);
    const getExpectedBorders = (): RowBorderExpectation[] => {
      if (showColumnLines) {
        return [
          {
            rowIndex: 0,
            cells: [
              { columnIndex: 0, name: 'Col 1', expected: rtlEnabled ? [1, 0] : [0, 1] },
              { columnIndex: 1, name: 'Col 2', expected: rtlEnabled ? [1, 1] : [1, 1] },
              { columnIndex: 2, name: 'Col 3', expected: rtlEnabled ? [0, 1] : [1, 0] },
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

    await t.expect(dataGrid.isReady()).ok();
    await checkHeaderCellBorders(t, dataGrid, getExpectedBorders());
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
});
