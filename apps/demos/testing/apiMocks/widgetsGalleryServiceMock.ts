import { RequestMock } from 'testcafe';
import { getCrossOriginHeaders, widgetsGalleryHandlers } from './widgetsGalleryHandlers';

export const widgetsGalleryServiceMock = widgetsGalleryHandlers.reduce(
  (mock, handler) => mock
    .onRequestTo((req) => handler.matches(req))
    .respond((req, res) => {
      res.headers = { ...res.headers, ...getCrossOriginHeaders(req), 'content-type': 'application/json' };
      res.statusCode = 200;
      res.setBody(JSON.stringify(handler.respond(req)));
    }),
  RequestMock(),
);
