import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupPanelData } from '../../../types';
import type { GroupNode } from '../../../utils/resource_manager/types';
import { getGroupPanelData } from '../../utils/base';
import { HeaderPanel } from '../base/header_panel';
import { HeaderPanelTimeline } from './header_panel_timeline';

interface VirtualNodeLike {
  type?: { name?: string } | string;
  props?: Record<string, unknown>;
}

const hierarchicalGroupsTree: GroupNode[] = [
  {
    id: 'A',
    resourceText: 'Building A',
    resourceIndex: 'buildingId',
    grouped: { buildingId: 'A' },
    children: [
      {
        id: 1,
        resourceText: 'Room A1',
        resourceIndex: 'roomId',
        grouped: { buildingId: 'A', roomId: 1 },
        children: [],
      },
      {
        id: 2,
        resourceText: 'Room A2',
        resourceIndex: 'roomId',
        grouped: { buildingId: 'A', roomId: 2 },
        children: [],
      },
    ],
  },
];

const hierarchicalGroupPanelData: GroupPanelData = getGroupPanelData(
  hierarchicalGroupsTree,
  1,
  false,
  1,
  true,
);

const baseProps = {
  groupPanelData: hierarchicalGroupPanelData,
  groups: [{ name: 'buildingId', items: [], data: [] }],
  groupByDate: false,
  isRenderDateHeader: true,
  dateHeaderData: {
    dataMap: [], leftVirtualCellCount: 0, rightVirtualCellCount: 0,
  },
};

describe('HeaderPanelTimeline', () => {
  it('should delegate a hierarchical groupPanelData through to the shared HeaderPanel unchanged', () => {
    const component = new HeaderPanelTimeline({
      ...baseProps,
      groupOrientation: 'horizontal',
    } as any);
    const result = component.render() as VirtualNodeLike;

    expect((result.type as { name?: string })?.name).toBe(HeaderPanel.name);
    expect(result.props?.groupPanelData).toBe(hierarchicalGroupPanelData);
    expect(result.props?.groupOrientation).toBe('horizontal');
  });

  it('should still delegate correctly for vertical grouping (sidebar-driven, no header GroupPanel)', () => {
    const component = new HeaderPanelTimeline({
      ...baseProps,
      groupOrientation: 'vertical',
    } as any);
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.groupPanelData).toBe(hierarchicalGroupPanelData);
    expect(result.props?.groupOrientation).toBe('vertical');
  });
});
