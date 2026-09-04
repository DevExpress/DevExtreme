import arrayQueryImpl from '@js/common/data/array_query';
import { errors, handleError } from '@js/common/data/errors';
import queryAdapters from '@js/common/data/query_adapters';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isFunction } from '@js/core/utils/type';
import type { ArrayQuery, LangParams } from '@ts/data/array_query';

export interface RemoteTask {
  name: string;
  args: unknown[];
}

export interface QueryAdapter {
  [taskName: string]: unknown;
  optimize?: (tasks: RemoteTask[]) => void;
  exec: (url: string) => DeferredObj<unknown>;
}

export interface RemoteQueryOptions {
  adapter?: string | ((options: RemoteQueryOptions) => QueryAdapter);
  errorHandler?: (error: unknown) => void;
  langParams?: LangParams;
  version?: number;
  expand?: string | string[] | Function;
  fieldTypes?: Record<string, string>;
  filterToLower?: boolean;
  requireTotalCount?: boolean;
  params?: Record<string, unknown>;
  beforeSend?: Function;
  jsonp?: boolean;
  withCredentials?: boolean;
  processDatesAsUtc?: boolean;
  deserializeDates?: boolean;
}

export interface RemoteQuery {
  sortBy: (...args: unknown[]) => RemoteQuery;
  thenBy: (...args: unknown[]) => RemoteQuery;
  filter: (...args: unknown[]) => RemoteQuery;
  slice: (...args: unknown[]) => RemoteQuery;
  select: (...args: unknown[]) => RemoteQuery;
  groupBy: (...args: unknown[]) => RemoteQuery;
  count: (...args: unknown[]) => DeferredObj<unknown>;
  min: (...args: unknown[]) => DeferredObj<unknown>;
  max: (...args: unknown[]) => DeferredObj<unknown>;
  sum: (...args: unknown[]) => DeferredObj<unknown>;
  avg: (...args: unknown[]) => DeferredObj<unknown>;
  aggregate: (...args: unknown[]) => DeferredObj<unknown>;
  enumerate: (...args: unknown[]) => DeferredObj<unknown>;
}

const createTask = function (name: string, args: unknown[]): RemoteTask {
  return { name, args };
};

const remoteQueryImpl = function (
  url: string,
  options?: RemoteQueryOptions,
  previousTasks?: RemoteTask[],
): RemoteQuery {
  const tasks: RemoteTask[] = previousTasks ?? [];
  const queryOptions: RemoteQueryOptions = options ?? {};

  const exec = function (executorTask: RemoteTask): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let mergedSortArgs: unknown[][] | undefined;

    const rejectWithNotify = function (error: unknown): void {
      const handler = queryOptions.errorHandler;
      if (handler) {
        handler(error);
      }

      handleError(error);
      d.reject(error);
    };

    function mergeSortTask(task: RemoteTask): boolean {
      switch (task.name) {
        case 'sortBy':
          mergedSortArgs = [task.args];
          return true;

        case 'thenBy':
          if (!mergedSortArgs) {
            throw errors.Error('E4004');
          }

          mergedSortArgs.push(task.args);
          return true;

        default:
          return false;
      }
    }

    function unmergeSortTasks(queue: RemoteTask[]): RemoteTask[] {
      const head = queue[0];
      const unmergedTasks: RemoteTask[] = [];

      if (head?.name === 'multiSort') {
        queue.shift();
        const [sortArgsList] = head.args;
        if (Array.isArray(sortArgsList)) {
          sortArgsList.forEach((sortArgs: unknown) => {
            unmergedTasks.push(createTask(
              unmergedTasks.length ? 'thenBy' : 'sortBy',
              Array.isArray(sortArgs) ? sortArgs : [sortArgs],
            ));
          });
        }
      }

      return unmergedTasks.concat(queue);
    }

    function passTaskToAdapter(adapter: QueryAdapter, task: RemoteTask): boolean {
      if (String(task.name) === 'enumerate') {
        return true;
      }

      const taskHandler = adapter[task.name];

      return isFunction(taskHandler) && taskHandler.apply(adapter, task.args) !== false;
    }

    function collectAdapterTasks(adapter: QueryAdapter, queue: RemoteTask[]): void {
      while (queue.length) {
        const currentTask = queue[0];

        if (!mergeSortTask(currentTask)) {
          if (mergedSortArgs) {
            queue.unshift(createTask('multiSort', [mergedSortArgs]));
            mergedSortArgs = undefined;
            // eslint-disable-next-line no-continue
            continue;
          }

          if (!passTaskToAdapter(adapter, currentTask)) {
            break;
          }
        }
        queue.shift();
      }
    }

    try {
      const adapterFactory = isFunction(queryOptions.adapter)
        ? queryOptions.adapter
        : queryAdapters[String(queryOptions.adapter)];

      const adapter: QueryAdapter = adapterFactory(queryOptions);

      let taskQueue: RemoteTask[] = [...tasks, executorTask];

      const { optimize } = adapter;
      if (optimize) optimize(taskQueue);

      collectAdapterTasks(adapter, taskQueue);

      taskQueue = unmergeSortTasks(taskQueue);

      adapter.exec(url)
        .done((result: unknown, extra: unknown) => {
          if (!taskQueue.length) {
            d.resolve(result, extra);
          } else {
            // @ts-expect-error the adapter resolves with whatever the service returned
            let clientChain: ArrayQuery = arrayQueryImpl(result, {
              errorHandler: queryOptions.errorHandler,
            });
            taskQueue.forEach((task) => {
              const method = clientChain[task.name];
              if (isFunction(method)) {
                clientChain = method.apply(clientChain, task.args);
              }
            });
            // @ts-expect-error the queue always ends with `enumerate`, so
            // the chain ends with a Deferred rather than with a query
            clientChain.done(d.resolve).fail(d.reject);
          }
        })
        .fail(rejectWithNotify);
    } catch (x) {
      rejectWithNotify(x);
    }

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  };

  const chain = (name: string, args: unknown[]): RemoteQuery => remoteQueryImpl(
    url,
    queryOptions,
    tasks.concat(createTask(name, args)),
  );

  return {
    sortBy: (...args: unknown[]): RemoteQuery => chain('sortBy', args),
    thenBy: (...args: unknown[]): RemoteQuery => chain('thenBy', args),
    filter: (...args: unknown[]): RemoteQuery => chain('filter', args),
    slice: (...args: unknown[]): RemoteQuery => chain('slice', args),
    select: (...args: unknown[]): RemoteQuery => chain('select', args),
    groupBy: (...args: unknown[]): RemoteQuery => chain('groupBy', args),

    count: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('count', args)),
    min: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('min', args)),
    max: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('max', args)),
    sum: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('sum', args)),
    avg: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('avg', args)),
    aggregate: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('aggregate', args)),
    enumerate: (...args: unknown[]): DeferredObj<unknown> => exec(createTask('enumerate', args)),
  };
};

export default remoteQueryImpl;
