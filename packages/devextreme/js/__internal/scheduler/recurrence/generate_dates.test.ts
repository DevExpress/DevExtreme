import {
  describe, expect, it,
} from '@jest/globals';

import { generateDates } from './generate_dates';

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

describe('generateDates', () => {
  it('get dates with undefined rule', () => {
    const dates = generateDates({
      rule: undefined,
      start: new Date(2015, 0, 1, 0, 0, 10),
      min: new Date(2015, 0, 1, 0, 0, 10),
      max: new Date(2015, 0, 1, 0, 0, 12),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([]);
  });

  it('get date by second recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=SECONDLY',
      start: new Date(2015, 0, 1, 0, 0, 10),
      min: new Date(2015, 0, 1, 0, 0, 10),
      max: new Date(2015, 0, 1, 0, 0, 12),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 0, 0, 10),
      new Date(2015, 0, 1, 0, 0, 11),
      new Date(2015, 0, 1, 0, 0, 12),
    ]);
  });

  it('get date by minute recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=MINUTELY',
      start: new Date(2015, 0, 1, 0, 1),
      min: new Date(2015, 0, 1, 0, 1),
      max: new Date(2015, 0, 1, 0, 3),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 0, 1),
      new Date(2015, 0, 1, 0, 2),
      new Date(2015, 0, 1, 0, 3),
    ]);
  });

  it('get date by hour recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=HOURLY',
      start: new Date(2015, 0, 1, 8),
      min: new Date(2015, 0, 1, 8),
      max: new Date(2015, 0, 1, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 8),
      new Date(2015, 0, 1, 9),
      new Date(2015, 0, 1, 10),
    ]);
  });

  it('get date by day recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 0, 3),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2015, 0, 1), new Date(2015, 0, 2), new Date(2015, 0, 3)]);
  });

  it('get date by day recurrence, endDate of part is min', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY',
      start: new Date(2015, 4, 26),
      end: new Date(2015, 4, 27),
      min: new Date(2015, 4, 31),
      max: new Date(2015, 5, 2),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 30),
      new Date(2015, 4, 31),
      new Date(2015, 5, 1),
      new Date(2015, 5, 2),
    ]);
  });

  it('get date by week recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY',
      start: new Date(2015, 0, 15),
      min: new Date(2015, 0, 15),
      max: new Date(2015, 1, 5),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 15),
      new Date(2015, 0, 22),
      new Date(2015, 0, 29),
      new Date(2015, 1, 5),
    ]);
  });

  it('get date by month recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY',
      start: new Date(2015, 1, 15),
      min: new Date(2015, 1, 15),
      max: new Date(2015, 5, 5),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 1, 15),
      new Date(2015, 2, 15),
      new Date(2015, 3, 15),
      new Date(2015, 4, 15),
    ]);
  });

  it('get date by year recurrence', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY',
      start: new Date(2015, 11, 15),
      min: new Date(2015, 11, 15),
      max: new Date(2019, 5, 5),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 11, 15),
      new Date(2016, 11, 15),
      new Date(2017, 11, 15),
      new Date(2018, 11, 15),
    ]);
  });

  it('get date by recurrence with 2 day INTERVAL', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;INTERVAL=2',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 0, 7),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1),
      new Date(2015, 0, 3),
      new Date(2015, 0, 5),
      new Date(2015, 0, 7),
    ]);
  });

  it('generateDates should not handled strings only with INTERVAL', () => {
    const dates = generateDates({
      rule: 'INTERVAL=2',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 0, 7),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([]);
  });

  it('generateDates should handle strings with DAILY & BYDAY=SU rules and start in Sunday', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYDAY=SU',
      start: new Date(2015, 4, 24),
      min: new Date(2015, 4, 20),
      max: new Date(2015, 5, 7),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 24),
      new Date(2015, 4, 31),
      new Date(2015, 5, 7),
    ]);
  });

  it('generateDates should handle strings with WEEKLY & BYDAY=SU rules and start in Sunday', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=SU',
      start: new Date(2018, 4, 27),
      min: new Date(2018, 4, 27),
      max: new Date(2018, 5, 11),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2018, 4, 27),
      new Date(2018, 5, 3),
      new Date(2018, 5, 10),
    ]);
  });

  it('generateDates should handle strings with DAILY & BYDAY=MO rules and WKST=WE', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;WKST=WE;BYDAY=MO',
      start: new Date(2015, 4, 18),
      min: new Date(2015, 4, 18),
      max: new Date(2015, 5, 7),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 18),
      new Date(2015, 4, 25),
      new Date(2015, 5, 1),
    ]);
  });

  it('generateDates should handle strings with DAILY, BYDAY = whole week, WKST rules', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=WE',
      start: new Date(2015, 4, 18),
      min: new Date(2015, 4, 18),
      max: new Date(2015, 4, 26),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 18),
      new Date(2015, 4, 19),
      new Date(2015, 4, 20),
      new Date(2015, 4, 21),
      new Date(2015, 4, 22),
      new Date(2015, 4, 23),
      new Date(2015, 4, 24),
      new Date(2015, 4, 25),
      new Date(2015, 4, 26),
    ]);
  });

  it('generateDates should handle strings with COUNT', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;INTERVAL=3;COUNT=2',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 0, 21),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1),
      new Date(2015, 0, 4),
    ]);
  });

  it('generateDates should handle strings with COUNT without range', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=4',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 0, 21),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 2),
      new Date(2015, 0, 5),
      new Date(2015, 0, 7),
      new Date(2015, 0, 9),
    ]);
  });

  it('generateDates should handle strings with COUNT & BYDAY', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 0, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 2),
      new Date(2015, 0, 5),
      new Date(2015, 0, 7),
      new Date(2015, 0, 9),
      new Date(2015, 0, 12),
      new Date(2015, 0, 14),
      new Date(2015, 0, 16),
      new Date(2015, 0, 19),
    ]);
  });

  it('generateDates should handle strings with COUNT & BYDAY & DAILY', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYDAY=MO;COUNT=7',
      start: new Date(2018, 4, 14),
      min: new Date(2018, 4, 14),
      max: new Date(2018, 6, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2018, 4, 14),
      new Date(2018, 4, 21),
      new Date(2018, 4, 28),
      new Date(2018, 5, 4),
      new Date(2018, 5, 11),
      new Date(2018, 5, 18),
      new Date(2018, 5, 25),
    ]);
  });

  it('generateDates should handle strings with COUNT & BYDAY & WEEKLY & INTERVAL', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2',
      start: new Date(2019, 2, 4, 9),
      min: new Date(2019, 2, 4, 8),
      max: new Date(2019, 6, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2019, 2, 4, 9),
      new Date(2019, 2, 18, 9),
    ]);
  });

  it('generateDates: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2',
      start: new Date(2019, 2, 4, 9),
      min: new Date(2019, 2, 4, 8),
      max: new Date(2019, 6, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2019, 2, 4, 9),
      new Date(2019, 2, 18, 9),
    ]);
  });

  it('generateDates: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2',
      start: new Date(2019, 2, 4, 9),
      min: new Date(2019, 2, 4, 8),
      max: new Date(2019, 2, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2019, 2, 4, 9),
      new Date(2019, 2, 18, 9),
    ]);
  });

  it('generateDates: FREQ=WEEKLY;BYDAY=[all days], min: new Date(2019, 0, 6), max: new Date(2015, 0, 12)', () => {
    for (let i = 0; i < days.length; i += 1) {
      const dates = generateDates({
        rule: `FREQ=WEEKLY;BYDAY=${days[i]}`,
        start: new Date(2019, 0, 6),
        min: new Date(2019, 0, 6),
        max: new Date(2019, 0, 12),
        appointmentTimezoneOffset: 0,
      });
      expect(dates).toEqual([new Date(2019, 0, 6 + i)]);
    }
  });

  it('generateDates: FREQ=WEEKLY;BYDAY=[all days], min: new Date(2015, 0, 4), max: new Date(2015, 0, 17)', () => {
    for (let i = 0; i < days.length; i += 1) {
      const dates = generateDates({
        rule: `FREQ=WEEKLY;BYDAY=${days[i]}`,
        start: new Date(2019, 0, 6),
        min: new Date(2019, 0, 6),
        max: new Date(2019, 0, 19),
        appointmentTimezoneOffset: 0,
      });
      expect(dates).toEqual([
        new Date(2019, 0, 6 + i),
        new Date(2019, 0, 13 + i),
      ]);
    }
  });

  it('generateDates: FREQ=WEEKLY;BYDAY=[all days];COUNT=1, min: new Date(2015, 0, 4), max: new Date(2015, 0, 17)', () => {
    for (let i = 0; i < days.length; i += 1) {
      const dates = generateDates({
        rule: `FREQ=WEEKLY;BYDAY=${days[i]};COUNT=1`,
        start: new Date(2019, 0, 6),
        min: new Date(2019, 0, 6),
        max: new Date(2019, 0, 19),
        appointmentTimezoneOffset: 0,
      });
      expect(dates).toEqual([new Date(2019, 0, 6 + i)]);
    }
  });

  it('generateDates should handle strings with COUNT & BYMONTH', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=2;COUNT=10',
      start: new Date(2017, 0, 1),
      min: new Date(2017, 0, 1),
      max: new Date(2017, 11, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 0, 2),
      new Date(2017, 1, 2),
      new Date(2017, 2, 2),
      new Date(2017, 3, 2),
      new Date(2017, 4, 2),
      new Date(2017, 5, 2),
      new Date(2017, 6, 2),
      new Date(2017, 7, 2),
      new Date(2017, 8, 2),
      new Date(2017, 9, 2),
    ]);
  });

  it('generateDates should handle strings with BYYEARDAY, COUNT & YEARLY', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYYEARDAY=200,201;COUNT=10',
      start: new Date(2017, 0, 1),
      min: new Date(2017, 6, 1),
      max: new Date(2018, 7, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 6, 19),
      new Date(2017, 6, 20),
      new Date(2018, 6, 19),
      new Date(2018, 6, 20),
    ]);
  });

  it('generateDates should not have any string if count is out', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;INTERVAL=2;COUNT=2',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 1, 1),
      max: new Date(2015, 1, 21),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([]);
  });

  it('generateDates should handle strings with UNTIL', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;UNTIL=20160319T030000',
      start: new Date(2016, 2, 16, 3),
      min: new Date(2016, 1, 29),
      max: new Date(2016, 3, 10),
      exception: undefined,
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 2, 16, 3),
      new Date(2016, 2, 17, 3),
      new Date(2016, 2, 18, 3),
      new Date(2016, 2, 19, 3),
    ]);
  });

  it('generateDates should handle strings with UNTIL greater than endDate', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;UNTIL=20150219T000000',
      start: new Date(2015, 1, 1),
      min: new Date(2015, 1, 1),
      max: new Date(2015, 1, 3),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 1, 1),
      new Date(2015, 1, 2),
      new Date(2015, 1, 3),
    ]);
  });

  it('generateDates should handle strings with UNTIL without time', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;UNTIL=20150203',
      start: new Date(2015, 1, 1),
      min: new Date(2015, 1, 1),
      max: new Date(2015, 2, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 1, 1),
      new Date(2015, 1, 2),
      new Date(2015, 1, 3),
    ]);
  });

  it('generateDates should handle strings with BYMONTH', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYMONTH=2',
      start: new Date(2013, 0, 1),
      min: new Date(2013, 0, 1),
      max: new Date(2015, 2, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2013, 1, 1),
      new Date(2014, 1, 1),
      new Date(2015, 1, 1),
    ]);
  });

  it('generateDates should handle strings with several value in BYMONTH', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYMONTH=1,3',
      start: new Date(2014, 0, 1),
      min: new Date(2014, 0, 1),
      max: new Date(2015, 2, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2014, 0, 1),
      new Date(2014, 2, 1),
      new Date(2015, 0, 1),
      new Date(2015, 2, 1),
    ]);
  });

  it('generateDates should handle strings with BYMONTHDAY', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=2',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 2, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 2),
      new Date(2015, 1, 2),
      new Date(2015, 2, 2),
    ]);
  });

  it('generateDates should handle strings with MONTHLY & BYDAY', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYDAY=MO',
      start: new Date(2017, 8, 25),
      min: new Date(2017, 8, 20),
      max: new Date(2017, 9, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 8, 25),
      new Date(2017, 9, 2),
      new Date(2017, 9, 9),
      new Date(2017, 9, 16),
    ]);
  });

  it('generateDates should handle strings with BYMONTHDAY value < 0', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=-1',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 5, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 31),
      new Date(2015, 1, 28),
      new Date(2015, 2, 31),
      new Date(2015, 3, 30),
      new Date(2015, 4, 31),
    ]);
  });

  it('generateDates should handle strings with BYMONTHDAY value = -1, recStart - last day of Month (31st) (T515652)', () => {
    const firstRecurrence = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=-1',
      start: new Date(2017, 4, 31),
      min: new Date(2017, 4, 31),
      max: new Date(2017, 6, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(firstRecurrence).toEqual([
      new Date(2017, 4, 31),
      new Date(2017, 5, 30),
    ]);

    const secondRecurrence = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=-1',
      start: new Date(2017, 2, 31),
      min: new Date(2017, 2, 31),
      max: new Date(2017, 4, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(secondRecurrence).toEqual([
      new Date(2017, 2, 31),
      new Date(2017, 3, 30),
    ]);
  });

  it('generateDates should handle strings with COUNT, BYMONTHDAY=-1 and start in 31st', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=10',
      start: new Date(2017, 6, 31),
      min: new Date(2017, 6, 31),
      max: new Date(2017, 10, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 6, 31),
      new Date(2017, 7, 31),
      new Date(2017, 8, 30),
      new Date(2017, 9, 31),
    ]);
  });

  it('generateDates should handle strings with BYMONTHDAY value = -31', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=-31',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 6, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1),
      new Date(2015, 2, 1),
      new Date(2015, 4, 1),
      new Date(2015, 6, 1),
    ]);
  });

  it('generateDates should handle strings with BYMONTHDAY value = -25', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=-25',
      start: new Date(2015, 2, 1),
      min: new Date(2015, 2, 1),
      max: new Date(2015, 5, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 2, 7),
      new Date(2015, 3, 6),
      new Date(2015, 4, 7),
      new Date(2015, 5, 6),
    ]);
  });

  it('generateDates should handle strings with BYMONTHDAY && INTERVAL=2', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2',
      start: new Date(2016, 0, 11, 9),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 3, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2016, 2, 10, 9)]);
  });

  it('generateDates should handle strings with several value in BYMONTHDAY', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=11,22',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 2, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 11),
      new Date(2015, 0, 22),
      new Date(2015, 1, 11),
      new Date(2015, 1, 22),
      new Date(2015, 2, 11),
    ]);
  });

  it('generateDates should handle strings with BYMONTH & BYMONTHDAY', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTH=1;BYMONTHDAY=2',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 1),
      max: new Date(2015, 2, 19),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2015, 0, 2)]);
  });

  it('generateDates should handle strings with BYMONTHDAY correctly when recurrenceDate is out of range', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      start: new Date(2015, 4, 25, 9, 30),
      end: new Date(2015, 4, 26, 11, 30),
      min: new Date(2015, 4, 27),
      max: new Date(2015, 4, 27, 23, 59),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2015, 4, 26, 9, 30)]);
  });

  it('generateDates should handle strings with BYSECOND', () => {
    const dates = generateDates({
      rule: 'FREQ=MINUTELY;BYSECOND=15',
      start: new Date(2015, 0, 1, 1, 1, 10),
      min: new Date(2015, 0, 1, 1, 1, 10),
      max: new Date(2015, 0, 1, 1, 3, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 1, 1, 15),
      new Date(2015, 0, 1, 1, 2, 15),
      new Date(2015, 0, 1, 1, 3, 15),
    ]);
  });

  it('generateDates should handle strings with several value in BYSECOND', () => {
    const dates = generateDates({
      rule: 'FREQ=MINUTELY;BYSECOND=15,17',
      start: new Date(2015, 0, 1, 1, 1, 10),
      min: new Date(2015, 0, 1, 1, 1, 10),
      max: new Date(2015, 0, 1, 1, 2, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 1, 1, 15),
      new Date(2015, 0, 1, 1, 1, 17),
      new Date(2015, 0, 1, 1, 2, 15),
      new Date(2015, 0, 1, 1, 2, 17),
    ]);
  });

  it('generateDates should handle strings with BYMINUTE', () => {
    const dates = generateDates({
      rule: 'FREQ=HOURLY;BYMINUTE=15',
      start: new Date(2015, 0, 1, 1, 10),
      min: new Date(2015, 0, 1, 1, 10),
      max: new Date(2015, 0, 1, 3, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 1, 15),
      new Date(2015, 0, 1, 2, 15),
      new Date(2015, 0, 1, 3, 15),
    ]);
  });

  it('generateDates should handle strings with several value in BYMINUTE', () => {
    const dates = generateDates({
      rule: 'FREQ=HOURLY;BYMINUTE=15,17',
      start: new Date(2015, 0, 1, 1, 10),
      min: new Date(2015, 0, 1, 1, 10),
      max: new Date(2015, 0, 1, 2, 16),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 1, 15),
      new Date(2015, 0, 1, 1, 17),
      new Date(2015, 0, 1, 2, 15),
    ]);
  });

  it('generateDates should handle strings with BYHOUR', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYHOUR=15',
      start: new Date(2015, 0, 1, 10),
      min: new Date(2015, 0, 1, 10),
      max: new Date(2015, 0, 3, 20),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 15),
      new Date(2015, 0, 2, 15),
      new Date(2015, 0, 3, 15),
    ]);
  });

  it('generateDates should handle strings with several value in BYHOUR', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYHOUR=15,17',
      start: new Date(2015, 0, 1, 10),
      min: new Date(2015, 0, 1, 10),
      max: new Date(2015, 0, 2, 16),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 0, 1, 15),
      new Date(2015, 0, 1, 17),
      new Date(2015, 0, 2, 15),
    ]);
  });

  it('generateDates should handle strings with BYDAY to reduce date count', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYDAY=TU',
      start: new Date(2015, 1, 10),
      min: new Date(2015, 1, 10),
      max: new Date(2015, 2, 9),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 1, 10),
      new Date(2015, 1, 17),
      new Date(2015, 1, 24),
      new Date(2015, 2, 3),
    ]);
  });

  it('generateDates should handle strings with several value in BYDAY to reduce date count', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY;BYDAY=TU,SA',
      start: new Date(2015, 1, 10),
      min: new Date(2015, 1, 10),
      max: new Date(2015, 1, 23),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 1, 10),
      new Date(2015, 1, 14),
      new Date(2015, 1, 17),
      new Date(2015, 1, 21),
    ]);
  });

  it('generateDates should handle strings with BYYEARDAY, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYYEARDAY=200,201',
      start: new Date(2015, 1, 10),
      min: new Date(2015, 1, 10),
      max: new Date(2017, 1, 23),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 6, 19),
      new Date(2015, 6, 20),
      new Date(2016, 6, 18),
      new Date(2016, 6, 19),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & BYDAY, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=20,21;BYDAY=TU,SA',
      start: new Date(2015, 1, 10),
      min: new Date(2015, 1, 10),
      max: new Date(2016, 1, 23),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 12),
      new Date(2015, 4, 16),
      new Date(2015, 4, 19),
      new Date(2015, 4, 23),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=20',
      start: new Date(2015, 1, 10),
      min: new Date(2015, 1, 10),
      max: new Date(2016, 1, 23),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 11),
      new Date(2015, 4, 12),
      new Date(2015, 4, 13),
      new Date(2015, 4, 14),
      new Date(2015, 4, 15),
      new Date(2015, 4, 16),
      new Date(2015, 4, 17),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO on second year, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=20',
      start: new Date(2015, 1, 10),
      min: new Date(2016, 1, 10),
      max: new Date(2017, 1, 23),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 4, 16),
      new Date(2016, 4, 17),
      new Date(2016, 4, 18),
      new Date(2016, 4, 19),
      new Date(2016, 4, 20),
      new Date(2016, 4, 21),
      new Date(2016, 4, 22),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=TH, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=TH',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 14),
      new Date(2016, 0, 15),
      new Date(2016, 0, 16),
      new Date(2016, 0, 17),
      new Date(2016, 0, 18),
      new Date(2016, 0, 19),
      new Date(2016, 0, 20),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=FR, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=FR',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 15),
      new Date(2016, 0, 16),
      new Date(2016, 0, 17),
      new Date(2016, 0, 18),
      new Date(2016, 0, 19),
      new Date(2016, 0, 20),
      new Date(2016, 0, 21),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=SA, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=SA',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 16),
      new Date(2016, 0, 17),
      new Date(2016, 0, 18),
      new Date(2016, 0, 19),
      new Date(2016, 0, 20),
      new Date(2016, 0, 21),
      new Date(2016, 0, 22),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=SU, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=SU',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 17),
      new Date(2016, 0, 18),
      new Date(2016, 0, 19),
      new Date(2016, 0, 20),
      new Date(2016, 0, 21),
      new Date(2016, 0, 22),
      new Date(2016, 0, 23),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=MO, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=MO',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 18),
      new Date(2016, 0, 19),
      new Date(2016, 0, 20),
      new Date(2016, 0, 21),
      new Date(2016, 0, 22),
      new Date(2016, 0, 23),
      new Date(2016, 0, 24),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=TU, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=TU',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 12),
      new Date(2016, 0, 13),
      new Date(2016, 0, 14),
      new Date(2016, 0, 15),
      new Date(2016, 0, 16),
      new Date(2016, 0, 17),
      new Date(2016, 0, 18),
    ]);
  });

  it('generateDates should handle strings with BYWEEKNO & WKST=WE, YEARLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=WE',
      start: new Date(2016, 0, 1),
      min: new Date(2016, 0, 1),
      max: new Date(2016, 11, 31),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 0, 13),
      new Date(2016, 0, 14),
      new Date(2016, 0, 15),
      new Date(2016, 0, 16),
      new Date(2016, 0, 17),
      new Date(2016, 0, 18),
      new Date(2016, 0, 19),
    ]);
  });

  it('generateDates should handle strings with WKST, WEEKLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=TU;WKST=WE;INTERVAL=2',
      start: new Date(2017, 0, 12, 9, 0),
      min: new Date(2017, 0, 9),
      max: new Date(2017, 1, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 0, 17, 9),
      new Date(2017, 0, 31, 9),
    ]);
  });

  it('generateDates should handle strings with BYSETPOS', () => {
    const dates = generateDates({
      rule: 'FREQ=YEARLY;BYWEEKNO=8;BYSETPOS=-1,3',
      start: new Date(2017, 0, 1, 10),
      min: new Date(2017, 0, 1),
      max: new Date(2018, 0, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 1, 22, 10),
      new Date(2017, 1, 26, 10),
    ]);
  });

  it('generateDates, FREQ=MONTHLY;BYDAY;BYMONTHDAY;BYSETPOS=-1, [minDate; maxDate] < 1 month and [minDate; maxDate] is not include recurrent dates', () => {
    const rRule = 'FREQ=MONTHLY;BYDAY=TU;BYMONTHDAY=21,22,23,24,25,26,27,28,29,30,31;BYSETPOS=-1';
    const dates = generateDates({
      rule: rRule,
      start: new Date(2017, 0, 1, 10),
      min: new Date(2017, 0, 1),
      max: new Date(2017, 0, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([]);
  });

  it('generateDates, FREQ=MONTHLY;BYDAY;BYMONTHDAY;BYSETPOS=-1, [minDate; maxDate] < 1 and [minDate; maxDate] is include recurrent dates', () => {
    const rRule = 'FREQ=MONTHLY;BYDAY=TU;BYMONTHDAY=21,22,23,24,25,26,27,28,29,30,31;BYSETPOS=-1';
    const dates = generateDates({
      rule: rRule,
      start: new Date(2017, 0, 25, 10),
      min: new Date(2017, 0, 20),
      max: new Date(2017, 0, 31, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2017, 0, 31, 10)]);
  });

  it('generateDates, FREQ=MONTHLY;BYDAY;BYMONTHDAY;BYSETPOS=-1 if (maxDate - minDate) === 4 month', () => {
    const rRule = 'FREQ=MONTHLY;BYDAY=TU;BYMONTHDAY=21,22,23,24,25,26,27,28,29,30,31;BYSETPOS=-1';
    const dates = generateDates({
      rule: rRule,
      start: new Date(2017, 0, 1, 10),
      min: new Date(2017, 0, 1),
      max: new Date(2017, 4, 10),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 0, 31, 10),
      new Date(2017, 1, 28, 10),
      new Date(2017, 2, 28, 10),
      new Date(2017, 3, 25, 10),
    ]);
  });

  it('generateDates should handle recurrence exception in long format, DAILY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY',
      start: new Date(2015, 4, 24, 2),
      min: new Date(2015, 4, 24),
      max: new Date(2015, 4, 27, 10),
      exception: '20150525T020000',
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 4, 24, 2),
      new Date(2015, 4, 26, 2),
      new Date(2015, 4, 27, 2),
    ]);
  });

  it('generateDates should handle recurrence exception in long format with \'Z\', DAILY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=DAILY',
      start: new Date(Date.UTC(2015, 4, 24)),
      min: new Date(Date.UTC(2015, 4, 23, 21)),
      max: new Date(Date.UTC(2015, 4, 27, 7)),
      exception: '20150525T000000Z',
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(Date.UTC(2015, 4, 24)),
      new Date(Date.UTC(2015, 4, 26)),
      new Date(Date.UTC(2015, 4, 27)),
    ]);
  });

  it('generateDates should handle recurrence exception, WEEKLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO',
      start: new Date(2015, 0, 1),
      min: new Date(2015, 0, 5),
      max: new Date(2015, 0, 7),
      exception: '20150105',
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([]);
  });

  it('Weekly recurrences should be shown on the 29 February, WEEKLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO',
      start: new Date(2016, 1, 1, 2, 0),
      min: new Date(2016, 1, 1),
      max: new Date(2016, 2, 7),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2016, 1, 1, 2, 0),
      new Date(2016, 1, 8, 2, 0),
      new Date(2016, 1, 15, 2, 0),
      new Date(2016, 1, 22, 2, 0),
      new Date(2016, 1, 29, 2, 0),
    ]);
  });

  it('generateDates should handle strings correctly if interval starts from any day, WEEKLY rule', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO,TH,SA',
      start: new Date(2015, 2, 12),
      min: new Date(2015, 2, 12),
      max: new Date(2015, 2, 18, 23, 59),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2015, 2, 12),
      new Date(2015, 2, 14),
      new Date(2015, 2, 16),
    ]);
  });

  it('generateDates should handle strings correctly for WEEKLY rule with BYDAY for next week', () => {
    const dates = generateDates({
      rule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH',
      start: new Date(2017, 5, 29, 9),
      min: new Date(2017, 6, 3),
      max: new Date(2017, 6, 7, 23, 59),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      new Date(2017, 6, 3, 9),
      new Date(2017, 6, 4, 9),
      new Date(2017, 6, 5, 9),
      new Date(2017, 6, 6, 9),
    ]);
  });

  it('get date by month recurrence with start date at 31', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY',
      start: new Date(2015, 0, 31),
      min: new Date(2015, 1, 15),
      max: new Date(2015, 5, 5),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2015, 2, 31), new Date(2015, 4, 31)]);
  });

  it('get date by month recurrence with BYMONTHDAY at 31', () => {
    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=31',
      start: new Date(2015, 1, 15),
      min: new Date(2015, 1, 15),
      max: new Date(2015, 5, 5),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([new Date(2015, 2, 31), new Date(2015, 4, 31)]);
  });

  it('get date by month recurrence with BYMONTHDAY=31, FREQ=MONTHLY, COUNT and skiping dates with last day of month < 31', () => {
    const start = new Date(2020, 2, 31, 9, 30);

    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=31;COUNT=3',
      start,
      end: new Date(2020, 2, 31, 11),
      min: new Date(2020, 2, 1),
      max: new Date(2020, 10, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([start, new Date(2020, 4, 31, 9, 30), new Date(2020, 6, 31, 9, 30)]);
  });

  it('get date by month recurrence with BYMONTHDAY=31, FREQ=MONTHLY and skiping dates with last day of month < 31', () => {
    const start = new Date(2020, 2, 31, 16, 0);

    const dates = generateDates({
      rule: 'FREQ=MONTHLY;BYMONTHDAY=31',
      start,
      end: new Date(2020, 2, 31, 16, 30),
      min: new Date(2020, 2, 1),
      max: new Date(2020, 10, 1),
      appointmentTimezoneOffset: 0,
    });

    expect(dates).toEqual([
      start,
      new Date(2020, 4, 31, 16, 0),
      new Date(2020, 6, 31, 16, 0),
      new Date(2020, 7, 31, 16, 0),
      new Date(2020, 9, 31, 16, 0),
    ]);
  });
});
