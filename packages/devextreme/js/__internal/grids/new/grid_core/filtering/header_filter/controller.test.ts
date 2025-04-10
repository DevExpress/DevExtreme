/* eslint-disable spellcheck/spell-checker, no-spaced-func */
import { describe, expect, it } from '@jest/globals';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { HeaderFilterController } from '@ts/grids/new/grid_core/filtering/header_filter/controller';
import type { HeaderFilterColumnOptions } from '@ts/grids/new/grid_core/filtering/header_filter/types';

import { getContext } from '../../di.test_utils';

const setup = (options = {}) => {
  const context = getContext(options);

  return {
    headerFilterController: context.get(HeaderFilterController),
    columnsController: context.get(ColumnsController),
  };
};

describe('HeaderFilter', () => {
  describe('Controller', () => {
    describe('openPopup', () => {
      it('should pass element as is to popupState$', () => {
        const mockElement = {} as Element;
        const { headerFilterController } = setup();
        headerFilterController.openPopup(mockElement, {} as Column);

        const result = headerFilterController.popupState$.unreactive_get();
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
        const { headerFilterController } = setup();
        headerFilterController.openPopup({} as Element, { dataType } as Column);

        const state = headerFilterController.popupState$.unreactive_get();
        expect(state?.options?.type).toBe(result);
      });

      it('should pass headerFilter options', () => {
        const expectedFilterType = 'TEST_TYPE';
        const expectedFilterValues = ['VAL_0', 'VAL_1', 'VAL_2'];
        const expectedHeaderFilter = {
          allowSearch: true,
          testRandomField: 'A',
          filterType: expectedFilterType as any,
          values: expectedFilterValues,
        } as HeaderFilterColumnOptions;

        const { headerFilterController } = setup();
        headerFilterController.openPopup(
          {} as Element,
          { headerFilter: expectedHeaderFilter } as Column,
        );

        const state = headerFilterController.popupState$.unreactive_get();
        expect(state?.options?.headerFilter).toStrictEqual(expectedHeaderFilter);
        expect(state?.options?.filterType).toEqual(expectedFilterType);
        expect(state?.options?.filterValues).toEqual(expectedFilterValues);
      });

      it('should apply headerFilter to column options by callback call', () => {
        const expectedFilterType = 'TEST_TYPE';
        const expectedFilterValues = ['VAL_0', 'VAL_1', 'VAL_2'];
        const expectedHeaderFilter = {
          filterType: expectedFilterType as any,
          values: expectedFilterValues,
        } as HeaderFilterColumnOptions;

        const { headerFilterController, columnsController } = setup({
          headerFilter: { visible: true },
          columns: [{ name: 'A' }],
        });

        headerFilterController.openPopup(
          {} as Element,
          { name: 'A' } as Column,
        );

        const state = headerFilterController.popupState$.unreactive_get();
        state?.options?.apply?.call({
          filterType: expectedFilterType,
          filterValues: expectedFilterValues,
        });

        const updatedColumn = columnsController.columns.unreactive_get()[0];

        expect(updatedColumn?.headerFilter)
          .toMatchObject(expectedHeaderFilter as Record<string, unknown>);
      });

      it('should save passed headerFilter values during update by callback call', () => {
        const expectedFilterType = 'TEST_TYPE';
        const expectedFilterValues = ['VAL_0', 'VAL_1', 'VAL_2'];
        const expectedSearch = {
          enabled: true,
          editorOptions: { testOpt: 'TEST_OPT' },
        };
        const expectedHeaderFilter = {
          search: expectedSearch,
          filterType: expectedFilterType as any,
          values: expectedFilterValues,
        } as HeaderFilterColumnOptions;

        const { headerFilterController, columnsController } = setup({
          headerFilter: { visible: true },
          columns: [{ name: 'A' }],
        });

        headerFilterController.openPopup(
          {} as Element,
          { name: 'A', headerFilter: { search: expectedSearch } } as unknown as Column,
        );

        const state = headerFilterController.popupState$.unreactive_get();
        state?.options?.apply?.call({
          filterType: expectedFilterType,
          filterValues: expectedFilterValues,
        });

        const updatedColumn = columnsController.columns.unreactive_get()[0];

        expect(updatedColumn?.headerFilter)
          .toMatchObject(expectedHeaderFilter as Record<string, unknown>);
      });

      it('should clear popupState$ on hide popup callback', () => {
        const { headerFilterController } = setup({
          headerFilter: { visible: true },
          columns: [{ name: 'A' }],
        });

        headerFilterController.openPopup(
          {} as Element,
          { name: 'A' } as Column,
        );

        const state = headerFilterController.popupState$.unreactive_get();
        expect(state !== null).toBeTruthy();

        state?.options?.hidePopupCallback?.();

        const stateAfterClose = headerFilterController.popupState$.unreactive_get();
        expect(stateAfterClose === null).toBeTruthy();
      });
    });

    describe('openPopup - get dataSource legacy', () => {
      it('dataSource options should contain load and postProcess functions', () => {
        const { headerFilterController } = setup({
          headerFilter: { visible: true },
          columns: [{ name: 'A' }],
        });

        headerFilterController.openPopup(
          {} as Element,
          { name: 'A' } as Column,
        );

        const state = headerFilterController.popupState$.unreactive_get();

        expect(typeof state?.options.dataSource.load).toBe('function');
        expect(typeof state?.options.dataSource.postProcess).toBe('function');
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
            const { headerFilterController } = setup({
              headerFilter: { visible: true },
              columns: [column as any],
            });

            headerFilterController.openPopup(
              {} as Element,
              column,
            );

            const state = headerFilterController.popupState$.unreactive_get();

            expect(state?.options.dataSource.group).toBeTruthy();
            expect(checkFn(state?.options.dataSource.group)).toBeTruthy();
          });
    });
  });
});
