import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupPanelData } from '../../../types';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVertical } from './group_panel_vertical';
import { GroupPanelVerticalRow } from './group_panel_vertical_row';

interface VirtualNodeLike {
  className?: string;
  props?: Record<string, unknown>;
  children?: VirtualNodeLike | VirtualNodeLike[];
}

const toChildrenArray = (
  children: VirtualNodeLike | VirtualNodeLike[] | undefined,
): VirtualNodeLike[] => {
  if (!children) {
    return [];
  }

  return Array.isArray(children) ? children : [children];
};

const hierarchicalGroupPanelData: GroupPanelData = {
  groupTree: [{
    key: 'buildingId_A',
    id: 'A',
    text: 'Building A',
    data: { id: 'A', text: 'Building A' },
    resourceIndex: 'buildingId',
    leafCount: 2,
    children: [
      {
        key: 'buildingId_A_roomId_1',
        id: 1,
        text: 'Room A1',
        data: { id: 1, text: 'Room A1' },
        resourceIndex: 'roomId',
        leafCount: 1,
        children: [],
      },
      {
        key: 'buildingId_A_roomId_2',
        id: 2,
        text: 'Room A2',
        data: { id: 2, text: 'Room A2' },
        resourceIndex: 'roomId',
        leafCount: 1,
        children: [],
      },
    ],
  }],
  groupPanelItems: [
    [{
      key: 'buildingId_A', id: 'A', text: 'Building A', data: { id: 'A', text: 'Building A' }, resourceIndex: 'buildingId', colSpan: 2,
    }],
    [
      {
        key: 'buildingId_A_roomId_1', id: 1, text: 'Room A1', data: { id: 1, text: 'Room A1' }, resourceIndex: 'roomId', colSpan: 1,
      },
      {
        key: 'buildingId_A_roomId_2', id: 2, text: 'Room A2', data: { id: 2, text: 'Room A2' }, resourceIndex: 'roomId', colSpan: 1,
      },
    ],
  ],
  maxDepth: 2,
  baseColSpan: 1,
};

const createGroupPanelVertical = (
  overrides: Partial<GroupPanelBaseProps> & Pick<GroupPanelBaseProps, 'groupPanelData'>,
): GroupPanelVertical => new GroupPanelVertical({
  ...GroupPanelBaseDefaultProps,
  ...overrides,
} as GroupPanelBaseProps);

describe('GroupPanelVertical', () => {
  it('should render timeline rows when verticalLayout is timeline regardless of className', () => {
    const component = createGroupPanelVertical({
      verticalLayout: 'timeline',
      className: 'dx-scheduler-group-table extra-class',
      groupPanelData: hierarchicalGroupPanelData,
    });
    const result = component.render() as VirtualNodeLike;
    const flexContainer = toChildrenArray(result.children)[0];
    const rows = toChildrenArray(flexContainer.children);

    expect(flexContainer.className).toBe('dx-scheduler-group-flex-container');
    expect(rows).toHaveLength(hierarchicalGroupPanelData.groupPanelItems.length);
  });

  it('should render hierarchical nodes for sidebar layout with multilevel data', () => {
    const component = createGroupPanelVertical({
      verticalLayout: 'sidebar',
      groupPanelData: hierarchicalGroupPanelData,
    });
    const result = component.render() as VirtualNodeLike;
    const flexContainer = toChildrenArray(result.children)[0];
    const nodes = toChildrenArray(flexContainer.children);

    expect(flexContainer.className).toContain('dx-scheduler-group-flex-container-hierarchical');
    expect(nodes).toHaveLength(hierarchicalGroupPanelData.groupTree.length);
  });

  it('should not use timeline rows when only className matches the timeline table class', () => {
    const component = createGroupPanelVertical({
      className: 'dx-scheduler-group-table extra-class',
      groupPanelData: hierarchicalGroupPanelData,
    });
    const result = component.render() as VirtualNodeLike;
    const flexContainer = toChildrenArray(result.children)[0];
    const treeNodeCount = hierarchicalGroupPanelData.groupTree.length;

    expect(flexContainer.className).toContain('dx-scheduler-group-flex-container-hierarchical');
    expect(toChildrenArray(flexContainer.children)).toHaveLength(treeNodeCount);
  });

  it('should render a flat row for sidebar layout with single-level data', () => {
    const component = createGroupPanelVertical({
      verticalLayout: 'sidebar',
      groupPanelData: {
        groupTree: [{
          key: 'roomId_1',
          id: 1,
          text: 'Room 1',
          data: { id: 1, text: 'Room 1' },
          resourceIndex: 'roomId',
          leafCount: 1,
          children: [],
        }],
        groupPanelItems: [[{
          key: 'roomId_1', id: 1, text: 'Room 1', data: { id: 1, text: 'Room 1' }, resourceIndex: 'roomId', colSpan: 1,
        }]],
        maxDepth: 1,
        baseColSpan: 1,
      },
    });
    const result = component.render() as VirtualNodeLike;
    const flexContainer = toChildrenArray(result.children)[0];

    expect(flexContainer.className).toBe('dx-scheduler-group-flex-container');
    const row = toChildrenArray(flexContainer.children)[0];
    expect(row.className).toContain('dx-scheduler-group-row');
  });
});

describe('GroupPanelVerticalRow', () => {
  it('should render one group row with a cell per group item', () => {
    const component = new GroupPanelVerticalRow({
      groupItems: [
        {
          id: 1, text: 'a', key: 'one_1', resourceIndex: 'one', data: { id: 1, text: 'a' }, colSpan: 2,
        },
        {
          id: 2, text: 'b', key: 'one_2', resourceIndex: 'one', data: { id: 2, text: 'b' }, colSpan: 2,
        },
      ],
    });
    const result = component.render() as VirtualNodeLike;

    expect(result.className).toContain('dx-scheduler-group-row');
    expect(toChildrenArray(result.children)).toHaveLength(2);
  });
});
