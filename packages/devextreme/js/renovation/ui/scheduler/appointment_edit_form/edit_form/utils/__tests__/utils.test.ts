import {
  normalizeNewStartDate,
  normalizeNewEndDate,
} from '../normalizeDate';

describe('Utils', () => {
  const invalidDate = new Date(11111111111111112);

  describe('normalizeNewStartDate', () => {
    [
      {
        newStartDate: new Date(2020, 0, 1, 11),
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 10),
      },
      {
        newStartDate: new Date(2020, 0, 1, 9),
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 9),
      },
      {
        newStartDate: invalidDate,
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 8),
      },
      {
        newStartDate: undefined,
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 8),
      },
      {
        newStartDate: null,
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: null,
      },
    ].forEach(({
      newStartDate,
      currentStartDate,
      currentEndDate,
      expected,
    }) => {
      it(`should correctly normalize date if new startDate=${newStartDate}`, () => {
        expect(normalizeNewStartDate(newStartDate as any, currentStartDate, currentEndDate))
          .toEqual(expected);
      });
    });
  });

  describe('normalizeNewEndDate', () => {
    [
      {
        newEndDate: new Date(2020, 0, 1, 7),
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 8),
      },
      {
        newEndDate: new Date(2020, 0, 1, 11),
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 11),
      },
      {
        newEndDate: invalidDate,
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 10),
      },
      {
        newEndDate: undefined,
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: new Date(2020, 0, 1, 10),
      },
      {
        newEndDate: null,
        currentStartDate: new Date(2020, 0, 1, 8),
        currentEndDate: new Date(2020, 0, 1, 10),
        expected: null,
      },
    ].forEach(({
      newEndDate,
      currentStartDate,
      currentEndDate,
      expected,
    }) => {
      it(`should correctly normalize date if new endDate=${newEndDate}`, () => {
        expect(normalizeNewEndDate(newEndDate, currentStartDate, currentEndDate))
          .toEqual(expected);
      });
    });
  });
});
