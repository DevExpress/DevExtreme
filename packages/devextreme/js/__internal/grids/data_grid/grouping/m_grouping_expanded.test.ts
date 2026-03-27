import { describe, expect, it } from '@jest/globals';

import { GroupingHelper as GroupingHelperCore } from './m_grouping_core';
import { GroupingHelper, updateGroupOffsets } from './m_grouping_expanded';
import type { DataItem, GroupInfoData, GroupItemData } from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findGroup(
  items: DataItem[],
  key: unknown,
): GroupItemData | undefined {
  for (const item of items) {
    if ('key' in item && (item as GroupItemData).key === key) {
      return item as GroupItemData;
    }
  }
  return undefined;
}

function countLeafItems(items: DataItem[] | null): number {
  if (!items) return 0;
  let count = 0;
  for (const item of items) {
    if ('key' in item && (item as GroupItemData).items !== undefined) {
      count += countLeafItems((item as GroupItemData).items);
    } else {
      count += 1;
    }
  }
  return count;
}

// ---------------------------------------------------------------------------
// Scenario helper — holds a single mutable items array and a
// GroupingHelperCore.  After each collapse / expand the items
// array is mutated the same way the real grid does it:
//   collapse → group.items becomes null
//   expand   → group.items is restored from the saved snapshot
//
// When `serverCounts` is provided, collapse uses the server-side
// total count instead of counting visible leaf items.  This mirrors
// the real flow where `loadTotalCount` queries the server.
// ---------------------------------------------------------------------------

interface Scenario {
  readonly helper: GroupingHelperCore;
  readonly items: DataItem[];
  collapse: (path: unknown[]) => void;
  expand: (path: unknown[]) => void;
}

function createScenario(
  initialItems: DataItem[],
  serverCounts?: Record<string, number>,
): Scenario {
  const items = initialItems;
  const helper = new GroupingHelperCore({ option: (): undefined => undefined });
  const savedChildren = new Map<string, GroupItemData[] | null>();

  function simulateChangeRowExpand(
    path: unknown[],
    count: number,
  ): void {
    const groupInfo = helper.findGroupInfo(path);

    const pendingGroupInfo: GroupInfoData = {
      offset: groupInfo ? groupInfo.offset : -1,
      path: groupInfo ? groupInfo.path : path,
      isExpanded: groupInfo ? !groupInfo.isExpanded : false,
      count,
    };

    updateGroupOffsets(helper, items, [], 0, pendingGroupInfo);

    if (groupInfo) {
      groupInfo.isExpanded = !groupInfo.isExpanded;
      groupInfo.count = count;
    } else if (pendingGroupInfo.offset >= 0) {
      helper.addGroupInfo(pendingGroupInfo);
    }
  }

  return {
    helper,
    items,

    collapse(path): void {
      const key = String(path[path.length - 1]);
      const group = findGroup(items, key);
      const count = serverCounts?.[key] ?? countLeafItems(group?.items ?? null);

      simulateChangeRowExpand(path, count);

      if (group) {
        savedChildren.set(JSON.stringify(path), group.items);
        group.items = null;
      }
    },

    expand(path): void {
      const groupInfo = helper.findGroupInfo(path);
      const count = groupInfo ? groupInfo.count : 0;

      simulateChangeRowExpand(path, count);

      const group = findGroup(items, path[path.length - 1]);
      if (group) {
        group.items = savedChildren.get(JSON.stringify(path)) ?? null;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

function createItems(): DataItem[] {
  return [
    { key: 'A', items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    { key: 'B', items: [{ id: 4 }, { id: 5 }] },
    { key: 'C', items: [{ id: 6 }] },
  ];
}

const SERVER_COUNTS = { A: 100, B: 50, C: 30 };

// ---------------------------------------------------------------------------
// Tests — local data (count matches visible items)
// ---------------------------------------------------------------------------

describe('groupInfo state after changeRowExpand flow', () => {
  describe('local data: collapsing a single new group', () => {
    it('should register group A with offset 0 and isExpanded false', () => {
      const { helper, collapse } = createScenario(createItems());

      collapse(['A']);

      expect(helper.findGroupInfo(['A'])).toEqual({
        offset: 0, count: 3, path: ['A'], isExpanded: false,
      });
    });

    it('should register group C with offset 5', () => {
      const { helper, collapse } = createScenario(createItems());

      collapse(['C']);

      expect(helper.findGroupInfo(['C'])).toEqual({
        offset: 5, count: 1, path: ['C'], isExpanded: false,
      });
    });
  });

  describe('local data: collapsing new groups top-to-bottom (A → B → C)', () => {
    it('should assign correct offsets at each step', () => {
      const { helper, collapse } = createScenario(createItems());

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, isExpanded: false });

      collapse(['B']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 3, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 3, isExpanded: false });

      collapse(['C']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 3, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 2, isExpanded: false });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 1, isExpanded: false });
    });
  });

  describe('local data: collapsing new groups bottom-to-top (C → B → A)', () => {
    it('should assign correct offsets at each step', () => {
      const { helper, collapse } = createScenario(createItems());

      collapse(['C']);
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 5, isExpanded: false });

      collapse(['B']);
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 3, isExpanded: false });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 5, isExpanded: false });

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 3, isExpanded: false });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 5, isExpanded: false });
    });
  });

  describe('local data: collapse order independence', () => {
    it('should produce identical final offsets regardless of collapse order', () => {
      const topDown = createScenario(createItems());
      topDown.collapse(['A']);
      topDown.collapse(['B']);
      topDown.collapse(['C']);

      const bottomUp = createScenario(createItems());
      bottomUp.collapse(['C']);
      bottomUp.collapse(['B']);
      bottomUp.collapse(['A']);

      for (const key of ['A', 'B', 'C']) {
        expect(topDown.helper.findGroupInfo([key]))
          .toEqual(bottomUp.helper.findGroupInfo([key]));
      }
    });
  });

  describe('local data: expanding and re-collapsing', () => {
    it('should toggle isExpanded to true on expand', () => {
      const { helper, collapse, expand } = createScenario(createItems());

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ isExpanded: false });

      expand(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ isExpanded: true });
    });

    it('should preserve count when expanding', () => {
      const { helper, collapse, expand } = createScenario(createItems());

      collapse(['B']);
      expand(['B']);

      expect(helper.findGroupInfo(['B'])).toMatchObject({ count: 2, isExpanded: true });
    });

    it('should toggle isExpanded back to false (collapse → expand → collapse)', () => {
      const { helper, collapse, expand } = createScenario(createItems());

      collapse(['A']);
      expand(['A']);
      collapse(['A']);

      expect(helper.findGroupInfo(['A'])).toMatchObject({
        offset: 0, count: 3, isExpanded: false,
      });
    });
  });

  // -------------------------------------------------------------------------
  // Server-side filtered data: visible items are a subset,
  // but server reports the real total count per group.
  //
  //   Group A — 3 visible items, 100 on server
  //   Group B — 2 visible items,  50 on server
  //   Group C — 1 visible item,   30 on server
  //
  // Expected flat offsets: A=0, B=100, C=150
  // -------------------------------------------------------------------------

  describe('server-side data: collapsing a single group uses server count', () => {
    it('should store server count, not visible item count', () => {
      const { helper, collapse } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['A']);

      expect(helper.findGroupInfo(['A'])).toEqual({
        offset: 0, count: 100, path: ['A'], isExpanded: false,
      });
    });
  });

  describe('server-side data: collapsing top-to-bottom (A → B → C)', () => {
    it('should assign offsets based on server counts', () => {
      const { helper, collapse } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });

      collapse(['B']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });

      collapse(['C']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 150, count: 30, isExpanded: false });
    });
  });

  describe('server-side data: collapsing bottom-to-top (C → B → A)', () => {
    it('should assign offsets based on server counts', () => {
      const { helper, collapse } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['C']);
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 30, isExpanded: false });

      collapse(['B']);
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 50, isExpanded: false });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 53, count: 30, isExpanded: false });

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 150, count: 30, isExpanded: false });
    });
  });

  describe('server-side data: expand and re-collapse', () => {
    it('should preserve server count through expand/collapse cycle', () => {
      const { helper, collapse, expand } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ count: 100, isExpanded: false });

      expand(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ count: 100, isExpanded: true });

      collapse(['A']);
      expect(helper.findGroupInfo(['A'])).toMatchObject({ count: 100, isExpanded: false });
    });
  });

  describe('server-side data: skip a middle group', () => {
    it('should correctly offset C past collapsed A (B stays expanded)', () => {
      const { helper, collapse } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['A']);
      collapse(['C']);

      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100 });
      // B is expanded, its 2 visible items sit between A and C
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 102, count: 30 });
    });
  });
});

// ---------------------------------------------------------------------------
// Tests — isPending logic
// ---------------------------------------------------------------------------

// Subclass that exposes the protected handleDataLoading method for testing.
class TestableGroupingHelper extends GroupingHelper {
  public testHandleDataLoading(options: unknown): void {
    this.handleDataLoading(options);
  }
}

function createHandleDataLoadingOptions(take: number): Record<string, unknown> {
  return {
    storeLoadOptions: { skip: 0, take },
    loadOptions: { group: [{ selector: 'category' }] },
    isCustomLoading: false,
  };
}

describe('isPending logic', () => {
  describe('updateGroupOffsets: expanding a known collapsed group', () => {
    it('should keep subsequent collapsed group at correct offset when expanding the first group', () => {
      const { helper, collapse, expand } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['A']);
      collapse(['B']);
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 100 });

      expand(['A']);

      expect(helper.findGroupInfo(['A'])).toMatchObject({ isExpanded: true });
      // B.offset must stay at 100 (A.count), not drop to 1
      expect(helper.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });
    });

    it('should keep surrounding offsets correct when expanding a middle group', () => {
      const { helper, collapse, expand } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['A']);
      collapse(['B']);
      collapse(['C']);

      expand(['B']);

      expect(helper.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.findGroupInfo(['B'])).toMatchObject({ isExpanded: true });
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 150, count: 30, isExpanded: false });
    });

    it('should recalculate C offset as groups are expanded one by one (collapse C→B→A, expand B→A)', () => {
      const { helper, collapse, expand } = createScenario(createItems(), SERVER_COUNTS);

      collapse(['C']);
      collapse(['B']);
      collapse(['A']);

      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 150 });

      expand(['B']);
      // A still collapsed (100) + B being expanded still counts as 50 + C
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 150 });

      expand(['A']);
      // A still uses count (100) + B expanded with 2 visible items → C at 102
      expect(helper.findGroupInfo(['C'])).toMatchObject({ offset: 102 });
    });
  });

  describe('handleDataLoading: expandCorrection', () => {
    it('should widen the load window for collapsed groups after the expanding one', () => {
      const helper = new TestableGroupingHelper({ option: (): undefined => undefined });

      // Group A was just expanded — isPending + isExpanded, count=100
      helper.addGroupInfo({
        offset: 0, count: 100, isExpanded: true, isPending: true, path: ['A'],
      });
      // Group B is collapsed right after A: B.offset = A.count
      helper.addGroupInfo({
        offset: 100, count: 30, isExpanded: false, path: ['B'],
      });

      const options: any = createHandleDataLoadingOptions(50);
      helper.testHandleDataLoading(options);

      // expandCorrection = A.count (100) shifts boundary from 51 to 151,
      // so B (offset = A.count = 100) falls inside the load window
      expect(options.collapsedGroups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['B'], count: 30 }),
        ]),
      );
      expect(options.collapsedItemsCount).toBe(30);
    });

    it('should NOT widen the load window for previously expanded groups (not pending)', () => {
      const helper = new TestableGroupingHelper({ option: (): undefined => undefined });

      // Group A is expanded but NOT pending (normal steady state)
      helper.addGroupInfo({
        offset: 0, count: 100, isExpanded: true, path: ['A'],
      });
      // Group B is collapsed right after A: B.offset = A.count
      helper.addGroupInfo({
        offset: 100, count: 30, isExpanded: false, path: ['B'],
      });

      const options = createHandleDataLoadingOptions(50);
      helper.testHandleDataLoading(options);

      // Without expandCorrection boundary stays at 51;
      // B (offset = A.count = 100) is past it and therefore excluded
      expect(options.collapsedGroups).toEqual([]);
      expect(options.collapsedItemsCount).toBe(0);
    });
  });

  describe('handleDataLoading: isPending cleanup', () => {
    it('should delete isPending from an expanded group after processing', () => {
      const helper = new TestableGroupingHelper({ option: (): undefined => undefined });

      helper.addGroupInfo({
        offset: 0, count: 100, isExpanded: true, isPending: true, path: ['A'],
      });

      const options = createHandleDataLoadingOptions(50);
      helper.testHandleDataLoading(options);

      expect(helper.findGroupInfo(['A'])?.isPending).toBeUndefined();
    });

    it('should delete isPending from a collapsed group after processing', () => {
      const helper = new TestableGroupingHelper({ option: (): undefined => undefined });

      helper.addGroupInfo({
        offset: 0, count: 10, isExpanded: false, isPending: true, path: ['A'],
      });

      const options = createHandleDataLoadingOptions(50);
      helper.testHandleDataLoading(options);

      expect(helper.findGroupInfo(['A'])?.isPending).toBeUndefined();
    });
  });
});
