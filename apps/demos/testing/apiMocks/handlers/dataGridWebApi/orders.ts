import type { MockHandler } from '../../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../../aspNet/store';
import orders from '../../fixtures/orders.json';

export const dataGridWebApiOrdersHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DataGridWebApi/Orders',
    orders,
  ),
  aspNetMutationHandler(
    '/api/DataGridWebApi/InsertOrder',
  ),
  aspNetMutationHandler(
    '/api/DataGridWebApi/UpdateOrder',
  ),
  aspNetMutationHandler(
    '/api/DataGridWebApi/DeleteOrder',
  ),
];
