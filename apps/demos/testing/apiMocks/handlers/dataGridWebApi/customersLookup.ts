import type { MockHandler } from '../../types';
import { aspNetLoadHandler } from '../../aspNet/store';
import customers from '../../fixtures/customersLookup.json';

export const dataGridWebApiCustomersLookupHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridWebApi/CustomersLookup',
  customers,
);
