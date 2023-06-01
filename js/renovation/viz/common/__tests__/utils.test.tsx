import { getFormatValue, isUpdatedFlatObject } from '../utils';
import formatHelper from '../../../../format_helper';

jest.mock('../../../../format_helper', () => ({
  format: jest.fn().mockReturnValue('formated_value'),
}));

describe('getFormatValue', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call formatHelper with format', () => {
    expect(getFormatValue(10, '', { argumentFormat: 'argument_format', format: 'value_format' })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, 'value_format');
  });

  it('should call formatHelper with argumentFormat', () => {
    expect(getFormatValue(10, 'argument', { argumentFormat: 'argument_format', format: 'value_format' })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, 'argument_format');
  });

  it('should call formatHelper with percent format', () => {
    expect(getFormatValue(10, 'percent', { argumentFormat: 'argument_format', format: 'value_format' })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, { type: 'percent' });
  });

  it('should call formatHelper with percent format and precision, percentPrecision is defined', () => {
    expect(getFormatValue(10, 'percent', { argumentFormat: 'argument_format', format: { percentPrecision: 3 } })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, { type: 'percent', precision: 3 });
  });
});

describe('isUpdatedFlatObject', () => {
  it('should return false for empty objects', () => {
    expect(isUpdatedFlatObject({}, {})).toBe(false);
  });

  it('should return false for \'undefined\' arguments', () => {
    expect(isUpdatedFlatObject(undefined, undefined)).toBe(false);
  });

  it('should return false for \'null\' arguments', () => {
    expect(isUpdatedFlatObject(null, null)).toBe(false);
  });

  it('should return false for objects with same fields', () => {
    expect(isUpdatedFlatObject({ a: 1, b: 'c' }, { a: 1, b: 'c' })).toBe(false);
  });

  it('should return true for objects with different fields', () => {
    expect(isUpdatedFlatObject({ a: 1, b: 'd' }, { a: 1, b: 'c' })).toBe(true);
  });

  it('should return true for objects with additional fields', () => {
    expect(isUpdatedFlatObject({ a: 1, b: 'c', e: 2 }, { a: 1, b: 'c' })).toBe(true);
  });
});
