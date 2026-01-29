import {
  describe, expect, it,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import { loadResource, normalizeDataSource } from './utils';

describe('utils', () => {
  describe('normalizeDataSource', () => {
    it('JSON declaration should be wrapped to DataSource object', () => {
      const filterValue = ['id', '=', 'emp1'];
      const dataSource = normalizeDataSource({
        filter: filterValue,
        store: new CustomStore({
          load: () => {},
        }),
      });

      expect(dataSource instanceof DataSource).toBe(true);
      expect(dataSource?.filter()).toBe(filterValue);
    });

    it('Array data should be wrapped to DataSource object', () => {
      const dataSource = normalizeDataSource([
        { id: 0 },
        { id: 1 },
      ]);

      expect(dataSource instanceof DataSource).toBe(true);
      expect(dataSource?.filter()).toBe(undefined);
    });

    it('DataSource object shouldn\'t wrapped', () => {
      const originalDataSource = new DataSource({
        store: new CustomStore({
          load: () => {},
        }),
      });
      const dataSource = normalizeDataSource(originalDataSource);

      expect(dataSource).toBe(originalDataSource);
      expect(dataSource?.filter()).toBe(undefined);
    });
  });

  describe('loadResource', () => {
    it('should return empty array', async () => {
      expect(await loadResource(undefined as any)).toEqual([]);
    });

    it('should return loaded array', async () => {
      let loadCount = 0;
      const dataSource = new DataSource({
        store: new CustomStore({
          load: () => {
            loadCount += 1;
            return [1, 2];
          },
        }),
      });
      await dataSource.load();

      expect(loadCount).toEqual(1);
      expect(await loadResource(dataSource)).toEqual([1, 2]);
    });

    it('should load and return array', async () => {
      let loadCount = 0;
      const dataSource = new DataSource({
        store: new CustomStore({
          load: () => {
            loadCount += 1;
            return [1, 2];
          },
        }),
      });

      expect(await loadResource(dataSource)).toEqual([1, 2]);
      expect(await loadResource(dataSource)).toEqual([1, 2]);
      expect(loadCount).toEqual(1);
    });
  });
});
