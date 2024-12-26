/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnsController } from './columns_controller';
import type { Options } from './options';
import { PublicMethods } from './public_methods';

const setup = (config: Options = {}) => {
  const options = new OptionsControllerMock(config);
  const columnsController = new ColumnsController(options);

  // @ts-expect-error
  const gridCore = new (PublicMethods(class {
    protected columnsController = columnsController;
  }))();

  return {
    options,
    columnsController,
    gridCore,
  };
};

describe('PublicMethods', () => {
  describe('getVisibleColumns', () => {
    it('should return visible columns', () => {
      const { gridCore } = setup({
        columns: ['a', 'b', { dataField: 'c', visible: false }],
      });

      expect(gridCore.getVisibleColumns()).toMatchObject([
        { name: 'a' },
        { name: 'b' },
      ]);
    });
  });

  describe('addColumn', () => {
    // tested in columns_controller.test.ts
  });

  describe('getVisibleColumnIndex', () => {
    const { gridCore } = setup({
      columns: [{ dataField: 'a', visible: false }, 'b', 'c'],
    });

    it('should return visible index of visible column', () => {
      expect(gridCore.getVisibleColumnIndex('b')).toBe(0);
      expect(gridCore.getVisibleColumnIndex('c')).toBe(1);
    });

    it('should return -1 for non-visible colunm', () => {
      expect(gridCore.getVisibleColumnIndex('a')).toBe(-1);
    });
  });

  describe('deleteColumn', () => {
    // tested in columns_controller.test.ts
  });

  describe('columnOption', () => {
    // tested in columns_controller.test.ts
  });
});
