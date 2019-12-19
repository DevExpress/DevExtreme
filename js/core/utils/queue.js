var errors = require('../errors'),
    when = require('../../core/utils/deferred').when;

function createQueue(discardPendingTasks) {
    var _tasks = [],
        _busy = false;

    function exec() {
        while(_tasks.length) {
            _busy = true;

            var task = _tasks.shift(),
                result = task();

            if(result === undefined) {
                continue;
            }

            if(result.then) {
                // NOTE: immediate "then" on the next line can reset it back to false
                when(result).always(exec);
                return;
            }

            throw errors.Error('E0015');
        }

        _busy = false;
    }

    function add(task, removeTaskCallback) {
        if(!discardPendingTasks) {
            _tasks.push(task);
        } else {
            if(_tasks[0] && removeTaskCallback) {
                removeTaskCallback(_tasks[0]);
            }
            _tasks = [task];
        }
        if(!_busy) {
            exec();
        }
    }

    function busy() {
        return _busy;
    }

    return {
        add: add,
        busy: busy
    };
}


exports.create = createQueue;
exports.enqueue = createQueue().add; // Default global queue for UI sync, consider renaming
