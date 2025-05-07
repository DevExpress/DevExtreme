import { RequestMock } from 'testcafe';
import dimensions from './OLAP_dimensions_response';
import levels from './OLAP_levels_response';
import hierarchies from './OLAP_hierarchies_response';
import measures from './OLAP_measures_response';
import measureGroups from './OLAP_measure_groups_response';
import count from './OLAP_count_response';
import countColumnsOnly from './OLAP_count_columns_only_response';
import data from './OLAP_data_response';
import dataOffset from './OLAP_data_offset_response';
import dataColumnsOnly from './OLAP_data_columns_only_response';

export const OLAPApiMock = RequestMock()
  .onRequestTo((req) => req.url.includes('/api/data') && req.method === 'options')
  .respond(
    undefined,
    200,
    {
      'access-control-allow-headers': 'Origin, Content-Type, Accept',
      'access-control-allow-origin': '*',
      'access-control-request-method': 'POST',
      allow: 'OPTIONS, TRACE, GET, HEAD, POST',
    },
  )
  // structure
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && req.body.toString().includes('<RequestType>MDSCHEMA_DIMENSIONS</RequestType>'))
  .respond(
    dimensions,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && req.body.toString().includes('<RequestType>MDSCHEMA_MEASURES</RequestType>'))
  .respond(
    measures,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && req.body.toString().includes('<RequestType>MDSCHEMA_HIERARCHIES</RequestType>'))
  .respond(
    hierarchies,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && req.body.toString().includes('<RequestType>MDSCHEMA_LEVELS</RequestType>'))
  .respond(
    levels,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && req.body.toString().includes('<RequestType>MDSCHEMA_MEASUREGROUPS</RequestType>'))
  .respond(
    measureGroups,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  // data
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && /set \[DX_columns] as Subset\(.*, 0, \d*\) set \[DX_rows] as Subset\(.*, 0, \d*\) SELECT/.test(req.body.toString()))
  .respond(
    data,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && /as COUNT\(\[DX_columns]\) .* as COUNT\(\[DX_rows]\) SELECT/.test(req.body.toString()))
  .respond(
    count,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  // after scroll down
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && /set \[DX_columns] as Subset\(.*, 0, \d*\) set \[DX_rows] as Subset\(.*, \d{2,}, \d*\) SELECT/.test(req.body.toString()))
  .respond(
    dataOffset,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  // data without rows
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && /set \[DX_columns] as Subset\(.*, 0, \d*\) SELECT/.test(req.body.toString()))
  .respond(
    dataColumnsOnly,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  )
  .onRequestTo((req) => req.url.includes('/api/data')
    && req.method === 'post'
    && req.body.toString().includes('as COUNT([DX_columns]) SELECT'))
  .respond(
    countColumnsOnly,
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  );
