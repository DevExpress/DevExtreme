import type { MockedRequest } from '../../../helpers/apiMock';

export const resourceApiMock: MockedRequest[] = [{
  url: /\/api\/data/,
  body: {
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
  },
}];
