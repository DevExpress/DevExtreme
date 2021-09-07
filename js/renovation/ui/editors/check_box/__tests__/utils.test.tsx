import each from 'jest-each';
import { getDefaultIconSize, getFontSizeByIconSize, getDefaultFontSize } from '../utils';
import { current } from '../../../../../ui/themes';

interface Mock extends jest.Mock {}

jest.mock('../../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

const defaultIconSizes = {
  generic: 22,
  material: 18,
  'generic-compact': 16,
  'material-compact': 16,
};

const defaultFontSizes = {
  true: {
    generic: 16,
    material: 16,
    'generic-compact': 10,
    'material-compact': 14,
  },
  false: {
    generic: 12,
    material: 20,
    'generic-compact': 8,
    'material-compact': 18,
  },
};

each(['material', 'generic', 'generic-compact', 'material-compact'])
  .describe('%s theme', (theme) => {
    afterEach(() => { jest.resetAllMocks(); });

    describe('getDefaultIconSize', () => {
      it('returns correct default icon size', () => {
        (current as Mock).mockReturnValue(theme);

        expect(getDefaultIconSize()).toEqual(defaultIconSizes[theme]);
      });
    });

    each([true, false])
      .describe('isChecked=%s', (isChecked) => {
        describe('getDefaultFontSize', () => {
          it('returns correct default font size', () => {
            (current as Mock).mockReturnValue(theme);

            const resultFontSize = getDefaultFontSize(isChecked);
            expect(resultFontSize).toEqual(defaultFontSizes[isChecked][theme]);
          });
        });

        describe('getFontSizeByIconSize', () => {
          it('returns correct font size by icon size', () => {
            (current as Mock).mockReturnValue(theme);

            const resultFontSize = getFontSizeByIconSize(1, isChecked);
            const expectedFontSize = Math.ceil(
              defaultFontSizes[isChecked][theme] / defaultIconSizes[theme],
            );
            expect(resultFontSize).toEqual(expectedFontSize);
          });
        });
      });
  });
