import type { MockHandler } from '../../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../../aspNet/store';
import employeeTasks from '../../fixtures/employeeTasks.json';

export const dataGridCustomEditorsTasksHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DataGridCustomEditors/Tasks',
    employeeTasks,
  ),
  aspNetMutationHandler(
    '/api/DataGridCustomEditors/InsertTask',
  ),
  aspNetMutationHandler(
    '/api/DataGridCustomEditors/UpdateTask',
  ),
];
