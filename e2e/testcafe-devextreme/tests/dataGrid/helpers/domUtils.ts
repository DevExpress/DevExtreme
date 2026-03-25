import type DataGrid from 'devextreme-testcafe-models/dataGrid';

// [borderLeftWidth, borderRightWidth] in pixels
type Borders = [left: number, right: number];

interface CellBorderExpectation {
  columnIndex: number;
  name: string;
  expected: Borders;
}

export interface RowBorderExpectation {
  rowIndex: number;
  cells: CellBorderExpectation[];
}

export async function checkHeaderCellBorders(
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
          `Headers: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
        )
        .expect(parseInt(borderRight, 10)).eql(
          rightWidth,
          `Headers: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
        );
    }
  }
}

export async function checkFilterCellBorders(
  t: TestController,
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  // eslint-disable-next-line no-restricted-syntax
  for (const { rowIndex, cells } of expectedRows) {
    const filterRow = dataGrid.getFilterRow();

    // eslint-disable-next-line no-restricted-syntax
    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const { element } = filterRow.getFilterCell(columnIndex);

      const borderLeft = await element.getStyleProperty('border-left-width');
      const borderRight = await element.getStyleProperty('border-right-width');

      await t
        .expect(parseInt(borderLeft, 10)).eql(
          leftWidth,
          `Filter cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
        )
        .expect(parseInt(borderRight, 10)).eql(
          rightWidth,
          `Filter cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
        );
    }
  }
}

export async function checkDataCellBorders(
  t: TestController,
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  // eslint-disable-next-line no-restricted-syntax
  for (const { rowIndex, cells } of expectedRows) {
    const dataRow = dataGrid.getDataRow(rowIndex);

    // eslint-disable-next-line no-restricted-syntax
    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const { element } = dataRow.getDataCell(columnIndex);

      const borderLeft = await element.getStyleProperty('border-left-width');
      const borderRight = await element.getStyleProperty('border-right-width');

      await t
        .expect(parseInt(borderLeft, 10)).eql(
          leftWidth,
          `Data cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
        )
        .expect(parseInt(borderRight, 10)).eql(
          rightWidth,
          `Data cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
        );
    }
  }
}

export async function checkSummaryCellBorders(
  t: TestController,
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  // eslint-disable-next-line no-restricted-syntax
  for (const { rowIndex, cells } of expectedRows) {
    const summaryRow = dataGrid.getFooterRow();

    // eslint-disable-next-line no-restricted-syntax
    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const element = summaryRow.child('td');

      const borderLeft = await element.getStyleProperty('border-left-width');
      const borderRight = await element.getStyleProperty('border-right-width');

      await t
        .expect(parseInt(borderLeft, 10)).eql(
          leftWidth,
          `Summary cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
        )
        .expect(parseInt(borderRight, 10)).eql(
          rightWidth,
          `Summary cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
        );
    }
  }
}
