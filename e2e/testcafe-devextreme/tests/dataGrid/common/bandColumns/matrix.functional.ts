import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Band columns.Matrix`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

// [borderLeftWidth, borderRightWidth] in pixels
type Borders = [left: number, right: number];

interface CellBorderExpectation {
  columnIndex: number;
  name: string;
  expected: Borders;
}

interface RowBorderExpectation {
  rowIndex: number;
  cells: CellBorderExpectation[];
}

async function checkHeaderCellBorders(
  t: TestController,
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  const headers = dataGrid.getHeaders();

  // eslint-disable-next-line no-restricted-syntax
  for (const { rowIndex, cells } of expectedRows) {
    const headerRow = headers.getHeaderRow(rowIndex);

    // eslint-disable-next-line no-restricted-syntax
    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const { element } = headerRow.getHeaderCell(columnIndex);

      const borderLeft = await element.getStyleProperty('border-left-width');
      const borderRight = await element.getStyleProperty('border-right-width');

      await t
        .expect(parseInt(borderLeft, 10)).eql(
          leftWidth,
          `"${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
        )
        .expect(parseInt(borderRight, 10)).eql(
          rightWidth,
          `"${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
        );
    }
  }
}

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

// Check vertical borders of band header cells
configs.forEach((
  { showColumnLines, rtlEnabled }: { showColumnLines: boolean; rtlEnabled: boolean; },
): void => {
  // Header layout:
  // Row 0: | Band Column 1 (cols 0–2)    | Band Column 2 (cols 3–5)    |
  // Row 1: | Nested BandColumn 1 (0–2)   | Nested Band Column 2 (3–5)  |
  // Row 2: | Col1 | Col2 | Col3          | Col4 | Col5 | Col6          |
  test(`Two band columns with three levels (showColumnLines: ${showColumnLines}, rtl: ${rtlEnabled})`, async (t) => {
    const dataGrid = new DataGrid(GRID_CONTAINER);
    const getExpectedBorders = (): RowBorderExpectation[] => {
      if (showColumnLines) {
        return [
          {
            rowIndex: 0,
            cells: [
              { columnIndex: 0, name: 'Band Column 1', expected: rtlEnabled ? [1, 0] : [0, 1] },
              { columnIndex: 3, name: 'Band Column 2', expected: rtlEnabled ? [0, 0] : [1, 0] },
            ],
          },
          {
            rowIndex: 1,
            cells: [
              { columnIndex: 0, name: 'Nested Band Column 1', expected: rtlEnabled ? [1, 0] : [0, 1] },
              { columnIndex: 3, name: 'Nested Band Column 2', expected: rtlEnabled ? [0, 0] : [1, 0] },
            ],
          },
          {
            rowIndex: 2,
            cells: [
              { columnIndex: 0, name: 'Col1', expected: rtlEnabled ? [1, 0] : [0, 1] },
              { columnIndex: 1, name: 'Col2', expected: [1, 1] },
              { columnIndex: 2, name: 'Col3', expected: [1, 1] },
              { columnIndex: 3, name: 'Col4', expected: [1, 1] },
              { columnIndex: 4, name: 'Col5', expected: [1, 1] },
              { columnIndex: 5, name: 'Col6', expected: rtlEnabled ? [0, 0] : [1, 0] },
            ],
          },
        ];
      }

      return [
        {
          rowIndex: 0,
          cells: [
            { columnIndex: 0, name: 'Band Column 1', expected: rtlEnabled ? [0, 0] : [0, 0] },
            { columnIndex: 3, name: 'Band Column 2', expected: rtlEnabled ? [0, 1] : [1, 0] },
          ],
        },
        {
          rowIndex: 1,
          cells: [
            { columnIndex: 0, name: 'Nested Band Column 1', expected: rtlEnabled ? [0, 0] : [0, 0] },
            { columnIndex: 3, name: 'Nested Band Column 2', expected: rtlEnabled ? [0, 1] : [1, 0] },
          ],
        },
        {
          rowIndex: 2,
          cells: [
            { columnIndex: 0, name: 'Col1', expected: [0, 0] },
            { columnIndex: 1, name: 'Col2', expected: rtlEnabled ? [0, 1] : [1, 0] },
            { columnIndex: 2, name: 'Col3', expected: rtlEnabled ? [0, 1] : [1, 0] },
            { columnIndex: 3, name: 'Col4', expected: rtlEnabled ? [0, 1] : [1, 0] },
            { columnIndex: 4, name: 'Col5', expected: rtlEnabled ? [0, 1] : [1, 0] },
            { columnIndex: 5, name: 'Col6', expected: rtlEnabled ? [0, 1] : [1, 0] },
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
        {
          caption: 'Band Column 1',
          columns: [
            {
              caption: 'Nested BandColumn 1',
              columns: [
                { dataField: 'Col1' },
                { dataField: 'Col2' },
                { dataField: 'Col3' },
              ],
            },
          ],
        },
        {
          caption: 'Band Column 2',
          columns: [
            {
              caption: 'Nested Band Column 2',
              columns: [
                { dataField: 'Col4' },
                { dataField: 'Col5' },
                { dataField: 'Col6' },
              ],
            },
          ],
        },
      ],
      showColumnLines,
      rtlEnabled,
      columnWidth: 100,
    });
  });
});
