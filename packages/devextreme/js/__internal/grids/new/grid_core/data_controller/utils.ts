/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';
import { normalizeDataSourceOptions } from '@js/data/data_source/utils';
import { applyBatch } from '@ts/data/m_array_utils';

import type { DataObject } from './types';

export function normalizeDataSource(
  dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined,
  keyExpr: string | string[] | undefined,
): DataSource<unknown, unknown> {
  if (dataSourceLike instanceof DataSource) {
    return dataSourceLike;
  }

  if (Array.isArray(dataSourceLike)) {
    // eslint-disable-next-line no-param-reassign
    dataSourceLike = {
      store: {
        type: 'array',
        data: dataSourceLike,
        key: keyExpr,
      },
    };
  }

  // TODO: research making second param not required
  return new DataSource(normalizeDataSourceOptions(dataSourceLike, undefined));
}

export function updateItemsImmutable(
  data: DataObject[],
  changes: any[],
  keyInfo: any,
): DataObject[] {
  // @ts-expect-error
  return applyBatch({
    keyInfo,
    data,
    changes,
    immutable: true,
  });
}
