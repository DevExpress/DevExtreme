import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import type { Properties } from '@js/ui/calendar';
import Calendar from '@js/ui/calendar';

const calendars: Calendar[] = [];

const createCalendar = (options: Properties): Calendar => {
  const element = document.body.appendChild(document.createElement('div'));
  const instance = new Calendar(element, options);

  calendars.push(instance);

  return instance;
};

const expectValidDate = (value: unknown): void => {
  expect(value instanceof Date && !Number.isNaN(value.getTime())).toBe(true);
};

describe('Calendar with a date option that cannot be parsed', () => {
  afterEach(() => {
    calendars.forEach((instance) => instance.dispose());
    calendars.length = 0;
    document.body.innerHTML = '';
  });

  it('renders for value: abc', () => {
    const calendar = createCalendar({ value: 'abc' });

    expectValidDate(calendar.option('currentDate'));
    expect(calendar.option('value')).toBe('abc');
    expect(calendar.$element().find('.dx-calendar-selected-date').length).toBe(0);
  });

  it('renders for an invalid Date', () => {
    const calendar = createCalendar({ value: new Date(NaN) });

    expectValidDate(calendar.option('currentDate'));
  });

  it.each(['min', 'max'] as const)('renders for %s: abc', (optionName) => {
    const calendar = createCalendar({ value: new Date(2020, 0, 2), [optionName]: 'abc' });

    expect(calendar.option('currentDate')).toEqual(new Date(2020, 0, 2));
  });

  it('renders in the range mode for value: [abc, def]', () => {
    const calendar = createCalendar({ selectionMode: 'range', value: ['abc', 'def'] });

    expectValidDate(calendar.option('currentDate'));
  });

  it('still parses a valid date string', () => {
    const calendar = createCalendar({ value: '2020-01-02' });

    expect(calendar.option('currentDate')).toEqual(new Date(2020, 0, 2));
  });
});
