import getThemeType from '../getThemeType';
import {
  isFluent, isMaterial, isCompact, current,
} from '../../../ui/themes';

jest.mock('../../../ui/themes', () => ({
  current: jest.fn(() => 'test_current'),
  isFluent: jest.fn(() => 'test_isFluent'),
  isMaterial: jest.fn(() => 'test_isMaterial'),
  isCompact: jest.fn(() => 'test_isCompact'),
}));

describe('getThemeType', () => {
  it('should return isMaterial correctly', () => {
    expect(getThemeType())
      .toEqual({
        isCompact: 'test_isCompact',
        isMaterial: 'test_isMaterial',
        isFluent: 'test_isFluent',
      });

    expect(isFluent)
      .toBeCalledWith('test_current');

    expect(isMaterial)
      .toBeCalledWith('test_current');

    expect(isCompact)
      .toBeCalledWith('test_current');

    expect(current)
      .toBeCalledTimes(1);
  });
});
