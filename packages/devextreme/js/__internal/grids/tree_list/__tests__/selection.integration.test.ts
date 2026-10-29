import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { ArrayStore, DataSource } from '@js/common/data';
import $ from '@js/core/renderer';

import { flushAsync } from '../../grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createTreeList,
} from './__mock__/helpers/utils';

describe('TreeList selection', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('store push', () => {
    [true, false].forEach((reshapeOnPush) => {
      it(`updated cells are rendered when pushed changes remove a selected row with repaintChangesOnly and reshapeOnPush=${reshapeOnPush} (T1337202)`, async () => {
        const store = new ArrayStore({
          key: 'id',
          data: [
            {
              id: 1, parentId: 0, name: 'Anna', load: 3,
            },
            {
              id: 2, parentId: 0, name: 'Berta', load: 3,
            },
            {
              id: 3, parentId: 0, name: 'Carl', load: 3,
            },
          ],
        });
        const { instance } = await createTreeList({
          dataSource: new DataSource({ store, reshapeOnPush }),
          repaintChangesOnly: true,
          columns: ['name', 'load'],
          selection: { mode: 'multiple' },
          selectedRowKeys: [2],
        });
        await flushAsync();

        store.push([
          { type: 'update', key: 1, data: { load: 4.5 } },
          { type: 'update', key: 3, data: { load: 4.5 } },
          { type: 'remove', key: 2 },
        ]);
        await flushAsync();

        expect($(instance.getCellElement(0, 'load')).text()).toBe('4.5');
        expect($(instance.getCellElement(1, 'load')).text()).toBe('4.5');
      });
    });
  });
});
