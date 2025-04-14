import { describe, expect, it } from '@jest/globals';
import type { DataSourceLike } from '@js/data/data_source';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type {
  HeaderFilterColumnOptions,
  HeaderFilterRootOptions,
} from '@ts/grids/new/grid_core/filtering/header_filter/types';

import * as utils from './utils';

describe('HeaderFilter', () => {
  describe('Utils', () => {
    describe('mergeColumnHeaderFilterOptions', () => {
      it('should spread other column options as is', () => {
        const otherOptions = {
          optA: 'A',
          optB: 'B',
        };

        const mergedOptions = utils.mergeColumnHeaderFilterOptions(
          otherOptions as unknown as Column,
          {},
        );

        expect(mergedOptions).toMatchObject(otherOptions);
      });

      it.each<{
        rootVisible: boolean;
        columnAllowFiltering: boolean;
        result: boolean;
      }>([
        { rootVisible: false, columnAllowFiltering: false, result: false },
        { rootVisible: false, columnAllowFiltering: true, result: false },
        { rootVisible: true, columnAllowFiltering: false, result: false },
        { rootVisible: true, columnAllowFiltering: true, result: false },
      ])(
        'allowHeaderFiltering option (rootVisible: $rootVisible | columnAllowFiltering: $columnAllowFiltering)',
        ({ rootVisible, columnAllowFiltering, result }) => {
          const mergedOptions = utils.mergeColumnHeaderFilterOptions(
            {
              allowHeaderFiltering: columnAllowFiltering,
            } as Column,
            {
              visible: rootVisible,
            },
          );

          expect(mergedOptions.allowHeaderFiltering).toBe(result);
        },
      );

      it.each<{
        caseName: string;
        root: HeaderFilterRootOptions;
        col: HeaderFilterColumnOptions;
        result: HeaderFilterColumnOptions;
      }>([
        {
          caseName: 'not take uniq properties from root',
          root: { visible: true, texts: {} },
          col: {},
          result: { search: {} },
        },
        {
          caseName: 'take uniq properties from column',
          root: {},
          col: {
            dataSource: { test: 'TEST_DS' } as DataSourceLike<unknown>,
            filterType: 'exclude',
            values: ['A', 'B', 'C'],
          },
          result: {
            dataSource: { test: 'TEST_DS' } as DataSourceLike<unknown>,
            filterType: 'exclude',
            values: ['A', 'B', 'C'],
            search: {},
          },
        },
        {
          caseName: 'apply root if columns not specified',
          root: {
            allowSelectAll: true, width: 150, height: 150,
          },
          col: {},
          result: {
            allowSelectAll: true, width: 150, height: 150, search: {},
          },
        },
        {
          caseName: 'override root if columns specified',
          root: {
            allowSelectAll: true, width: 150, height: 150,
          },
          col: {
            allowSelectAll: false, width: 200, height: 200,
          },
          result: {
            allowSelectAll: false, width: 200, height: 200, search: {},
          },
        },
        {
          caseName: 'apply root search if columns not specified',
          root: {
            search: {
              enabled: true, editorOptions: { optA: 'A' }, mode: 'equals', timeout: 999,
            },
          },
          col: {},
          result: {
            search: {
              enabled: true, editorOptions: { optA: 'A' }, mode: 'equals', timeout: 999,
            },
          },
        },
        {
          caseName: 'override root search if columns specified',
          root: {
            search: {
              enabled: true, editorOptions: { optA: 'A' }, mode: 'equals', timeout: 999,
            },
          },
          col: {
            search: {
              enabled: false, editorOptions: { optA: 'B' }, mode: 'contains', timeout: 100,
            },
          },
          result: {
            search: {
              enabled: false, editorOptions: { optA: 'B' }, mode: 'contains', timeout: 100,
            },
          },
        },
        {
          caseName: 'take uniq properties from columns search',
          root: {},
          col: {
            search: { searchExpr: '123_TEST' },
          },
          result: {
            search: { searchExpr: '123_TEST' },
          },
        },
      ])('$caseName: should correctly merge options', ({ root, col, result }) => {
        const mergedOptions = utils.mergeColumnHeaderFilterOptions(
          { headerFilter: col } as Column,
          root,
        );

        expect(mergedOptions.headerFilter).toStrictEqual(result);
      });
    });
  });
});
