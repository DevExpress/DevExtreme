import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupPanelTreeNode } from '../../../types';
import { buildGroupPanelTree } from '../../utils/group_panel_tree';
import type { ResourceCellTemplateData } from '../types';
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
  path: [{
    id: key, text, color: undefined, resourceIndex: 'roomId', data: { id: key, text },
  }],
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

  it('should set title/aria-label for the accessible label and overflow tooltip', () => {
    const component = new GroupPanelVerticalNode({ node: leafNode('a', 'Room A', 1), index: 0 });
    const result = component.render() as VirtualNodeLike;
    const children = result.children as VirtualNodeLike[];
    const cell = children[0];

    expect(cell.props?.title).toBe('Room A');
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

  describe('resourceCellTemplate', () => {
    const cellTemplate = (): JSX.Element => <div />;
    const hierarchy = buildGroupPanelTree([
      {
        id: 'A',
        resourceText: 'Building A',
        resourceIndex: 'buildingId',
        grouped: { buildingId: 'A' },
        children: [{
          id: 1,
          resourceText: 'Room A1',
          color: '#aaa',
          resourceIndex: 'roomId',
          grouped: { buildingId: 'A', roomId: 1 },
          children: [],
        }],
      },
    ]);
    const [building] = hierarchy;
    const [room] = building.children;

    const renderTemplateData = (
      node: GroupPanelTreeNode,
      index: number,
    ): ResourceCellTemplateData => {
      const result = new GroupPanelVerticalNode({ node, index, cellTemplate }).render();
      const cell = (result as VirtualNodeLike).children as VirtualNodeLike[];
      const templateNode = (Array.isArray(cell[0].children)
        ? cell[0].children[0]
        : cell[0].children) as VirtualNodeLike;

      return (templateNode.props as {
        templateProps: { data: ResourceCellTemplateData };
      }).templateProps.data;
    };

    it('should pass hierarchy-aware data to a parent header cell template', () => {
      expect(renderTemplateData(building, 0)).toEqual({
        data: { id: 'A', text: 'Building A' },
        id: 'A',
        text: 'Building A',
        color: undefined,
        resourceIndex: 'buildingId',
        level: 0,
        isLeaf: false,
        path: [expect.objectContaining({ id: 'A', text: 'Building A' })],
      });
    });

    it('should pass hierarchy-aware data to a leaf header cell template', () => {
      expect(renderTemplateData(room, 0)).toEqual({
        data: { id: 1, text: 'Room A1', color: '#aaa' },
        id: 1,
        text: 'Room A1',
        color: '#aaa',
        resourceIndex: 'roomId',
        level: 1,
        isLeaf: true,
        path: [
          expect.objectContaining({ text: 'Building A' }),
          expect.objectContaining({ text: 'Room A1' }),
        ],
      });
    });
  });
});
