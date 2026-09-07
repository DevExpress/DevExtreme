import { describe, expect, it } from '@jest/globals';

import type { LoadOperation, NodeByKey, TreeNode } from '../../types';
import type { NodesContext } from '../nodes';
import {
  convertItemToNode, createNodesByItems, fillNodes, getVisibleNodes,
} from '../nodes';

interface Item {
  [field: string]: unknown;
  id?: unknown;
  parentId?: unknown;
  hasItems?: unknown;
}

const ROOT = 0;

function createContext(overrides?: Partial<NodesContext>): NodesContext {
  return {
    rootValue: ROOT,
    isFullBranchFilterMode: false,
    keyGetter: (data): unknown => (data as Item).id,
    parentIdGetter: (data): unknown => (data as Item).parentId,
    hasItemsGetter: undefined,
    isChildrenLoaded: {},
    ...overrides,
  };
}

function createLoadOptions(options: {
  parentIds?: unknown[];
  storeFilter?: unknown;
  loadFilter?: unknown;
  remoteFiltering?: boolean;
  expandVisibleNodes?: boolean;
} = {}): LoadOperation {
  return {
    storeLoadOptions: {
      parentIds: options.parentIds,
      filter: options.storeFilter,
    },
    loadOptions: {
      filter: options.loadFilter,
    },
    remoteOperations: {
      filtering: options.remoteFiltering,
    },
    expandVisibleNodes: options.expandVisibleNodes,
  };
}

function buildTree(items: Item[], visibleKeys?: unknown[]): { root: TreeNode; nodes: NodeByKey } {
  const visibleItems = visibleKeys && items.filter((item) => visibleKeys.includes(item.id));
  const { rootNode, nodeByKey } = createNodesByItems(items, visibleItems, createContext());

  return { root: rootNode as TreeNode, nodes: nodeByKey };
}

describe('convertItemToNode', () => {
  it('wires the node to a placeholder parent and registers both by key', () => {
    const nodeByKey = {};
    const item = { id: 2, parentId: 1 };

    const node = convertItemToNode(item, nodeByKey, createContext());

    expect(node).toMatchObject({ key: 2, data: item, children: [] });
    expect(node.parent).toEqual({ key: 1, children: [] });
    expect(nodeByKey).toEqual({ 1: node.parent, 2: node });
  });

  const rootFallbackCases: [string, unknown][] = [
    ['undefined', undefined],
    ['null', null],
  ];

  it.each(rootFallbackCases)('attaches the item to rootValue when its parent id is %s', (_, parentId) => {
    const node = convertItemToNode({ id: 1, parentId }, {}, createContext());

    expect(node.parent?.key).toBe(ROOT);
  });

  it('reuses an already registered node, keeping the children it accumulated', () => {
    const nodeByKey = {};
    const context = createContext();

    // The child is converted first, so node `1` only exists as a placeholder parent.
    const child = convertItemToNode({ id: 2, parentId: 1 }, nodeByKey, context);
    child.parent?.children.push(child);

    const parentItem = { id: 1, parentId: ROOT };
    const parent = convertItemToNode(parentItem, nodeByKey, context);

    expect(parent).toBe(child.parent);
    expect(parent.data).toBe(parentItem);
    expect(parent.children).toEqual([child]);
  });

  it('reuses an already registered parent', () => {
    const nodeByKey = {};
    const context = createContext();

    const first = convertItemToNode({ id: 2, parentId: 1 }, nodeByKey, context);
    const second = convertItemToNode({ id: 3, parentId: 1 }, nodeByKey, context);

    expect(second.parent).toBe(first.parent);
  });
});

describe('createNodesByItems', () => {
  it('builds a tree and indexes every node by key', () => {
    const items = [
      { id: 1, parentId: ROOT },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 1 },
    ];

    const { rootNode, nodeByKey } = createNodesByItems(items, undefined, createContext());

    expect(rootNode?.key).toBe(ROOT);
    expect(rootNode?.level).toBe(-1);
    expect(rootNode?.children.map((node) => node.key)).toEqual([1]);
    expect(rootNode?.children[0].children.map((node) => node.key)).toEqual([2, 3]);
    expect(Object.keys(nodeByKey)).toEqual(['0', '1', '2', '3']);
  });

  it('does not depend on item order — a child may precede its parent', () => {
    const items = [
      { id: 2, parentId: 1 },
      { id: 1, parentId: ROOT },
    ];

    const { rootNode } = createNodesByItems(items, undefined, createContext());

    expect(rootNode?.children.map((node) => node.key)).toEqual([1]);
    expect(rootNode?.children[0].children.map((node) => node.key)).toEqual([2]);
    expect(rootNode?.children[0].data).toBe(items[1]);
  });

  it('leaves an orphaned branch out of the root, but keeps it indexed', () => {
    const items = [{ id: 2, parentId: 'missing' }];

    const { rootNode, nodeByKey } = createNodesByItems(items, undefined, createContext());

    expect(rootNode?.children).toEqual([]);
    expect(nodeByKey.missing.children.map((node) => node.key)).toEqual([2]);
  });

  const rootValueCases: [string, unknown][] = [
    ['null', null],
    ['a string', 'root'],
  ];

  it.each(rootValueCases)('supports %s as rootValue', (_, rootValue) => {
    const items = [{ id: 1, parentId: rootValue }];

    const { rootNode } = createNodesByItems(items, undefined, createContext({ rootValue }));

    expect(rootNode?.key).toBe(rootValue);
    expect(rootNode?.children.map((node) => node.key)).toEqual([1]);
  });

  it('returns a synthetic root when there are no items', () => {
    const { rootNode, nodeByKey } = createNodesByItems([], undefined, createContext());

    expect(rootNode).toEqual({ key: ROOT, children: [], level: -1 });
    expect(nodeByKey).toEqual({});
  });

  it('marks every node visible when visibleItems is not passed', () => {
    const items = [{ id: 1, parentId: ROOT }, { id: 2, parentId: 1 }];

    const { nodeByKey } = createNodesByItems(items, undefined, createContext());

    expect(nodeByKey[1].visible).toBe(true);
    expect(nodeByKey[2].visible).toBe(true);
  });

  it('marks only the nodes listed in visibleItems visible', () => {
    const items = [{ id: 1, parentId: ROOT }, { id: 2, parentId: 1 }];

    const { nodeByKey } = createNodesByItems(items, [items[1]], createContext());

    expect(nodeByKey[1].visible).toBe(false);
    expect(nodeByKey[2].visible).toBe(true);
  });

  it('hides every node when visibleItems is an empty array', () => {
    const items = [{ id: 1, parentId: ROOT }];

    const { nodeByKey } = createNodesByItems(items, [], createContext());

    expect(nodeByKey[1].visible).toBe(false);
  });

  it('bails out without a root node when an item has no key (E1046)', () => {
    const items = [
      { id: 1, parentId: ROOT },
      { id: undefined, parentId: 1 },
      { id: 3, parentId: 1 },
    ];

    const { rootNode, nodeByKey } = createNodesByItems(items, undefined, createContext());

    expect(rootNode).toBeUndefined();
    // The adapter keeps this partially filled map, so the nodes seen so far stay indexed.
    expect(nodeByKey[1]).toMatchObject({ key: 1 });
    expect(nodeByKey[3]).toBeUndefined();
  });
});

describe('fillNodes', () => {
  it('assigns the level of every node depth first', () => {
    const { root, nodes } = buildTree([
      { id: 1, parentId: ROOT },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 2 },
      { id: 4, parentId: ROOT },
    ]);

    fillNodes(root.children, createLoadOptions(), createContext());

    expect([1, 2, 3, 4].map((key) => nodes[key].level)).toEqual([0, 1, 2, 0]);
  });

  it('returns no keys for an empty node list', () => {
    expect(fillNodes([], createLoadOptions(), createContext())).toEqual([]);
  });

  describe('hasChildren propagation', () => {
    it('propagates up from the visible leaves', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
      ], [3]);

      fillNodes(root.children, createLoadOptions(), createContext());

      expect([1, 2, 3].map((key) => nodes[key].hasChildren)).toEqual([true, true, false]);
      expect(root.hasChildren).toBe(true);
    });

    it('stays false on a branch of hidden leaves', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT },
        { id: 2, parentId: 1 },
      ], []);

      fillNodes(root.children, createLoadOptions(), createContext());

      expect(nodes[1].hasChildren).toBe(false);
      expect(root.hasChildren).toBeUndefined();
    });

    it('is overridden by hasItemsExpr on the node itself', () => {
      const context = createContext({
        hasItemsGetter: (data): unknown => (data as Item).hasItems,
      });
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT, hasItems: false },
        { id: 2, parentId: 1 },
      ], [2]);

      fillNodes(root.children, createLoadOptions(), context);

      expect(nodes[1].hasChildren).toBe(false);
    });
  });

  describe('hasChildren of one node', () => {
    interface Fixture {
      items: Item[];
      visibleKeys: unknown[];
    }

    const leaf: Fixture = {
      items: [{ id: 1, parentId: ROOT }],
      visibleKeys: [],
    };

    const withVisibleChild: Fixture = {
      items: [{ id: 1, parentId: ROOT }, { id: 2, parentId: 1 }],
      visibleKeys: [2],
    };

    const withHiddenChild: Fixture = {
      items: [{ id: 1, parentId: ROOT }, { id: 2, parentId: 1 }],
      visibleKeys: [],
    };

    function calculateHasChildren(
      fixture: Fixture,
      options: LoadOperation,
      context: NodesContext,
    ): boolean | undefined {
      const { root, nodes } = buildTree(fixture.items, fixture.visibleKeys);

      fillNodes(root.children, options, context);

      return nodes[1].hasChildren;
    }

    describe('hasItemsExpr', () => {
      const getterCases: [string, unknown, boolean][] = [
        ['true', true, true],
        ['false', false, false],
      ];

      it.each(getterCases)('follows the getter when it returns %s', (_, hasItems, expected) => {
        const context = createContext({ hasItemsGetter: () => hasItems });

        // Shaped so the fallback would answer the opposite: the getter has to win.
        const fixture = expected ? leaf : withVisibleChild;

        expect(calculateHasChildren(fixture, createLoadOptions(), context)).toBe(expected);
      });

      it('falls back to the children when the getter returns undefined', () => {
        const context = createContext({ hasItemsGetter: () => undefined });

        expect(calculateHasChildren(withVisibleChild, createLoadOptions(), context)).toBe(true);
      });

      it('is ignored while a store filter is applied', () => {
        const context = createContext({ hasItemsGetter: () => true });
        const options = createLoadOptions({ storeFilter: ['id', '=', 1] });

        expect(calculateHasChildren(leaf, options, context)).toBe(false);
      });

      it('is used under a store filter when parentIds are requested', () => {
        const context = createContext({ hasItemsGetter: () => true });
        const options = createLoadOptions({ storeFilter: ['id', '=', 1], parentIds: [ROOT] });

        expect(calculateHasChildren(leaf, options, context)).toBe(true);
      });

      // Pins current behaviour: an empty parentIds array is truthy here, while
      // _processTreeStructure treats it as "no parent ids requested".
      it('is used under a store filter when parentIds is an empty array', () => {
        const context = createContext({ hasItemsGetter: () => true });
        const options = createLoadOptions({ storeFilter: ['id', '=', 1], parentIds: [] });

        expect(calculateHasChildren(leaf, options, context)).toBe(true);
      });

      it('is used under a store filter in fullBranch mode', () => {
        const context = createContext({
          hasItemsGetter: () => true,
          isFullBranchFilterMode: true,
        });
        const options = createLoadOptions({ storeFilter: ['id', '=', 1] });

        expect(calculateHasChildren(leaf, options, context)).toBe(true);
      });
    });

    describe('children not loaded yet', () => {
      it('assumes items exist under remote filtering when parentIds are requested', () => {
        const options = createLoadOptions({ remoteFiltering: true, parentIds: [ROOT] });

        expect(calculateHasChildren(leaf, options, createContext())).toBe(true);
      });

      it('assumes items exist under remote filtering in fullBranch mode', () => {
        const context = createContext({ isFullBranchFilterMode: true });
        const options = createLoadOptions({ remoteFiltering: true });

        expect(calculateHasChildren(leaf, options, context)).toBe(true);
      });

      it('assumes nothing once the children are loaded', () => {
        const context = createContext({ isChildrenLoaded: { 1: true } });
        const options = createLoadOptions({ remoteFiltering: true, parentIds: [ROOT] });

        expect(calculateHasChildren(leaf, options, context)).toBe(false);
      });

      it('assumes nothing without remote filtering', () => {
        const options = createLoadOptions({ parentIds: [ROOT] });

        expect(calculateHasChildren(leaf, options, createContext())).toBe(false);
      });
    });

    describe('local filtering in fullBranch mode', () => {
      const options = createLoadOptions({ loadFilter: ['id', '=', 1] });
      const context = createContext({ isFullBranchFilterMode: true });

      it('reports items for any child that survived the filter, visible or not', () => {
        expect(calculateHasChildren(withHiddenChild, options, context)).toBe(true);
      });

      it('reports no items when every child was filtered out', () => {
        expect(calculateHasChildren(leaf, options, context)).toBe(false);
      });
    });

    describe('fallback', () => {
      it('reports items once a descendant propagated them', () => {
        expect(calculateHasChildren(withVisibleChild, createLoadOptions(), createContext()))
          .toBe(true);
      });

      it('reports none for a node nothing propagated into', () => {
        expect(calculateHasChildren(leaf, createLoadOptions(), createContext())).toBe(false);
      });
    });
  });

  describe('expandedRowKeys', () => {
    it('collects the keys to expand deepest first', () => {
      const { root } = buildTree([
        { id: 1, parentId: ROOT },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
      ]);
      const expandedRowKeys = fillNodes(
        root.children,
        createLoadOptions({ expandVisibleNodes: true }),
        createContext(),
      );

      expect(expandedRowKeys).toEqual([2, 1]);
    });

    it('collects nothing when expandVisibleNodes is not set', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT },
        { id: 2, parentId: 1 },
      ]);
      const expandedRowKeys = fillNodes(root.children, createLoadOptions(), createContext());

      expect(expandedRowKeys).toEqual([]);
      expect(nodes[1].hasChildren).toBe(true);
    });

    it('skips a node that is hidden itself', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT },
        { id: 2, parentId: 1 },
      ], [2]);
      const expandedRowKeys = fillNodes(
        root.children,
        createLoadOptions({ expandVisibleNodes: true }),
        createContext(),
      );

      expect(nodes[1].hasChildren).toBe(true);
      expect(expandedRowKeys).toEqual([]);
    });

    it('skips a node without children', () => {
      const { root } = buildTree([{ id: 1, parentId: ROOT }]);
      const expandedRowKeys = fillNodes(
        root.children,
        createLoadOptions({ expandVisibleNodes: true }),
        createContext(),
      );

      expect(expandedRowKeys).toEqual([]);
    });
  });

  describe('fullBranch mode', () => {
    const context = createContext({
      isFullBranchFilterMode: true,
      hasItemsGetter: (data): unknown => (data as Item).hasItems,
    });
    const options = createLoadOptions({ expandVisibleNodes: true });

    it('expands a node that kept at least one visible child', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 1 },
      ], [1, 2]);
      const expandedRowKeys = fillNodes(root.children, options, context);

      expect(expandedRowKeys).toEqual([1]);
      expect(nodes[3].visible).toBe(false);
    });

    it('reveals the branch instead of expanding it when every child was filtered out', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT, hasItems: true },
        { id: 2, parentId: 1 },
      ], [1]);
      const expandedRowKeys = fillNodes(root.children, options, context);

      expect(expandedRowKeys).toEqual([]);
      expect(nodes[2].visible).toBe(true);
    });

    it('stops revealing a branch at a node that reports no items of its own', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT, hasItems: true },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
      ], [1]);

      fillNodes(root.children, options, context);

      // foreachNodes only descends into nodes whose hasChildren is already truthy,
      // and node 2 reports none once its own children were filtered out.
      expect(nodes[2].visible).toBe(true);
      expect(nodes[3].visible).toBe(false);
    });

    it('keeps revealing a branch through a node that reports items', () => {
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT, hasItems: true },
        { id: 2, parentId: 1, hasItems: true },
        { id: 3, parentId: 2 },
      ], [1]);

      fillNodes(root.children, options, context);

      expect(nodes[3].visible).toBe(true);
    });

    it('handles a node that reports items but has no loaded children', () => {
      const { root, nodes } = buildTree([{ id: 1, parentId: ROOT, hasItems: true }], [1]);
      const expandedRowKeys = fillNodes(root.children, options, context);

      expect(expandedRowKeys).toEqual([]);
      expect(nodes[1].hasChildren).toBe(true);
    });

    it('expands a visible node with children when the mode is off', () => {
      const plainContext = createContext({
        hasItemsGetter: (data): unknown => (data as Item).hasItems,
      });
      const { root, nodes } = buildTree([
        { id: 1, parentId: ROOT, hasItems: true },
        { id: 2, parentId: 1 },
      ], [1]);
      const expandedRowKeys = fillNodes(root.children, options, plainContext);

      expect(expandedRowKeys).toEqual([1]);
      expect(nodes[2].visible).toBe(false);
    });
  });
});

describe('getVisibleNodes', () => {
  const noneExpanded = (): boolean => false;
  const allExpanded = (): boolean => true;

  // Mirrors the adapter: the tree is filled first, then flattened into rows.
  function getVisibleKeys(
    items: Item[],
    visibleKeys: unknown[] | undefined,
    isRowExpanded: (key: unknown) => boolean,
    context = createContext(),
  ): unknown[] {
    const { root } = buildTree(items, visibleKeys);

    fillNodes(root.children, createLoadOptions(), context);

    return getVisibleNodes(root.children, isRowExpanded).map((node) => node.key);
  }

  const parentAndChild: Item[] = [
    { id: 1, parentId: ROOT },
    { id: 2, parentId: 1 },
  ];

  it('returns the node objects themselves', () => {
    const { root, nodes } = buildTree([{ id: 1, parentId: ROOT }]);

    fillNodes(root.children, createLoadOptions(), createContext());

    expect(getVisibleNodes(root.children, noneExpanded)[0]).toBe(nodes[1]);
  });

  it('returns nothing for an empty node list', () => {
    expect(getVisibleNodes([], noneExpanded)).toEqual([]);
  });

  it('stops at a collapsed node', () => {
    expect(getVisibleKeys(parentAndChild, undefined, noneExpanded)).toEqual([1]);
  });

  it('includes the children of an expanded node', () => {
    expect(getVisibleKeys(parentAndChild, undefined, allExpanded)).toEqual([1, 2]);
  });

  it('returns the nodes in tree order', () => {
    const items = [
      { id: 1, parentId: ROOT },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 2 },
      { id: 4, parentId: ROOT },
    ];

    expect(getVisibleKeys(items, undefined, allExpanded)).toEqual([1, 2, 3, 4]);
  });

  // How matchOnly/fullBranch surface a match whose ancestors were filtered out.
  it('descends through a hidden node without listing it', () => {
    expect(getVisibleKeys(parentAndChild, [2], noneExpanded)).toEqual([2]);
  });

  it('does not descend into a node that reports no children', () => {
    const context = createContext({
      hasItemsGetter: (data): unknown => (data as Item).hasItems,
    });
    const items = [
      { id: 1, parentId: ROOT, hasItems: false },
      { id: 2, parentId: 1 },
    ];

    expect(getVisibleKeys(items, undefined, allExpanded, context)).toEqual([1]);
  });

  it('handles a node that reports children it has not loaded', () => {
    const context = createContext({
      hasItemsGetter: (data): unknown => (data as Item).hasItems,
    });
    const items = [{ id: 1, parentId: ROOT, hasItems: true }];

    expect(getVisibleKeys(items, undefined, allExpanded, context)).toEqual([1]);
  });

  it('asks about expansion using each node key', () => {
    const asked: unknown[] = [];

    getVisibleKeys(parentAndChild, undefined, (key) => {
      asked.push(key);

      return true;
    });

    expect(asked).toEqual([1, 2]);
  });
});
