import {
  describe, expect, it,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import { ResourceManager } from './resource_manager';

const counts: any = {};
const getResourceConfig = (index: string) => {
  counts[index] = 0;
  return {
    fieldExpr: index,
    label: index,
    dataSource: new DataSource({
      store: new CustomStore({
        load: () => {
          counts[index] += 1;
          return [{ id: 1, text: 'one' }, { id: 2, text: 'two' }];
        },
      }),
    }),
  };
};

describe('ResourceManager', () => {
  describe('loadGroupResources', () => {
    it('should load dataSource only once', async () => {
      const manager = new ResourceManager([
        getResourceConfig('one'),
        getResourceConfig('two'),
      ]);

      await Promise.all([
        manager.loadGroupResources(['one']),
        manager.loadGroupResources(['one', 'two']),
        manager.loadGroupResources(['two']),
      ]);
      await manager.loadGroupResources(['one', 'two']);

      expect(counts.one).toEqual(1);
      expect(counts.two).toEqual(1);
    });

    it('should load all dataSources in different requests', async () => {
      const manager = new ResourceManager([
        getResourceConfig('one'),
        getResourceConfig('two'),
      ]);

      await Promise.all([
        manager.loadGroupResources(['one']),
        manager.loadGroupResources(['two']),
      ]);

      expect(counts.one).toEqual(1);
      expect(counts.two).toEqual(1);
    });
  });

  describe('groupCount', () => {
    it('should return correct group count after grouping', async () => {
      const manager = new ResourceManager([
        getResourceConfig('one'),
        getResourceConfig('two'),
      ]);

      await manager.loadGroupResources(['one', 'two']);

      expect(manager.groupCount()).toEqual(4);
    });
  });

  describe('groupResources', () => {
    it('should return only grouped resources', async () => {
      const manager = new ResourceManager([
        getResourceConfig('one'),
        getResourceConfig('two'),
        getResourceConfig('three'),
      ]);

      await manager.loadGroupResources(['one', 'two']);

      const resources = manager.groupResources();

      expect(resources.length).toBe(2);
      expect(resources[0].resourceIndex).toBe('one');
      expect(resources[1].resourceIndex).toBe('two');
      expect(resources[0].isLoaded()).toBe(true);
      expect(resources[1].isLoaded()).toBe(true);
    });
  });

  describe('hierarchical resources', () => {
    const roomData = [
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

    it('should expose hierarchy tree and leaf items for hierarchical resource', async () => {
      const manager = new ResourceManager([{
        fieldExpr: 'roomId',
        parentIdExpr: 'parentId',
        dataSource: roomData,
        label: 'Room',
      }]);

      await manager.loadGroupResources(['roomId']);

      expect(manager.isHierarchicalResource('roomId')).toBe(true);
      expect(manager.getResourceLeafItems('roomId').map((item) => item.id)).toEqual([11, 12, 21]);
      expect(manager.getResourceHierarchyTree('roomId').map((node) => node.data.id)).toEqual(['board', 'open']);
    });
  });
});
