import { describe, expect, it } from '@jest/globals';
import $ from '@js/core/renderer';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import {
  getMaxHorizontalScrollOffset, insertRowElement, isRowElementVisible, isSameColumnLayout,
} from '../utils';

const createContainerMock = (
  scrollWidth: number,
  clientWidth: number,
): HTMLElement => ({ scrollWidth, clientWidth } as HTMLElement);

describe('getMaxHorizontalScrollOffset', () => {
  it('returns 0 when the container is not defined', () => {
    expect(getMaxHorizontalScrollOffset(undefined)).toBe(0);
  });

  it('returns the difference between the scroll width and the client width', () => {
    const container = createContainerMock(2000, 995);

    expect(getMaxHorizontalScrollOffset(container)).toBe(1005);
  });

  it('returns 0 when the content does not overflow the container', () => {
    const container = createContainerMock(1000, 1000);

    expect(getMaxHorizontalScrollOffset(container)).toBe(0);
  });

  it('rounds the result', () => {
    const container = createContainerMock(2000.4, 995);

    expect(getMaxHorizontalScrollOffset(container)).toBe(1005);
  });
});

describe('isSameColumnLayout', () => {
  const createColumns = (
    ...columns: Pick<Column, 'index' | 'command'>[]
  ): Column[] => columns.map((column) => ({ ...column } as Column));

  it('accepts new column objects at the same positions', () => {
    const renderedColumns = createColumns({ command: 'select' }, { index: 0 }, { index: 1 });
    const columns = createColumns({ command: 'select' }, { index: 0 }, { index: 1 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(true);
  });

  it('accepts no columns', () => {
    expect(isSameColumnLayout([], [])).toBe(true);
  });

  it('rejects a hidden column', () => {
    const renderedColumns = createColumns({ index: 0 }, { index: 1 }, { index: 2 });
    const columns = createColumns({ index: 0 }, { index: 2 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(false);
  });

  it('rejects reordered columns', () => {
    const renderedColumns = createColumns({ index: 0 }, { index: 1 });
    const columns = createColumns({ index: 1 }, { index: 0 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(false);
  });

  it('rejects a command column in place of a data column', () => {
    const renderedColumns = createColumns({ index: 0 }, { index: 1 });
    const columns = createColumns({ command: 'adaptive' }, { index: 1 });

    expect(isSameColumnLayout(renderedColumns, columns)).toBe(false);
  });
});

describe('isRowElementVisible', () => {
  it('accepts a shown row', () => {
    expect(isRowElementVisible(document.createElement('tr'))).toBe(true);
  });

  it('rejects a row hidden by the invisible class', () => {
    const rowElement = document.createElement('tr');
    rowElement.classList.add('dx-state-invisible');

    expect(isRowElementVisible(rowElement)).toBe(false);
  });

  it('rejects a row hidden by an inline style', () => {
    const rowElement = document.createElement('tr');
    rowElement.style.display = 'none';

    expect(isRowElementVisible(rowElement)).toBe(false);
  });
});

describe('insertRowElement', () => {
  const createTable = (rowCount: number): HTMLTableElement => {
    const table = document.createElement('table');
    const tableBody = table.createTBody();

    for (let i = 0; i < rowCount; i += 1) {
      tableBody.insertRow().id = `row${i}`;
    }

    return table;
  };

  const getChildIds = (element: Element | null | undefined): string[] => Array
    .from(element?.children ?? [], (child) => child.id);

  const createNewRow = (tagName = 'tr'): HTMLElement => {
    const newRow = document.createElement(tagName);
    newRow.id = 'new';

    return newRow;
  };

  it('inserts the row before the row at its index', () => {
    const table = createTable(2);
    const $rows = $(table).find('tr');

    insertRowElement($(createNewRow()), $rows, 1, $(table));

    expect(getChildIds(table.tBodies[0])).toEqual(['row0', 'new', 'row1']);
  });

  it('inserts the row after the last row when its index is past the rows', () => {
    const table = createTable(2);
    const $rows = $(table).find('tr');

    insertRowElement($(createNewRow()), $rows, 2, $(table));

    expect(getChildIds(table.tBodies[0])).toEqual(['row0', 'row1', 'new']);
  });

  it('prepends the row to the table body when there are no rows', () => {
    const table = createTable(1);
    table.rows[0].id = 'freeSpace';

    insertRowElement($(createNewRow()), $(), 0, $(table));

    expect(getChildIds(table.tBodies[0])).toEqual(['new', 'freeSpace']);
  });

  it('adds a <tbody> row to the table itself when there are no rows', () => {
    const table = createTable(0);
    const newRow = createNewRow('tbody');

    insertRowElement($(newRow), $(), 0, $(table));

    expect(newRow.parentElement).toBe(table);
  });

  it('leaves the row out when there are neither rows nor a table', () => {
    const newRow = createNewRow();

    insertRowElement($(newRow), $(), 0, undefined);

    expect(newRow.parentElement).toBeNull();
  });
});
