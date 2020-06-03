import { h } from 'preact';
import { mount, ReactWrapper } from 'enzyme';
import DeleteButton from '../../../../js/renovation/scheduler/appointment-tooltip/delete-button.p';
import Button from '../../../../js/renovation/button.p';

jest.mock('../../../../js/renovation/button.p', () => () => null);

describe('DeleteButton', () => {
  describe('View', () => {
    const render = (props = {}): ReactWrapper => {
      window.h = h;
      return mount(<DeleteButton {...props} />).childAt(0);
    };
    const defaultProps: DeleteButtonProps = {
      onClick: jest.fn(),
    };

    it('should render components correctly', () => {
      const tree = render(defaultProps);

      expect(tree.is('.dx-tooltip-appointment-item-delete-button'))
        .toBe(true);
      expect(tree.children())
        .toHaveLength(1);

      const button = tree.childAt(0);
      expect(button.exists())
        .toBe(true);
      expect(button.type())
        .toBe(Button);
      expect(button.children())
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
        });
    });
  });
});
