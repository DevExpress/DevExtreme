import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

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
      expect(component.getHeaderCell(0, 0).getAlignment()).toBe('right');
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

      const $headerCell = $(component.getHeaderCell(0, 0).getElement());
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

      const $secondCellOfFirstRow = $(component.getHeaderCell(0, 1).getElement());
      const $firstCellOfSecondRow = $(component.getHeaderCell(1, 0).getElement());
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

      const $firstHeaderCell = $(component.getHeaderCell(0, 0).getElement());
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

      const $firstCellOfFirstRow = $(component.getHeaderCell(0, 0).getElement());
      const $firstCellOfSecondRow = $(component.getHeaderCell(1, 0).getElement());

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

      const $secondCellOfFirstRow = $(component.getHeaderCell(0, 1).getElement());
      const $secondCellOfSecondRow = $(component.getHeaderCell(1, 1).getElement());

      expect($secondCellOfFirstRow.hasClass('dx-datagrid-first-header')).toBe(false);
      expect($secondCellOfSecondRow.hasClass('dx-datagrid-first-header')).toBe(false);
    });
  });
});
