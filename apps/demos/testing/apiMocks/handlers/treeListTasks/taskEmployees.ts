import type { MockHandler } from '../../types';
import { aspNetLoadHandler } from '../../aspNet/store';
import taskEmployees from '../../fixtures/taskEmployees.json';

export const treeListTasksTaskEmployeesHandler: MockHandler = aspNetLoadHandler(
  '/api/TreeListTasks/TaskEmployees',
  taskEmployees,
);
