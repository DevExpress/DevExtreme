import type { MockHandler } from '../types';

// GET /api/Common/GetAntiForgeryToken
//
// shared/anti-forgery holds every other request back until this token arrives,
// so it stays a live dependency even once the data is mocked. The value is never
// verified anywhere.

export const commonAntiForgeryHandler: MockHandler = {
  matches: (req) => /\/api\/Common\/GetAntiForgeryToken\b/i.test(req.url),
  respond: () => ({
    token: 'demo-tests-anti-forgery-token',
    headerName: 'RequestVerificationToken',
  }),
};
