import { queryImpl } from '@js/common/data/query_implementation';
import type { ArrayQuery, QueryOptions } from '@ts/data/array_query';
import type { RemoteQuery, RemoteQueryOptions } from '@ts/data/remote_query';

function query(array: unknown[], queryOptions?: QueryOptions): ArrayQuery;
function query(url: string, queryOptions?: RemoteQueryOptions): RemoteQuery;
function query(
  source: unknown[] | string,
  queryOptions?: QueryOptions & RemoteQueryOptions,
): ArrayQuery | RemoteQuery {
  return Array.isArray(source)
    ? queryImpl.array(source, queryOptions)
    : queryImpl.remote(source, queryOptions);
}

export default query;
