import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupPanelData } from '../../../types';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVertical } from './group_panel_vertical';

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
  it.each([
    {
      verticalLayout: 'timeline' as const,
      isHierarchical: false,
      expectedChildCount: hierarchicalGroupPanelData.groupPanelItems.length,
    },
    {
      verticalLayout: undefined,
      isHierarchical: true,
      expectedChildCount: hierarchicalGroupPanelData.groupTree.length,
    },
  ])('should render multilevel group panel as %# when verticalLayout is $verticalLayout', ({
    verticalLayout,
    isHierarchical,
    expectedChildCount,
  }) => {
    const component = createGroupPanelVertical({
      ...(verticalLayout ? { verticalLayout } : {}),
      className: 'dx-scheduler-group-table extra-class',
      groupPanelData: hierarchicalGroupPanelData,
    });
    const result = component.render() as VirtualNodeLike;
    const flexContainer = toChildrenArray(result.children)[0];

    if (isHierarchical) {
      expect(flexContainer.className).toContain('dx-scheduler-group-flex-container-hierarchical');
    } else {
      expect(flexContainer.className).toBe('dx-scheduler-group-flex-container');
    }
    expect(toChildrenArray(flexContainer.children)).toHaveLength(expectedChildCount);
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
    expect(flexContainer.props?.role).toBe('grid');
    const row = toChildrenArray(flexContainer.children)[0];
    expect(row.className).toContain('dx-scheduler-group-row');
    expect(row.props?.role).toBe('row');
  });
});
