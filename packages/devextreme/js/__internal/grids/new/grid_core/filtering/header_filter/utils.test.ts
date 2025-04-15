import { describe, expect, it } from '@jest/globals';
import type { DataSourceLike } from '@js/data/data_source';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type {
  HeaderFilterColumnOptions,
  HeaderFilterRootOptions,
} from '@ts/grids/new/grid_core/filtering/header_filter/types';
import each from 'jest-each';

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
            values: ['A', 'B', 'C'],
          },
          result: {
            dataSource: { test: 'TEST_DS' } as DataSourceLike<unknown>,
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

    describe('getColumnName', () => {
      each`
      column                                          | expectedResult
      ${{ name: 'testName' }}                         | ${'testName'}
      ${{ dataField: 'testField' }}                   | ${'testField'}
      ${{ name: 'testName', dataFiled: 'testField' }} | ${'testName'}

`
        .it('should return column name or dataField', ({
          column,

          expectedResult,
        }) => {
          const result = utils.getColumnName(column);
          expect(result).toEqual(expectedResult);
        });

      it('should throw an exception if there are no name or dataField', () => {
        expect(() => utils.getColumnName({ } as Column)).toThrowError();
      });
    });

    describe('getFilterOperator', () => {
      each`
      values                                          | filterType      | expectedResult
      ${[1, 2, 3]}                                    | ${'include'}    | ${'anyof'}
      ${[]}                                           | ${'include'}    | ${'anyof'}
      ${[1, 2, 3]}                                    | ${'exclude'}    | ${'noneof'}
      ${[]}                                           | ${'exclude'}    | ${'noneof'}
      ${[1, 2, 3]}                                    | ${undefined}    | ${'anyof'}
      ${[]}                                           | ${undefined}    | ${'anyof'}
`
        .it('should return anyof or noneof for array values', ({
          values,
          filterType,

          expectedResult,
        }) => {
          const result = utils.getFilterOperator(values, filterType);
          expect(result).toEqual(expectedResult);
        });

      each`
    values                                  | filterType      | expectedResult
    ${1}                                    | ${'include'}    | ${'='}
    ${'test'}                               | ${'include'}    | ${'='}
    ${null}                                 | ${'include'}    | ${'='}
    ${1}                                    | ${'exclude'}    | ${'<>'}
    ${'test'}                               | ${'exclude'}    | ${'<>'}
    ${null}                                 | ${'exclude'}    | ${'<>'}
    ${1}                                    | ${undefined}    | ${'='}
    ${'test'}                               | ${undefined}    | ${'='}
    ${null}                                 | ${undefined}    | ${'='}
`
        .it('should return = or <> for plain values', ({
          values,
          filterType,

          expectedResult,
        }) => {
          const result = utils.getFilterOperator(values, filterType);
          expect(result).toEqual(expectedResult);
        });
    });

    const allowFilteringColumnConfig = {
      allowFiltering: true,
      allowHeaderFiltering: true,
    };

    describe('needCreateHeaderFilter', () => {
      each`
      column                                                      | expectedResult
      ${{ allowFiltering: true, allowHeaderFiltering: false }}    | ${false}
      ${{ allowFiltering: false, allowHeaderFiltering: true }}    | ${false}
      ${{ allowFiltering: false, allowHeaderFiltering: false }}   | ${false}

`
        .it('should return false if filtering is prohibited', ({
          column,

          expectedResult,
        }) => {
          const result = utils.needCreateHeaderFilter(column);
          expect(result).toEqual(expectedResult);
        });
      each`
      column                                                      | expectedResult
      ${{
        ...allowFilteringColumnConfig,
        headerFilter: { values: [] },
      }}                                                          | ${false}
      ${{
        ...allowFilteringColumnConfig,
        headerFilter: { values: [1, 2, 3] },
      }}                                                          | ${true}
      ${{
        ...allowFilteringColumnConfig,
        headerFilter: { values: null },
      }}                                                          | ${false}
      ${{
        ...allowFilteringColumnConfig,
        headerFilter: { values: 'test' },
      }}                                                          | ${true}
      ${{
        ...allowFilteringColumnConfig,
        headerFilter: { values: [null] },
      }}                                                          | ${true}
`
        .it('should check if there are selected values', ({
          column,

          expectedResult,
        }) => {
          const result = utils.needCreateHeaderFilter(column);
          expect(result).toEqual(expectedResult);
        });
    });

    describe('getComposedHeaderFilter', () => {
      it.each<{
        caseName: string;
        columns: unknown[];
        result: unknown;
      }>([
        {
          caseName: 'two columns have plain values',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            headerFilter: { values: 'test' },
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            headerFilter: { values: 'test2' },
          }] as unknown[],
          result: [['ID1', '=', 'test'], 'and', ['ID2', '=', 'test2']],
        },
        {
          caseName: 'one columns has plain value',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            headerFilter: { values: 'test' },
          }] as unknown[],
          result: [['ID1', '=', 'test']],
        },
        {
          caseName: 'two columns have array values',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            headerFilter: { values: [1, 2, 3] },
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            headerFilter: { values: ['test1', 'test2'] },
          }] as unknown[],
          result: [['ID1', 'anyof', [1, 2, 3]], 'and', ['ID2', 'anyof', ['test1', 'test2']]],
        },
        {
          caseName: 'it is prohibited to sort the first column',
          columns: [{
            dataField: 'ID1',
            headerFilter: { values: [1, 2, 3] },
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            headerFilter: { values: ['test1', 'test2'] },
          }] as unknown[],
          result: [['ID2', 'anyof', ['test1', 'test2']]],
        },
        {
          caseName: 'two columns have exclude filterType',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            headerFilter: { values: [1, 2, 3] },
            filterType: 'exclude',
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            headerFilter: { values: 'test1' },
            filterType: 'exclude',
          }] as unknown[],
          result: [['ID1', 'noneof', [1, 2, 3]], 'and', ['ID2', '<>', 'test1']],
        },
      ])('$caseName: should correctly calculate the header filter', ({ columns, result }) => {
        const headerFilter = utils.getComposedHeaderFilter(columns as Column[]);

        expect(headerFilter).toStrictEqual(result);
      });
    });
  });
});
