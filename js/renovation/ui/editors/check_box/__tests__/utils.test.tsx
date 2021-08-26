import each from 'jest-each';
import { getDefaultIconSize, getFontSizeByIconSize } from '../utils';
import { current } from '../../../../../ui/themes';

interface Mock extends jest.Mock {}

jest.mock('../../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

const defaultIconSizes = {
  generic: 22,
  material: 18,
  compact: 16,
};

const defaultFontSizes = {
  generic: 16,
  material: 16,
  compact: 12,
};

each(['material', 'generic', 'compact'])
  .describe('%s theme', (theme) => {
    afterEach(() => { jest.resetAllMocks(); });

    describe('getDefaultIconSize', () => {
      it(`returns correct default icon size in ${theme} theme`, () => {
        (current as Mock).mockReturnValue(theme);

        expect(getDefaultIconSize()).toEqual(defaultIconSizes[theme]);
      });
    });

    describe('getFontSizeByIconSize', () => {
      it(`returns correct font size in ${theme} theme`, () => {
        (current as Mock).mockReturnValue(theme);

        const resultFontSize = getFontSizeByIconSize(1);
        const expectedFontSize = Math.ceil(defaultFontSizes[theme] / defaultIconSizes[theme]);
        expect(resultFontSize).toEqual(expectedFontSize);
      });
    });
  });
