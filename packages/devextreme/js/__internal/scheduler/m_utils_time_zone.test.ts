import {
  beforeAll, describe, expect, it, jest,
} from '@jest/globals';

import { globalCache } from './global_cache';
import timeZoneUtils from './m_utils_time_zone';
import timeZoneList from './timezones/timezone_list';

describe('timezone utils', () => {
  beforeAll(() => {
    globalCache.timezones.clear();
  });

  describe('calculateTimezoneByValue', () => {
    it('should cache the results', () => {
      timeZoneList.value.forEach((timezone) => {
        timeZoneUtils.calculateTimezoneByValue(timezone);
      });

      jest.spyOn(Intl, 'DateTimeFormat');
      timeZoneList.value.forEach((timezone) => {
        timeZoneUtils.calculateTimezoneByValue(timezone);
      });

      expect(globalCache.timezones.size).toBe(timeZoneList.value.length);
      expect(Intl.DateTimeFormat).toHaveBeenCalledTimes(0);
    });
  });
});
