import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from './__mock__/helpers/utils';

describe('Grid', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when column caption has a newline character', () => {
    it('should exclude the newline character from the header filter\'s aria-label', async () => {
      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        columns: ['id', { dataField: 'name', caption: 'Test\nName' }, 'value'],
        showBorders: true,
        headerFilter: {
          visible: true,
        },
      });

      expect(component.getHeaderCellFilter(1).attr('aria-label'))
        .toBe('Show filter options for column \'Test Name\'');
    });
  });
});
