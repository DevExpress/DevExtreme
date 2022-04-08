import {
  createValue, createGetter, createSelector,
} from '../../../utils/plugin/context';

import type {
  ColumnInternal, KeyExprInternal, RowData, Row, DataState,
} from './types';
import type { LoadOptions } from '../../../../data';

export const LocalData = createValue<RowData[] | undefined>();
export const LocalVisibleItems = createGetter<RowData[] | undefined>([]);
export const VisibleRows = createGetter<Row[]>([]);
export const RemoteOperations = createValue<boolean>();

export const LoadOptionsValue = createGetter<LoadOptions>({});
export const DataStateValue = createValue<DataState>();

export const Columns = createValue<ColumnInternal[]>();
export const VisibleColumns = createGetter<ColumnInternal[]>([]);
export const LocalDataState = createGetter<DataState | undefined>(undefined);

export const KeyExprPlugin = createValue<KeyExprInternal>();
export const TotalCount = createSelector<number>(
  [DataStateValue],
  (dataState: DataState) => dataState.totalCount ?? dataState.data.length,
);

export const VisibleDataRows = createSelector<Row[]>(
  [
    DataStateValue, KeyExprPlugin,
  ],
  (
    dataStateValue: DataState, keyExpr: KeyExprInternal,
  ): Row[] => dataStateValue.data.map((data) => ({
    key: keyExpr ? data[keyExpr] : data,
    data,
    rowType: 'data',
  })),
);

export const CalculateLocalDataState = createSelector(
  [LocalVisibleItems, LocalData],
  (visibleItems, localData): DataState | undefined => (Array.isArray(localData) ? {
    data: visibleItems ?? [],
    totalCount: localData.length,
  } : undefined),
);
