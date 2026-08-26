import {
  beforeAll, describe, expect, it,
} from '@jest/globals';
import { getResourceManagerMock } from '@ts/scheduler/__mock__/resource_manager.mock';

import { ResourceLoader } from '../loader/resource_loader';
import type { RawResourceData } from '../loader/types';
import {
  getAllGroupValues, getGroupTexts, getLeafGroupValues, getResourcesByGroupIndex, groupResources,
} from './group_utils';
import type { GroupLeaf } from './types';

const assigneeData: RawResourceData[] = [
  { id: 0, text: 'Samantha Bright', color: '#727bd2' },
  { id: 1, text: 'John Heart', color: '#32c9ed' },
];

const roomData: RawResourceData[] = [
  { id: 0, text: 'Room 1', color: '#aaa' },
  { id: 1, text: 'Room 2', color: '#ccc' },
];

const roomHierarchyData: RawResourceData[] = [
  {
    id: 'board', text: 'Board rooms', color: '#111', parentId: null,
  },
  {
    id: 'open', text: 'Open spaces', color: '#222', parentId: null,
  },
  {
    id: 11, text: 'Room 11', color: '#333', parentId: 'board',
  },
  {
    id: 12, text: 'Room 12', color: '#444', parentId: 'board',
  },
  {
    id: 21, text: 'Room 21', color: '#555', parentId: 'open',
  },
];

const createResourceLoader = async (
  fieldExpr: string,
  dataSource: RawResourceData[],
  label: string,
  parentIdExpr?: string,
): Promise<ResourceLoader> => {
  const loader = new ResourceLoader({
    fieldExpr,
    dataSource,
    label,
    parentIdExpr,
  });

  await loader.load();

  return loader;
};

const createHierarchicalRoomResource = (): Promise<ResourceLoader> => createResourceLoader(
  'roomId',
  roomHierarchyData,
  'Room',
  'parentId',
);

const createGroupLeaf = (
  groupIndex: number,
  grouped: GroupLeaf['grouped'],
): GroupLeaf => ({
  groupIndex,
  grouped,
  id: 0,
  resourceText: '',
  resourceIndex: '',
  children: [],
});

const omitResourceData = <T>(value: T): T => {
  const strip = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(strip);
    }

    if (obj && typeof obj === 'object') {
      const { resourceData, ...rest } = obj as Record<string, unknown>;

      return Object.fromEntries(
        Object.entries(rest).map(([key, val]) => [key, strip(val)]),
      );
    }

    return obj;
  };

  return strip(value) as T;
};

const groupsLeafs: GroupLeaf[] = [
  createGroupLeaf(0, { assigneeId: 1, roomId: 3 }),
  createGroupLeaf(1, { assigneeId: 3, roomId: 4 }),
  createGroupLeaf(2, { roomId: 0 }),
  createGroupLeaf(3, { assigneeId: 0, roomId: 0 }),
];

describe('groups utils', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let resourceById: Record<string, ResourceLoader>;

  beforeAll(async () => {
    const [assigneeId, roomId] = await Promise.all([
      createResourceLoader('assigneeId', assigneeData, 'Assignee'),
      createResourceLoader('roomId', roomData, 'Room'),
    ]);

    resourceById = { assigneeId, roomId };
  });

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

    it('should return empty tree when groups only contains keys missing from resourceById', () => {
      expect(groupResources(resourceById, ['unknownId'])).toEqual({
        groupTree: [],
        groupLeafs: [],
      });
    });

    it('should group by one group', () => {
      expect(omitResourceData(groupResources(resourceById, ['roomId']))).toEqual({
        groupTree: [
          {
            id: 0,
            color: '#aaa',
            children: [],
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            id: 1,
            color: '#ccc',
            children: [],
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
        groupLeafs: [
          {
            id: 0,
            color: '#aaa',
            children: [],
            groupIndex: 0,
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            id: 1,
            color: '#ccc',
            children: [],
            groupIndex: 1,
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
      });
    });

    it('should attach raw resourceData to group nodes', () => {
      const { groupTree } = groupResources(resourceById, ['roomId', 'assigneeId']);

      expect(groupTree[0].resourceData).toEqual(roomData[0]);
      expect(groupTree[0].children[0].resourceData).toEqual(assigneeData[0]);
      expect(groupTree[0].children[1].resourceData).toEqual(assigneeData[1]);
    });

    it('should attach raw resourceData to hierarchical nodes when valueExpr returns new object ids', async () => {
      const hierarchyData: RawResourceData[] = [
        {
          id: { guid: 'board' },
          text: 'Board rooms',
          color: '#111',
          parentId: null,
        },
        {
          id: { guid: 11 },
          text: 'Room 11',
          color: '#333',
          parentId: { guid: 'board' },
        },
      ];
      const loader = new ResourceLoader({
        fieldExpr: 'roomId',
        dataSource: hierarchyData,
        label: 'Room',
        parentIdExpr: 'parentId',
        valueExpr: (item: RawResourceData) => ({ ...(item.id as object) }),
      });

      await loader.load();

      const { groupTree } = groupResources({ roomId: loader }, ['roomId']);

      expect(groupTree[0].resourceData).toEqual(hierarchyData[0]);
      expect(groupTree[0].children[0].resourceData).toEqual(hierarchyData[1]);
    });

    it('should ignore missed resources and group by one group', () => {
      expect(omitResourceData(groupResources({
        roomId: resourceById.roomId,
      }, ['roomId', 'assigneeId']))).toEqual({
        groupTree: [
          {
            id: 0,
            color: '#aaa',
            children: [],
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            id: 1,
            color: '#ccc',
            children: [],
            grouped: { roomId: 1 },
            resourceIndex: 'roomId',
            resourceText: 'Room 2',
          },
        ],
        groupLeafs: [
          {
            id: 0,
            color: '#aaa',
            children: [],
            groupIndex: 0,
            grouped: { roomId: 0 },
            resourceIndex: 'roomId',
            resourceText: 'Room 1',
          },
          {
            id: 1,
            color: '#ccc',
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
      expect(omitResourceData(groupResources(resourceById, ['roomId', 'assigneeId']))).toEqual({
        groupTree: [
          {
            id: 0,
            color: '#aaa',
            children: [
              {
                id: 0,
                color: '#727bd2',
                children: [],
                grouped: { assigneeId: 0, roomId: 0 },
                resourceIndex: 'assigneeId',
                resourceText: 'Samantha Bright',
              },
              {
                id: 1,
                color: '#32c9ed',
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
            id: 1,
            color: '#ccc',
            children: [
              {
                id: 0,
                color: '#727bd2',
                children: [],
                grouped: { assigneeId: 0, roomId: 1 },
                resourceIndex: 'assigneeId',
                resourceText: 'Samantha Bright',
              },
              {
                id: 1,
                color: '#32c9ed',
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
            id: 0,
            color: '#727bd2',
            children: [],
            groupIndex: 0,
            grouped: { assigneeId: 0, roomId: 0 },
            resourceIndex: 'assigneeId',
            resourceText: 'Samantha Bright',
          },
          {
            id: 1,
            color: '#32c9ed',
            children: [],
            groupIndex: 1,
            grouped: { assigneeId: 1, roomId: 0 },
            resourceIndex: 'assigneeId',
            resourceText: 'John Heart',
          },
          {
            id: 0,
            color: '#727bd2',
            children: [],
            groupIndex: 2,
            grouped: { assigneeId: 0, roomId: 1 },
            resourceIndex: 'assigneeId',
            resourceText: 'Samantha Bright',
          },
          {
            id: 1,
            color: '#32c9ed',
            children: [],
            groupIndex: 3,
            grouped: { assigneeId: 1, roomId: 1 },
            resourceIndex: 'assigneeId',
            resourceText: 'John Heart',
          },
        ],
      });
    });

    it('should group hierarchical resource by parent-child tree', async () => {
      const hierarchicalRoom = await createHierarchicalRoomResource();

      expect(omitResourceData(groupResources({ roomId: hierarchicalRoom }, ['roomId']))).toEqual({
        groupTree: [
          {
            id: 'board',
            color: '#111',
            resourceText: 'Board rooms',
            resourceIndex: 'roomId',
            grouped: { roomId: 'board' },
            children: [
              {
                id: 11,
                color: '#333',
                resourceText: 'Room 11',
                resourceIndex: 'roomId',
                grouped: { roomId: 11 },
                children: [],
              },
              {
                id: 12,
                color: '#444',
                resourceText: 'Room 12',
                resourceIndex: 'roomId',
                grouped: { roomId: 12 },
                children: [],
              },
            ],
          },
          {
            id: 'open',
            color: '#222',
            resourceText: 'Open spaces',
            resourceIndex: 'roomId',
            grouped: { roomId: 'open' },
            children: [
              {
                id: 21,
                color: '#555',
                resourceText: 'Room 21',
                resourceIndex: 'roomId',
                grouped: { roomId: 21 },
                children: [],
              },
            ],
          },
        ],
        groupLeafs: [
          {
            id: 11,
            color: '#333',
            resourceText: 'Room 11',
            resourceIndex: 'roomId',
            grouped: { roomId: 11 },
            children: [],
            groupIndex: 0,
          },
          {
            id: 12,
            color: '#444',
            resourceText: 'Room 12',
            resourceIndex: 'roomId',
            grouped: { roomId: 12 },
            children: [],
            groupIndex: 1,
          },
          {
            id: 21,
            color: '#555',
            resourceText: 'Room 21',
            resourceIndex: 'roomId',
            grouped: { roomId: 21 },
            children: [],
            groupIndex: 2,
          },
        ],
      });
    });

    it('should use only leaf bands for hierarchical resource instead of cartesian product', async () => {
      const hierarchicalRoom = await createHierarchicalRoomResource();

      const { groupLeafs } = groupResources({ roomId: hierarchicalRoom }, ['roomId']);

      expect(groupLeafs).toHaveLength(3);
      expect(groupLeafs.map((leaf) => leaf.grouped.roomId)).toEqual([11, 12, 21]);
    });

    it('should combine hierarchical and flat resources', async () => {
      const hierarchicalRoom = await createHierarchicalRoomResource();

      const { groupTree, groupLeafs } = groupResources({
        roomId: hierarchicalRoom,
        assigneeId: resourceById.assigneeId,
      }, ['roomId', 'assigneeId']);

      expect(groupLeafs).toHaveLength(6);
      expect(groupLeafs[0].grouped).toEqual({ roomId: 11, assigneeId: 0 });
      expect(groupLeafs[1].grouped).toEqual({ roomId: 11, assigneeId: 1 });
      expect(groupTree[0].resourceText).toBe('Board rooms');
      expect(groupTree[0].children[0].children[0].resourceText).toBe('Samantha Bright');
    });

    it('should return an empty group tree when an earlier resource in groups has an empty dataSource', async () => {
      const emptyRoom = await createResourceLoader('roomId', [], 'Room');

      expect(groupResources({
        roomId: emptyRoom,
        assigneeId: resourceById.assigneeId,
      }, ['roomId', 'assigneeId'])).toEqual({
        groupTree: [],
        groupLeafs: [],
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
          ...resourceById.assigneeId,
          items: [{ id: 0, text: 'Samantha Bright', color: '#727bd2' }],
        },
        {
          ...resourceById.roomId,
          items: [{ id: 0, text: 'Room 1', color: '#aaa' }],
        },
      ]);
    });
  });
});
