import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

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
});
