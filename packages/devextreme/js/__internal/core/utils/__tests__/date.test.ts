import each from 'jest-each';

// eslint-disable-next-line forbidden-imports/no-restricted-imports
import { dateUtilsTs } from '../date';

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

describe('Date utils', () => {
  describe('addOffsets function', () => {
    each`offsets | expectedResult
         ${[0]} | ${new Date('2023-09-05T00:00:00Z')}
         ${[SECOND_MS]} | ${new Date('2023-09-05T00:00:01Z')}
         ${[-HOUR_MS]} | ${new Date('2023-09-04T23:00:00Z')}
         ${[2 * HOUR_MS, -HOUR_MS]} | ${new Date('2023-09-05T01:00:00Z')}
         ${[SECOND_MS, MINUTE_MS, HOUR_MS, DAY_MS]} | ${new Date('2023-09-06T01:01:01Z')}
         ${[-SECOND_MS, -MINUTE_MS, -HOUR_MS, -DAY_MS]} | ${new Date('2023-09-03T22:58:59Z')}
         ${[HOUR_MS, -HOUR_MS]} | ${new Date('2023-09-05T00:00:00Z')}
    `
      .it('should add ms offsets to date correctly', ({
        offsets,
        expectedResult,
      }) => {
        const date = new Date('2023-09-05T00:00:00Z');

        const result = dateUtilsTs.addOffsets(date, offsets);

        expect(result).toEqual(expectedResult);
      });
  });
});
