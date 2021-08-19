/* eslint-disable jest/no-standalone-expect */
import { shallow } from 'enzyme';
import each from 'jest-each';
import { RefObject } from '@devextreme-generator/declarations';
import getElementComputedStyle from '../../../../utils/get_computed_style';
import { current } from '../../../../../ui/themes';
import {
  CheckBoxIcon, viewFunction,
} from '../check_box_icon';
import { getDefaultIconSize, getFontSizeByIconSize } from '../utils';
import { getWindow, setWindow } from '../../../../../core/utils/window';

interface Mock extends jest.Mock {}

jest.mock('../../../../utils/get_computed_style');

jest.mock('../../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('CheckBoxIconIcon', () => {
  describe('Render', () => {
    it('should render span with "dx-checkbox-class" class', () => {
      const checkBoxIconIcon = shallow(viewFunction({} as CheckBoxIcon));
      const span = checkBoxIconIcon.find('span');
      expect(span.props()).toMatchObject({
        className: 'dx-checkbox-icon',
      });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('updateIconFontSize', () => {
        afterEach(() => {
          jest.resetAllMocks();
        });

        it('should not do anything if there is no window', () => {
          const checkBoxIcon = new CheckBoxIcon({});
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          const icon = checkBoxIcon.elementRef.current!;

          setWindow(getWindow(), false);
          try {
            checkBoxIcon.updateFontSize();

            expect(icon.style.fontSize).toEqual(undefined);
          } finally {
            setWindow(getWindow(), true);
          }
        });

        it('should set icon font size', () => {
          const checkBoxIcon = new CheckBoxIcon({ size: 22 });
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          const icon = checkBoxIcon.elementRef.current!;

          checkBoxIcon.updateFontSize();

          expect(icon.style.fontSize).toEqual('16px');
        });

        it('should set default generic theme font-size if theme is not defined (e.g. in SSR)', () => {
          (current as Mock).mockReturnValue(undefined);
          const checkBoxIcon = new CheckBoxIcon({ size: 22 });
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          const icon = checkBoxIcon.elementRef.current!;

          checkBoxIcon.updateFontSize();

          expect(icon.style.fontSize).toEqual('16px');
        });

        each(['material', 'generic', 'material-compact', 'generic-compact'])
          .describe('%s theme', (theme) => {
            it('should set fontSize properly when size is specified', () => {
              (current as Mock).mockReturnValue(theme);
              const iconSize = getDefaultIconSize();

              const checkBoxIcon = new CheckBoxIcon({ size: iconSize });
              checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
              const icon = checkBoxIcon.elementRef.current!;

              checkBoxIcon.updateFontSize();

              const expectedValue = `${getFontSizeByIconSize(iconSize)}px`;
              expect(icon.style.fontSize).toEqual(expectedValue);
            });

            it('should set fontSize properly when size is not speified', () => {
              (current as Mock).mockReturnValue(theme);
              const iconSize = getDefaultIconSize();
              (getElementComputedStyle as Mock).mockReturnValue({ width: iconSize });

              const checkBoxIcon = new CheckBoxIcon({});
              checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
              const icon = checkBoxIcon.elementRef.current!;

              checkBoxIcon.updateFontSize();

              const expectedValue = `${getFontSizeByIconSize(iconSize)}px`;
              expect(icon.style.fontSize).toEqual(expectedValue);
            });
          });

        it('should update icon font size correctly if size prop is specified as a pixel string', () => {
          const iconSize = '22px';
          (getElementComputedStyle as Mock).mockReturnValue({ width: iconSize });

          const checkBoxIcon = new CheckBoxIcon({ size: iconSize });
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          const icon = checkBoxIcon.elementRef.current!;

          checkBoxIcon.updateFontSize();

          expect(icon.style.fontSize).toEqual('16px');
        });

        it("should use default icon size if 'getElementComputedStyle' util returns null", () => {
          (getElementComputedStyle as Mock).mockReturnValue(null);

          const checkBoxIcon = new CheckBoxIcon({});
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          const icon = checkBoxIcon.elementRef.current!;

          checkBoxIcon.updateFontSize();

          expect(icon.style.fontSize).toEqual('16px');
        });
      });
    });

    describe('Methods', () => {
      describe('setIconFontSize', () => {
        it('should set element font size', () => {
          const checkBoxIcon = new CheckBoxIcon({});
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          const icon = checkBoxIcon.elementRef.current!;

          checkBoxIcon.setIconFontSize(50);

          expect(icon.style.fontSize).toEqual('50px');
        });
      });

      describe('getComputedIconSize', () => {
        beforeEach(() => {
          jest.resetAllMocks();
        });

        it('should return element computed style width as a number', () => {
          const checkBoxIcon = new CheckBoxIcon({});
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          (getElementComputedStyle as Mock).mockReturnValue({ width: '200px' });

          expect(checkBoxIcon.getComputedIconSize()).toEqual(200);
        });

        it('should return default icon size if element computed style width is 0', () => {
          const checkBoxIcon = new CheckBoxIcon({});
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          (getElementComputedStyle as Mock).mockReturnValue({ width: 0 });

          const defaultIconSize = getDefaultIconSize();
          expect(checkBoxIcon.getComputedIconSize()).toEqual(defaultIconSize);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssStyles', () => {
        each([22, '22px'])
          .it('should have "22px" width and height is size=%s', (value) => {
            const checkBoxIcon = new CheckBoxIcon({ size: value });

            expect(checkBoxIcon.cssStyles).toMatchObject({ width: '22px', height: '22px' });
          });

        each(['50%', '1em', 'auto'])
          .it('should have %s width and height if it is passed to size prop', (value) => {
            const checkBoxIcon = new CheckBoxIcon({ size: value });

            expect(checkBoxIcon.cssStyles).toMatchObject({ width: value, height: value });
          });
      });
    });
  });
});
