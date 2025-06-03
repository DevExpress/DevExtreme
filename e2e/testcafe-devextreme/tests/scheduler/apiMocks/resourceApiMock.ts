import { RequestMock } from 'testcafe';

export const resourceApiMock = RequestMock()
  .onRequestTo((req) => req.url.includes('/api/data'))
  .respond(
    {
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
    200,
    { 'access-control-allow-origin': '*', 'content-type': 'text/xml' },
  );
