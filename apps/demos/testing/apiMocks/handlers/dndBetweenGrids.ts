import type { MockHandler } from '../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../aspNet/store';
import dndTasks from '../fixtures/dndTasks.json';

export const dndBetweenGridsHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DnDBetweenGrids/Tasks',
    dndTasks,
  ),
  aspNetMutationHandler(
    '/api/DnDBetweenGrids/UpdateTask',
  ),
];
