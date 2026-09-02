import type { MockHandler } from '../types';
import schedulerData from '../fixtures/schedulerData.json';

// GET /api/SchedulerData — Scheduler WebAPIService (AspNet store + remoteFiltering).
// Returning the full captured payload is enough for screenshot tests: the day
// view only renders appointments that intersect the current visible interval.

export const schedulerDataHandler: MockHandler = {
  matches: (req) => /\/api\/SchedulerData\b/i.test(req.url),
  respond: () => schedulerData,
};
