import {
  describe, expect, it,
} from '@jest/globals';
import { getResourceManagerMock } from '@ts/scheduler/__mock__/resource_manager.mock';

import {
  getAllGroupValues, getGroupTexts, getLeafGroupValues, getResourcesByGroupIndex, groupResources,
} from './group_utils';

const groupsLeafs: any = [
  { groupIndex: 0, grouped: { assigneeId: 1, roomId: 3 } },
  { groupIndex: 1, grouped: { assigneeId: 3, roomId: 4 } },
  { groupIndex: 2, grouped: { roomId: 0 } },
  { groupIndex: 3, grouped: { assigneeId: 0, roomId: 0 } },
];
const resourceById: any = {
  assigneeId: {
    resourceIndex: 'assigneeId',
    items: [{ id: 0, text: 'Samantha Bright' }, { id: 1, text: 'John Heart' }],
  },
  roomId: {
    resourceIndex: 'roomId',
    items: [{ id: 0, text: 'Room 1' }, { id: 1, text: 'Room 2' }],
  },
};

describe('groups utils', () => {
  describe('groupResources', () => {
    it('should return empty tree for empty groups', () => {
      expect(groupResources(resourceById, [])).toEqual({
        groupTree: [],
        groupLeafs: [],
      });
    });

    it('should return empty tree for empty resources', () => {
      expect(groupResources({}, ['roomId', 'assigneeId'])).toEqual({
        groupTree: [],
        groupLeafs: [],
      });
    });

    it('should group by one group', () => {
      expect(groupResources(resourceById, ['roomId'])).toEqual({
        groupTree: [
          {
            children: [],
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            children: [],
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
        groupLeafs: [
          {
            children: [],
            groupIndex: 0,
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            children: [],
            groupIndex: 1,
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
      });
    });

    it('should ignore missed resources and group by one group', () => {
      expect(groupResources({
        roomId: resourceById.roomId,
      }, ['roomId', 'assigneeId'])).toEqual({
        groupTree: [
          {
            children: [],
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            children: [],
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
        groupLeafs: [
          {
            children: [],
            groupIndex: 0,
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            children: [],
            groupIndex: 1,
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
      });
    });

    it('should group by multiple groups with correct order', () => {
      expect(groupResources(resourceById, ['roomId', 'assigneeId'])).toEqual({
        groupTree: [
          {
            children: [
              {
                children: [],
                grouped: { assigneeId: 0, roomId: 0 },
                resourceIndex: 'assigneeId',
                resourceText: 'Samantha Bright',
              },
              {
                children: [],
                grouped: { assigneeId: 1, roomId: 0 },
                resourceIndex: 'assigneeId',
                resourceText: 'John Heart',
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
                grouped: { assigneeId: 0, roomId: 1 },
                resourceIndex: 'assigneeId',
                resourceText: 'Samantha Bright',
              },
              {
                children: [],
                grouped: { assigneeId: 1, roomId: 1 },
                resourceIndex: 'assigneeId',
                resourceText: 'John Heart',
              },
            ],
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
        groupLeafs: [
          {
            children: [],
            groupIndex: 0,
            grouped: { assigneeId: 0, roomId: 0 },
            resourceIndex: 'assigneeId',
            resourceText: 'Samantha Bright',
          },
          {
            children: [],
            groupIndex: 1,
            grouped: { assigneeId: 1, roomId: 0 },
            resourceIndex: 'assigneeId',
            resourceText: 'John Heart',
          },
          {
            children: [],
            groupIndex: 2,
            grouped: { assigneeId: 0, roomId: 1 },
            resourceIndex: 'assigneeId',
            resourceText: 'Samantha Bright',
          },
          {
            children: [],
            groupIndex: 3,
            grouped: { assigneeId: 1, roomId: 1 },
            resourceIndex: 'assigneeId',
            resourceText: 'John Heart',
          },
        ],
      });
    });
  });

  describe('getAllGroupValues', () => {
    it('should return all group values', () => {
      expect(getAllGroupValues(groupsLeafs)).toEqual([
        { assigneeId: 1, roomId: 3 },
        { assigneeId: 3, roomId: 4 },
        { roomId: 0 },
        { assigneeId: 0, roomId: 0 },
      ]);
    });
  });

  describe('getLeafGroupValues', () => {
    it('should return {} if nothing has found', () => {
      expect(getLeafGroupValues(groupsLeafs, 10)).toEqual({});
    });
    it('should return group values of passed index', () => {
      expect(getLeafGroupValues(groupsLeafs, 1)).toEqual({ assigneeId: 3, roomId: 4 });
    });
  });

  describe('getGroupTexts', () => {
    it('should return empty array if there is no leaf with groupIndex', () => {
      expect(getGroupTexts(['roomId'], groupsLeafs, resourceById, 20)).toEqual([]);
    });

    it('should return groups for single grouping', () => {
      expect(getGroupTexts(['roomId'], groupsLeafs, resourceById, 2)).toEqual(['Room 1']);
    });

    it('should return groups for multiple grouping', () => {
      expect(
        getGroupTexts(['assigneeId', 'roomId'], groupsLeafs, resourceById, 3),
      ).toEqual(['Samantha Bright', 'Room 1']);
    });

    it('should return empty array for empty resources', () => {
      expect(
        getGroupTexts(['assigneeId', 'roomId'], [], {}, 3),
      ).toEqual([]);
    });

    it('should return groups in order of groups declared', async () => {
      const manager = getResourceManagerMock();
      await manager.loadGroupResources(['assigneeId', 'nested.priorityId', 'roomId']);
      expect(
        getGroupTexts(manager.groups, manager.groupsLeafs, manager.resourceById, 3),
      ).toEqual(['Samantha Bright', 'High Priority', 'Room 1']);
    });
  });

  describe('getResourcesByGroupIndex', () => {
    it('should return empty array if there is no leaf with groupIndex', () => {
      expect(getResourcesByGroupIndex(groupsLeafs, resourceById, 30)).toEqual([]);
    });

    it('should return resources of groupIndex', () => {
      expect(getResourcesByGroupIndex(groupsLeafs, resourceById, 3)).toEqual([
        {
          items: [{ id: 0, text: 'Samantha Bright' }],
          resourceIndex: 'assigneeId',
        },
        {
          items: [{ id: 0, text: 'Room 1' }],
          resourceIndex: 'roomId',
        },
      ]);
    });
  });
});
