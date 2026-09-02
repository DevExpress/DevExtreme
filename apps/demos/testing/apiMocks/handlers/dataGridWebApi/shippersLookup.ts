import type { MockHandler } from '../../types';
import { aspNetLoadHandler } from '../../aspNet/store';
import shippers from '../../fixtures/shippersLookup.json';

export const dataGridWebApiShippersLookupHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridWebApi/ShippersLookup',
  shippers,
);
