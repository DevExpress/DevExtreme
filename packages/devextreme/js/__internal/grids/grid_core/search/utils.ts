import type { LangParams } from '@js/common/data';
import dataQuery from '@js/common/data/query';
import { compileGetter } from '@js/core/utils/data';

import type { Column } from '../columns_controller/types';
import type { RawItemData } from '../data_source_adapter/types';
import type { DataFilter } from '../filter/types';
import { combineFilters } from '../filter/utils';

export const allowSearch = (
  column: Column,
): boolean => !!(column.allowSearch ?? column.allowFiltering);

export const parseValue = (column: Column, text: string): unknown => {
  const { lookup } = column;

  if (!column.parseValue) {
    return text;
  }

  if (lookup) {
    return column.parseValue.call(lookup, text);
  }

  return column.parseValue(text);
};

export const createLookupFilterExpressions = (
  items: RawItemData[],
  column: Column,
): DataFilter[] => {
  const { lookup, createFilterExpression } = column;

  if (!createFilterExpression) {
    return [];
  }

  const valueGetter = compileGetter(lookup?.valueExpr ?? '') as (data: unknown) => unknown;

  return items.map((item): DataFilter => {
    const value = valueGetter(item);

    return createFilterExpression.call(column, value, null, 'search');
  });
};

const createLookupSearchExpressions = (
  column: Column,
  filterValue: unknown,
  langParams: LangParams | undefined,
): DataFilter[] => {
  const { lookup, createFilterExpression, calculateFilterExpression } = column;
  const filters: DataFilter[] = [];

  dataQuery(lookup?.items ?? [], { langParams })
    .filter(
      createFilterExpression?.call(
        {
          dataField: lookup?.displayExpr,
          dataType: lookup?.dataType,
          calculateFilterExpression,
        },
        filterValue,
        null,
        'search',
      ),
    )
    .enumerate()
    .done((items: unknown) => {
      filters.push(...createLookupFilterExpressions(items as RawItemData[], column));
    });

  return filters;
};

const createColumnSearchExpressions = (
  column: Column,
  text: string,
  langParams: LangParams | undefined,
): DataFilter[] => {
  const { createFilterExpression, calculateFilterExpression, lookup } = column;

  if (!allowSearch(column) || !calculateFilterExpression || !createFilterExpression) {
    return [];
  }

  const filterValue = parseValue(column, text);

  if (lookup?.items) {
    return createLookupSearchExpressions(column, filterValue, langParams);
  }

  return filterValue === undefined
    ? []
    : [createFilterExpression.call(column, filterValue, null, 'search')];
};

export const createSearchExpression = (
  columns: Column[],
  text: string | undefined,
  langParams: LangParams | undefined,
): DataFilter => {
  if (!text) {
    return null;
  }

  const filters = columns.flatMap(
    (column) => createColumnSearchExpressions(column, text, langParams),
  );

  if (filters.length === 0) {
    return ['!'];
  }

  return combineFilters(filters, 'or');
};
