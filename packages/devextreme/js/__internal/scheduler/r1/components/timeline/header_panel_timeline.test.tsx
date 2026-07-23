import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupPanelData } from '../../../types';
import { HeaderPanel } from '../base/header_panel';
import { HeaderPanelTimeline } from './header_panel_timeline';

interface VirtualNodeLike {
  type?: { name?: string } | string;
  props?: Record<string, unknown>;
}

const hierarchicalGroupPanelData: GroupPanelData = {
  groupTree: [
    {
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
    },
  ],
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
