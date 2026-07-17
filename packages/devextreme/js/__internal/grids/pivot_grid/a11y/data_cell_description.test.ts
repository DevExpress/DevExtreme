import { describe, expect, it } from '@jest/globals';

import { describeDataCellsWithHeaders } from './data_cell_description';

const createSection = (tag: 'thead' | 'tbody', rowsHtml: string): HTMLTableSectionElement => {
  const table = document.createElement('table');
  table.innerHTML = `<${tag}>${rowsHtml}</${tag}>`;
  return table.querySelector(tag) as HTMLTableSectionElement;
};

const getDescribingCells = (cell: HTMLTableCellElement | null): (Element | null)[] => (cell?.getAttribute('aria-describedby') ?? '')
  .split(' ')
  .filter((id) => !!id)
  .map((id) => document.getElementById(id));

describe('describeDataCellsWithHeaders', () => {
  it('should reference the column header path including colspan groups', () => {
    const columns = createSection('thead', `
      <tr><td id="group" colspan="2" aria-colindex="1">2015</td><td id="total" rowspan="2" aria-colindex="3">Grand Total</td></tr>
      <tr><td id="q1" aria-colindex="1">Q1</td><td id="q2" aria-colindex="2">Q2</td></tr>
    `);
    const data = createSection('tbody', `
      <tr><td aria-colindex="1" aria-rowindex="1">10</td><td aria-colindex="2" aria-rowindex="1">20</td><td aria-colindex="3" aria-rowindex="1">30</td></tr>
    `);
    document.body.append(columns, data);

    describeDataCellsWithHeaders(columns, undefined, data);

    const cells = data.querySelectorAll('td');
    expect(getDescribingCells(cells[0])).toEqual([
      document.getElementById('group'),
      document.getElementById('q1'),
    ]);
    expect(getDescribingCells(cells[1])).toEqual([
      document.getElementById('group'),
      document.getElementById('q2'),
    ]);
    expect(getDescribingCells(cells[2])).toEqual([
      document.getElementById('total'),
    ]);
  });

  it('should reference the row header path including rowspan groups', () => {
    const rows = createSection('tbody', `
      <tr><td id="africa" rowspan="2" aria-rowindex="1">Africa</td><td id="cairo" aria-rowindex="1">Cairo</td></tr>
      <tr><td id="luxor" aria-rowindex="2">Luxor</td></tr>
    `);
    const data = createSection('tbody', `
      <tr><td aria-colindex="1" aria-rowindex="1">10</td></tr>
      <tr><td aria-colindex="1" aria-rowindex="2">20</td></tr>
    `);
    document.body.append(rows, data);

    describeDataCellsWithHeaders(undefined, rows, data);

    const cells = data.querySelectorAll('td');
    expect(getDescribingCells(cells[0])).toEqual([
      document.getElementById('africa'),
      document.getElementById('cairo'),
    ]);
    expect(getDescribingCells(cells[1])).toEqual([
      document.getElementById('africa'),
      document.getElementById('luxor'),
    ]);
  });

  it('should combine row and column paths in the row-then-column order', () => {
    const columns = createSection('thead', '<tr><td id="c" aria-colindex="1">2015</td></tr>');
    const rows = createSection('tbody', '<tr><td id="r" aria-rowindex="1">Africa</td></tr>');
    const data = createSection('tbody', '<tr><td aria-colindex="1" aria-rowindex="1">10</td></tr>');
    document.body.append(columns, rows, data);

    describeDataCellsWithHeaders(columns, rows, data);

    expect(getDescribingCells(data.querySelector('td'))).toEqual([
      document.getElementById('r'),
      document.getElementById('c'),
    ]);
  });

  it('should respect the virtual scrolling index offset', () => {
    const columns = createSection('thead', '<tr><td id="c5" aria-colindex="5">2015</td><td id="c6" aria-colindex="6">2016</td></tr>');
    const data = createSection('tbody', '<tr><td aria-colindex="5" aria-rowindex="1">10</td><td aria-colindex="6" aria-rowindex="1">20</td></tr>');
    document.body.append(columns, data);

    describeDataCellsWithHeaders(columns, undefined, data);

    const cells = data.querySelectorAll('td');
    expect(getDescribingCells(cells[0])).toEqual([document.getElementById('c5')]);
    expect(getDescribingCells(cells[1])).toEqual([document.getElementById('c6')]);
  });

  it('should reuse existing header cell ids and keep generated ones stable across runs', () => {
    const columns = createSection('thead', '<tr><td id="existing" aria-colindex="1">2015</td><td aria-colindex="2">2016</td></tr>');
    const data = createSection('tbody', '<tr><td aria-colindex="1" aria-rowindex="1">10</td><td aria-colindex="2" aria-rowindex="1">20</td></tr>');
    document.body.append(columns, data);

    describeDataCellsWithHeaders(columns, undefined, data);
    const generatedId = (columns.querySelectorAll('td')[1]).id;
    describeDataCellsWithHeaders(columns, undefined, data);

    expect((columns.querySelectorAll('td')[0]).id).toBe('existing');
    expect((columns.querySelectorAll('td')[1]).id).toBe(generatedId);
    expect(generatedId).toMatch(/^dx-/);
  });

  it('should remove a stale description when no header chains match', () => {
    const data = createSection('tbody', '<tr><td aria-colindex="1" aria-rowindex="1" aria-describedby="stale">10</td></tr>');
    document.body.append(data);

    describeDataCellsWithHeaders(undefined, undefined, data);

    expect(data.querySelector('td')?.hasAttribute('aria-describedby')).toBe(false);
  });
});
