import { RequestMock } from 'testcafe';
import type { MockHandler } from './types';
import { salesHandler } from './handlers/sales';
import { ordersHandler } from './handlers/orders';

// Router for the remote WidgetsGalleryDataService endpoints used by demos,
// so screenshot tests don't depend on the (flaky) live service.
// It forks by URL, delegating to a per-endpoint handler that returns the JSON body.

const CORS = { 'access-control-allow-origin': '*' };

const handlers: MockHandler[] = [
  // GET /api/Sales, excluding /api/Sales/Orders
  salesHandler,
  // GET /api/orders
  ordersHandler,
];

export const widgetsGalleryServiceMock = handlers.reduce(
  (mock, handler) => mock
    .onRequestTo((req) => handler.matches(req.url))
    .respond((req, res) => {
      res.headers = { ...res.headers, ...CORS, 'content-type': 'application/json' };
      res.statusCode = 200;
      res.setBody(JSON.stringify(handler.respond(req.url)));
    }),
  RequestMock(),
);
