import getThemeType from '../getThemeType';
import { isMaterial, isCompact, current } from '../../../ui/themes';

jest.mock('../../../ui/themes', () => ({
  current: jest.fn(() => 'test_current'),
  isMaterial: jest.fn(() => 'test_isMaterial'),
  isCompact: jest.fn(() => 'test_isCompact'),
}));

describe('getThemeType', () => {
  it('should return isMaterial correctly', () => {
    expect(getThemeType())
      .toEqual({
        isCompact: 'test_isCompact',
        isMaterial: 'test_isMaterial',
      });

    expect(isMaterial)
      .toBeCalledWith('test_current');

    expect(isCompact)
      .toBeCalledWith('test_current');

    expect(current)
      .toBeCalledTimes(1);
  });
});
