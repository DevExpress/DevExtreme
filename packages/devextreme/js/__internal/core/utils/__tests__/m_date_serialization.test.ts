import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';

const {
  createLocalDateFromUTCTimestamp,
  dateParser,
  deserializeDate,
  serializeDate,
  getDateSerializationFormat,
} = dateSerialization;

const time = (value: unknown): number => (value as Date).getTime();

describe('Date serialization utils', () => {
  afterEach(() => {
    config({ forceIsoDateParsing: true });
  });

  describe('createLocalDateFromUTCTimestamp', () => {
    it('should create the local midnight of the UTC date', () => {
      const result = createLocalDateFromUTCTimestamp(Date.UTC(2020, 4, 17, 23, 59, 59));

      expect(time(result)).toBe(time(new Date(2020, 4, 17)));
    });
  });

  describe('deserializeDate', () => {
    it('should create a date from a number', () => {
      const result = deserializeDate(1234567890000);

      expect(result).toBeInstanceOf(Date);
      expect(time(result)).toBe(1234567890000);
    });

    it('should parse an ISO string without a time zone as a local date', () => {
      expect(time(deserializeDate('2020-05-17'))).toBe(time(new Date(2020, 4, 17)));
      expect(time(deserializeDate('2020-05-17T10:20:30'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30)));
      expect(time(deserializeDate('2020-05-17T10:20'))).toBe(time(new Date(2020, 4, 17, 10, 20)));
      expect(time(deserializeDate('2020-05-17T10'))).toBe(time(new Date(2020, 4, 17, 10)));
    });

    it('should parse an ISO string with the Z designator as UTC', () => {
      expect(time(deserializeDate('2020-05-17T10:20:30Z'))).toBe(Date.UTC(2020, 4, 17, 10, 20, 30));
    });

    it('should apply the time zone offset of an ISO string', () => {
      expect(time(deserializeDate('2020-05-17T10:20:30+03:00'))).toBe(Date.UTC(2020, 4, 17, 7, 20, 30));
      expect(time(deserializeDate('2020-05-17T10:20:30-02:30'))).toBe(Date.UTC(2020, 4, 17, 12, 50, 30));
      expect(time(deserializeDate('2020-05-17T10:20:30+0300'))).toBe(Date.UTC(2020, 4, 17, 7, 20, 30));
      expect(time(deserializeDate('2020-05-17T10:20:30+03'))).toBe(Date.UTC(2020, 4, 17, 7, 20, 30));
    });

    it('should parse the milliseconds of an ISO string', () => {
      expect(time(deserializeDate('2020-05-17T10:20:30.5'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30, 500)));
      expect(time(deserializeDate('2020-05-17T10:20:30.12'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30, 120)));
      expect(time(deserializeDate('2020-05-17T10:20:30.123456'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30, 123)));
    });

    it('should parse an ISO string without separators', () => {
      expect(time(deserializeDate('20200517T102030'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30)));
      expect(time(deserializeDate('20200517'))).toBe(time(new Date(2020, 4, 17)));
    });

    it('should parse a time string as a time of the zero date', () => {
      expect(time(deserializeDate('10:20:30'))).toBe(time(new Date(0, 0, 0, 10, 20, 30)));
      expect(time(deserializeDate('10:20'))).toBe(time(new Date(0, 0, 0, 10, 20, 0)));
    });

    it('should keep the year of an ISO string below 100', () => {
      const result = deserializeDate('0050-01-02T03:04:05') as Date;

      expect(result.getFullYear()).toBe(50);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(2);
      expect((deserializeDate('0050-01-02T03:04:05Z') as Date).getUTCFullYear()).toBe(50);
    });

    it('should parse a partial ISO date as a local date', () => {
      expect(time(deserializeDate('2020-05'))).toBe(time(new Date(2020, 4, 1)));
      expect(time(deserializeDate('2020'))).toBe(time(new Date(2020, 0, 1)));
    });

    it('should parse the default serialization formats', () => {
      expect(time(deserializeDate('2020/05/17'))).toBe(time(new Date(2020, 4, 17)));
      expect(time(deserializeDate('2020/05/17 10:20:30'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30)));
    });

    it('should build a date of the default serialization format that the native parser rejects', () => {
      expect(time(deserializeDate('2020/13/45'))).toBe(time(new Date(2021, 1, 14)));
    });

    it('should return a string that is not a date as is', () => {
      expect(deserializeDate('not a date')).toBe('not a date');
      expect(deserializeDate('')).toBe('');
    });

    it('should return the values that are not strings and numbers as is', () => {
      const date = new Date(5);
      const object = {};

      expect(deserializeDate(date)).toBe(date);
      expect(deserializeDate(object)).toBe(object);
      expect(deserializeDate(null)).toBeNull();
      expect(deserializeDate(undefined)).toBeUndefined();
      expect(deserializeDate(true)).toBe(true);
    });

    it('should parse an ISO date with the native parser when the ISO parsing is not forced', () => {
      config({ forceIsoDateParsing: false });

      expect(time(deserializeDate('2020-05-17'))).toBe(Date.UTC(2020, 4, 17));
      expect(time(deserializeDate('2020-05-17T10:20:30Z'))).toBe(Date.UTC(2020, 4, 17, 10, 20, 30));
      expect(time(deserializeDate('2020/05/17'))).toBe(time(new Date(2020, 4, 17)));
    });
  });

  describe('dateParser', () => {
    it('should parse ISO strings by default', () => {
      expect(time(dateParser('2020-05-17T10:20:30'))).toBe(time(new Date(2020, 4, 17, 10, 20, 30)));
      expect(time(dateParser('2020-05-17T10:20:30Z'))).toBe(Date.UTC(2020, 4, 17, 10, 20, 30));
    });

    it('should skip the ISO parsing on demand', () => {
      expect(time(dateParser('2020-05-17', true))).toBe(Date.UTC(2020, 4, 17));
    });

    it('should return a value that is not a date as is', () => {
      expect(dateParser('abc')).toBe('abc');
      expect(dateParser(null)).toBeNull();
    });
  });

  describe('serializeDate', () => {
    const date = new Date(2020, 4, 17, 10, 20, 30);

    it('should return the value as is without a serialization format', () => {
      const object = {};

      expect(serializeDate(date)).toBe(date);
      expect(serializeDate(date, '')).toBe(date);
      expect(serializeDate(date, null)).toBe(date);
      expect(serializeDate('text')).toBe('text');
      expect(serializeDate(object, undefined)).toBe(object);
      expect(serializeDate(5)).toBe(5);
    });

    it('should return null for a value that is not a date', () => {
      expect(serializeDate('2020-05-17', 'yyyy-MM-dd')).toBeNull();
      expect(serializeDate(5, 'number')).toBeNull();
      expect(serializeDate(null, 'yyyy')).toBeNull();
      expect(serializeDate(undefined, 'yyyy')).toBeNull();
    });

    it('should serialize a date to the number of milliseconds', () => {
      expect(serializeDate(new Date(5), 'number')).toBe(5);
    });

    it('should format a date with the serialization format', () => {
      expect(serializeDate(date, 'yyyy-MM-dd')).toBe('2020-05-17');
      expect(serializeDate(date, 'yyyy/MM/dd HH:mm:ss')).toBe('2020/05/17 10:20:30');
      expect(serializeDate(date, 'HH:mm')).toBe('10:20');
      expect(serializeDate(date, 'yyyyMMdd')).toBe('20200517');
    });
  });

  describe('getDateSerializationFormat', () => {
    it('should return the number format for a number', () => {
      expect(getDateSerializationFormat(0)).toBe('number');
      expect(getDateSerializationFormat(1234567890000)).toBe('number');
    });

    it('should return the format of an ISO string', () => {
      expect(getDateSerializationFormat('2020-05-17')).toBe('yyyy-MM-dd');
      expect(getDateSerializationFormat('20200517')).toBe('yyyyMMdd');
      expect(getDateSerializationFormat('2020-05-17T10')).toBe('yyyy-MM-ddTHH');
      expect(getDateSerializationFormat('2020-05-17T10:20')).toBe('yyyy-MM-ddTHH:mm');
      expect(getDateSerializationFormat('2020-05-17T10:20:30')).toBe('yyyy-MM-ddTHH:mm:ss');
      expect(getDateSerializationFormat('2020-05-17T10:20:30.123')).toBe('yyyy-MM-ddTHH:mm:ss.SSS');
      expect(getDateSerializationFormat('20200517T102030')).toBe('yyyyMMddTHHmmss');
    });

    it('should return the format of an ISO string with a time zone', () => {
      expect(getDateSerializationFormat('2020-05-17T10:20:30Z')).toBe('yyyy-MM-ddTHH:mm:ss\'Z\'');
      expect(getDateSerializationFormat('2020-05-17T10:20:30+03:00')).toBe('yyyy-MM-ddTHH:mm:ssxxx');
      expect(getDateSerializationFormat('2020-05-17T10:20:30+0300')).toBe('yyyy-MM-ddTHH:mm:ssxx');
      expect(getDateSerializationFormat('2020-05-17T10:20:30+03')).toBe('yyyy-MM-ddTHH:mm:ssx');
    });

    it('should return the format of a time string', () => {
      expect(getDateSerializationFormat('10:20')).toBe('HH:mm');
      expect(getDateSerializationFormat('10:20:30')).toBe('HH:mm:ss');
    });

    it('should return the default formats for the other strings', () => {
      expect(getDateSerializationFormat('2020/05/17')).toBe('yyyy/MM/dd');
      expect(getDateSerializationFormat('text')).toBe('yyyy/MM/dd');
      expect(getDateSerializationFormat('')).toBe('yyyy/MM/dd');
      expect(getDateSerializationFormat('2020/05/17 10:20:30')).toBe('yyyy/MM/dd HH:mm:ss');
      expect(getDateSerializationFormat('May 17, 2020 10:20')).toBe('yyyy/MM/dd HH:mm:ss');
    });

    it('should not detect an ISO format when the ISO parsing is not forced', () => {
      config({ forceIsoDateParsing: false });

      expect(getDateSerializationFormat('2020-05-17')).toBe('yyyy/MM/dd');
      expect(getDateSerializationFormat('2020-05-17T10:20:30')).toBe('yyyy/MM/dd HH:mm:ss');
    });

    it('should return null for the other truthy values', () => {
      expect(getDateSerializationFormat(new Date())).toBeNull();
      expect(getDateSerializationFormat({})).toBeNull();
      expect(getDateSerializationFormat(true)).toBeNull();
    });

    it('should return undefined for the falsy values that are not numbers or strings', () => {
      expect(getDateSerializationFormat(null)).toBeUndefined();
      expect(getDateSerializationFormat(undefined)).toBeUndefined();
      expect(getDateSerializationFormat(false)).toBeUndefined();
    });
  });
});
