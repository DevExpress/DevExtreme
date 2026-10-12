import type { MockHandler } from '../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../aspNet/store';
import orders from '../fixtures/orders.json';

export const dataGridBatchUpdateWebApiHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DataGridBatchUpdateWebApi/Orders',
    orders,
  ),
  aspNetMutationHandler(
    '/api/DataGridBatchUpdateWebApi/Batch',
  ),
];
