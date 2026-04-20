/* eslint-disable no-spaced-func */
import { describe, expect, it } from '@jest/globals';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { HeaderFilterColumnOptions } from '@ts/grids/new/grid_core/filtering/header_filter/types';

import { getContext } from '../../di.test_utils';
import { HeaderFilterViewController } from './view_controller';

const setup = (options = {}) => {
  const context = getContext(options);

  return {
    viewController: context.get(HeaderFilterViewController),
    columnsController: context.get(ColumnsController),
  };
};

describe('HeaderFilter', () => {
  describe('ViewController', () => {
    describe('openPopup', () => {
      it('should pass element as is to popupState', () => {
        const mockElement = {} as Element;
        const { viewController } = setup();
        viewController.openPopup(mockElement, {} as Column);

        const result = viewController.popupState.peek();
        expect(result?.element).toBe(mockElement);
      });

      it.each<{
        dataType: Column['dataType']; result: 'tree' | 'list';
      }>([
        { dataType: 'string', result: 'list' },
        { dataType: 'number', result: 'list' },
        { dataType: 'boolean', result: 'list' },
        { dataType: 'date', result: 'tree' },
        { dataType: 'datetime', result: 'tree' },
      ])('options.type in state with columns dataType "$dataType" -> "$result"', ({ dataType, result }) => {
        const { viewController } = setup();
        viewController.openPopup({} as Element, { dataType } as Column);

        const state = viewController.popupState.peek();
        expect(state?.options?.type).toBe(result);
      });

      it('should pass headerFilter options', () => {
        const expectedFilterValues = ['VAL_0', 'VAL_1', 'VAL_2'];
        const expectedHeaderFilter = {
          allowSearch: true,
          testRandomField: 'A',
        } as HeaderFilterColumnOptions;

        const { viewController } = setup();
        viewController.openPopup(
          {} as Element,
          { headerFilter: expectedHeaderFilter, filterValues: expectedFilterValues } as Column,
        );

        const state = viewController.popupState.peek();
        expect(state?.options?.headerFilter).toStrictEqual(expectedHeaderFilter);
        expect(state?.options?.filterValues).toEqual(expectedFilterValues);
      });

      it('should apply headerFilter to column options by callback call', () => {
        const expectedFilterValues = ['VAL_0', 'VAL_1', 'VAL_2'];

        const { viewController, columnsController } = setup({
          headerFilter: { visible: true },
          columns: [{ dataField: 'A', name: 'A' }],
        });

        viewController.openPopup(
          {} as Element,
          { dataField: 'A', name: 'A' } as Column,
        );

        const state = viewController.popupState.peek();
        state?.options?.apply?.call({
          filterValues: expectedFilterValues,
        });

        const updatedColumn = columnsController.columns.peek()[0];

        expect(updatedColumn?.filterValues)
          .toMatchObject(expectedFilterValues as unknown as Record<string, unknown>);
      });

      it('should save passed headerFilter values during update by callback call', () => {
        const expectedFilterValues = ['VAL_0', 'VAL_1', 'VAL_2'];
        const expectedSearch = {
          enabled: true,
          editorOptions: { testOpt: 'TEST_OPT' },
        };
        const expectedHeaderFilter = {
          search: expectedSearch,
          values: expectedFilterValues,
        } as HeaderFilterColumnOptions;

        const { viewController, columnsController } = setup({
          headerFilter: {
            ...expectedHeaderFilter,
          },
          filterValues: 'test',
          columns: [{ dataField: 'A' }],
        });

        viewController.openPopup(
          {} as Element,
          { dataField: 'A', name: 'A', headerFilter: { search: expectedSearch } } as unknown as Column,
        );

        const state = viewController.popupState.peek();
        state?.options?.apply?.call({
          filterValues: expectedFilterValues,
        });

        const updatedColumn = columnsController.columns.peek()[0];

        expect(updatedColumn?.headerFilter)
          .toMatchObject(expectedHeaderFilter as Record<string, unknown>);
      });

      it('should clear popupState on hide popup callback', () => {
        const { viewController } = setup({
          headerFilter: { visible: true },
          columns: [{ name: 'A' }],
        });

        viewController.openPopup(
          {} as Element,
          { name: 'A' } as Column,
        );

        const state = viewController.popupState.peek();
        expect(state !== null).toBeTruthy();

        state?.options?.hidePopupCallback?.();

        const stateAfterClose = viewController.popupState.peek();
        expect(stateAfterClose === null).toBeTruthy();
      });
    });

    describe('openPopup - get dataSource legacy', () => {
      it('dataSource options should contain load and postProcess functions', () => {
        const { viewController } = setup({
          headerFilter: { visible: true },
          columns: [{ name: 'A' }],
        });

        viewController.openPopup(
          {} as Element,
          { name: 'A' } as Column,
        );

        const state = viewController.popupState.peek();

        expect(typeof (state?.options.dataSource as any).load).toBe('function');
        expect(typeof (state?.options.dataSource as any).postProcess).toBe('function');
      });

      // NOTE: Unfortunately, we cannot test perfectly local group functions here
      // Because these functions are local and too deep in the old grid_core
      it.each<{
        caseName: string;
        column: Column;
        checkFn: (group: any) => boolean;
      }>([
        {
          caseName: 'default',
          column: { dataField: 'A' } as Column,
          checkFn: (group): boolean => typeof group === 'function',
        },
        {
          caseName: 'groupInterval',
          column: { dataField: 'A', headerFilter: { groupInterval: 2 } } as Column,
          checkFn: ([group]): boolean => typeof group === 'function',
        },
        {
          caseName: 'sortingMethod',
          column: { dataField: 'A', sortingMethod: () => {} } as unknown as Column,
          checkFn: ([{ selector, compare }]): boolean => typeof selector === 'function' && typeof compare === 'function',
        },
      ])('$caseName: dataSource options should contains correct group', ({ column, checkFn }) => {
        const { viewController } = setup({
          headerFilter: { visible: true },
          columns: [column as any],
        });

        viewController.openPopup(
          {} as Element,
          column,
        );

        const state = viewController.popupState.peek();

        expect((state?.options.dataSource as any).group).toBeTruthy();
        expect(checkFn((state?.options.dataSource as any).group)).toBeTruthy();
      });
    });
  });
});
