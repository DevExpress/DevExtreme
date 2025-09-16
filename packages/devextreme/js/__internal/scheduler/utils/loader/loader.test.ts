import {
  describe, expect, it,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import { Loader } from './loader';

const data = ['one', 'two'];
const transformedData = ['one_transformed', 'two_transformed'];

class BaseLoader extends Loader<string, string> {
  constructor(config: any) {
    super(config, { pageSize: 0 });
    this.onInit();
  }

  protected onLoadTransform(items: string[]): string[] {
    return items.map((item) => `${item}_transformed`);
  }

  protected onLoadError(): void {}

  protected onChange(): void {}
}

describe('resource loader', () => {
  describe('Array', () => {
    it('should unwrap resources on load and dispose datasource', async () => {
      const loader = new BaseLoader({ dataSource: data });

      await loader.load();
      expect(loader.items).toEqual(transformedData);
      loader.dispose();
      expect(loader.items).toEqual([]);
      expect(loader.dataSource?.items()).toBe(undefined);
    });
  });

  describe('DataSource', () => {
    it('should unwrap resources on load and shouldn\'t dispose external datasource', async () => {
      const dataSource = new DataSource({
        store: new CustomStore({
          load: () => data,
        }),
      });
      const loader = new BaseLoader({ dataSource });

      await loader.load();
      expect(loader.items).toEqual(transformedData);
      loader.dispose();
      expect(loader.items).toEqual([]);
      expect(loader.dataSource?.items()).toBe(data);
    });

    it('should load resource data only once', async () => {
      let loadCount = 0;
      const dataSource = new DataSource({
        store: new CustomStore({
          load: () => {
            loadCount += 1;
            return data;
          },
        }),
      });
      const loader = new BaseLoader({ dataSource });

      expect(loader.isLoaded()).toBe(false);
      await Promise.all([loader.load(), loader.load()]);
      await loader.load();
      expect(loader.items).toEqual(transformedData);
      expect(loader.isLoaded()).toBe(true);
      expect(loadCount).toBe(1);
    });

    it('should fill items initially for loaded dataSource', async () => {
      const dataSource = new DataSource({
        store: new CustomStore({
          load: () => data,
        }),
      });
      await dataSource.load();
      const loader = new BaseLoader({ dataSource });

      expect(loader.isLoaded()).toBe(true);
      expect(loader.items).toEqual(transformedData);
    });

    it('should fill items for dataSource loaded externally', async () => {
      const dataSource = new DataSource({
        store: new CustomStore({ load: () => data }),
      });
      const loader = new BaseLoader({ dataSource });

      await dataSource.load();
      expect(loader.isLoaded()).toBe(true);
      expect(loader.items).toEqual(transformedData);
    });
  });
});
