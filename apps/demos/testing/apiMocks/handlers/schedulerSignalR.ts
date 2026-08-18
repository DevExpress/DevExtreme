import type { MockHandler } from '../types';
import schedulerData from '../fixtures/schedulerData.json';

// GET /api/SchedulerSignalR — Scheduler SignalRService AspNet store load.
// Live service returns the same appointments as SchedulerData; the WebSocket
// hub is stubbed separately via Demos/Scheduler/SignalRService/client-script.js.

export const schedulerSignalRHandler: MockHandler = {
  matches: (req) => /\/api\/SchedulerSignalR\b/i.test(req.url),
  respond: () => schedulerData,
};
