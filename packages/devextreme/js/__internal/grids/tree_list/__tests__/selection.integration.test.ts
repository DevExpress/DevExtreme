import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { ArrayStore, DataSource } from '@js/common/data';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';

const TREELIST_CONTAINER_ID = 'treeListContainer';

const flushAsync = async (): Promise<void> => {
  jest.runAllTimers();
  await Promise.resolve();
};

const createTreeList = (options: TreeListProperties = {}): { instance: TreeList } => {
  const $container = $('<div>')
    .attr('id', TREELIST_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new TreeList($container.get(0) as HTMLDivElement, {
    keyExpr: 'id',
    ...options,
  });

  jest.runAllTimers();

  return { instance };
};

describe('TreeList selection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    const $container = $(`#${TREELIST_CONTAINER_ID}`);

    (TreeList.getInstance($container.get(0) as HTMLElement) as TreeList)?.dispose();
    $container.remove();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

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
        const { instance } = createTreeList({
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
