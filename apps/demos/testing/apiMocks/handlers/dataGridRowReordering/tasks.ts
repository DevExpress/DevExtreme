import type { MockHandler } from '../../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../../aspNet/store';
import employeeTasks from '../../fixtures/employeeTasks.json';

export const dataGridRowReorderingTasksHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DataGridRowReordering/Tasks',
    employeeTasks,
  ),
  aspNetMutationHandler(
    '/api/DataGridRowReordering/UpdateTask',
  ),
];
