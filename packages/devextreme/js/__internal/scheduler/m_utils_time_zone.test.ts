import {
  afterAll, beforeAll, describe, expect, it, jest,
} from '@jest/globals';
import { macroTaskArray } from '@ts/scheduler/utils/index';

import timeZoneUtils from './m_utils_time_zone';
import { timeZonesMock } from './m_utils_time_zone.mock';
import timeZoneList from './timezones/timezone_list';

const defaultTimeZones = timeZoneList.value;

describe('timezone utils', () => {
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
      expect(timeZoneUtils.getTimeZones(
        new Date('2025-04-23T10:00:00Z'),
      )).toEqual(timeZonesMock);
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
