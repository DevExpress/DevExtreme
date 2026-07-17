import Guid from '@js/core/guid';

import { buildCellMatrix } from '../keyboard_navigation/table_cell_navigation';

type ChainMap = Map<string, string>;

const ensureId = (cell: HTMLTableCellElement): string => {
  if (!cell.id) {
    cell.id = `dx-${new Guid()}`;
  }
  return cell.id;
};

const getUniqueChainIds = (cells: (HTMLTableCellElement | undefined)[]): string => {
  const chain: HTMLTableCellElement[] = [];

  cells.forEach((cell) => {
    if (cell && !chain.includes(cell)) {
      chain.push(cell);
    }
  });

  return chain.map(ensureId).join(' ');
};

// The aria index attributes are affine to the rendered position (a constant
// virtual-scrolling offset per render), so a single sampled cell is enough to
// translate matrix positions into aria index keys.
const getColumnChains = (section: HTMLTableSectionElement | undefined): ChainMap => {
  const chains: ChainMap = new Map();
  const matrix = section ? buildCellMatrix(section) : [];
  const leafRow = matrix[matrix.length - 1] ?? [];

  const sampleCell = leafRow.find((cell) => cell?.hasAttribute('aria-colindex'));
  if (!sampleCell) {
    return chains;
  }
  const offset = Number(sampleCell.getAttribute('aria-colindex')) - leafRow.indexOf(sampleCell);

  leafRow.forEach((_, columnIndex) => {
    chains.set(
      String(columnIndex + offset),
      getUniqueChainIds(matrix.map((row) => row[columnIndex])),
    );
  });

  return chains;
};

const getRowChains = (section: HTMLTableSectionElement | undefined): ChainMap => {
  const chains: ChainMap = new Map();
  const matrix = section ? buildCellMatrix(section) : [];

  const sampleCell = matrix
    .flat()
    .find((cell) => cell?.hasAttribute('aria-rowindex'));
  if (!sampleCell) {
    return chains;
  }
  const sampleRow = (sampleCell.parentElement as HTMLTableRowElement).sectionRowIndex;
  const offset = Number(sampleCell.getAttribute('aria-rowindex')) - sampleRow;

  matrix.forEach((row, rowIndex) => {
    chains.set(String(rowIndex + offset), getUniqueChainIds(row));
  });

  return chains;
};

// Associates every data cell with the row and column header cells covering it
// via aria-describedby. The header areas live in separate tables, so the
// native headers/id mechanism is not applicable; aria-describedby keeps the
// cell value as the accessible name and announces the header path as the
// description.
export function describeDataCellsWithHeaders(
  columnsSection: HTMLTableSectionElement | undefined,
  rowsSection: HTMLTableSectionElement | undefined,
  dataSection: HTMLTableSectionElement | undefined,
): void {
  if (!dataSection) {
    return;
  }

  const columnChains = getColumnChains(columnsSection);
  const rowChains = getRowChains(rowsSection);

  Array.from(dataSection.rows).forEach((row) => {
    Array.from(row.cells).forEach((cell) => {
      const description = [
        rowChains.get(cell.getAttribute('aria-rowindex') ?? ''),
        columnChains.get(cell.getAttribute('aria-colindex') ?? ''),
      ].filter((ids) => !!ids).join(' ');

      if (description) {
        cell.setAttribute('aria-describedby', description);
      } else {
        cell.removeAttribute('aria-describedby');
      }
    });
  });
}
