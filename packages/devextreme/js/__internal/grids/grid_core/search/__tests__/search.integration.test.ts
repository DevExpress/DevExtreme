import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('SearchPanel', () => {
  beforeEach(() => {
    beforeTest();
  });
  afterEach(afterTest);

  describe('searchPanel options change', () => {
    it('should not invalidate headerPanel when changing option on invisible searchPanel', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1, a: 'test' }],
        searchPanel: {
          visible: false,
        },
      });

      const headerPanel = instance.getView('headerPanel');
      const invalidateSpy = jest.spyOn(headerPanel, '_invalidate');

      instance.option('searchPanel.placeholder', 'Search...');
      jest.runAllTimers();

      expect(invalidateSpy).not.toHaveBeenCalled();
    });

    it('should apply searchPanel option set while it was invisible once it becomes visible', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1, a: 'test' }],
        searchPanel: {
          visible: false,
        },
      });

      instance.option('searchPanel.placeholder', 'updated');
      jest.runAllTimers();

      const $searchPanel = $(instance.element()).find('.dx-datagrid-search-panel');
      expect($searchPanel.length).toBe(0);

      instance.option('searchPanel.visible', true);
      jest.runAllTimers();

      const $input = $(instance.element()).find('.dx-datagrid-search-panel input');
      expect($input.length).toBe(1);
      expect($input.attr('placeholder')).toBe('updated');
    });

    it('should update visible searchPanel option in runtime', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1, a: 'test' }],
        searchPanel: {
          visible: true,
          placeholder: 'initial',
        },
      });

      let $input = $(instance.element()).find('.dx-datagrid-search-panel input');
      expect($input.length).toBe(1);
      expect($input.attr('placeholder')).toBe('initial');

      instance.option('searchPanel.placeholder', 'updated');
      jest.runAllTimers();

      $input = $(instance.element()).find('.dx-datagrid-search-panel input');
      expect($input.attr('placeholder')).toBe('updated');
    });
  });

  describe('search text highlighting', () => {
    it('should highlight a non-string cell whose text equals the formatted search text', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1, price: 15 }],
        columns: [{
          dataField: 'price',
          dataType: 'number',
          format: { type: 'fixedPoint', precision: 2 },
        }],
        searchPanel: {
          visible: true,
          text: '15',
        },
      });
      jest.runAllTimers();

      const $highlighted = $(instance.element()).find('.dx-datagrid-search-text');
      expect($highlighted.length).toBe(1);
      expect($highlighted.text()).toBe('15.00');
    });

    it('should highlight the typed text, not the formatted one, in a string column', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ name: 'Mark' }],
        columns: [{
          dataField: 'name',
          dataType: 'string',
          customizeText: ({ valueText }): string => `Name: ${valueText}`,
        }],
        searchPanel: {
          visible: true,
          text: 'ar',
        },
      });
      jest.runAllTimers();

      const $highlighted = $(instance.element()).find('.dx-datagrid-search-text');
      expect($highlighted.length).toBe(1);
      expect($highlighted.text()).toBe('ar');
    });

    it('should highlight every match and keep the text around them', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ name: 'Mark Carter' }],
        searchPanel: {
          visible: true,
          text: 'AR',
        },
      });
      jest.runAllTimers();

      const $cell = $(instance.element()).find('.dx-data-row td').eq(0);
      expect($cell.html()).toBe(
        'M<span class="dx-datagrid-search-text">ar</span>k C<span class="dx-datagrid-search-text">ar</span>ter',
      );
    });

    it('should highlight the search text in the rows of a data row template', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ name: 'Mark' }],
        dataRowTemplate: (container, { data }): void => {
          $(container).append($('<tr>').append($('<td>').text(data.name)));
        },
        searchPanel: {
          visible: true,
          text: 'ar',
        },
      });
      jest.runAllTimers();

      const $highlighted = $(instance.element()).find('.dx-datagrid-search-text');
      expect($highlighted.length).toBe(1);
      expect($highlighted.text()).toBe('ar');
    });

    describe('when templates render asynchronously', () => {
      it('should highlight the search text in a cell without a template', async () => {
        const { instance } = await createDataGrid({
          dataSource: [{ name: 'Mark' }],
          templatesRenderAsynchronously: true,
          searchPanel: {
            visible: true,
            text: 'ar',
          },
        } as DataGridProperties);
        jest.runAllTimers();

        const $highlighted = $(instance.element()).find('.dx-datagrid-search-text');
        expect($highlighted.length).toBe(1);
        expect($highlighted.text()).toBe('ar');
      });

      it('should highlight the search text once in each cell template', async () => {
        const cellTemplate = (container, { text }): void => {
          $(container).append($('<span>').text(text));
        };
        const { instance } = await createDataGrid({
          dataSource: [{ name: 'Mark', city: 'Paris' }],
          columns: [
            { dataField: 'name', cellTemplate },
            { dataField: 'city', cellTemplate },
          ],
          templatesRenderAsynchronously: true,
          searchPanel: {
            visible: true,
            text: 'ar',
          },
        } as DataGridProperties);
        jest.runAllTimers();

        const $highlighted = $(instance.element()).find('.dx-datagrid-search-text');
        expect($highlighted.length).toBe(2);
        expect($highlighted.eq(0).text()).toBe('ar');
        expect($highlighted.eq(1).text()).toBe('ar');
      });

      it('should highlight the search text in a group row', async () => {
        const { instance } = await createDataGrid({
          dataSource: [{ name: 'Mark', city: 'Rome' }],
          columns: [{ dataField: 'name', groupIndex: 0 }, 'city'],
          templatesRenderAsynchronously: true,
          searchPanel: {
            visible: true,
            text: 'ar',
          },
        } as DataGridProperties);
        jest.runAllTimers();

        const $highlighted = $(instance.element()).find('.dx-group-cell .dx-datagrid-search-text');
        expect($highlighted.length).toBe(1);
        expect($highlighted.text()).toBe('ar');
      });
    });
  });
});
