import { describe, expect, it } from '@jest/globals';
import type { DataSourceLike } from '@js/data/data_source';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type {
  HeaderFilterRootOptions,
} from '@ts/grids/new/grid_core/filtering/header_filter/types';
import each from 'jest-each';

import type { ColumnSettings } from '../../columns_controller/options';
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
        col: ColumnSettings;
        result: ColumnSettings;
      }>([
        {
          caseName: 'not take uniq properties from root',
          root: { visible: true, texts: {} },
          col: {},
          result: { headerFilter: { search: {} } },
        },
        {
          caseName: 'take uniq properties from column',
          root: {},
          col: {
            headerFilter: {
              dataSource: { test: 'TEST_DS' } as DataSourceLike<unknown>,
            },
            filterValues: ['A', 'B', 'C'],
          },
          result: {
            headerFilter: {
              dataSource: { test: 'TEST_DS' } as DataSourceLike<unknown>,
              search: {},
            },
            filterValues: ['A', 'B', 'C'],
          },
        },
        {
          caseName: 'apply root if columns not specified',
          root: {
            allowSelectAll: true, width: 150, height: 150,
          },
          col: {},
          result: {
            headerFilter: {
              allowSelectAll: true, width: 150, height: 150, search: {},
            },
          },
        },
        {
          caseName: 'override root if columns specified',
          root: {
            allowSelectAll: true, width: 150, height: 150,
          },
          col: {
            headerFilter: {
              allowSelectAll: false, width: 200, height: 200,
            },
          },
          result: {
            headerFilter: {
              allowSelectAll: false, width: 200, height: 200, search: {},
            },
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
            headerFilter: {
              search: {
                enabled: true, editorOptions: { optA: 'A' }, mode: 'equals', timeout: 999,
              },
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
            headerFilter: {
              search: {
                enabled: false, editorOptions: { optA: 'B' }, mode: 'contains', timeout: 100,
              },
            },
          },
          result: {
            headerFilter: {
              search: {
                enabled: false, editorOptions: { optA: 'B' }, mode: 'contains', timeout: 100,
              },
            },
          },
        },
        {
          caseName: 'take uniq properties from columns search',
          root: {},
          col: {
            headerFilter: { search: { searchExpr: '123_TEST' } },
          },
          result: {
            headerFilter: { search: { searchExpr: '123_TEST' } },
          },
        },
      ])('$caseName: should correctly merge options', ({ root, col, result }) => {
        const mergedOptions = utils.mergeColumnHeaderFilterOptions(
          col as Column,
          root,
        );

        expect(mergedOptions).toMatchObject(result);
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
      column                                                                               | expectedResult
      ${{ allowFiltering: true, allowHeaderFiltering: false, filterValues: [1, 2, 3] }}    | ${true}
      ${{ allowFiltering: false, allowHeaderFiltering: true, filterValues: [1, 2, 3] }}    | ${true}
      ${{ allowFiltering: false, allowHeaderFiltering: false, filterValues: [1, 2, 3] }}   | ${false}

`
        .it('should take into account allowFiltering and allowHeaderFiltering', ({
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
        filterValues: [],
      }}                                                          | ${false}
      ${{
        ...allowFilteringColumnConfig,
        filterValues: [1, 2, 3],
      }}                                                          | ${true}
      ${{
        ...allowFilteringColumnConfig,
        filterValues: null,
      }}                                                          | ${false}
      ${{
        ...allowFilteringColumnConfig,
        filterValues: 'test',
      }}                                                          | ${true}
      ${{
        ...allowFilteringColumnConfig,
        filterValues: [null],
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
            filterValues: 'test',
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            filterValues: 'test2',
          }] as unknown[],
          result: [['ID1', '=', 'test'], 'and', ['ID2', '=', 'test2']],
        },
        {
          caseName: 'one columns has plain value',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: 'test',
          }] as unknown[],
          result: [['ID1', '=', 'test']],
        },
        {
          caseName: 'two columns have array values',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: [1, 2, 3],
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            filterValues: ['test1', 'test2'],
          }] as unknown[],
          result: [['ID1', 'anyof', [1, 2, 3]], 'and', ['ID2', 'anyof', ['test1', 'test2']]],
        },
        {
          caseName: 'two columns have array values, one of them contain 1 item',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: [1],
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            filterValues: ['test1', 'test2'],
          }] as unknown[],
          result: [['ID1', '=', 1], 'and', ['ID2', 'anyof', ['test1', 'test2']]],
        },
        {
          caseName: 'it is prohibited to sort the first column',
          columns: [{
            dataField: 'ID1',
            filterValues: [1, 2, 3],
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            filterValues: ['test1', 'test2'],
          }] as unknown[],
          result: [['ID2', 'anyof', ['test1', 'test2']]],
        },
        {
          caseName: 'two columns have exclude filterType',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: [1, 2, 3],
            filterType: 'exclude',
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            filterValues: 'test1',
            filterType: 'exclude',
          }] as unknown[],
          result: [['ID1', 'noneof', [1, 2, 3]], 'and', ['ID2', '<>', 'test1']],
        },
        {
          caseName: 'one column has an array of filter expressions',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: [['ID1', '>', 5], ['ID1', '<', 10]],
          }] as unknown[],
          result: [[['ID1', '>', 5], 'or', ['ID1', '<', 10]]],
        },
        {
          caseName: 'one column has an array of plain value and filter expressions',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: [5, ['ID1', '=', 10]],
          }] as unknown[],
          result: [[['ID1', '=', 5], 'or', ['ID1', '=', 10]]],
        },
        {
          caseName: 'two column have an array of filter expressions',
          columns: [{
            ...allowFilteringColumnConfig,
            dataField: 'ID1',
            filterValues: [['ID1', '>', 5], ['ID1', '<', 10]],
          }, {
            ...allowFilteringColumnConfig,
            dataField: 'ID2',
            filterValues: [['ID2', '>', 6], ['ID2', '<', 9]],
          }] as unknown[],
          result: [[['ID1', '>', 5], 'or', ['ID1', '<', 10]], 'and', [['ID2', '>', 6], 'or', ['ID2', '<', 9]]],
        },
      ])('$caseName: should correctly calculate the header filter', ({ columns, result }) => {
        const headerFilterInfoArray = utils.getHeaderFilterInfoArray(columns as Column[]);
        const headerFilter = utils.getComposedHeaderFilter(headerFilterInfoArray);

        expect(headerFilter).toStrictEqual(result);
      });
    });
  });
});
