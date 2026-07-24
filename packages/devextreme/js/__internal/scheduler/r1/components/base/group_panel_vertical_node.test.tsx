import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupPanelTreeNode } from '../../../types';
import { GroupPanelVerticalNode } from './group_panel_vertical_node';

interface VirtualNodeLike {
  className?: string;
  props?: Record<string, unknown>;
  children?: VirtualNodeLike | VirtualNodeLike[];
}

const leafNode = (
  key: string,
  text: string,
  leafCount: number,
): GroupPanelTreeNode => ({
  key,
  id: key,
  text,
  data: { id: key, text },
  resourceIndex: 'roomId',
  leafCount,
  children: [],
});

describe('GroupPanelVerticalNode', () => {
  it('should set flexGrow from leafCount so height is proportional to descendant leaves', () => {
    const component = new GroupPanelVerticalNode({ node: leafNode('a', 'Room A', 3), index: 0 });
    const result = component.render() as VirtualNodeLike;

    expect(result.props?.style).toEqual({ 'flex-grow': 3 });
  });

  it('should mark a childless node as a leaf cell and render no nested children container', () => {
    const component = new GroupPanelVerticalNode({ node: leafNode('a', 'Room A', 1), index: 0 });
    const result = component.render() as VirtualNodeLike;
    const children = result.children as VirtualNodeLike[];

    expect(children).toHaveLength(1);
    expect(children[0].className).toContain('dx-scheduler-group-header-leaf');
  });

  it('should set title/role/aria-label for the accessible label and overflow tooltip', () => {
    const component = new GroupPanelVerticalNode({ node: leafNode('a', 'Room A', 1), index: 0 });
    const result = component.render() as VirtualNodeLike;
    const children = result.children as VirtualNodeLike[];
    const cell = children[0];

    expect(cell.props?.title).toBe('Room A');
    expect(cell.props?.role).toBe('rowheader');
    expect(cell.props?.['aria-label']).toBe('Room A');
  });

  it('should recurse into children via a nested flex container when the node has children', () => {
    const parent: GroupPanelTreeNode = {
      ...leafNode('parent', 'Building A', 2),
      children: [leafNode('child1', 'Room A1', 1), leafNode('child2', 'Room A2', 1)],
    };
    const component = new GroupPanelVerticalNode({ node: parent, index: 0 });
    const result = component.render() as VirtualNodeLike;
    const children = result.children as VirtualNodeLike[];

    expect(children).toHaveLength(2);
    expect(children[0].className).not.toContain('dx-scheduler-group-header-leaf');

    const nestedContainer = children[1];
    expect(nestedContainer.className).toBe('dx-scheduler-group-flex-container');
    expect(nestedContainer.children).toHaveLength(2);
  });

  it('should apply custom property width to non-leaf header cell', () => {
    const parent: GroupPanelTreeNode = {
      ...leafNode('parent', 'Building A', 2),
      children: [leafNode('child1', 'Room A1', 1), leafNode('child2', 'Room A2', 1)],
    };
    const component = new GroupPanelVerticalNode({ node: parent, index: 0 });
    const result = component.render() as VirtualNodeLike;
    const children = result.children as VirtualNodeLike[];
    const headerCell = children[0];

    expect(headerCell.props?.style).toEqual({ width: 'var(--dx-scheduler-group-header-width)' });
  });

  it('should not apply width style to leaf header cell', () => {
    const component = new GroupPanelVerticalNode({ node: leafNode('a', 'Room A', 1), index: 0 });
    const result = component.render() as VirtualNodeLike;
    const children = result.children as VirtualNodeLike[];
    const headerCell = children[0];

    expect(headerCell.props?.style).toEqual({});
  });

  it('should apply custom property width consistently across non-uniform depth branches', () => {
    const branch1Depth2: GroupPanelTreeNode = {
      ...leafNode('building1', 'Building 1', 2),
      children: [leafNode('room1', 'Room 1', 1), leafNode('room2', 'Room 2', 1)],
    };
    const branch2Depth3: GroupPanelTreeNode = {
      ...leafNode('building2', 'Building 2', 3),
      children: [
        {
          ...leafNode('floor1', 'Floor 1', 2),
          children: [leafNode('room3', 'Room 3', 1), leafNode('room4', 'Room 4', 1)],
        },
        leafNode('room5', 'Room 5', 1),
      ],
    };

    const checkNonLeafWidth = (node: GroupPanelTreeNode) => {
      const component = new GroupPanelVerticalNode({ node, index: 0 });
      const result = component.render() as VirtualNodeLike;
      const children = result.children as VirtualNodeLike[];
      const headerCell = children[0];

      expect(headerCell.className).not.toContain('dx-scheduler-group-header-leaf');
      expect(headerCell.props?.style).toEqual({ width: 'var(--dx-scheduler-group-header-width)' });
    };

    checkNonLeafWidth(branch1Depth2);
    checkNonLeafWidth(branch2Depth3);
  });
});
