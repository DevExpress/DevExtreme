import { describe, expect, it } from '@jest/globals';
import { noop } from '@js/core/utils/common';

import { GroupingHelper } from '../m_grouping_expanded';
import type { GroupInfoData, GroupingLoadOperation, GroupItemData } from '../types';
import type { GroupConfig } from './grouping_expanded.helpers';
import { GroupingTestHelper } from './grouping_expanded.helpers';
import { createDataSourceAdapterStub } from './grouping_expanded.mock';

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------
const LOCAL_GROUPS: GroupConfig[] = [
  { key: 'A', count: 3 },
  { key: 'B', count: 2 },
  { key: 'C', count: 1 },
];

const SERVER_GROUPS: GroupConfig[] = [
  { key: 'A', count: 3, serverCount: 100 },
  { key: 'B', count: 2, serverCount: 50 },
  { key: 'C', count: 1, serverCount: 30 },
];

// ---------------------------------------------------------------------------
// Tests — local data (count matches visible items)
// ---------------------------------------------------------------------------

describe('groupInfo state after changeRowExpand flow', () => {
  describe('local data: collapsing a single new group', () => {
    it('should register group A with offset 0 and isExpanded false', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['A']);

      expect(helper.grouping.findGroupInfo(['A'])).toEqual({
        offset: 0, count: 3, path: ['A'], isExpanded: false,
      });
    });

    it('should register group C with offset 5', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['C']);

      expect(helper.grouping.findGroupInfo(['C'])).toEqual({
        offset: 5, count: 1, path: ['C'], isExpanded: false,
      });
    });
  });

  describe('local data: collapsing new groups top-to-bottom (A → B → C)', () => {
    it('should assign correct offsets at each step', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 3, isExpanded: false });

      helper.collapse(['B']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 3, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 2, isExpanded: false });

      helper.collapse(['C']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 3, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 2, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 1, isExpanded: false });
    });
  });

  describe('local data: collapsing new groups bottom-to-top (C → B → A)', () => {
    it('should assign correct offsets at each step', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['C']);
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 1, isExpanded: false });

      helper.collapse(['B']);
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 2, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 1, isExpanded: false });

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 3, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 2, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 1, isExpanded: false });
    });
  });

  describe('local data: expanding and re-collapsing', () => {
    it('should toggle isExpanded to true on expand', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ isExpanded: false });

      helper.expand(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ isExpanded: true });
    });

    it('should preserve count when expanding', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['B']);
      helper.expand(['B']);

      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ count: 2, isExpanded: true });
    });

    it('should toggle isExpanded back to false (collapse → expand → collapse)', () => {
      const helper = new GroupingTestHelper(LOCAL_GROUPS);

      helper.collapse(['A']);
      helper.expand(['A']);
      helper.collapse(['A']);

      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({
        offset: 0, count: 3, isExpanded: false,
      });
    });
  });

  describe('server-side data: collapsing a single group uses server count', () => {
    it('should store server count, not visible item count', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['A']);

      expect(helper.grouping.findGroupInfo(['A'])).toEqual({
        offset: 0, count: 100, path: ['A'], isExpanded: false,
      });
    });
  });

  describe('server-side data: collapsing top-to-bottom (A → B → C)', () => {
    it('should assign offsets based on server counts', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });

      helper.collapse(['B']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });

      helper.collapse(['C']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 150, count: 30, isExpanded: false });
    });
  });

  describe('server-side data: collapsing bottom-to-top (C → B → A)', () => {
    it('should assign offsets based on server counts', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['C']);
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 5, count: 30, isExpanded: false });

      helper.collapse(['B']);
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 3, count: 50, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 53, count: 30, isExpanded: false });

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 150, count: 30, isExpanded: false });
    });
  });

  describe('server-side data: expand and re-collapse', () => {
    it('should preserve server count through expand/collapse cycle', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ count: 100, isExpanded: false });

      helper.expand(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ count: 100, isExpanded: true });

      helper.collapse(['A']);
      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ count: 100, isExpanded: false });
    });
  });

  describe('server-side data: skip a middle group', () => {
    it('should correctly offset C past collapsed A (B stays expanded)', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['A']);
      helper.collapse(['C']);

      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100 });
      // B is expanded, its 2 visible items sit between A and C
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 102, count: 30 });
    });
  });
});

// ---------------------------------------------------------------------------
// Tests — isPending logic
// ---------------------------------------------------------------------------

describe('isPending logic', () => {
  describe('updateGroupOffsets: expanding a known collapsed group', () => {
    it('should keep subsequent collapsed group at correct offset when expanding the first group', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['A']);
      helper.collapse(['B']);
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 100 });

      helper.expand(['A']);

      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ isExpanded: true });
      // B.offset must stay at 100 (A.count), not drop to 1
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ offset: 100, count: 50, isExpanded: false });
    });

    it('should keep surrounding offsets correct when expanding a middle group', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['A']);
      helper.collapse(['B']);
      helper.collapse(['C']);

      helper.expand(['B']);

      expect(helper.grouping.findGroupInfo(['A'])).toMatchObject({ offset: 0, count: 100, isExpanded: false });
      expect(helper.grouping.findGroupInfo(['B'])).toMatchObject({ isExpanded: true });
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 150, count: 30, isExpanded: false });
    });

    it('should recalculate C offset as groups are expanded one by one (collapse C→B→A, expand B→A)', () => {
      const helper = new GroupingTestHelper(SERVER_GROUPS);

      helper.collapse(['C']);
      helper.collapse(['B']);
      helper.collapse(['A']);

      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 150 });

      helper.expand(['B']);
      // A still collapsed (100) + B being expanded still counts as 50 + C
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 150 });

      helper.expand(['A']);
      // A still uses count (100) + B expanded with 2 visible items → C at 102
      expect(helper.grouping.findGroupInfo(['C'])).toMatchObject({ offset: 102 });
    });
  });

  describe('handleDataLoading: expandCorrection', () => {
    it('should widen the load window for collapsed groups after the expanding one', () => {
      const grouping = new GroupingHelper(createDataSourceAdapterStub());

      // Group A was just expanded — isPending + isExpanded, count=100
      grouping.addGroupInfo({
        offset: 0, count: 100, isExpanded: true, isPending: true, path: ['A'],
      });
      // Group B is collapsed right after A: B.offset = A.count
      grouping.addGroupInfo({
        offset: 100, count: 30, isExpanded: false, path: ['B'],
      });

      const options: GroupingLoadOperation = {
        storeLoadOptions: { skip: 0, take: 50 },
        loadOptions: { group: [{ selector: 'category' }] },
      };
      grouping.handleDataLoading(options);

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
      const grouping = new GroupingHelper(createDataSourceAdapterStub());

      // Group A is expanded but NOT pending (normal steady state)
      grouping.addGroupInfo({
        offset: 0, count: 100, isExpanded: true, path: ['A'],
      });
      // Group B is collapsed right after A: B.offset = A.count
      grouping.addGroupInfo({
        offset: 100, count: 30, isExpanded: false, path: ['B'],
      });

      const options: GroupingLoadOperation = {
        storeLoadOptions: { skip: 0, take: 50 },
        loadOptions: { group: [{ selector: 'category' }] },
      };
      grouping.handleDataLoading(options);

      // Without expandCorrection boundary stays at 51;
      // B (offset = A.count = 100) is past it and therefore excluded
      expect(options.collapsedGroups).toEqual([]);
      expect(options.collapsedItemsCount).toBe(0);
    });
  });

  describe('handleDataLoading: isPending cleanup', () => {
    it('should delete isPending from an expanded group after processing', () => {
      const grouping = new GroupingHelper(createDataSourceAdapterStub());

      grouping.addGroupInfo({
        offset: 0, count: 100, isExpanded: true, isPending: true, path: ['A'],
      });

      const options: GroupingLoadOperation = {
        storeLoadOptions: { skip: 0, take: 50 },
        loadOptions: { group: [{ selector: 'category' }] },
      };
      grouping.handleDataLoading(options);

      expect(grouping.findGroupInfo(['A'])?.isPending).toBeUndefined();
    });

    it('should delete isPending from a collapsed group after processing', () => {
      const grouping = new GroupingHelper(createDataSourceAdapterStub());

      grouping.addGroupInfo({
        offset: 0, count: 10, isExpanded: false, isPending: true, path: ['A'],
      });

      const options: GroupingLoadOperation = {
        storeLoadOptions: { skip: 0, take: 50 },
        loadOptions: { group: [{ selector: 'category' }] },
      };
      grouping.handleDataLoading(options);

      expect(grouping.findGroupInfo(['A'])?.isPending).toBeUndefined();
    });
  });
});

describe('handleDataLoaded: group items processing', () => {
  const ROWS = [
    { g: 'A', id: 'a1' },
    { g: 'A', id: 'a2' },
    { g: 'B', id: 'b1' },
    { g: 'B', id: 'b2' },
    { g: 'B', id: 'b3' },
    { g: 'C', id: 'c1' },
  ];

  const COLLAPSED_A: GroupInfoData = {
    offset: 0, count: 2, isExpanded: false, path: ['A'],
  };
  const COLLAPSED_B: GroupInfoData = {
    offset: 2, count: 3, isExpanded: false, path: ['B'],
  };

  it.each([
    {
      name: 'hide the items of a collapsed group',
      groupInfos: [COLLAPSED_B],
      rows: ROWS,
      take: 10,
      skipFirstItem: false,
      expected: [
        { key: 'A', items: [ROWS[0], ROWS[1]] },
        { key: 'B', items: null, collapsedItems: [ROWS[2], ROWS[3], ROWS[4]] },
        { key: 'C', items: [ROWS[5]] },
      ],
    },
    {
      name: 'cut the items that do not fit into take',
      groupInfos: [],
      rows: ROWS,
      take: 3,
      skipFirstItem: false,
      expected: [
        { key: 'A', items: [ROWS[0], ROWS[1]] },
        { key: 'B', items: [ROWS[2]], isContinuationOnNextPage: true },
      ],
    },
    {
      name: 'cut collapsed groups that do not fit into take',
      groupInfos: [COLLAPSED_A, COLLAPSED_B],
      rows: ROWS,
      take: 1,
      skipFirstItem: false,
      expected: [
        { key: 'A', items: null, collapsedItems: [ROWS[0], ROWS[1]] },
      ],
    },
    {
      name: 'mark the first group as a continuation when the first item is skipped',
      groupInfos: [],
      rows: ROWS,
      take: 10,
      skipFirstItem: true,
      expected: [
        { key: 'A', items: [ROWS[1]], isContinuation: true },
        { key: 'B', items: [ROWS[2], ROWS[3], ROWS[4]] },
        { key: 'C', items: [ROWS[5]] },
      ],
    },
    {
      name: 'remove the first group when its only item is skipped',
      groupInfos: [],
      rows: ROWS.slice(1),
      take: 10,
      skipFirstItem: true,
      expected: [
        { key: 'B', items: [ROWS[2], ROWS[3], ROWS[4]] },
        { key: 'C', items: [ROWS[5]] },
      ],
    },
    {
      name: 'remove a collapsed first group when the first item is skipped',
      groupInfos: [COLLAPSED_A],
      rows: ROWS,
      take: 10,
      skipFirstItem: true,
      expected: [
        { key: 'B', items: [ROWS[2], ROWS[3], ROWS[4]] },
        { key: 'C', items: [ROWS[5]] },
      ],
    },
  ])('should $name', ({
    groupInfos, rows, take, skipFirstItem, expected,
  }) => {
    const grouping = new GroupingHelper(createDataSourceAdapterStub());
    groupInfos.forEach((groupInfo) => {
      grouping.addGroupInfo({ ...groupInfo });
    });
    const options: GroupingLoadOperation = {
      storeLoadOptions: {},
      group: [{ selector: 'g' }],
      data: rows,
      skip: 0,
      take,
      skipFirstItem,
    };

    grouping.handleDataLoaded(options, noop);

    expect(options.data).toEqual(expected);
  });
});

describe('non-array items', () => {
  it('should keep the offset when a group holds non-array items', () => {
    const grouping = new GroupingHelper(createDataSourceAdapterStub());
    const items = { key: 'B', items: null } as unknown as GroupItemData[];

    expect(grouping.updateGroupOffsets([{ key: 'A', items }], [], 0)).toBe(0);
  });

  it('should keep a row whose items field is an object', () => {
    const grouping = new GroupingHelper(createDataSourceAdapterStub());
    const row = { g: 'A', items: { id: 1 } };
    const options: GroupingLoadOperation = {
      storeLoadOptions: {},
      group: [{ selector: 'g' }],
      data: [row],
      skip: 0,
      take: 10,
      skipFirstItem: false,
    };

    grouping.handleDataLoaded(options, noop);

    expect(options.data).toEqual([{ key: 'A', items: [row] }]);
  });
});
