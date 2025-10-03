import {
  describe, expect, it,
} from '@jest/globals';

import { generateRecurrenceUTCDates } from './generate_recurrence_utc_dates';

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const timeZone = 'Etc/UTC';

describe('generateRecurrenceUTCDates', () => {
  it('should return source start date with undefined rule', () => {
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: false,
      recurrenceRule: undefined,
      source: {
        startDate: Date.UTC(2015, 0, 1, 0, 0, 10),
        endDate: Date.UTC(2015, 0, 1, 0, 0, 11),
      },
    }, {
      interval: {
        min: Date.UTC(2015, 0, 1, 0, 0, 10),
        max: Date.UTC(2015, 0, 1, 0, 0, 12),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2015, 0, 1, 0, 0, 10)]);
  });

  it('get date by second recurrence', () => {
    const start = Date.UTC(2015, 0, 1, 0, 0, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=SECONDLY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      interval: {
        min: Date.UTC(2015, 0, 1, 0, 0, 10),
        max: Date.UTC(2015, 0, 1, 0, 0, 12),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 0, 0, 10),
      Date.UTC(2015, 0, 1, 0, 0, 11),
      Date.UTC(2015, 0, 1, 0, 0, 12),
    ]);
  });

  it('get date by minute recurrence', () => {
    const start = Date.UTC(2015, 0, 1, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MINUTELY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 0, 1),
        max: Date.UTC(2015, 0, 1, 0, 3),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 0, 1),
      Date.UTC(2015, 0, 1, 0, 2),
      Date.UTC(2015, 0, 1, 0, 3),
    ]);
  });

  it('get date by hour recurrence', () => {
    const start = Date.UTC(2015, 0, 1, 8);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=HOURLY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 8),
        max: Date.UTC(2015, 0, 1, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 8),
      Date.UTC(2015, 0, 1, 9),
      Date.UTC(2015, 0, 1, 10),
    ]);
  });

  it('get date by day recurrence', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 0, 3),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2015, 0, 1), Date.UTC(2015, 0, 2), Date.UTC(2015, 0, 3)]);
  });

  it('get date by day recurrence, endDate of part is min', () => {
    const start = Date.UTC(2015, 4, 26);
    const end = Date.UTC(2015, 4, 27);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 4, 31),
        max: Date.UTC(2015, 5, 2),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 30),
      Date.UTC(2015, 4, 31),
      Date.UTC(2015, 5, 1),
      Date.UTC(2015, 5, 2),
    ]);
  });

  it('get date by week recurrence', () => {
    const start = Date.UTC(2015, 0, 15);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 15),
        max: Date.UTC(2015, 1, 5),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 15),
      Date.UTC(2015, 0, 22),
      Date.UTC(2015, 0, 29),
      Date.UTC(2015, 1, 5),
    ]);
  });

  it('get date by month recurrence', () => {
    const start = Date.UTC(2015, 1, 15);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 15),
        max: Date.UTC(2015, 5, 5),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 1, 15),
      Date.UTC(2015, 2, 15),
      Date.UTC(2015, 3, 15),
      Date.UTC(2015, 4, 15),
    ]);
  });

  it('get date by year recurrence', () => {
    const start = Date.UTC(2015, 11, 15);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 11, 15),
        max: Date.UTC(2019, 5, 5),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 11, 15),
      Date.UTC(2016, 11, 15),
      Date.UTC(2017, 11, 15),
      Date.UTC(2018, 11, 15),
    ]);
  });

  it('get date by recurrence with 2 day INTERVAL', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 0, 7),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1),
      Date.UTC(2015, 0, 3),
      Date.UTC(2015, 0, 5),
      Date.UTC(2015, 0, 7),
    ]);
  });

  it('should handle strings with DAILY & BYDAY=SU rules and start in Sunday', () => {
    const start = Date.UTC(2015, 4, 24);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYDAY=SU',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 4, 20),
        max: Date.UTC(2015, 5, 7),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 24),
      Date.UTC(2015, 4, 31),
      Date.UTC(2015, 5, 7),
    ]);
  });

  it('should handle strings with WEEKLY & BYDAY=SU rules and start in Sunday', () => {
    const start = Date.UTC(2018, 4, 27);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2018, 4, 27),
        max: Date.UTC(2018, 5, 11),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2018, 4, 27),
      Date.UTC(2018, 5, 3),
      Date.UTC(2018, 5, 10),
    ]);
  });

  it('should handle strings with DAILY & BYDAY=MO rules and WKST=WE', () => {
    const start = Date.UTC(2015, 4, 18);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;WKST=WE;BYDAY=MO',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 4, 18),
        max: Date.UTC(2015, 5, 7),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 18),
      Date.UTC(2015, 4, 25),
      Date.UTC(2015, 5, 1),
    ]);
  });

  it('should handle strings with DAILY, BYDAY = whole week, WKST rules', () => {
    const start = Date.UTC(2015, 4, 18);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=WE',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 4, 18),
        max: Date.UTC(2015, 4, 26),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 18),
      Date.UTC(2015, 4, 19),
      Date.UTC(2015, 4, 20),
      Date.UTC(2015, 4, 21),
      Date.UTC(2015, 4, 22),
      Date.UTC(2015, 4, 23),
      Date.UTC(2015, 4, 24),
      Date.UTC(2015, 4, 25),
      Date.UTC(2015, 4, 26),
    ]);
  });

  it('should handle strings with COUNT', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;INTERVAL=3;COUNT=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 0, 21),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1),
      Date.UTC(2015, 0, 4),
    ]);
  });

  it('should handle strings with COUNT without range', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=4',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 0, 21),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 2),
      Date.UTC(2015, 0, 5),
      Date.UTC(2015, 0, 7),
      Date.UTC(2015, 0, 9),
    ]);
  });

  it('should handle strings with COUNT & BYDAY', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 0, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 2),
      Date.UTC(2015, 0, 5),
      Date.UTC(2015, 0, 7),
      Date.UTC(2015, 0, 9),
      Date.UTC(2015, 0, 12),
      Date.UTC(2015, 0, 14),
      Date.UTC(2015, 0, 16),
      Date.UTC(2015, 0, 19),
    ]);
  });

  it('should handle strings with COUNT & BYDAY & DAILY', () => {
    const start = Date.UTC(2018, 4, 14);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYDAY=MO;COUNT=7',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2018, 4, 14),
        max: Date.UTC(2018, 6, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2018, 4, 14),
      Date.UTC(2018, 4, 21),
      Date.UTC(2018, 4, 28),
      Date.UTC(2018, 5, 4),
      Date.UTC(2018, 5, 11),
      Date.UTC(2018, 5, 18),
      Date.UTC(2018, 5, 25),
    ]);
  });

  it('should handle strings with COUNT & BYDAY & WEEKLY & INTERVAL', () => {
    const start = Date.UTC(2019, 2, 4, 9);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2019, 2, 4, 8),
        max: Date.UTC(2019, 6, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2019, 2, 4, 9),
      Date.UTC(2019, 2, 18, 9),
    ]);
  });

  it('generateRecurrenceUTCDates: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2', () => {
    const start = Date.UTC(2019, 2, 4, 9);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2;COUNT=2',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2019, 2, 4, 8),
        max: Date.UTC(2019, 6, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2019, 2, 4, 9),
      Date.UTC(2019, 2, 18, 9),
    ]);
  });

  it('generateRecurrenceUTCDates: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2', () => {
    const start = Date.UTC(2019, 2, 4, 9);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=2',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2019, 2, 4, 8),
        max: Date.UTC(2019, 2, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2019, 2, 4, 9),
      Date.UTC(2019, 2, 18, 9),
    ]);
  });

  it('generateRecurrenceUTCDates: FREQ=WEEKLY;BYDAY=[all days], min: Date.UTC(2019, 0, 6), max: Date.UTC(2015, 0, 12)', () => {
    for (let i = 0; i < days.length; i += 1) {
      const start = Date.UTC(2019, 0, 6);
      const dates = generateRecurrenceUTCDates({
        hasRecurrenceRule: true,
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${days[i]}`,
        source: {
          startDate: start,
          endDate: start,
        },
      }, {
        firstDayOfWeek: 0,
        interval: {
          min: Date.UTC(2019, 0, 6),
          max: Date.UTC(2019, 0, 12),
        },
        timeZone,
      });
      expect(dates).toEqual([Date.UTC(2019, 0, 6 + i)]);
    }
  });

  it('generateRecurrenceUTCDates: FREQ=WEEKLY;BYDAY=[all days], min: Date.UTC(2015, 0, 4), max: Date.UTC(2015, 0, 17)', () => {
    for (let i = 0; i < days.length; i += 1) {
      const start = Date.UTC(2019, 0, 6);
      const dates = generateRecurrenceUTCDates({
        hasRecurrenceRule: true,
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${days[i]}`,
        source: {
          startDate: start,
          endDate: start,
        },
      }, {
        firstDayOfWeek: 0,
        interval: {
          min: Date.UTC(2019, 0, 6),
          max: Date.UTC(2019, 0, 19),
        },
        timeZone,
      });
      expect(dates).toEqual([
        Date.UTC(2019, 0, 6 + i),
        Date.UTC(2019, 0, 13 + i),
      ]);
    }
  });

  it('generateRecurrenceUTCDates: FREQ=WEEKLY;BYDAY=[all days];COUNT=1, min: Date.UTC(2015, 0, 4), max: Date.UTC(2015, 0, 17)', () => {
    for (let i = 0; i < days.length; i += 1) {
      const start = Date.UTC(2019, 0, 6);
      const dates = generateRecurrenceUTCDates({
        hasRecurrenceRule: true,
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${days[i]};COUNT=1`,
        source: {
          startDate: start,
          endDate: start,
        },
      }, {
        firstDayOfWeek: 0,
        interval: {
          min: Date.UTC(2019, 0, 6),
          max: Date.UTC(2019, 0, 19),
        },
        timeZone,
      });
      expect(dates).toEqual([Date.UTC(2019, 0, 6 + i)]);
    }
  });

  it('should handle strings with COUNT & BYMONTH', () => {
    const start = Date.UTC(2017, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=2;COUNT=10',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 0, 1),
        max: Date.UTC(2017, 11, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 0, 2),
      Date.UTC(2017, 1, 2),
      Date.UTC(2017, 2, 2),
      Date.UTC(2017, 3, 2),
      Date.UTC(2017, 4, 2),
      Date.UTC(2017, 5, 2),
      Date.UTC(2017, 6, 2),
      Date.UTC(2017, 7, 2),
      Date.UTC(2017, 8, 2),
      Date.UTC(2017, 9, 2),
    ]);
  });

  it('should handle strings with BYYEARDAY, COUNT & YEARLY', () => {
    const start = Date.UTC(2017, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYYEARDAY=200,201;COUNT=10',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 6, 1),
        max: Date.UTC(2018, 7, 1),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 6, 19),
      Date.UTC(2017, 6, 20),
      Date.UTC(2018, 6, 19),
      Date.UTC(2018, 6, 20),
    ]);
  });

  it('should not have any string if count is out', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 1),
        max: Date.UTC(2015, 1, 21),
      },
      timeZone,
    });

    expect(dates).toEqual([]);
  });

  it('should handle strings with UNTIL greater than endDate', () => {
    const start = Date.UTC(2015, 1, 1);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;UNTIL=20150219T000000',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 1),
        max: Date.UTC(2015, 1, 3),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 1, 1),
      Date.UTC(2015, 1, 2),
      Date.UTC(2015, 1, 3),
    ]);
  });

  it('should handle strings with BYMONTH', () => {
    const start = Date.UTC(2013, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYMONTH=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2013, 0, 1),
        max: Date.UTC(2015, 2, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2013, 1, 1),
      Date.UTC(2014, 1, 1),
      Date.UTC(2015, 1, 1),
    ]);
  });

  it('should handle strings with several value in BYMONTH', () => {
    const start = Date.UTC(2014, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYMONTH=1,3',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2014, 0, 1),
        max: Date.UTC(2015, 2, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2014, 0, 1),
      Date.UTC(2014, 2, 1),
      Date.UTC(2015, 0, 1),
      Date.UTC(2015, 2, 1),
    ]);
  });

  it('should handle strings with BYMONTHDAY', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 2, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 2),
      Date.UTC(2015, 1, 2),
      Date.UTC(2015, 2, 2),
    ]);
  });

  it('should handle strings with MONTHLY & BYDAY', () => {
    const start = Date.UTC(2017, 8, 25);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=MO',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 8, 20),
        max: Date.UTC(2017, 9, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 8, 25),
      Date.UTC(2017, 9, 2),
      Date.UTC(2017, 9, 9),
      Date.UTC(2017, 9, 16),
    ]);
  });

  it('should handle strings with BYMONTHDAY value < 0', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=-1',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 5, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 31),
      Date.UTC(2015, 1, 28),
      Date.UTC(2015, 2, 31),
      Date.UTC(2015, 3, 30),
      Date.UTC(2015, 4, 31),
    ]);
  });

  it('should handle strings with BYMONTHDAY value = -1, recStart - last day of Month (31st) (T515652)', () => {
    const start1 = Date.UTC(2017, 4, 31);
    const end1 = start1;
    const firstRecurrence = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=-1',
      source: {
        startDate: start1,
        endDate: end1,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 4, 31),
        max: Date.UTC(2017, 6, 1),
      },
      timeZone,
    });

    expect(firstRecurrence).toEqual([
      Date.UTC(2017, 4, 31),
      Date.UTC(2017, 5, 30),
    ]);

    const start2 = Date.UTC(2017, 2, 31);
    const end2 = start2;
    const secondRecurrence = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=-1',
      source: {
        startDate: start2,
        endDate: end2,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 2, 31),
        max: Date.UTC(2017, 4, 1),
      },
      timeZone,
    });

    expect(secondRecurrence).toEqual([
      Date.UTC(2017, 2, 31),
      Date.UTC(2017, 3, 30),
    ]);
  });

  it('should handle strings with COUNT, BYMONTHDAY=-1 and start in 31st', () => {
    const start = Date.UTC(2017, 6, 31);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=10',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 6, 31),
        max: Date.UTC(2017, 10, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 6, 31),
      Date.UTC(2017, 7, 31),
      Date.UTC(2017, 8, 30),
      Date.UTC(2017, 9, 31),
    ]);
  });

  it('should handle strings with BYMONTHDAY value = -31', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=-31',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 6, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1),
      Date.UTC(2015, 2, 1),
      Date.UTC(2015, 4, 1),
      Date.UTC(2015, 6, 1),
    ]);
  });

  it('should handle strings with BYMONTHDAY value = -25', () => {
    const start = Date.UTC(2015, 2, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=-25',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 2, 1),
        max: Date.UTC(2015, 5, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 2, 7),
      Date.UTC(2015, 3, 6),
      Date.UTC(2015, 4, 7),
      Date.UTC(2015, 5, 6),
    ]);
  });

  it('should handle strings with BYMONTHDAY && INTERVAL=2', () => {
    const start = Date.UTC(2016, 0, 11, 9);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 3, 1),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2016, 2, 10, 9)]);
  });

  it('should handle strings with several value in BYMONTHDAY', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=11,22',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 2, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 11),
      Date.UTC(2015, 0, 22),
      Date.UTC(2015, 1, 11),
      Date.UTC(2015, 1, 22),
      Date.UTC(2015, 2, 11),
    ]);
  });

  it('should handle strings with BYMONTH & BYMONTHDAY', () => {
    const start = Date.UTC(2015, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTH=1;BYMONTHDAY=2',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1),
        max: Date.UTC(2015, 2, 19),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2015, 0, 2)]);
  });

  it('should handle strings with BYMONTHDAY correctly when recurrenceDate is out of range', () => {
    const start = Date.UTC(2015, 4, 25, 9, 30);
    const end = Date.UTC(2015, 4, 26, 11, 30);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 4, 27),
        max: Date.UTC(2015, 4, 27, 23, 59),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2015, 4, 26, 9, 30)]);
  });

  it('should handle strings with BYSECOND', () => {
    const start = Date.UTC(2015, 0, 1, 1, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MINUTELY;BYSECOND=15',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 1, 1, 10),
        max: Date.UTC(2015, 0, 1, 1, 3, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 1, 1, 15),
      Date.UTC(2015, 0, 1, 1, 2, 15),
      Date.UTC(2015, 0, 1, 1, 3, 15),
    ]);
  });

  it('should handle strings with several value in BYSECOND', () => {
    const start = Date.UTC(2015, 0, 1, 1, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MINUTELY;BYSECOND=15,17',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 1, 1, 10),
        max: Date.UTC(2015, 0, 1, 1, 2, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 1, 1, 15),
      Date.UTC(2015, 0, 1, 1, 1, 17),
      Date.UTC(2015, 0, 1, 1, 2, 15),
      Date.UTC(2015, 0, 1, 1, 2, 17),
    ]);
  });

  it('should handle strings with BYMINUTE', () => {
    const start = Date.UTC(2015, 0, 1, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=HOURLY;BYMINUTE=15',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 1, 10),
        max: Date.UTC(2015, 0, 1, 3, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 1, 15),
      Date.UTC(2015, 0, 1, 2, 15),
      Date.UTC(2015, 0, 1, 3, 15),
    ]);
  });

  it('should handle strings with several value in BYMINUTE', () => {
    const start = Date.UTC(2015, 0, 1, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=HOURLY;BYMINUTE=15,17',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 1, 10),
        max: Date.UTC(2015, 0, 1, 2, 16),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 1, 15),
      Date.UTC(2015, 0, 1, 1, 17),
      Date.UTC(2015, 0, 1, 2, 15),
    ]);
  });

  it('should handle strings with BYHOUR', () => {
    const start = Date.UTC(2015, 0, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYHOUR=15',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 10),
        max: Date.UTC(2015, 0, 3, 20),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 15),
      Date.UTC(2015, 0, 2, 15),
      Date.UTC(2015, 0, 3, 15),
    ]);
  });

  it('should handle strings with several value in BYHOUR', () => {
    const start = Date.UTC(2015, 0, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYHOUR=15,17',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 0, 1, 10),
        max: Date.UTC(2015, 0, 2, 16),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 0, 1, 15),
      Date.UTC(2015, 0, 1, 17),
      Date.UTC(2015, 0, 2, 15),
    ]);
  });

  it('should handle strings with BYDAY to reduce date count', () => {
    const start = Date.UTC(2015, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYDAY=TU',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 10),
        max: Date.UTC(2015, 2, 9),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 1, 10),
      Date.UTC(2015, 1, 17),
      Date.UTC(2015, 1, 24),
      Date.UTC(2015, 2, 3),
    ]);
  });

  it('should handle strings with several value in BYDAY to reduce date count', () => {
    const start = Date.UTC(2015, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=DAILY;BYDAY=TU,SA',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 10),
        max: Date.UTC(2015, 1, 23),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 1, 10),
      Date.UTC(2015, 1, 14),
      Date.UTC(2015, 1, 17),
      Date.UTC(2015, 1, 21),
    ]);
  });

  it('should handle strings with BYYEARDAY, YEARLY rule', () => {
    const start = Date.UTC(2015, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYYEARDAY=200,201',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 10),
        max: Date.UTC(2017, 1, 23),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 6, 19),
      Date.UTC(2015, 6, 20),
      Date.UTC(2016, 6, 18),
      Date.UTC(2016, 6, 19),
    ]);
  });

  it('should handle strings with BYWEEKNO & BYDAY, YEARLY rule', () => {
    const start = Date.UTC(2015, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=20,21;BYDAY=TU,SA',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 10),
        max: Date.UTC(2016, 1, 23),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 12),
      Date.UTC(2015, 4, 16),
      Date.UTC(2015, 4, 19),
      Date.UTC(2015, 4, 23),
    ]);
  });

  it('should handle strings with BYWEEKNO, YEARLY rule', () => {
    const start = Date.UTC(2015, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=20',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 10),
        max: Date.UTC(2016, 1, 23),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 11),
      Date.UTC(2015, 4, 12),
      Date.UTC(2015, 4, 13),
      Date.UTC(2015, 4, 14),
      Date.UTC(2015, 4, 15),
      Date.UTC(2015, 4, 16),
      Date.UTC(2015, 4, 17),
    ]);
  });

  it('should handle strings with BYWEEKNO on second year, YEARLY rule', () => {
    const start = Date.UTC(2015, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=20',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 1, 10),
        max: Date.UTC(2017, 1, 23),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 4, 16),
      Date.UTC(2016, 4, 17),
      Date.UTC(2016, 4, 18),
      Date.UTC(2016, 4, 19),
      Date.UTC(2016, 4, 20),
      Date.UTC(2016, 4, 21),
      Date.UTC(2016, 4, 22),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=TH, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=TH',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 14),
      Date.UTC(2016, 0, 15),
      Date.UTC(2016, 0, 16),
      Date.UTC(2016, 0, 17),
      Date.UTC(2016, 0, 18),
      Date.UTC(2016, 0, 19),
      Date.UTC(2016, 0, 20),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=FR, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=FR',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 15),
      Date.UTC(2016, 0, 16),
      Date.UTC(2016, 0, 17),
      Date.UTC(2016, 0, 18),
      Date.UTC(2016, 0, 19),
      Date.UTC(2016, 0, 20),
      Date.UTC(2016, 0, 21),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=SA, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=SA',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 16),
      Date.UTC(2016, 0, 17),
      Date.UTC(2016, 0, 18),
      Date.UTC(2016, 0, 19),
      Date.UTC(2016, 0, 20),
      Date.UTC(2016, 0, 21),
      Date.UTC(2016, 0, 22),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=SU, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=SU',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 17),
      Date.UTC(2016, 0, 18),
      Date.UTC(2016, 0, 19),
      Date.UTC(2016, 0, 20),
      Date.UTC(2016, 0, 21),
      Date.UTC(2016, 0, 22),
      Date.UTC(2016, 0, 23),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=MO, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=MO',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 18),
      Date.UTC(2016, 0, 19),
      Date.UTC(2016, 0, 20),
      Date.UTC(2016, 0, 21),
      Date.UTC(2016, 0, 22),
      Date.UTC(2016, 0, 23),
      Date.UTC(2016, 0, 24),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=TU, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=TU',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 12),
      Date.UTC(2016, 0, 13),
      Date.UTC(2016, 0, 14),
      Date.UTC(2016, 0, 15),
      Date.UTC(2016, 0, 16),
      Date.UTC(2016, 0, 17),
      Date.UTC(2016, 0, 18),
    ]);
  });

  it('should handle strings with BYWEEKNO & WKST=WE, YEARLY rule', () => {
    const start = Date.UTC(2016, 0, 1);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=3;WKST=WE',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 0, 1),
        max: Date.UTC(2016, 11, 31),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 0, 13),
      Date.UTC(2016, 0, 14),
      Date.UTC(2016, 0, 15),
      Date.UTC(2016, 0, 16),
      Date.UTC(2016, 0, 17),
      Date.UTC(2016, 0, 18),
      Date.UTC(2016, 0, 19),
    ]);
  });

  it('should handle strings with WKST, WEEKLY rule', () => {
    const start = Date.UTC(2017, 0, 12, 9, 0);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;WKST=WE;INTERVAL=2',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 0, 9),
        max: Date.UTC(2017, 1, 1),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 0, 17, 9),
      Date.UTC(2017, 0, 31, 9),
    ]);
  });

  it('should handle strings with BYSETPOS', () => {
    const start = Date.UTC(2017, 0, 1, 10);
    const end = start;
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=YEARLY;BYWEEKNO=8;BYSETPOS=-1,3',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 0, 1),
        max: Date.UTC(2018, 0, 1),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 1, 22, 10),
      Date.UTC(2017, 1, 26, 10),
    ]);
  });

  it('generateRecurrenceUTCDates, FREQ=MONTHLY;BYDAY;BYMONTHDAY;BYSETPOS=-1, [minDate; maxDate] < 1 month and [minDate; maxDate] is not include recurrent dates', () => {
    const rRule = 'FREQ=MONTHLY;BYDAY=TU;BYMONTHDAY=21,22,23,24,25,26,27,28,29,30,31;BYSETPOS=-1';
    const start = Date.UTC(2017, 0, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: rRule,
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 0, 1),
        max: Date.UTC(2017, 0, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([]);
  });

  it('generateRecurrenceUTCDates, FREQ=MONTHLY;BYDAY;BYMONTHDAY;BYSETPOS=-1, [minDate; maxDate] < 1 and [minDate; maxDate] is include recurrent dates', () => {
    const rRule = 'FREQ=MONTHLY;BYDAY=TU;BYMONTHDAY=21,22,23,24,25,26,27,28,29,30,31;BYSETPOS=-1';
    const start = Date.UTC(2017, 0, 25, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: rRule,
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 0, 20),
        max: Date.UTC(2017, 0, 31, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2017, 0, 31, 10)]);
  });

  it('generateRecurrenceUTCDates, FREQ=MONTHLY;BYDAY;BYMONTHDAY;BYSETPOS=-1 if (maxDate - minDate) === 4 month', () => {
    const rRule = 'FREQ=MONTHLY;BYDAY=TU;BYMONTHDAY=21,22,23,24,25,26,27,28,29,30,31;BYSETPOS=-1';
    const start = Date.UTC(2017, 0, 1, 10);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: rRule,
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 0, 1),
        max: Date.UTC(2017, 4, 10),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 0, 31, 10),
      Date.UTC(2017, 1, 28, 10),
      Date.UTC(2017, 2, 28, 10),
      Date.UTC(2017, 3, 25, 10),
    ]);
  });

  it('Weekly recurrences should be shown on the 29 February, WEEKLY rule', () => {
    const start = Date.UTC(2016, 1, 1, 2, 0);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2016, 1, 1),
        max: Date.UTC(2016, 2, 7),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2016, 1, 1, 2, 0),
      Date.UTC(2016, 1, 8, 2, 0),
      Date.UTC(2016, 1, 15, 2, 0),
      Date.UTC(2016, 1, 22, 2, 0),
      Date.UTC(2016, 1, 29, 2, 0),
    ]);
  });

  it('should handle strings correctly if interval starts from any day, WEEKLY rule', () => {
    const start = Date.UTC(2015, 2, 12);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH,SA',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 2, 12),
        max: Date.UTC(2015, 2, 18, 23, 59),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 2, 12),
      Date.UTC(2015, 2, 14),
      Date.UTC(2015, 2, 16),
    ]);
  });

  it('should handle strings correctly for WEEKLY rule with BYDAY for next week', () => {
    const start = Date.UTC(2017, 5, 29, 9);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2017, 6, 3),
        max: Date.UTC(2017, 6, 7, 23, 59),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2017, 6, 3, 9),
      Date.UTC(2017, 6, 4, 9),
      Date.UTC(2017, 6, 5, 9),
      Date.UTC(2017, 6, 6, 9),
    ]);
  });

  it('get date by month recurrence with start date at 31', () => {
    const start = Date.UTC(2015, 2, 31);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 3, 15),
        max: Date.UTC(2015, 7, 5),
      },
      timeZone,
    });

    expect(dates).toEqual([
      Date.UTC(2015, 4, 31),
      Date.UTC(2015, 6, 31),
    ]);
  });

  it('get date by month recurrence with BYMONTHDAY at 31', () => {
    const start = Date.UTC(2015, 1, 15);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=31',
      source: {
        startDate: start,
        endDate: start,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2015, 1, 15),
        max: Date.UTC(2015, 5, 5),
      },
      timeZone,
    });

    expect(dates).toEqual([Date.UTC(2015, 2, 31), Date.UTC(2015, 4, 31)]);
  });

  it('get date by month recurrence with BYMONTHDAY=31, FREQ=MONTHLY, COUNT and skiping dates with last day of month < 31', () => {
    const start = Date.UTC(2020, 2, 31, 9, 30);
    const end = Date.UTC(2020, 2, 31, 11);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=31;COUNT=3',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2020, 2, 1),
        max: Date.UTC(2020, 10, 1),
      },
      timeZone,
    });

    expect(dates).toEqual([start, Date.UTC(2020, 4, 31, 9, 30), Date.UTC(2020, 6, 31, 9, 30)]);
  });

  it('get date by month recurrence with BYMONTHDAY=31, FREQ=MONTHLY and skiping dates with last day of month < 31', () => {
    const start = Date.UTC(2020, 2, 31, 16, 0);
    const end = Date.UTC(2020, 2, 31, 16, 30);
    const dates = generateRecurrenceUTCDates({
      hasRecurrenceRule: true,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=31',
      source: {
        startDate: start,
        endDate: end,
      },
    }, {
      firstDayOfWeek: 0,
      interval: {
        min: Date.UTC(2020, 2, 1),
        max: Date.UTC(2020, 10, 1),
      },
      timeZone,
    });

    expect(dates).toEqual([
      start,
      Date.UTC(2020, 4, 31, 16, 0),
      Date.UTC(2020, 6, 31, 16, 0),
      Date.UTC(2020, 7, 31, 16, 0),
      Date.UTC(2020, 9, 31, 16, 0),
    ]);
  });
});
