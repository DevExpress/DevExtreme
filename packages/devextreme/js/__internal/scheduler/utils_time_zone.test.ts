import {
  afterAll, beforeAll, describe, expect, it, jest,
} from '@jest/globals';
import { macroTaskArray } from '@ts/scheduler/utils/index';

import { globalCache } from './global_cache';
import timeZoneList from './timezones/timezone_list';
import timeZoneUtils from './utils_time_zone';

const defaultTimeZones = timeZoneList.value;

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
