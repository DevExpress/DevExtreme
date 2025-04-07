import {
  describe, expect, it,
} from '@jest/globals';

import {
  deepCopyTreeNode,
  mergeOptionTrees,
  shallowCopySubtreePath,
  shallowCopyTree,
} from './tree_utils';

describe('OptionsController', () => {
  describe('TreeUtils', () => {
    describe('shallowCopyTree', () => {
      it('should shallow copy array', () => {
        const data = ['A', 'B', { a: 1, b: 2 }, 3, () => {}];

        const result = shallowCopyTree(data);

        expect(result).not.toBe(data);
        expect(result).toStrictEqual(data);
      });

      it('should shallow copy object', () => {
        const data = {
          A: 1,
          ref: { a: 1, b: 2 },
          fn: () => {},
        };

        const result = shallowCopyTree(data);

        expect(result).not.toBe(data);
        expect(result).toStrictEqual(data);
      });
    });

    describe('deepCopyTreeNode', () => {
      it('should deep copy array', () => {
        const data = [{ a: { b: 'value' } }];

        const result = deepCopyTreeNode(data);

        expect(result).not.toBe(data);
        expect(result[0].a).not.toBe(data[0].a);
        expect(result).toStrictEqual(data);
      });

      it('should shallow copy object', () => {
        const data = { ref: { a: { b: 'value' } } };

        const result = deepCopyTreeNode(data);

        expect(result).not.toBe(data);
        expect(result.ref.a).not.toBe(data.ref.a);
        expect(result).toStrictEqual(data);
      });

      it.each([
        'string',
        100,
        true,
        undefined,
      ])('should return value = %s as is', (data) => {
        const result = deepCopyTreeNode(data);

        expect(result).toBe(data);
      });
    });

    describe('shallowCopySubtreePath', () => {
      it('should shallow copy root if path is empty', () => {
        const tree = { a: { b: { c: 3 } }, d: { e: 2 } };

        const result = shallowCopySubtreePath(tree, []);

        expect(result).toStrictEqual(tree);
        expect(result).not.toBe(tree);
        expect(result.a).toBe(tree.a);
      });

      it('should shallow copy root if path has length 1', () => {
        const tree = { a: { b: { c: 3 } }, d: { e: 2 } };

        const result = shallowCopySubtreePath(tree, ['a']);
        expect(result).toStrictEqual(tree);
        expect(result).not.toBe(tree);
        expect(result.a).toBe(tree.a);
      });

      it('should shallow copy passed path', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };

        const result = shallowCopySubtreePath(tree, ['a', 'b', 'c']);
        expect(result).toStrictEqual(tree);
        expect(result).not.toBe(tree);
        expect(result.a).not.toBe(tree.a);
        expect(result.a.b).not.toBe(tree.a.b);
        expect(result.a.b.c).toBe(tree.a.b.c);
      });

      it('should not touch subtree outside the passed path', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: { extra: 'extra_node' } } };

        const result = shallowCopySubtreePath(tree, ['a', 'b', 'c']);
        expect(result.d).toBe(tree.d);
        expect(result.d.e).toBe(tree.d.e);
      });

      it('should stop if path contains wrong values', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };

        const result = shallowCopySubtreePath(tree, ['a', 'wrong_path', 'c']);
        expect(result).toStrictEqual(tree);
        expect(result).not.toBe(tree);
        expect(result.a).not.toBe(tree.a);
        expect(result.a.b).toBe(tree.a.b);
        expect(result.a.b.c).toBe(tree.a.b.c);
      });
    });

    describe('mergeOptionTrees', () => {
      it('should only shallow copy root if path contains error at first place', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };
        const updatedTree = { a: { b: { c: { extra: 'update' } } }, d: { e: 2 } };
        const defaultTree = { a: { b: { c: { extra: 'default' } } } };

        const result = mergeOptionTrees(
          tree,
          updatedTree,
          defaultTree,
          ['wrong_path', 'c'],
        );

        expect(result).not.toBe(tree);
        expect(result.a).toBe(tree.a);
        expect(result.a.b).toBe(tree.a.b);
        expect(result.a.b.c).toBe(tree.a.b.c);
        expect(result.a.b.c.extra).toBe(tree.a.b.c.extra);
      });

      it('should shallow copy subtree path until faced the wrong node path', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };
        const updatedTree = { a: { b: { c: { extra: 'update' } } }, d: { e: 2 } };
        const defaultTree = { a: { b: { c: { extra: 'default' } } } };

        const result = mergeOptionTrees(
          tree,
          updatedTree,
          defaultTree,
          ['a', 'b', 'wrong_path', 'extra'],
        );

        expect(result).not.toBe(tree);
        expect(result.a).not.toBe(tree.a);
        expect(result.a.b).not.toBe(tree.a.b);
        expect(result.a.b.c).toBe(tree.a.b.c);
        expect(result.a.b.c.extra).toBe(tree.a.b.c.extra);
      });

      it('should deep copy applied value from updated tree', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };
        const updatedTree = { a: { b: { c: { extra: 'updated' } } }, d: { e: 2 } };
        const defaultTree = { a: { b: { c: { extra: 'default' } } } };

        const result = mergeOptionTrees(
          tree,
          updatedTree as any,
          defaultTree,
          ['a', 'b', 'c'],
        );

        expect(result.a.b.c).not.toBe(updatedTree.a.b.c);
        expect(result.a.b.c).toStrictEqual(updatedTree.a.b.c);
      });

      it('should apply default value if not found same path in updated tree', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };
        const updatedTree = { a: { b: undefined }, d: { e: 2 } };
        const defaultTree = { a: { b: { c: { extra: 'default' } } } };

        const result = mergeOptionTrees(
          tree,
          updatedTree as any,
          defaultTree,
          ['a', 'b', 'c'],
        );

        expect(result.a).toStrictEqual(defaultTree.a);
      });

      it('should deep copy applied value from default tree', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };
        const updatedTree = { a: { b: undefined }, d: { e: 2 } };
        const defaultTree = { a: { b: { c: { extra: 'default' } } } };

        const result = mergeOptionTrees(
          tree,
          updatedTree as any,
          defaultTree,
          ['a', 'b', 'c'],
        );

        expect(result.a.b.c).not.toBe(defaultTree.a.b.c);
        expect(result.a.b.c).toStrictEqual(defaultTree.a.b.c);
      });

      it('should not touch nodes outside the path', () => {
        const tree = { a: { b: { c: { extra: 'extra_node' } } }, d: { e: 2 } };
        const updatedTree = { a: { b: { c: { extra: 'updated' } } }, d: { e: 2 } };
        const defaultTree = { a: { b: { c: { extra: 'default' } } } };

        const result = mergeOptionTrees(
          tree,
          updatedTree as any,
          defaultTree,
          ['a', 'b', 'c'],
        );

        expect(result.d).toBe(tree.d);
      });
    });
  });
});
