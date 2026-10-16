import type { MockHandler } from '../../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../../aspNet/store';
import tasks from '../../fixtures/tasks.json';

export const treeListTasksTasksHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/TreeListTasks/Tasks',
    tasks,
  ),
  aspNetMutationHandler(
    '/api/TreeListTasks/InsertTask',
  ),
  aspNetMutationHandler(
    '/api/TreeListTasks/UpdateTask',
  ),
  aspNetMutationHandler(
    '/api/TreeListTasks/DeleteTask',
  ),
];
