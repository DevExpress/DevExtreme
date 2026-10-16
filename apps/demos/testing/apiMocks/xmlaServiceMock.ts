import { RequestMock } from 'testcafe';
import dimensions from './xmla/dimensions';
import levels from './xmla/levels';
import hierarchies from './xmla/hierarchies';
import measures from './xmla/measures';
import measureGroups from './xmla/measureGroups';
import remoteVirtualScrollingData from './xmla/remoteVirtualScrollingData';
import remoteVirtualScrollingCount from './xmla/remoteVirtualScrollingCount';
import integratedFieldChooserData from './xmla/integratedFieldChooserData';
import resellerFreightCostData from './xmla/resellerFreightCostData';
import internetTotalProductCostData from './xmla/internetTotalProductCostData';

// Intercepts the remote Adventure Works XMLA endpoint used by PivotGrid demos,
// so screenshot tests don't depend on demos.devexpress.com/Services/OLAP.
// Execute fixtures are recorded per demo measure from the live service.

const isXmlaUrl = (url: string): boolean => /msmdpump\.dll/i.test(url);

const xmlHeaders = {
  'access-control-allow-origin': '*',
  'content-type': 'text/xml',
};

const preflightHeaders = {
  'access-control-allow-headers': 'Origin, Content-Type, Accept, SOAPAction',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  allow: 'OPTIONS, TRACE, GET, HEAD, POST',
};

const bodyOf = (req: { body?: string | Buffer }): string => (req.body ? req.body.toString() : '');

const hasMeasure = (body: string, measure: string): boolean => body.includes(`[Measures].[${measure}]`);

const isCountQuery = (body: string): boolean => (
  body.includes('[DX_rows_count]')
  || body.includes('[DX_columns_count]')
);

export const xmlaServiceMock = RequestMock()
  .onRequestTo((req) => isXmlaUrl(req.url) && req.method === 'options')
  .respond(undefined, 200, preflightHeaders)

  // Structure (Discover)
  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && bodyOf(req).includes('<RequestType>MDSCHEMA_DIMENSIONS</RequestType>'))
  .respond(dimensions, 200, xmlHeaders)

  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && bodyOf(req).includes('<RequestType>MDSCHEMA_MEASURES</RequestType>'))
  .respond(measures, 200, xmlHeaders)

  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && bodyOf(req).includes('<RequestType>MDSCHEMA_HIERARCHIES</RequestType>'))
  .respond(hierarchies, 200, xmlHeaders)

  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && bodyOf(req).includes('<RequestType>MDSCHEMA_LEVELS</RequestType>'))
  .respond(levels, 200, xmlHeaders)

  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && bodyOf(req).includes('<RequestType>MDSCHEMA_MEASUREGROUPS</RequestType>'))
  .respond(measureGroups, 200, xmlHeaders)

  // Count queries for paginate — MDX has no measure member
  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && isCountQuery(bodyOf(req)))
  .respond(remoteVirtualScrollingCount, 200, xmlHeaders)

  // RemoteVirtualScrolling
  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && hasMeasure(bodyOf(req), 'Internet Sales Amount'))
  .respond(remoteVirtualScrollingData, 200, xmlHeaders)

  // IntegratedFieldChooser
  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && hasMeasure(bodyOf(req), 'Customer Count'))
  .respond(integratedFieldChooserData, 200, xmlHeaders)

  // OLAPDataSource
  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && hasMeasure(bodyOf(req), 'Reseller Freight Cost'))
  .respond(resellerFreightCostData, 200, xmlHeaders)

  // Filtering
  .onRequestTo((req) => isXmlaUrl(req.url)
    && req.method === 'post'
    && hasMeasure(bodyOf(req), 'Internet Total Product Cost'))
  .respond(internetTotalProductCostData, 200, xmlHeaders)

  // Catch-all — never hit the live service
  .onRequestTo((req) => isXmlaUrl(req.url) && req.method === 'post')
  .respond(remoteVirtualScrollingData, 200, xmlHeaders);
