import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import { flushAsync } from '../../../grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';

// 1 > 11 > 111, and 2 > 21.
const DATA = [
  { id: 1, parentId: 0, name: 'root A' },
  { id: 11, parentId: 1, name: 'child A1' },
  { id: 111, parentId: 11, name: 'leaf A1a' },
  { id: 2, parentId: 0, name: 'root B' },
  { id: 21, parentId: 2, name: 'child B1' },
];

type Instance = Awaited<ReturnType<typeof createTreeList>>['instance'];

const createTree = async (
  options = {},
): Promise<Instance> => {
  const { instance } = await createTreeList({ dataSource: DATA, autoExpandAll: false, ...options });
  await flushAsync();
  return instance;
};

const visibleKeys = (instance: Instance): unknown[] => instance
  .getVisibleRows().map((row) => row.key);

describe('TreeList data controller — node access', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('with a data source', () => {
    it('finds a loaded node by key', async () => {
      const instance = await createTree({ autoExpandAll: true });

      expect(instance.getNodeByKey(11)?.data).toEqual(DATA[1]);
      expect(instance.getNodeByKey(111)?.parent?.key).toBe(11);
    });

    it('returns undefined for a key that does not exist', async () => {
      const instance = await createTree({ autoExpandAll: true });

      expect(instance.getNodeByKey(999)).toBeUndefined();
    });

    it('returns the root node with its top-level children', async () => {
      const instance = await createTree();

      expect(instance.getRootNode()?.children?.map((node) => node.key)).toEqual([1, 2]);
    });

    it('walks every loaded node with forEachNode', async () => {
      const instance = await createTree({ autoExpandAll: true });
      const keys: unknown[] = [];

      instance.forEachNode((node) => { keys.push(node.key); });

      expect(keys).toEqual([1, 11, 111, 2, 21]);
    });

    it('reports expansion state and changes it through expandRow/collapseRow', async () => {
      const instance = await createTree();

      expect(instance.isRowExpanded(1)).toBe(false);
      expect(visibleKeys(instance)).toEqual([1, 2]);

      const expanding = instance.expandRow(1);
      await flushAsync();
      await expanding;

      expect(instance.isRowExpanded(1)).toBe(true);
      expect(visibleKeys(instance)).toEqual([1, 11, 2]);

      const collapsing = instance.collapseRow(1);
      await flushAsync();
      await collapsing;

      expect(instance.isRowExpanded(1)).toBe(false);
      expect(visibleKeys(instance)).toEqual([1, 2]);
    });

    it('loads descendants of a node', async () => {
      const instance = await createTree();

      const loading = instance.loadDescendants([1]);

      // A shallow gate: an array store has the whole tree loaded already, so the only
      // observable contract is that the call forwards and hands back the adapter's deferred.
      expect(loading).toBeDefined();

      await flushAsync();
      await loading;

      expect(instance.getNodeByKey(111)).toBeDefined();
    });

    it('reloads when expandedRowKeys changes', async () => {
      const instance = await createTree();

      instance.option('expandedRowKeys', [1, 11]);
      await flushAsync();

      expect(visibleKeys(instance)).toEqual([1, 11, 111, 2]);
    });
  });

  describe('with no data source', () => {
    it('answers node lookups with undefined', async () => {
      const { instance } = await createTreeList({});
      await flushAsync();

      expect(instance.getNodeByKey(1)).toBeUndefined();
      expect(instance.getRootNode()).toBeFalsy();
    });
  });
});
