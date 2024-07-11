"use strict";

var _jestEach = _interopRequireDefault(require("jest-each"));
var _date = require("./date");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
describe('Date utils', () => {
  describe('addOffsets function', () => {
    (0, _jestEach.default)`
         offsets | expectedResult
         ${[0]} | ${new Date('2023-09-05T00:00:00Z')}
         ${[SECOND_MS]} | ${new Date('2023-09-05T00:00:01Z')}
         ${[-HOUR_MS]} | ${new Date('2023-09-04T23:00:00Z')}
         ${[2 * HOUR_MS, -HOUR_MS]} | ${new Date('2023-09-05T01:00:00Z')}
         ${[SECOND_MS, MINUTE_MS, HOUR_MS, DAY_MS]} | ${new Date('2023-09-06T01:01:01Z')}
         ${[-SECOND_MS, -MINUTE_MS, -HOUR_MS, -DAY_MS]} | ${new Date('2023-09-03T22:58:59Z')}
         ${[HOUR_MS, -HOUR_MS]} | ${new Date('2023-09-05T00:00:00Z')}
    `.it('should add ms offsets to date correctly', _ref => {
      let {
        offsets,
        expectedResult
      } = _ref;
      const date = new Date('2023-09-05T00:00:00Z');
      const result = _date.dateUtilsTs.addOffsets(date, offsets);
      expect(result).toEqual(expectedResult);
    });
  });
});