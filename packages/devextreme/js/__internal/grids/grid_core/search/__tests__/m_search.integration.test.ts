import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

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

      const headerPanel = (instance as any).getView('headerPanel');
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
});
