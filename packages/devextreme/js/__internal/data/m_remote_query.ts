/* eslint-disable @typescript-eslint/naming-convention */
import arrayQueryImpl from '@js/common/data/array_query';
import { errors, handleError } from '@js/common/data/errors';
import queryAdapters from '@js/common/data/query_adapters';
import { Deferred } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isFunction } from '@js/core/utils/type';

const remoteQueryImpl = function (url, queryOptions, tasks) {
  tasks = tasks || [];
  queryOptions = queryOptions || {};

  const createTask = function (name, args) {
    return { name, args };
  };

  const exec = function (executorTask) {
    // @ts-expect-error
    const d = new Deferred();
    let _adapterFactory;
    let _adapter;
    let _taskQueue;
    let _currentTask;
    let _mergedSortArgs;

    const rejectWithNotify = function (error) {
      const handler = queryOptions.errorHandler;
      if (handler) {
        handler(error);
      }

      handleError(error);
      d.reject(error);
    };

    function mergeSortTask(task) {
      // eslint-disable-next-line default-case
      switch (task.name) {
        case 'sortBy':
          _mergedSortArgs = [task.args];
          return true;

        case 'thenBy':
          if (!_mergedSortArgs) {
            throw errors.Error('E4004');
          }

          _mergedSortArgs.push(task.args);
          return true;
      }

      return false;
    }

    function unmergeSortTasks() {
      const head = _taskQueue[0];
      const unmergedTasks = [];

      if (head && head.name === 'multiSort') {
        _taskQueue.shift();
        each(head.args[0], function () {
          // @ts-expect-error
          unmergedTasks.push(createTask(unmergedTasks.length ? 'thenBy' : 'sortBy', this));
        });
      }

      _taskQueue = unmergedTasks.concat(_taskQueue);
    }

    try {
      _adapterFactory = queryOptions.adapter;
      if (!isFunction(_adapterFactory)) {
        _adapterFactory = queryAdapters[_adapterFactory];
      }

      _adapter = _adapterFactory(queryOptions);

      _taskQueue = [].concat(tasks).concat(executorTask);

      const { optimize } = _adapter;
      if (optimize) optimize(_taskQueue);

      while (_taskQueue.length) {
        /* eslint-disable-next-line prefer-destructuring */
        _currentTask = _taskQueue[0];

        if (!mergeSortTask(_currentTask)) {
          if (_mergedSortArgs) {
            _taskQueue.unshift(createTask('multiSort', [_mergedSortArgs]));
            _mergedSortArgs = null;
            continue;
          }

          if (String(_currentTask.name) !== 'enumerate') {
            if (!_adapter[_currentTask.name] || _adapter[_currentTask.name].apply(_adapter, _currentTask.args) === false) {
              break;
            }
          }
        }
        _taskQueue.shift();
      }

      unmergeSortTasks();

      _adapter.exec(url)
        .done((result, extra) => {
          if (!_taskQueue.length) {
            d.resolve(result, extra);
          } else {
            let clientChain = arrayQueryImpl(result, {
              errorHandler: queryOptions.errorHandler,
            });
            each(_taskQueue, function () {
              clientChain = clientChain[this.name].apply(clientChain, this.args);
            });
            clientChain
              // @ts-expect-error
              .done(d.resolve)
              .fail(d.reject);
          }
        })
        .fail(rejectWithNotify);
    } catch (x) {
      rejectWithNotify(x);
    }

    return d.promise();
  };

  const query = {};

  each(
    ['sortBy', 'thenBy', 'filter', 'slice', 'select', 'groupBy'],
    function () {
      const name = String(this);
      query[name] = function () {
        return remoteQueryImpl(url, queryOptions, tasks.concat(createTask(name, arguments)));
      };
    },
  );

  each(
    ['count', 'min', 'max', 'sum', 'avg', 'aggregate', 'enumerate'],
    function () {
      const name = String(this);
      query[name] = function () {
        return exec.call(this, createTask(name, arguments));
      };
    },
  );

  return query;
};

export default remoteQueryImpl;
