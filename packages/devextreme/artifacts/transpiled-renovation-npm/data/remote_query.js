"use strict";

exports.default = void 0;
var _query_adapters = _interopRequireDefault(require("./query_adapters"));
var _errors = require("./errors");
var _iterator = require("../core/utils/iterator");
var _type = require("../core/utils/type");
var _deferred = require("../core/utils/deferred");
var _array_query = _interopRequireDefault(require("./array_query"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const remoteQueryImpl = function (url, queryOptions, tasks) {
  tasks = tasks || [];
  queryOptions = queryOptions || {};
  const createTask = function (name, args) {
    return {
      name: name,
      args: args
    };
  };
  const exec = function (executorTask) {
    const d = new _deferred.Deferred();
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
      (0, _errors.handleError)(error);
      d.reject(error);
    };
    function mergeSortTask(task) {
      switch (task.name) {
        case 'sortBy':
          _mergedSortArgs = [task.args];
          return true;
        case 'thenBy':
          if (!_mergedSortArgs) {
            throw _errors.errors.Error('E4004');
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
        (0, _iterator.each)(head.args[0], function () {
          unmergedTasks.push(createTask(unmergedTasks.length ? 'thenBy' : 'sortBy', this));
        });
      }
      _taskQueue = unmergedTasks.concat(_taskQueue);
    }
    try {
      _adapterFactory = queryOptions.adapter;
      if (!(0, _type.isFunction)(_adapterFactory)) {
        _adapterFactory = _query_adapters.default[_adapterFactory];
      }
      _adapter = _adapterFactory(queryOptions);
      _taskQueue = [].concat(tasks).concat(executorTask);
      const optimize = _adapter.optimize;
      if (optimize) optimize(_taskQueue);
      while (_taskQueue.length) {
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
      _adapter.exec(url).done(function (result, extra) {
        if (!_taskQueue.length) {
          d.resolve(result, extra);
        } else {
          let clientChain = (0, _array_query.default)(result, {
            errorHandler: queryOptions.errorHandler
          });
          (0, _iterator.each)(_taskQueue, function () {
            clientChain = clientChain[this.name].apply(clientChain, this.args);
          });
          clientChain.done(d.resolve).fail(d.reject);
        }
      }).fail(rejectWithNotify);
    } catch (x) {
      rejectWithNotify(x);
    }
    return d.promise();
  };
  const query = {};
  (0, _iterator.each)(['sortBy', 'thenBy', 'filter', 'slice', 'select', 'groupBy'], function () {
    const name = String(this);
    query[name] = function () {
      return remoteQueryImpl(url, queryOptions, tasks.concat(createTask(name, arguments)));
    };
  });
  (0, _iterator.each)(['count', 'min', 'max', 'sum', 'avg', 'aggregate', 'enumerate'], function () {
    const name = String(this);
    query[name] = function () {
      return exec.call(this, createTask(name, arguments));
    };
  });
  return query;
};
var _default = exports.default = remoteQueryImpl;
module.exports = exports.default;
module.exports.default = exports.default;