import { describe, expect, it } from '@jest/globals';

import { binarySearchCellIndex } from './binary_search_cell_index';

const cells = [
  {
    min: 0, max: 15, cellIndex: 0, rowIndex: 0, columnIndex: 0,
  },
  {
    min: 25, max: 35, cellIndex: 1, rowIndex: 0, columnIndex: 1,
  },
  {
    min: 45, max: 55, cellIndex: 2, rowIndex: 0, columnIndex: 2,
  },
];

describe('binarySearchCellIndex', () => {
  it('should return current cellIndex by date inside cell', () => {
    expect(binarySearchCellIndex(cells, 50)).toBe(2);
  });

  it('should return current cellIndex by date equal min edge', () => {
    expect(binarySearchCellIndex(cells, 25)).toBe(1);
  });

  it('should return next cellIndex by date equal max edge', () => {
    expect(binarySearchCellIndex(cells, 15)).toBe(1);
  });

  it('should return next cellIndex by date between cells', () => {
    expect(binarySearchCellIndex(cells, 24)).toBe(1);
  });
});
