/* eslint-disable jest/no-standalone-expect */
import { shallow } from 'enzyme';
import each from 'jest-each';
import {
  CheckBoxIcon, viewFunction,
} from '../check_box_icon';

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
