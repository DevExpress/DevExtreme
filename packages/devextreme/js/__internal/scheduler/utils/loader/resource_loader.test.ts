import {
  describe, expect, it,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import { ResourceLoader } from './resource_loader';

const assigneeData = [
  { guid: 1, name: 'Samantha Bright', mainColor: '#727bd2' },
  { guid: 2, name: 'John Heart', mainColor: '#32c9ed' },
];
const getConfig = (dataSource) => ({
  fieldExpr: 'assigneeId',
  allowMultiple: true,
  dataSource,
  valueExpr: 'guid',
  colorExpr: 'mainColor',
  displayExpr: 'name',
  label: 'Assignee',
});

describe('resource loader', () => {
  describe('Array', () => {
    it('should unwrap resource data', async () => {
      const loader = new ResourceLoader(getConfig(assigneeData));

      expect(loader.isLoaded()).toBe(false);
      await loader.load();
      expect(loader.data).toEqual(assigneeData);
      expect(loader.items).toEqual([
        { id: 1, text: 'Samantha Bright', color: '#727bd2' },
        { id: 2, text: 'John Heart', color: '#32c9ed' },
      ]);
      expect(loader.isLoaded()).toBe(true);
    });
  });

  describe('DataSource', () => {
    it('should unwrap resource data', async () => {
      const loader = new ResourceLoader(getConfig(new DataSource({
        store: new CustomStore({
          load: () => assigneeData,
        }),
      })));

      expect(loader.isLoaded()).toBe(false);
      await loader.load();
      expect(loader.data).toEqual(assigneeData);
      expect(loader.items).toEqual([
        { id: 1, text: 'Samantha Bright', color: '#727bd2' },
        { id: 2, text: 'John Heart', color: '#32c9ed' },
      ]);
      expect(loader.isLoaded()).toBe(true);
    });
  });

  describe('Hierarchy', () => {
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
    const getHierarchyConfig = (dataSource) => ({
      fieldExpr: 'roomId',
      parentIdExpr: 'parentId',
      dataSource,
      label: 'Room',
    });

    it('should build hierarchy tree and leaf items from flat dataSource', async () => {
      const loader = new ResourceLoader(getHierarchyConfig(roomData));

      await loader.load();

      expect(loader.hasHierarchy).toBe(true);
      expect(loader.items).toHaveLength(5);
      expect(loader.leafItems.map((item) => item.id)).toEqual([11, 12, 21]);
      expect(loader.hierarchyTree.map((node) => node.data.id)).toEqual(['board', 'open']);
      expect(loader.hierarchyTree[0].children.map((node) => node.data.id)).toEqual([11, 12]);
    });

    it('should keep flat behavior when parentIdExpr is not configured', async () => {
      const loader = new ResourceLoader({
        fieldExpr: 'roomId',
        dataSource: roomData,
        label: 'Room',
      });

      await loader.load();

      expect(loader.hasHierarchy).toBe(false);
      expect(loader.hierarchyTree).toEqual([]);
      expect(loader.leafItems).toEqual(loader.items);
    });
  });
});
