import { describe, expect, it } from '@jest/globals';

import {
  buildCellMatrix,
  getAdjacentCell,
  getCellCoordinates,
} from './table_cell_navigation';

const createColumnHeadersSection = (): HTMLTableSectionElement => {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr><td id="a" colspan="2"></td><td id="b" rowspan="2"></td></tr>
      <tr><td id="a1"></td><td id="a2"></td></tr>
    </thead>
  `;

  return table.tHead as HTMLTableSectionElement;
};

const createRowHeadersSection = (): HTMLTableSectionElement => {
  const table = document.createElement('table');
  table.innerHTML = `
    <tbody>
      <tr><td id="p" rowspan="2"></td><td id="p1"></td></tr>
      <tr><td id="p2"></td></tr>
      <tr><td id="q" colspan="2"></td></tr>
    </tbody>
  `;

  return table.tBodies[0];
};

const getCell = (
  section: HTMLTableSectionElement,
  id: string,
): HTMLTableCellElement => section.querySelector(`#${id}`) as HTMLTableCellElement;

describe('buildCellMatrix', () => {
  it('should expand colspan and rowspan into matrix positions', () => {
    const section = createColumnHeadersSection();

    const matrix = buildCellMatrix(section);

    expect(matrix[0]).toEqual([getCell(section, 'a'), getCell(section, 'a'), getCell(section, 'b')]);
    expect(matrix[1]).toEqual([getCell(section, 'a1'), getCell(section, 'a2'), getCell(section, 'b')]);
  });
});

describe('getCellCoordinates', () => {
  it('should return the top-left position of a spanned cell', () => {
    const section = createRowHeadersSection();
    const matrix = buildCellMatrix(section);

    expect(getCellCoordinates(matrix, getCell(section, 'p'))).toEqual({ rowIndex: 0, columnIndex: 0 });
    expect(getCellCoordinates(matrix, getCell(section, 'p2'))).toEqual({ rowIndex: 1, columnIndex: 1 });
    expect(getCellCoordinates(matrix, getCell(section, 'q'))).toEqual({ rowIndex: 2, columnIndex: 0 });
  });

  it('should return undefined for a foreign cell', () => {
    const section = createRowHeadersSection();
    const matrix = buildCellMatrix(section);

    expect(getCellCoordinates(matrix, document.createElement('td'))).toBeUndefined();
  });
});

describe('getAdjacentCell', () => {
  describe('multi-level column headers', () => {
    it('should move between cells of one level', () => {
      const section = createColumnHeadersSection();

      expect(getAdjacentCell(section, getCell(section, 'a1'), 'right')).toBe(getCell(section, 'a2'));
      expect(getAdjacentCell(section, getCell(section, 'a2'), 'left')).toBe(getCell(section, 'a1'));
      expect(getAdjacentCell(section, getCell(section, 'a'), 'right')).toBe(getCell(section, 'b'));
    });

    it('should move between levels', () => {
      const section = createColumnHeadersSection();

      expect(getAdjacentCell(section, getCell(section, 'a'), 'down')).toBe(getCell(section, 'a1'));
      expect(getAdjacentCell(section, getCell(section, 'a2'), 'up')).toBe(getCell(section, 'a'));
    });

    it('should not move outside the section or inside an own span', () => {
      const section = createColumnHeadersSection();

      expect(getAdjacentCell(section, getCell(section, 'a'), 'up')).toBeNull();
      expect(getAdjacentCell(section, getCell(section, 'a'), 'left')).toBeNull();
      expect(getAdjacentCell(section, getCell(section, 'b'), 'right')).toBeNull();
      expect(getAdjacentCell(section, getCell(section, 'b'), 'down')).toBeNull();
      expect(getAdjacentCell(section, getCell(section, 'a1'), 'down')).toBeNull();
    });
  });

  describe('nested row headers', () => {
    it('should move between rows', () => {
      const section = createRowHeadersSection();

      expect(getAdjacentCell(section, getCell(section, 'p1'), 'down')).toBe(getCell(section, 'p2'));
      expect(getAdjacentCell(section, getCell(section, 'p2'), 'down')).toBe(getCell(section, 'q'));
      expect(getAdjacentCell(section, getCell(section, 'q'), 'up')).toBe(getCell(section, 'p'));
      expect(getAdjacentCell(section, getCell(section, 'p'), 'down')).toBe(getCell(section, 'q'));
    });

    it('should move between nesting levels', () => {
      const section = createRowHeadersSection();

      expect(getAdjacentCell(section, getCell(section, 'p'), 'right')).toBe(getCell(section, 'p1'));
      expect(getAdjacentCell(section, getCell(section, 'p2'), 'left')).toBe(getCell(section, 'p'));
    });

    it('should return null for a foreign cell', () => {
      const section = createRowHeadersSection();

      expect(getAdjacentCell(section, document.createElement('td'), 'down')).toBeNull();
    });
  });
});
