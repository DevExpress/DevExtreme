import errors from '@js/core/errors';
import { when } from '@js/core/utils/deferred';

type Task = () => unknown;

interface Queue {
  add: (task: Task, removeTaskCallback?: (task: Task) => void) => void;
  busy: () => boolean;
}

function createQueue(discardPendingTasks?: boolean): Queue {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let _tasks: Task[] = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let _busy = false;

  function exec(): void {
    while (_tasks.length) {
      _busy = true;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- the queue is not empty
      const task = _tasks.shift()!;
      const result = task();

      if (result === undefined) {
        // eslint-disable-next-line no-continue -- a task without a result lets the next one run
        continue;
      }

      // @ts-expect-error the task result is not typed yet
      if (result.then) {
        // NOTE: immediate "then" on the next line can reset it back to false
        when(result).always(exec);
        return;
      }

      throw errors.Error('E0015');
    }

    _busy = false;
  }

  function add(task: Task, removeTaskCallback?: (task: Task) => void): void {
    if (!discardPendingTasks) {
      _tasks.push(task);
    } else {
      if (_tasks[0] && removeTaskCallback) {
        removeTaskCallback(_tasks[0]);
      }
      _tasks = [task];
    }
    if (!_busy) {
      exec();
    }
  }

  function busy(): boolean {
    return _busy;
  }

  return {
    add,
    busy,
  };
}

export { createQueue as create };
export const enqueue = createQueue().add; // Default global queue for UI sync, consider renaming
