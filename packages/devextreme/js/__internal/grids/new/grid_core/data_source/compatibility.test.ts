import { describe, expect, it } from '@jest/globals';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { CompatibilityDataSourceController } from './compatibility';

const setup = (options: Options = {}): CompatibilityDataSourceController => getContext(options)
  .get(CompatibilityDataSourceController);

describe('CompatibilityDataSourceController', () => {
  describe('hasAdapter', () => {
    it('is false when the dataSource option is not set', () => {
      expect(setup().hasAdapter()).toBe(false);
    });

    it('is false when the dataSource option is cleared', () => {
      expect(setup({ dataSource: undefined }).hasAdapter()).toBe(false);
    });

    it('is true when the dataSource option holds items', () => {
      expect(setup({ dataSource: [{ id: 1 }] }).hasAdapter()).toBe(true);
    });

    it('is true for an empty array, as classic still builds an adapter for it', () => {
      expect(setup({ dataSource: [] }).hasAdapter()).toBe(true);
    });
  });
});
