import { describe, expect, it } from '@jest/globals';
import type { SortOrder } from '@js/common';
import { I18N_MESSAGE_SEPARATOR } from '@ts/grids/new/card_view/header_panel/a11y/const';

import {
  getCommonA11yLabel,
  getHeaderFilterA11yLabel, getHeaderItemA11yLabel,
  getSortIndexA11yLabel,
  getSortingA11yLabel,
} from './utils';

const I18N_EN = {
  getFieldName: (colName: string): string => `Field name ${colName}`,
  sortOrderAsc: 'Sorted in ascending order',
  sortOrderDesc: 'Sorted in descending order',
  getSortIdx: (idx?: number): string => `Sort index ${idx}`,
  withHeaderFilter: 'Header filter applied',
};

describe('HeaderPanel', () => {
  describe('a11y utils', () => {
    describe('getCommonA11yLabel', () => {
      it.each(['COL_A', 'COL_B'])('fieldName: %s -> should return i18n translation', (colName) => {
        const result = getCommonA11yLabel(colName);

        expect(result).toBe(I18N_EN.getFieldName(colName));
      });
    });

    describe('getHeaderFilterA11yLabel', () => {
      it.each<{
        hasFilterValues: boolean;
        expected: string | null;
      }>([
        { hasFilterValues: true, expected: I18N_EN.withHeaderFilter },
        { hasFilterValues: false, expected: null },
      ])('hasFilterValues: $hasFilterValues -> should return i18n translation', ({
        hasFilterValues, expected,
      }) => {
        const result = getHeaderFilterA11yLabel(hasFilterValues);

        expect(result).toBe(expected);
      });
    });

    describe('getSortingA11yLabel', () => {
      it.each<{
        sortOrder: SortOrder | undefined;
        expected: string | null;
      }>([
        {
          sortOrder: 'asc',
          expected: I18N_EN.sortOrderAsc,
        },
        {
          sortOrder: 'desc',
          expected: I18N_EN.sortOrderDesc,
        },
        {
          sortOrder: undefined,
          expected: null,
        },
      ])('sortOrder: $sortOrder -> should return i18n translation', ({ sortOrder, expected }) => {
        const result = getSortingA11yLabel(sortOrder);

        expect(result).toBe(expected);
      });
    });

    describe('getSortIndexA11yLabel', () => {
      it.each<{
        sortOrder: SortOrder | undefined;
        sortIndex: number | undefined;
        expected: string | null;
      }>([
        {
          sortOrder: 'asc',
          sortIndex: 0,
          expected: I18N_EN.getSortIdx(1),
        },
        {
          sortOrder: 'desc',
          sortIndex: 99,
          expected: I18N_EN.getSortIdx(100),
        },
        {
          sortOrder: undefined,
          sortIndex: 5,
          expected: null,
        },
      ])('sortOrder: $sortOrder | sortIndex: $sortIndex -> should return i18n translation', ({
        sortOrder, sortIndex, expected,
      }) => {
        const result = getSortIndexA11yLabel(sortOrder, sortIndex);

        expect(result).toBe(expected);
      });
    });

    describe('getHeaderItemA11yLabel', () => {
      it.each<{
        colName: string;
        hasFilterValues: boolean;
        sortOrder: SortOrder | undefined;
        sortIndex: number | undefined;
        expected: string | null;
      }>([
        {
          colName: 'TEST #0',
          hasFilterValues: true,
          sortOrder: 'asc',
          sortIndex: 9,
          expected: [
            I18N_EN.getFieldName('TEST #0'),
            I18N_EN.withHeaderFilter,
            I18N_EN.sortOrderAsc,
            I18N_EN.getSortIdx(10),
          ].join(I18N_MESSAGE_SEPARATOR),
        },
        {
          colName: 'TEST #1',
          hasFilterValues: false,
          sortOrder: undefined,
          sortIndex: 9,
          expected: [
            I18N_EN.getFieldName('TEST #1'),
          ].join(I18N_MESSAGE_SEPARATOR),
        },
        {
          colName: 'TEST #2',
          hasFilterValues: false,
          sortOrder: 'desc',
          sortIndex: 1,
          expected: [
            I18N_EN.getFieldName('TEST #2'),
            I18N_EN.sortOrderDesc,
            I18N_EN.getSortIdx(2),
          ].join(I18N_MESSAGE_SEPARATOR),
        },
        {
          colName: 'TEST #3',
          hasFilterValues: true,
          sortOrder: undefined,
          sortIndex: undefined,
          expected: [
            I18N_EN.getFieldName('TEST #3'),
            I18N_EN.withHeaderFilter,
          ].join(I18N_MESSAGE_SEPARATOR),
        },
        {
          colName: 'TEST #4',
          hasFilterValues: false,
          sortOrder: 'desc',
          sortIndex: undefined,
          expected: [
            I18N_EN.getFieldName('TEST #4'),
            I18N_EN.sortOrderDesc,
          ].join(I18N_MESSAGE_SEPARATOR),
        },
      ])('colName: $colName '
        + '| hasFilterValues: $hasFilterValues '
        + '| sortOrder: $sortOrder'
        + '| sortIndex: $sortIndex'
        + '-> should return i18n translation', ({
        colName,
        hasFilterValues,
        sortOrder,
        sortIndex,
        expected,
      }) => {
        const result = getHeaderItemA11yLabel(colName, {
          hasHeaderFilterValue: hasFilterValues,
          sortOrder,
          sortIndex,
        });

        expect(result).toBe(expected);
      });
    });
  });
});
