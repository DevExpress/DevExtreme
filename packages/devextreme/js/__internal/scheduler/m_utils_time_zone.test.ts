import {
  afterAll, beforeAll, describe, expect, it, jest,
} from '@jest/globals';
import { macroTaskArray } from '@ts/scheduler/utils/index';

import { globalCache } from './global_cache';
import timeZoneUtils from './m_utils_time_zone';
import timeZoneList from './timezones/timezone_list';

const defaultTimeZones = timeZoneList.value;

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

  describe('cacheTimeZones / getTimeZonesCache', () => {
    beforeAll(() => {
      timeZoneList.value = [
        'Etc/GMT+12',
        'Etc/GMT+11',
      ];
    });
    afterAll(() => {
      timeZoneList.value = defaultTimeZones;
    });

    it('should cache timezones only once and save into global variable', async () => {
      const mock = jest.spyOn(macroTaskArray, 'map');

      expect(timeZoneUtils.getTimeZonesCache()).toEqual([]);
      await timeZoneUtils.cacheTimeZones();
      expect(timeZoneUtils.getTimeZonesCache()).toEqual([
        { id: 'Etc/GMT+12', title: '(GMT -12:00) Etc - GMT+12' },
        { id: 'Etc/GMT+11', title: '(GMT -11:00) Etc - GMT+11' },
      ]);
      await timeZoneUtils.cacheTimeZones();
      await timeZoneUtils.cacheTimeZones();
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTimeZones', () => {
    it('should return timezones with offsets of default timezones list', () => {
      timeZoneList.value = [
        'Etc/GMT+12',
        'Etc/GMT+11',
      ];
      expect(timeZoneUtils.getTimeZones(
        new Date('2025-04-23T10:00:00Z'),
      )).toEqual([
        { id: 'Etc/GMT+12', title: '(GMT -12:00) Etc - GMT+12', offset: -12 },
        { id: 'Etc/GMT+11', title: '(GMT -11:00) Etc - GMT+11', offset: -11 },
      ]);
      timeZoneList.value = defaultTimeZones;
    });

    it('should return timezones with offsets of custom timezones list', () => {
      expect(timeZoneUtils.getTimeZones(
        new Date('2025-04-23T10:00:00Z'),
        ['Canada/Pacific'],
      )).toEqual([
        { id: 'Canada/Pacific', title: '(GMT -07:00) Canada - Pacific', offset: -7 },
      ]);
    });
  });
});
