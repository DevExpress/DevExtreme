import type { Page } from '@playwright/test';
import { mockApi } from '../../../../../helpers/apiMock';

export const RESOURCE_API_URL = /\/api\/data/;

// The answer is JSON text served as "text/xml", the way the TestCafe RequestMock served it: the
// store asks for JSON explicitly, so the content type only has to stay what it was.
export const mockResourceApi = async (page: Page): Promise<void> => mockApi(page, [{
  url: RESOURCE_API_URL,
  contentType: 'text/xml',
  body: JSON.stringify({
    data: [
      {
        text: 'Low Priority',
        id: 1,
        color: '#1e90ff',
      },
      {
        text: 'High Priority',
        id: 2,
        color: '#ff9747',
      },
    ],
  }),
}]);
