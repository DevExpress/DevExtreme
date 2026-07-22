import {
  describe, expect, it,
} from '@jest/globals';

import type { GroupNode } from '../../../utils/resource_manager/types';
import {
  buildGroupPanelTree,
  flattenGroupPanelTreeToRows,
  getGroupPanelTreeDepth,
} from '../group_panel_tree';

const node = (
  id: string,
  resourceText: string,
  resourceIndex: string,
  children: GroupNode[] = [],
  color?: string,
): GroupNode => ({
  id,
  resourceText,
  resourceIndex,
  color,
  grouped: { [resourceIndex]: id },
  children,
});

describe('group_panel_tree', () => {
  describe('buildGroupPanelTree', () => {
    it('should annotate a flat (single-level) tree', () => {
      const tree = [
        node('1', 'Room 1', 'roomId', [], '#aaa'),
        node('2', 'Room 2', 'roomId', [], '#ccc'),
      ];

      const result = buildGroupPanelTree(tree);

      expect(result).toEqual([
        {
          key: 'roomId_1',
          id: '1',
          text: 'Room 1',
          color: '#aaa',
          data: { id: '1', text: 'Room 1', color: '#aaa' },
          resourceIndex: 'roomId',
          leafCount: 1,
          isFirstGroupCell: true,
          isLastGroupCell: false,
          children: [],
        },
        {
          key: 'roomId_2',
          id: '2',
          text: 'Room 2',
          color: '#ccc',
          data: { id: '2', text: 'Room 2', color: '#ccc' },
          resourceIndex: 'roomId',
          leafCount: 1,
          isFirstGroupCell: false,
          isLastGroupCell: true,
          children: [],
        },
      ]);
    });

    it('should pass through full resourceData for resourceCellTemplate', () => {
      const tree = [{
        ...node('1', 'John Heart', 'employeeID', [], '#aaa'),
        resourceData: {
          id: 1,
          text: 'John Heart',
          color: '#aaa',
          age: 27,
          avatar: '19.png',
          discipline: 'ABS, Fitball, StepFit',
        },
      }];

      const result = buildGroupPanelTree(tree);

      expect(result[0].data).toEqual({
        id: 1,
        text: 'John Heart',
        color: '#aaa',
        age: 27,
        avatar: '19.png',
        discipline: 'ABS, Fitball, StepFit',
      });
    });

    it('should omit color from data when it is undefined', () => {
      const tree = [
        node('1', 'John', 'ownerId'),
      ];

      const result = buildGroupPanelTree(tree);

      expect(result[0].data).toEqual({ id: '1', text: 'John' });
      expect(result[0].data).not.toHaveProperty('color');
    });

    it('should compute leafCount for a uniform-depth tree from real descendant counts', () => {
      const tree = [
        node('A', 'Room A', 'roomId', [
          node('1', 'John', 'ownerId'),
          node('2', 'Jane', 'ownerId'),
        ]),
        node('B', 'Room B', 'roomId', [
          node('1', 'John', 'ownerId'),
        ]),
      ];

      const result = buildGroupPanelTree(tree);

      expect(result[0].leafCount).toBe(2);
      expect(result[1].leafCount).toBe(1);
    });

    it('should give every node a unique key even when the same id repeats under different parents', () => {
      const tree = [
        node('A', 'Room A', 'roomId', [node('1', 'John', 'ownerId')]),
        node('B', 'Room B', 'roomId', [node('1', 'John', 'ownerId')]),
      ];

      const result = buildGroupPanelTree(tree);
      const childKeys = result.map((parent) => parent.children[0].key);

      expect(new Set(childKeys).size).toBe(2);
    });

    it('should treat a childless node as its own leaf (leafCount 1) for non-uniform depth', () => {
      const tree = [
        node('A', 'Building A', 'buildingId', [
          node('1', 'Room A1', 'roomId'),
          node('2', 'Room A2', 'roomId'),
        ]),
        node('B', 'Building B', 'buildingId', []),
      ];

      const result = buildGroupPanelTree(tree);

      expect(result[0].leafCount).toBe(2);
      expect(result[1].leafCount).toBe(1);
    });
  });

  describe('getGroupPanelTreeDepth', () => {
    it('should return 0 for an empty tree', () => {
      expect(getGroupPanelTreeDepth([])).toBe(0);
    });

    it('should return 1 for a flat single-level tree', () => {
      const tree = buildGroupPanelTree([node('1', 'Room 1', 'roomId')]);

      expect(getGroupPanelTreeDepth(tree)).toBe(1);
    });

    it('should return the depth of the deepest branch for a non-uniform tree', () => {
      const tree = buildGroupPanelTree([
        node('A', 'Building A', 'buildingId', [
          node('1', 'Room A1', 'roomId', [
            node('x', 'Desk x', 'deskId'),
          ]),
          node('2', 'Room A2', 'roomId'),
        ]),
        node('B', 'Building B', 'buildingId'),
      ]);

      expect(getGroupPanelTreeDepth(tree)).toBe(3);
    });
  });

  describe('flattenGroupPanelTreeToRows', () => {
    it('should compute colSpan from leafCount and fill missing depth with rowSpan for a shallow leaf', () => {
      const tree = buildGroupPanelTree([
        node('A', 'Building A', 'buildingId', [
          node('1', 'Room A1', 'roomId'),
          node('2', 'Room A2', 'roomId'),
        ]),
        node('B', 'Building B', 'buildingId'),
      ]);
      const maxDepth = getGroupPanelTreeDepth(tree);

      const rows = flattenGroupPanelTreeToRows(tree, maxDepth, 3);

      expect(maxDepth).toBe(2);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual([
        expect.objectContaining({ id: 'A', colSpan: 2 * 3 }),
        expect.objectContaining({ id: 'B', colSpan: 1 * 3, rowSpan: 2 }),
      ]);
      expect(rows[1]).toEqual([
        expect.objectContaining({ id: '1', colSpan: 1 * 3 }),
        expect.objectContaining({ id: '2', colSpan: 1 * 3 }),
      ]);
    });

    it('should handle 3-level non-uniform depth (shallow leaf spans the remaining 2 rows)', () => {
      const tree = buildGroupPanelTree([
        node('X', 'Region X', 'regionId', [
          node('X1', 'Building X1', 'buildingId', [
            node('a', 'Room a', 'roomId'),
            node('b', 'Room b', 'roomId'),
          ]),
          node('X2', 'Building X2', 'buildingId'),
        ]),
      ]);
      const maxDepth = getGroupPanelTreeDepth(tree);

      const rows = flattenGroupPanelTreeToRows(tree, maxDepth, 1);

      expect(maxDepth).toBe(3);
      expect(rows[0]).toEqual([
        expect.objectContaining({ id: 'X', colSpan: 3 }),
      ]);
      expect(rows[1]).toEqual([
        expect.objectContaining({ id: 'X1', colSpan: 2 }),
        expect.objectContaining({ id: 'X2', colSpan: 1, rowSpan: 2 }),
      ]);
      expect(rows[2]).toEqual([
        expect.objectContaining({ id: 'a', colSpan: 1 }),
        expect.objectContaining({ id: 'b', colSpan: 1 }),
      ]);
    });
  });
});
