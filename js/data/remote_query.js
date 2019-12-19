var queryAdapters = require('./query_adapters'),
    errorsModule = require('./errors'),
    each = require('../core/utils/iterator').each,
    isFunction = require('../core/utils/type').isFunction,
    Deferred = require('../core/utils/deferred').Deferred,
    arrayQueryImpl = require('./array_query');

var remoteQueryImpl = function(url, queryOptions, tasks) {
    tasks = tasks || [];
    queryOptions = queryOptions || {};

    var createTask = function(name, args) {
        return { name: name, args: args };
    };

    var exec = function(executorTask) {
        var d = new Deferred(),
            _adapterFactory,
            _adapter,
            _taskQueue,
            _currentTask,
            _mergedSortArgs;

        var rejectWithNotify = function(error) {
            var handler = queryOptions.errorHandler;
            if(handler) {
                handler(error);
            }

            errorsModule._errorHandler(error);
            d.reject(error);
        };

        function mergeSortTask(task) {
            switch(task.name) {
                case 'sortBy':
                    _mergedSortArgs = [task.args];
                    return true;

                case 'thenBy':
                    if(!_mergedSortArgs) {
                        throw errorsModule.errors.Error('E4004');
                    }

                    _mergedSortArgs.push(task.args);
                    return true;
            }

            return false;
        }

        function unmergeSortTasks() {
            var head = _taskQueue[0],
                unmergedTasks = [ ];

            if(head && head.name === 'multiSort') {
                _taskQueue.shift();
                each(head.args[0], function() {
                    unmergedTasks.push(createTask(unmergedTasks.length ? 'thenBy' : 'sortBy', this));
                });
            }

            _taskQueue = unmergedTasks.concat(_taskQueue);
        }

        try {
            _adapterFactory = queryOptions.adapter;
            if(!isFunction(_adapterFactory)) {
                _adapterFactory = queryAdapters[_adapterFactory];
            }

            _adapter = _adapterFactory(queryOptions);

            _taskQueue = [].concat(tasks).concat(executorTask);

            var optimize = _adapter.optimize;
            if(optimize) optimize(_taskQueue);

            while(_taskQueue.length) {
                _currentTask = _taskQueue[0];

                if(!mergeSortTask(_currentTask)) {
                    if(_mergedSortArgs) {
                        _taskQueue.unshift(createTask('multiSort', [_mergedSortArgs]));
                        _mergedSortArgs = null;
                        continue;
                    }

                    if(String(_currentTask.name) !== 'enumerate') {
                        if(!_adapter[_currentTask.name] || _adapter[_currentTask.name].apply(_adapter, _currentTask.args) === false) {
                            break;
                        }
                    }
                }
                _taskQueue.shift();
            }

            unmergeSortTasks();

            _adapter.exec(url)
                .done(function(result, extra) {
                    if(!_taskQueue.length) {
                        d.resolve(result, extra);
                    } else {
                        var clientChain = arrayQueryImpl(result, {
                            errorHandler: queryOptions.errorHandler
                        });
                        each(_taskQueue, function() {
                            clientChain = clientChain[this.name].apply(clientChain, this.args);
                        });
                        clientChain
                            .done(d.resolve)
                            .fail(d.reject);
                    }
                })
                .fail(rejectWithNotify);

        } catch(x) {
            rejectWithNotify(x);
        }

        return d.promise();
    };

    var query = {};

    each(
        ['sortBy', 'thenBy', 'filter', 'slice', 'select', 'groupBy'],
        function() {
            var name = String(this);
            query[name] = function() {
                return remoteQueryImpl(url, queryOptions, tasks.concat(createTask(name, arguments)));
            };
        }
    );

    each(
        ['count', 'min', 'max', 'sum', 'avg', 'aggregate', 'enumerate'],
        function() {
            var name = String(this);
            query[name] = function() {
                return exec.call(this, createTask(name, arguments));
            };
        }
    );

    return query;
};

module.exports = remoteQueryImpl;
