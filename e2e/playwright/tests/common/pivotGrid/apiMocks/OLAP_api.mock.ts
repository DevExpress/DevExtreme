import type { Page } from '@playwright/test';
import type { MockedRequest } from '../../../../helpers/apiMock';
import { mockApi } from '../../../../helpers/apiMock';
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

const URL = /\/api\/data/;
const XML = 'text/xml';

const discover = (requestType: string, body: string): MockedRequest => ({
  url: URL,
  method: 'post',
  matchBody: (postData) => postData.includes(`<RequestType>${requestType}</RequestType>`),
  contentType: XML,
  body,
});

const execute = (pattern: RegExp, body: string): MockedRequest => ({
  url: URL,
  method: 'post',
  matchBody: (postData) => pattern.test(postData),
  contentType: XML,
  body,
});

export const mockOLAPApi = async (page: Page): Promise<void> => mockApi(page, [
  {
    url: URL,
    method: 'options',
    status: 200,
    headers: {
      'access-control-allow-headers': 'Origin, Content-Type, Accept',
      'access-control-request-method': 'POST',
      allow: 'OPTIONS, TRACE, GET, HEAD, POST',
    },
    contentType: XML,
    body: '',
  },
  // structure
  discover('MDSCHEMA_DIMENSIONS', dimensions),
  discover('MDSCHEMA_MEASURES', measures),
  discover('MDSCHEMA_HIERARCHIES', hierarchies),
  discover('MDSCHEMA_LEVELS', levels),
  discover('MDSCHEMA_MEASUREGROUPS', measureGroups),
  // data
  execute(/set \[DX_columns] as Subset\(.*, 0, \d*\) set \[DX_rows] as Subset\(.*, 0, \d*\) SELECT/, data),
  execute(/as COUNT\(\[DX_columns]\) .* as COUNT\(\[DX_rows]\) SELECT/, count),
  // after scroll down
  execute(/set \[DX_columns] as Subset\(.*, 0, \d*\) set \[DX_rows] as Subset\(.*, \d{2,}, \d*\) SELECT/, dataOffset),
  // data without rows
  execute(/set \[DX_columns] as Subset\(.*, 0, \d*\) SELECT/, dataColumnsOnly),
  execute(/as COUNT\(\[DX_columns]\) SELECT/, countColumnsOnly),
]);
