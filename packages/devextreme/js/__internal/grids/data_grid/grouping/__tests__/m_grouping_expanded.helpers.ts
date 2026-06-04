import { GroupingHelper, updateGroupOffsets } from '../m_grouping_expanded';
import type { DataItem, GroupInfoData, GroupItemData } from '../types';

export interface GroupConfig {
  key: string;
  count: number;
  serverCount?: number;
}

/**
 * Test helper that simulates the grid's expand/collapse flow for grouped data.
 *
 * Constructed from a configuration array — each entry generates a group
 * with `count` leaf items (ids like `"A0"`, `"A1"`, …).
 * When `serverCount` is provided it is used as the group's total instead of
 * the visible leaf count, mirroring the real server-side paging scenario.
 *
 * - `collapse(path)` — nullifies `group.items` and registers the group as collapsed.
 * - `expand(path)` — restores the saved children and marks the group as expanded.
 *
 * After each operation all group offsets are recalculated via `updateGroupOffsets`,
 * exactly matching the `changeRowExpand` flow in the production code.
 */

export class GroupingTestHelper {
  public readonly grouping: GroupingHelper;

  public readonly items: DataItem[];

  private readonly groupsByKey: Map<string, GroupItemData>;

  private readonly leafCounts: Map<string, number>;

  /** Saved children snapshots so expand can restore them. */
  private readonly savedChildren = new Map<string, GroupItemData[] | null>();

  constructor(groups: GroupConfig[]) {
    this.grouping = new GroupingHelper({ option: (): undefined => undefined });
    this.groupsByKey = new Map();
    this.leafCounts = new Map();

    // Initialize group items
    this.items = groups.map(({ key, count, serverCount }) => {
      const items = Array.from({ length: count }, (_, i) => ({ id: `${key}${i}` }));
      const group = { key, items } as unknown as GroupItemData;
      this.groupsByKey.set(key, group);
      this.leafCounts.set(key, serverCount ?? count);

      return group;
    });
  }

  public collapse(path: string[]): void {
    const key = path[0];
    const group = this.groupsByKey.get(key);
    const count = this.leafCounts.get(key) ?? 0;

    this.simulateChangeRowExpand(path, count);

    if (group) {
      this.savedChildren.set(key, group.items);
      group.items = null;
    }
  }

  public expand(path: string[]): void {
    const groupInfo = this.grouping.findGroupInfo(path);
    const count = groupInfo ? groupInfo.count : 0;

    this.simulateChangeRowExpand(path, count);

    const key = path[0];
    const group = this.groupsByKey.get(key);
    if (group) {
      group.items = this.savedChildren.get(key) ?? [];
    }
  }

  private simulateChangeRowExpand(
    path: unknown[],
    count: number,
  ): void {
    const groupInfo = this.grouping.findGroupInfo(path);

    const pendingGroupInfo: GroupInfoData = {
      offset: groupInfo ? groupInfo.offset : -1,
      path: groupInfo ? groupInfo.path : path,
      isExpanded: groupInfo ? !groupInfo.isExpanded : false,
      count,
    };

    updateGroupOffsets(this.grouping, this.items, [], 0, pendingGroupInfo);

    if (groupInfo) {
      groupInfo.isExpanded = !groupInfo.isExpanded;
      groupInfo.count = count;
    } else if (pendingGroupInfo.offset >= 0) {
      this.grouping.addGroupInfo(pendingGroupInfo);
    }
  }
}
