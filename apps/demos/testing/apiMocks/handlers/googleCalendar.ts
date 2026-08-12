import type { MockHandler } from '../types';
import googleCalendarEvents from '../fixtures/googleCalendarEvents.json';

// GET https://www.googleapis.com/calendar/v3/calendars/.../events
// Scheduler GoogleCalendarIntegration CustomStore resolves response.items.

export const googleCalendarHandler: MockHandler = {
  matches: (req) => /googleapis\.com\/calendar\/v3\/calendars\//i.test(req.url)
    && /\/events\b/i.test(req.url),
  respond: () => googleCalendarEvents,
};
