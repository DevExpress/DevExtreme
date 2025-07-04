import {
  beforeAll, describe, expect, it,
} from '@jest/globals';

import { globalCache } from './global_cache';
import timeZoneUtils from './m_utils_time_zone';
import timeZoneList from './timezones/timezone_list';

describe('timezone utils', () => {
  beforeAll(() => {
    globalCache.timezones.clear();
  });

  describe('calculateTimezoneByValue', () => {
    it('should work faster after first run', () => {
      let now = Date.now();
      timeZoneList.value.forEach((timezone) => {
        timeZoneUtils.calculateTimezoneByValue(timezone);
      });
      const delta1 = Date.now() - now; // 41
      now = Date.now();
      timeZoneList.value.forEach((timezone) => {
        timeZoneUtils.calculateTimezoneByValue(timezone);
      });
      const delta2 = Date.now() - now; // 6

      expect(globalCache.timezones.size).toBe(timeZoneList.value.length);
      expect(delta2).toBeLessThan(delta1 / 5);
    });
  });
});
