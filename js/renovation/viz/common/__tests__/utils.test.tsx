import { getFormatValue } from '../utils';
import formatHelper from '../../../../format_helper';

jest.mock('../../../../format_helper', () => ({
  format: jest.fn().mockReturnValue('formated_value'),
}));

describe('#getFormatValue', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return formated value', () => {
    expect(getFormatValue(10, '', { argumentFormat: 'argument_format', format: 'value_format' })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, 'value_format');
  });

  it('should return formated argument', () => {
    expect(getFormatValue(10, 'argument', { argumentFormat: 'argument_format', format: 'value_format' })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, 'argument_format');
  });

  it('should return percent format', () => {
    expect(getFormatValue(10, 'percent', { argumentFormat: 'argument_format', format: 'value_format' })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, { type: 'percent' });
  });

  it('should return percent format, percentPrecision is defined', () => {
    expect(getFormatValue(10, 'percent', { argumentFormat: 'argument_format', format: { percentPrecision: 3 } })).toEqual('formated_value');
    expect(formatHelper.format).toBeCalledWith(10, { type: 'percent', precision: 3 });
  });
});
