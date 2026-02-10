import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { DataGridCommandColumnType } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../__tests__/__mock__/helpers/utils';

const UNSUPPORTED_GROUPING_COLUMN_TYPES = ['adaptive', 'buttons', 'detailExpand', 'groupExpand', 'selection', 'drag', 'ai'];

const dataSource = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

describe('Column Controller', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Grouping for unsupported column types', () => {
    describe.each(UNSUPPORTED_GROUPING_COLUMN_TYPES)('unsupported grouping column types', (columnType) => {
      it(`Should have no group rows after put type property = ${columnType} (first load)`, async () => {
        const { component } = await createDataGrid({
          dataSource,
          showBorders: true,
          columns: [
            'id',
            {
              caption: 'Test',
              type: columnType as DataGridCommandColumnType | undefined,
              name: 'test',
              groupIndex: 0,
            },
          ],
        });

        const groupRow = component.getGroupRows();
        expect(groupRow.length).toBe(0);
      });

      it(`Should have no group rows after put type property = ${columnType} (dynamic update)`, async () => {
        const { component } = await createDataGrid({
          dataSource,
          showBorders: true,
          columns: [
            'id',
            {
              caption: 'Test',
              name: 'AItest',
            },
          ],
        });

        component.apiColumnOption('AItest', 'type', columnType as DataGridCommandColumnType | undefined);

        const groupRow = component.getGroupRows();
        expect(groupRow.length).toBe(0);
      });
    });
  });
});
