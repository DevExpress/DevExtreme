import type { MockHandler } from '../../types';
import { numberParam } from '../../utils';
import orderDetails from '../../fixtures/orderDetails.json';

const detailsByOrder = orderDetails as Record<string, unknown[]>;
const capturedOrders = Object.keys(detailsByOrder);

const detailsOf = (url: string): unknown[] => {
  const orderId = numberParam(url, 'orderID', 0);

  return detailsByOrder[String(orderId)]
    ?? detailsByOrder[capturedOrders[orderId % capturedOrders.length]];
};

export const dataGridWebApiOrderDetailsHandler: MockHandler = {
  matches: (req) => /\/api\/DataGridWebApi\/OrderDetails(?:\?|$)/i.test(req.url),
  respond: (req) => ({ data: detailsOf(req.url), totalCount: -1, groupCount: -1 }),
};
