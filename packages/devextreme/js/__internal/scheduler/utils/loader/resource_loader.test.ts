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
      expect(loader.items).toEqual([
        { id: 1, text: 'Samantha Bright', color: '#727bd2' },
        { id: 2, text: 'John Heart', color: '#32c9ed' },
      ]);
      expect(loader.isLoaded()).toBe(true);
    });
  });
});
