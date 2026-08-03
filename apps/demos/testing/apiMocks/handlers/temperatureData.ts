import type { MockHandler } from '../types';
import temperatures from '../fixtures/temperatureData.json';

// GET /api/TemperatureData?startVisible=M/DD/YYYY&endVisible=M/DD/YYYY&startBound=…&endBound=…
// The fixture holds the whole year; the handler narrows it to the requested range.

const dateParam = (url: string, name: string): Date | null => {
  const match = url.match(new RegExp(`[?&]${name}=([^&]*)`));
  if (!match) {
    return null;
  }
  const parsed = new Date(decodeURIComponent(match[1]));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const withinRange = (url: string) => {
  const start = dateParam(url, 'startVisible');
  const end = dateParam(url, 'endVisible');

  return ({ Date: date }: { Date: string }): boolean => {
    const day = new Date(date);
    return (!start || day >= start) && (!end || day <= end);
  };
};

export const temperatureDataHandler: MockHandler = {
  matches: (req) => /\/api\/TemperatureData\b/i.test(req.url),
  respond: (req) => temperatures.filter(withinRange(req.url)),
};
