import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type DataGrid from '../../../models/dataGrid';

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

const getStyleProperty = (element: Locator, property: string): Promise<string> => element
  .evaluate((node, name) => getComputedStyle(node).getPropertyValue(name), property);

export async function checkHeaderCellBorders(
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  const headers = dataGrid.getHeaders();

  for (const { rowIndex, cells } of expectedRows) {
    const headerRow = headers.getHeaderRow(rowIndex);

    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const { element } = headerRow.getHeaderCell(columnIndex);

      const borderLeft = await getStyleProperty(element, 'border-left-width');
      const borderRight = await getStyleProperty(element, 'border-right-width');

      expect(
        parseInt(borderLeft, 10),
        `Headers: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
      ).toBe(leftWidth);
      expect(
        parseInt(borderRight, 10),
        `Headers: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
      ).toBe(rightWidth);
    }
  }
}

export async function checkFilterCellBorders(
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  for (const { rowIndex, cells } of expectedRows) {
    const filterRow = dataGrid.getFilterRow();

    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const { element } = filterRow.getFilterCell(columnIndex);

      const borderLeft = await getStyleProperty(element, 'border-left-width');
      const borderRight = await getStyleProperty(element, 'border-right-width');

      expect(
        parseInt(borderLeft, 10),
        `Filter cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
      ).toBe(leftWidth);
      expect(
        parseInt(borderRight, 10),
        `Filter cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
      ).toBe(rightWidth);
    }
  }
}

export async function checkDataCellBorders(
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  for (const { rowIndex, cells } of expectedRows) {
    const dataRow = dataGrid.getDataRow(rowIndex);

    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const { element } = dataRow.getDataCell(columnIndex);

      const borderLeft = await getStyleProperty(element, 'border-left-width');
      const borderRight = await getStyleProperty(element, 'border-right-width');

      expect(
        parseInt(borderLeft, 10),
        `Data cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-left-width`,
      ).toBe(leftWidth);
      expect(
        parseInt(borderRight, 10),
        `Data cells: "${name}" (row: ${rowIndex}, col: ${columnIndex}): border-right-width`,
      ).toBe(rightWidth);
    }
  }
}

export async function checkSummaryCellBorders(
  dataGrid: DataGrid,
  expectedRows: RowBorderExpectation[],
): Promise<void> {
  for (const { cells } of expectedRows) {
    const summaryRow = dataGrid.getFooterRow();

    for (const { columnIndex, name, expected: [leftWidth, rightWidth] } of cells) {
      const element = summaryRow.locator(':scope > td').nth(columnIndex);

      const borderLeft = await getStyleProperty(element, 'border-left-width');
      const borderRight = await getStyleProperty(element, 'border-right-width');

      expect(
        parseInt(borderLeft, 10),
        `Summary cells: "${name}" (col: ${columnIndex}): border-left-width`,
      ).toBe(leftWidth);
      expect(
        parseInt(borderRight, 10),
        `Summary cells: "${name}" (col: ${columnIndex}): border-right-width`,
      ).toBe(rightWidth);
    }
  }
}
