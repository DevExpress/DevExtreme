import { h } from 'preact';
import { mount, ReactWrapper } from 'enzyme';
import DeleteButton from '../../../../js/renovation/scheduler/appointment-tooltip/delete-button';
import Button, { ButtonProps } from '../../../../js/renovation/button';

jest.mock('../../../../js/renovation/button', () => () => null);

describe('DeleteButton', () => {
  describe('View', () => {
    const render = (props = {}): ReactWrapper => {
      window.h = h;
      return mount(<DeleteButton {...props} />).childAt(0);
    };
    const defaultProps: ButtonProps = {
      onClick: jest.fn(),
    };

    it('should render component correctly', () => {
      const tree = render(defaultProps);

      expect(tree.type())
        .toBe(Button);
      expect(tree.children())
        .toHaveLength(0);
    });

    it('should pass correct properties to button', () => {
      const tree = render(defaultProps);

      const button = tree.find(Button);
      expect(button.props())
        .toMatchObject({
          icon: 'trash',
          stylingMode: 'text',
          onClick: defaultProps.onClick,
          className: 'dx-tooltip-appointment-item-delete-button',
        });
    });
  });
});
