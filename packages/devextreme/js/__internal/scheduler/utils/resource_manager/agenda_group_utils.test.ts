import {
  describe, expect, it,
} from '@jest/globals';

import { getResourceManagerMock } from '../../__mock__/resource_manager.mock';
import { reduceResourcesTree } from './agenda_group_utils';

describe('agenda group utils', () => {
  describe('reduceResourcesTree', () => {
    it('should reduce tree by appointments resources', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['roomId', 'nested.priorityId']);
      expect(reduceResourcesTree(manager.resourceById, manager.groupsTree, [
        { roomId: 0, nested: { priorityId: [1, 2] } },
        { roomId: 1, nested: { priorityId: 2 } },
      ] as any)).toEqual([
        {
          children: [
            {
              children: [],
              grouped: { 'nested.priorityId': 1, roomId: 0 },
              resourceIndex: 'nested.priorityId',
              resourceText: 'Low Priority',
            },
            {
              children: [],
              grouped: { 'nested.priorityId': 2, roomId: 0 },
              resourceIndex: 'nested.priorityId',
              resourceText: 'High Priority',
            },
          ],
          grouped: { roomId: 0 },
          resourceIndex: 'roomId',
          resourceText: 'Room 1',
        },
        {
          children: [
            {
              children: [],
              grouped: { 'nested.priorityId': 1, roomId: 1 },
              resourceIndex: 'nested.priorityId',
              resourceText: 'Low Priority',
            },
            {
              children: [],
              grouped: { 'nested.priorityId': 2, roomId: 1 },
              resourceIndex: 'nested.priorityId',
              resourceText: 'High Priority',
            },
          ],
          grouped: { roomId: 1 },
          resourceIndex: 'roomId',
          resourceText: 'Room 2',
        },
      ]);
    });

    it('should reduce tree by zero appointments', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['roomId', 'nested.priorityId']);
      expect(reduceResourcesTree(manager.resourceById, manager.groupsTree, [])).toEqual([]);
    });
  });
});
