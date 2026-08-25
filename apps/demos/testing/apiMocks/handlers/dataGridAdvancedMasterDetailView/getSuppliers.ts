import type { MockHandler } from '../../types';
import { aspNetLoadHandler } from '../../aspNet/store';
import suppliers from '../../fixtures/suppliers.json';

export const dataGridAdvancedMasterDetailViewGetSuppliersHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridAdvancedMasterDetailView/GetSuppliers',
  suppliers,
);
