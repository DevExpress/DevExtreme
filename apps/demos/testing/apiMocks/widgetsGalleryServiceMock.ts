import { RequestMock } from 'testcafe';
import type { MockHandler } from './types';
import { salesHandler } from './handlers/sales';
import { ordersHandler } from './handlers/orders';
import { openAIHandler } from './handlers/openai';
import { diagramEmployeesHandler } from './handlers/diagramEmployees';
import { temperatureDataHandler } from './handlers/temperatureData';
import { listDataHandler } from './handlers/listData';
import { treeViewPlainDataHandler } from './handlers/treeViewPlainData';
import { treeViewDataHandler } from './handlers/treeViewData';
import {
  fileManagerImagesHandler,
  fileManagerDbHandler,
  fileManagerFileSystemHandler,
} from './handlers/fileManager';

// The AI-column endpoint is a cross-origin POST with non-simple headers
// (api-key, content-type), so the browser issues a CORS preflight. Advertise
// the allowed methods/headers, otherwise the (mocked) request is blocked.
// The Diagram demo sends its request with withCredentials, and a credentialed
// response may not answer with a wildcard origin — echo the request origin back.
const getCrossOriginHeaders = (req: { headers?: Record<string, string> }) => {
  const origin = req.headers?.origin;

  return {
    'access-control-allow-origin': origin ?? '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': '*',
    ...(origin ? { 'access-control-allow-credentials': 'true' } : {}),
  };
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
  // GET /api/DiagramEmployees/Employees
  diagramEmployeesHandler,
  // GET /api/TemperatureData
  temperatureDataHandler,
  // GET /api/ListData
  listDataHandler,
  // GET /api/TreeViewPlainData
  treeViewPlainDataHandler,
  // GET /api/TreeViewData
  treeViewDataHandler,
  // GET /api/file-manager-file-system-images?command=GetDirContents
  fileManagerImagesHandler,
  // GET /api/file-manager-db?command=GetDirContents
  fileManagerDbHandler,
  // GET /api/file-manager-file-system?command=GetDirContents
  fileManagerFileSystemHandler,
];

export const widgetsGalleryServiceMock = handlers.reduce(
  (mock, handler) => mock
    .onRequestTo((req) => handler.matches(req))
    .respond((req, res) => {
      res.headers = { ...res.headers, ...getCrossOriginHeaders(req), 'content-type': 'application/json' };
      res.statusCode = 200;
      res.setBody(JSON.stringify(handler.respond(req)));
    }),
  RequestMock(),
);
