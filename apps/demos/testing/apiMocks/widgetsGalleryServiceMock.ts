import { RequestMock } from 'testcafe';
import type { MockHandler } from './types';
import { salesHandler } from './handlers/sales';
import { ordersHandler } from './handlers/orders';
import { openAIHandler } from './handlers/openai';

// The AI-column endpoint is a cross-origin POST with non-simple headers
// (api-key, content-type), so the browser issues a CORS preflight. Advertise
// the allowed methods/headers, otherwise the (mocked) request is blocked.
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': '*',
};

// Router for the remote WidgetsGalleryDataService endpoints used by demos,
// so screenshot tests don't depend on the (flaky) live service.
// It forks by URL, delegating to a per-endpoint handler that returns the JSON body.

const handlers: MockHandler[] = [
  // GET /api/Sales, excluding /api/Sales/Orders
  salesHandler,
  // GET /api/orders
  ordersHandler,
  // POST demo-openai chat completions (AI column)
  openAIHandler,
];

export const widgetsGalleryServiceMock = handlers.reduce(
  (mock, handler) => mock
    .onRequestTo((req) => handler.matches(req))
    .respond((req, res) => {
      res.headers = { ...res.headers, ...CORS, 'content-type': 'application/json' };
      res.statusCode = 200;
      res.setBody(JSON.stringify(handler.respond(req)));
    }),
  RequestMock(),
);
