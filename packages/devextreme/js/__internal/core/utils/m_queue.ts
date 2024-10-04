import errors from '@js/core/errors';
import { when } from '@js/core/utils/deferred';

function createQueue(discardPendingTasks?: boolean) {
  let tasks: any[] = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let _busy = false;

  function exec() {
    while (tasks.length) {
      _busy = true;

      const task = tasks.shift();
      const result = task();

      if (result === undefined) {
        continue;
      }

      if (result.then) {
        // NOTE: immediate "then" on the next line can reset it back to false
        when(result).always(exec);
        return;
      }

      throw errors.Error('E0015');
    }

    _busy = false;
  }

  function add(task, removeTaskCallback) {
    if (!discardPendingTasks) {
      tasks.push(task);
    } else {
      if (tasks[0] && removeTaskCallback) {
        removeTaskCallback(tasks[0]);
      }
      tasks = [task];
    }
    if (!_busy) {
      exec();
    }
  }

  function busy() {
    return _busy;
  }

  return {
    add,
    busy,
  };
}

export { createQueue as create };
export const enqueue = createQueue().add; // Default global queue for UI sync, consider renaming
