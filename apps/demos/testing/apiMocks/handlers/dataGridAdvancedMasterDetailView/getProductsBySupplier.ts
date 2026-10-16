import type { MockHandler } from '../../types';
import { numberParam } from '../../utils';
import productsBySupplier from '../../fixtures/productsBySupplier.json';

const products = productsBySupplier as Record<string, unknown[]>;

export const dataGridAdvancedMasterDetailViewGetProductsBySupplierHandler: MockHandler = {
  matches: (req) => /\/api\/DataGridAdvancedMasterDetailView\/GetProductsBySupplier(?:\?|$)/i.test(req.url),
  respond: (req) => ({
    data: products[String(numberParam(req.url, 'SupplierID', 0))] ?? [],
    totalCount: -1,
    groupCount: -1,
  }),
};
