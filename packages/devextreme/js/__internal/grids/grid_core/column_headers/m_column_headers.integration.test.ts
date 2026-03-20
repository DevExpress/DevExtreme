import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import {
  simulateHoverEvent,
  simulateTextOverflow,
} from '../__tests__/__mock__/helpers/dom_utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../__tests__/__mock__/helpers/utils';

describe('Column Headers', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('headerCellTemplate', () => {
    it('should apply right alignment to number column when headerCellTemplate is used', async () => {
      const { component } = await createDataGrid({
        dataSource: [],
        showBorders: true,
        headerFilter: {
          visible: true,
        },
        columns: [
          {
            dataField: 'test',
            dataType: 'number',
            headerCellTemplate(headerElement) {
              $('<span>')
                .text('Test')
                .appendTo(headerElement);
            },
          },
        ],
      });
      expect(component.getHeaderCell(0).getAlignment()).toBe('right');
    });
  });

  describe('when cellHintEnabled: true', () => {
    it('should show column caption in the tooltip instead of sort index when hovering sort indicator (T1321834)', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ id: 1, Position: 'Developer', Name: 'John' }],
        columns: [
          {
            dataField: 'Position',
            caption: 'Position',
            width: 30,
            sortOrder: 'asc',
            sortIndex: 0,
          },
          {
            dataField: 'Name',
            caption: 'Name',
            sortOrder: 'desc',
            sortIndex: 1,
          },
        ],
        sorting: {
          mode: 'multiple',
          showSortIndexes: true,
        },
        cellHintEnabled: true,
      });

      const headerCellElement = component.getHeaderCells()[0];
      const headerContentElement = component.getHeaderCell(0).getHeaderContent() as HTMLElement;

      simulateTextOverflow(headerContentElement, 50, 20);
      simulateHoverEvent(headerCellElement);

      expect($(headerCellElement).attr('title')).toBe('Position');
    });

    it('should show cell text in the tooltip for non-header rows', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1, Position: 'Very Long Position Name That Should Be Truncated' }],
        columns: [
          {
            dataField: 'Position',
            caption: 'Position',
            width: 50,
          },
        ],
        cellHintEnabled: true,
      });

      const dataCell = instance.getCellElement(0, 0) as HTMLElement;

      simulateTextOverflow(dataCell, 200, 50);
      simulateHoverEvent(dataCell);

      expect($(dataCell).attr('title')).toBe(dataCell.textContent);
    });
  });

  describe('toggleFirstHeaderClass', () => {
    it('should add first-header class to the first column', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          'field1',
          {
            caption: 'Band',
            columns: ['field2', 'field3'],
          },
        ],
      });

      const $headerCell = $(component.getHeaderCell(0).getElement());
      expect($headerCell.hasClass('dx-datagrid-first-header')).toBe(true);
    });

    it('should not add first-header class to non-first columns', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          'field1',
          {
            caption: 'Band',
            columns: ['field2', 'field3'],
          },
        ],
      });

      const $secondCellOfFirstRow = $(component.getHeaderCell(1).getElement());
      const $firstCellOfSecondRow = $(component.getHeaderCell(0, 1).getElement());
      const $secondCellOfSecondRow = $(component.getHeaderCell(1, 1).getElement());

      expect($secondCellOfFirstRow.hasClass('dx-datagrid-first-header')).toBe(false);
      expect($firstCellOfSecondRow.hasClass('dx-datagrid-first-header')).toBe(false);
      expect($secondCellOfSecondRow.hasClass('dx-datagrid-first-header')).toBe(false);
    });

    it('should update first-header class when first column visibility changes', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          'field1',
          {
            caption: 'Band',
            columns: ['field2', 'field3'],
          },
        ],
      });

      component.apiColumnOption('field1', 'visible', false);

      const $firstHeaderCell = $(component.getHeaderCell(0).getElement());
      expect($firstHeaderCell.text()).toBe('Band');
      expect($firstHeaderCell.hasClass('dx-datagrid-first-header')).toBe(true);
    });

    it('should add first-header class when band column is first', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          {
            caption: 'Band',
            columns: ['field1', 'field2'],
          },
          'field3',
        ],
      });

      const $firstCellOfFirstRow = $(component.getHeaderCell(0).getElement());
      const $firstCellOfSecondRow = $(component.getHeaderCell(0, 1).getElement());

      expect($firstCellOfFirstRow.hasClass('dx-datagrid-first-header')).toBe(true);
      expect($firstCellOfSecondRow.hasClass('dx-datagrid-first-header')).toBe(true);
    });

    it('should not add first-header class to non-first columns when band column is first', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          {
            caption: 'Band',
            columns: ['field1', 'field2'],
          },
          'field3',
        ],
      });

      const $secondCellOfFirstRow = $(component.getHeaderCell(1).getElement());
      const $secondCellOfSecondRow = $(component.getHeaderCell(1, 1).getElement());

      expect($secondCellOfFirstRow.hasClass('dx-datagrid-first-header')).toBe(false);
      expect($secondCellOfSecondRow.hasClass('dx-datagrid-first-header')).toBe(false);
    });
  });

  describe('_getCellElement', () => {
    it('should return correct cell for nested column using string identifier', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          'field1',
          {
            caption: 'Band',
            columns: ['field2', 'field3'],
          },
        ],
      });

      const columnHeadersView = (instance as any).getView('columnHeadersView');

      const $cell = columnHeadersView._getCellElement(1, 'index:2');

      expect($cell).toBeDefined();
      expect($cell.length).toBe(1);
      expect($cell.text()).toBe('Field 2');
    });

    it('should return correct cell for band header using string identifier', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        columns: [
          'field1',
          {
            caption: 'Band',
            columns: ['field2', 'field3'],
          },
        ],
      });

      const columnHeadersView = (instance as any).getView('columnHeadersView');
      const $bandCell = columnHeadersView._getCellElement(0, 'index:1');

      expect($bandCell).toBeDefined();
      expect($bandCell.text()).toBe('Band');
    });
  });
});
