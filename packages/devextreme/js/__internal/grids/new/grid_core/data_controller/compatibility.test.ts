import { describe, expect, it } from '@jest/globals';
import DataSource from '@js/data/data_source';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { CompatibilityDataController } from './compatibility';

const setup = (options: Options = {}): CompatibilityDataController => getContext(options)
  .get(CompatibilityDataController);

describe('CompatibilityDataController', () => {
  describe('dataSource', () => {
    it('is undefined when the dataSource option is not set', () => {
      expect(setup().dataSource()).toBeUndefined();
    });

    it('is undefined when the dataSource option is cleared', () => {
      expect(setup({ dataSource: undefined }).dataSource()).toBeUndefined();
    });

    it('is a DataSource when the dataSource option holds items', () => {
      expect(setup({ dataSource: [{ id: 1 }] }).dataSource()).toBeInstanceOf(DataSource);
    });

    it('is a DataSource for an empty array, as classic still builds an adapter for it', () => {
      expect(setup({ dataSource: [] }).dataSource()).toBeInstanceOf(DataSource);
    });
  });
});
