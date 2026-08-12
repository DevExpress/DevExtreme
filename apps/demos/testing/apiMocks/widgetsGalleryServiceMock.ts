import { RequestMock } from 'testcafe';
import type { MockHandler } from './types';
import { salesHandler } from './handlers/sales';
import { salesOrdersHandler } from './handlers/salesOrders';
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
import { schedulerDataHandler } from './handlers/schedulerData';
import { schedulerSignalRHandler } from './handlers/schedulerSignalR';
import { googleCalendarHandler } from './handlers/googleCalendar';
import { commonAntiForgeryHandler } from './handlers/commonAntiForgery';
import { dataGridWebApiOrdersHandlers } from './handlers/dataGridWebApi/orders';
import { dataGridWebApiCustomersLookupHandler } from './handlers/dataGridWebApi/customersLookup';
import { dataGridWebApiShippersLookupHandler } from './handlers/dataGridWebApi/shippersLookup';
import { dataGridWebApiOrderDetailsHandler } from './handlers/dataGridWebApi/orderDetails';
import { treeListTasksTasksHandlers } from './handlers/treeListTasks/tasks';
import { dataGridAdvancedMasterDetailViewGetSuppliersHandler } from './handlers/dataGridAdvancedMasterDetailView/getSuppliers';
import { dataGridAdvancedMasterDetailViewGetProductsBySupplierHandler } from './handlers/dataGridAdvancedMasterDetailView/getProductsBySupplier';
import { dataGridAdvancedMasterDetailViewGetOrdersByProductHandler } from './handlers/dataGridAdvancedMasterDetailView/getOrdersByProduct';
import { dataGridBatchUpdateWebApiHandlers } from './handlers/dataGridBatchUpdateWebApi';
import { dataGridCustomEditorsEmployeesHandler } from './handlers/dataGridCustomEditors/employees';
import { dataGridCustomEditorsTasksHandlers } from './handlers/dataGridCustomEditors/tasks';
import { dataGridRowReorderingEmployeesHandler } from './handlers/dataGridRowReordering/employees';
import { dataGridRowReorderingTasksHandlers } from './handlers/dataGridRowReordering/tasks';
import { dataGridSemanticSearchGetHandler } from './handlers/dataGridSemanticSearch';
import { dndBetweenGridsHandlers } from './handlers/dndBetweenGrids';
import { dataGridEmployeesValidationHandlers } from './handlers/dataGridEmployeesValidation';
import { dataGridCollaborativeEditingHandlers } from './handlers/dataGridCollaborativeEditing';
import { dataGridStatesLookupHandler } from './handlers/dataGridStatesLookup';
import { remoteValidationCheckUniqueEmailAddressHandler } from './handlers/remoteValidation';
import { treeListDataHandler } from './handlers/treeListData';
import { treeListTasksTaskEmployeesHandler } from './handlers/treeListTasks/taskEmployees';

// The AI-column endpoint is a cross-origin POST with non-simple headers
// (api-key, content-type), so the browser issues a CORS preflight. Advertise
// the allowed methods/headers, otherwise the (mocked) request is blocked.
// The Diagram demo sends its request with withCredentials, and a credentialed
// response may not answer with a wildcard origin — echo the request origin back.
const getCrossOriginHeaders = (req: { headers?: Record<string, string> }) => {
  const origin = req.headers?.origin;
  const requestedHeaders = req.headers?.['access-control-request-headers'];

  return {
    'access-control-allow-origin': origin ?? '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': requestedHeaders ?? '*',
    ...(origin ? { 'access-control-allow-credentials': 'true' } : {}),
  };
};

// Router for the remote WidgetsGalleryDataService endpoints used by demos,
// so screenshot tests don't depend on the (flaky) live service.
// It forks by URL, delegating to a per-endpoint handler that returns the JSON body.

const handlers: MockHandler[] = [
  // GET /api/Sales, excluding /api/Sales/Orders
  salesHandler,
  // GET /api/Sales/Orders (PivotGrid WebAPIService)
  salesOrdersHandler,
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
  // GET /api/SchedulerData (Scheduler WebAPIService)
  schedulerDataHandler,
  // GET /api/SchedulerSignalR (Scheduler SignalRService)
  schedulerSignalRHandler,
  // GET googleapis.com/calendar/v3/.../events (Scheduler GoogleCalendarIntegration)
  googleCalendarHandler,
  // GET /api/Common/GetAntiForgeryToken (shared/anti-forgery overrides)
  commonAntiForgeryHandler,
  // GET /api/DataGridWebApi/CustomersLookup
  dataGridWebApiCustomersLookupHandler,
  // GET /api/DataGridWebApi/ShippersLookup
  dataGridWebApiShippersLookupHandler,
  // GET /api/DataGridWebApi/OrderDetails?orderID=
  dataGridWebApiOrderDetailsHandler,
  // GET /api/DataGridWebApi/Orders
  // POST /api/DataGridWebApi/InsertOrder
  // PUT /api/DataGridWebApi/UpdateOrder
  // DELETE /api/DataGridWebApi/DeleteOrder
  ...dataGridWebApiOrdersHandlers,
  // GET /api/TreeListTasks/TaskEmployees
  treeListTasksTaskEmployeesHandler,
  // GET /api/TreeListTasks/Tasks
  // POST /api/TreeListTasks/InsertTask
  // PUT /api/TreeListTasks/UpdateTask
  // DELETE /api/TreeListTasks/DeleteTask
  ...treeListTasksTasksHandlers,
  // GET /api/DataGridAdvancedMasterDetailView/GetSuppliers
  dataGridAdvancedMasterDetailViewGetSuppliersHandler,
  // GET /api/DataGridAdvancedMasterDetailView/GetProductsBySupplier?SupplierID=
  dataGridAdvancedMasterDetailViewGetProductsBySupplierHandler,
  // GET /api/DataGridAdvancedMasterDetailView/GetOrdersByProduct?ProductID=
  dataGridAdvancedMasterDetailViewGetOrdersByProductHandler,
  // GET /api/DataGridBatchUpdateWebApi/Orders
  // POST /api/DataGridBatchUpdateWebApi/Batch
  ...dataGridBatchUpdateWebApiHandlers,
  // GET /api/DataGridCustomEditors/Employees
  dataGridCustomEditorsEmployeesHandler,
  // GET /api/DataGridCustomEditors/Tasks
  // POST /api/DataGridCustomEditors/InsertTask
  // PUT /api/DataGridCustomEditors/UpdateTask
  ...dataGridCustomEditorsTasksHandlers,
  // GET /api/DataGridRowReordering/Employees
  dataGridRowReorderingEmployeesHandler,
  // GET /api/DataGridRowReordering/Tasks
  // PUT /api/DataGridRowReordering/UpdateTask
  ...dataGridRowReorderingTasksHandlers,
  // GET /api/DataGridSemanticSearch/Get
  dataGridSemanticSearchGetHandler,
  // GET /api/DnDBetweenGrids/Tasks
  // PUT /api/DnDBetweenGrids/UpdateTask
  ...dndBetweenGridsHandlers,
  // GET/POST/PUT/DELETE /api/DataGridEmployeesValidation
  ...dataGridEmployeesValidationHandlers,
  // GET/POST/PUT/DELETE /api/DataGridCollaborativeEditing
  ...dataGridCollaborativeEditingHandlers,
  // GET /api/DataGridStatesLookup (DataGrid CollaborativeEditing lookup)
  dataGridStatesLookupHandler,
  // GET /RemoteValidation/CheckUniqueEmailAddress?id=&email=
  remoteValidationCheckUniqueEmailAddressHandler,
  // GET /api/treeListData?parentIds=
  treeListDataHandler,
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
