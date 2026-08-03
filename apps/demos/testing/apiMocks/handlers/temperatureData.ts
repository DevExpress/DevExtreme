import type { MockHandler } from '../types';
import temperatures from '../fixtures/temperatureData.json';

// GET /api/TemperatureData?startVisible=M/D/YYYY&endVisible=M/D/YYYY&startBound=…&endBound=…
// The fixture holds the whole year. The service returns more than the visible
// range: it pads it by a week on each side, then clamps the result to the bounds
// when they are given. Charts-LoadDataOnDemand sends no bounds and relies on the
// padding to draw up to the edges of its visual range.

const PADDING_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const dateParam = (url: string, name: string): Date | null => {
  const match = url.match(new RegExp(`[?&]${name}=([^&]*)`));
  if (!match) {
    return null;
  }
  const parsed = new Date(decodeURIComponent(match[1]));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const shiftDays = (date: Date, days: number): Date => new Date(date.getTime() + days * MS_PER_DAY);

const laterOf = (a: Date | null, b: Date | null): Date | null => {
  if (!a || !b) {
    return a ?? b;
  }
  return a > b ? a : b;
};

const earlierOf = (a: Date | null, b: Date | null): Date | null => {
  if (!a || !b) {
    return a ?? b;
  }
  return a < b ? a : b;
};

const requestedRange = (url: string): { start: Date | null; end: Date | null } => {
  const startVisible = dateParam(url, 'startVisible');
  const endVisible = dateParam(url, 'endVisible');

  return {
    start: laterOf(
      startVisible && shiftDays(startVisible, -PADDING_DAYS),
      dateParam(url, 'startBound'),
    ),
    end: earlierOf(
      endVisible && shiftDays(endVisible, PADDING_DAYS),
      dateParam(url, 'endBound'),
    ),
  };
};

export const temperatureDataHandler: MockHandler = {
  matches: (req) => /\/api\/TemperatureData\b/i.test(req.url),
  respond: (req) => {
    const { start, end } = requestedRange(req.url);

    return temperatures.filter(({ Date: date }) => {
      const day = new Date(date);
      return (!start || day >= start) && (!end || day <= end);
    });
  },
};
