import type { MockRequest } from './types';
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

export interface XmlaRule {
  matches: (req: MockRequest) => boolean;
  body?: string;
  headers: Record<string, string>;
}

// The first matching rule answers the request.
export const xmlaRules: XmlaRule[] = [
  {
    matches: (req) => isXmlaUrl(req.url) && req.method === 'options',
    headers: preflightHeaders,
  },

  // Structure (Discover)
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && bodyOf(req).includes('<RequestType>MDSCHEMA_DIMENSIONS</RequestType>'),
    body: dimensions,
    headers: xmlHeaders,
  },
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && bodyOf(req).includes('<RequestType>MDSCHEMA_MEASURES</RequestType>'),
    body: measures,
    headers: xmlHeaders,
  },
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && bodyOf(req).includes('<RequestType>MDSCHEMA_HIERARCHIES</RequestType>'),
    body: hierarchies,
    headers: xmlHeaders,
  },
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && bodyOf(req).includes('<RequestType>MDSCHEMA_LEVELS</RequestType>'),
    body: levels,
    headers: xmlHeaders,
  },
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && bodyOf(req).includes('<RequestType>MDSCHEMA_MEASUREGROUPS</RequestType>'),
    body: measureGroups,
    headers: xmlHeaders,
  },

  // Count queries for paginate — MDX has no measure member
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && isCountQuery(bodyOf(req)),
    body: remoteVirtualScrollingCount,
    headers: xmlHeaders,
  },

  // RemoteVirtualScrolling
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && hasMeasure(bodyOf(req), 'Internet Sales Amount'),
    body: remoteVirtualScrollingData,
    headers: xmlHeaders,
  },

  // IntegratedFieldChooser
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && hasMeasure(bodyOf(req), 'Customer Count'),
    body: integratedFieldChooserData,
    headers: xmlHeaders,
  },

  // OLAPDataSource
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && hasMeasure(bodyOf(req), 'Reseller Freight Cost'),
    body: resellerFreightCostData,
    headers: xmlHeaders,
  },

  // Filtering
  {
    matches: (req) => isXmlaUrl(req.url)
      && req.method === 'post'
      && hasMeasure(bodyOf(req), 'Internet Total Product Cost'),
    body: internetTotalProductCostData,
    headers: xmlHeaders,
  },

  // Catch-all — never hit the live service
  {
    matches: (req) => isXmlaUrl(req.url) && req.method === 'post',
    body: remoteVirtualScrollingData,
    headers: xmlHeaders,
  },
];
