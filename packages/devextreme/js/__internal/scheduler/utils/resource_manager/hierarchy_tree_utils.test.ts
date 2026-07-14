import {
  describe, expect, it,
} from '@jest/globals';

import type { ResourceData } from '../loader/types';
import {
  buildHierarchyTree,
  collectHierarchyLeaves,
} from './hierarchy_tree_utils';

const item = (
  id: ResourceData['id'],
  text: string,
  parentId: ResourceData['parentId'] = null,
): ResourceData => ({
  id,
  text,
  color: '#000',
  parentId,
});

describe('hierarchy_tree_utils', () => {
  describe('buildHierarchyTree', () => {
    it('should build parent-child tree from flat items', () => {
      const items = [
        item('board', 'Board rooms'),
        item('open', 'Open spaces'),
        item(11, 'Room 11', 'board'),
        item(12, 'Room 12', 'board'),
        item(21, 'Room 21', 'open'),
      ];

      const tree = buildHierarchyTree(items);

      expect(tree).toHaveLength(2);
      expect(tree[0].data.id).toBe('board');
      expect(tree[0].children.map((node) => node.data.id)).toEqual([11, 12]);
      expect(tree[1].data.id).toBe('open');
      expect(tree[1].children.map((node) => node.data.id)).toEqual([21]);
    });

    it('should treat items with missing parent as roots', () => {
      const items = [
        item(1, 'Root'),
        item(2, 'Orphan', 'missing'),
      ];

      const tree = buildHierarchyTree(items);

      expect(tree).toHaveLength(2);
      expect(tree.map((node) => node.data.id)).toEqual([1, 2]);
    });

    it('should support non-uniform depth', () => {
      const items = [
        item('a', 'A'),
        item('b', 'B', 'a'),
        item('c', 'C', 'b'),
        item('d', 'D'),
      ];

      const tree = buildHierarchyTree(items);

      expect(tree).toHaveLength(2);
      expect(tree[0].children[0].children[0].data.id).toBe('c');
      expect(tree[1].data.id).toBe('d');
    });

    it('should support depth greater than 3', () => {
      const items = [
        item(1, 'L1'),
        item(2, 'L2', 1),
        item(3, 'L3', 2),
        item(4, 'L4', 3),
        item(5, 'L5', 4),
      ];

      const tree = buildHierarchyTree(items);

      expect(tree).toHaveLength(1);
      expect(
        tree[0].children[0].children[0].children[0].children[0].data.id,
      ).toBe(5);
    });
  });

  describe('collectHierarchyLeaves', () => {
    it('should return only nodes without children in DFS order', () => {
      const items = [
        item('board', 'Board rooms'),
        item('open', 'Open spaces'),
        item(11, 'Room 11', 'board'),
        item(12, 'Room 12', 'board'),
        item(21, 'Room 21', 'open'),
      ];

      const tree = buildHierarchyTree(items);
      const leaves = collectHierarchyLeaves(tree);

      expect(leaves.map((leaf) => leaf.id)).toEqual([11, 12, 21]);
    });

    it('should return all items when every node is a leaf', () => {
      const items = [
        item(1, 'One'),
        item(2, 'Two'),
      ];

      const tree = buildHierarchyTree(items);
      const leaves = collectHierarchyLeaves(tree);

      expect(leaves.map((leaf) => leaf.id)).toEqual([1, 2]);
    });
  });
});
