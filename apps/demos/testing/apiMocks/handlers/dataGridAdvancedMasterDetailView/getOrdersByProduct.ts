import type { MockHandler } from '../../types';
import { numberParam } from '../../utils';
import ordersByProduct from '../../fixtures/ordersByProduct.json';

const ordersOf = ordersByProduct as Record<string, unknown[]>;
const captured = Object.keys(ordersOf);

export const dataGridAdvancedMasterDetailViewGetOrdersByProductHandler: MockHandler = {
  matches: (req) => /\/api\/DataGridAdvancedMasterDetailView\/GetOrdersByProduct(?:\?|$)/i.test(req.url),
  respond: (req) => {
    const productId = numberParam(req.url, 'ProductID', 0);

    return {
      data: ordersOf[String(productId)] ?? ordersOf[captured[productId % captured.length]],
      totalCount: -1,
      groupCount: -1,
    };
  },
};
