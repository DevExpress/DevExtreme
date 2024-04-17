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
    describe('Methods', () => {
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

        it('should not raise any error if getElementComputedStyle returns null', () => {
          const checkBoxIcon = new CheckBoxIcon({});
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          (getElementComputedStyle as Mock).mockReturnValue(null);

          expect(() => { checkBoxIcon.getComputedIconSize(); }).not.toThrow();
        });
      });

      describe('getIconSize', () => {
        beforeEach(() => {
          jest.resetAllMocks();
        });

        it('should return size prop if it is a number', () => {
          const size = 17;
          const checkBoxIcon = new CheckBoxIcon({ size: 17 });

          expect(checkBoxIcon.getIconSize(size)).toEqual(17);
        });

        it('should return parsed number if size is specified as a pixel string', () => {
          const size = '17px';
          const checkBoxIcon = new CheckBoxIcon({ size });

          expect(checkBoxIcon.getIconSize(size)).toEqual(17);
        });

        it('should return computed style width if size is specified not as a number and not as a pixel string', () => {
          const size = '100%';
          const checkBoxIcon = new CheckBoxIcon({ size });
          checkBoxIcon.elementRef = { current: { style: {} } } as RefObject<HTMLDivElement>;
          (getElementComputedStyle as Mock).mockReturnValue({ width: '100px' });

          expect(checkBoxIcon.getIconSize(size)).toEqual(100);
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
