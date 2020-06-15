import { h } from 'preact';
import { shallow } from 'enzyme';
import { DeleteButtonProps, viewFunction as DeleteButtonView } from '../../../../js/renovation/scheduler/appointment-tooltip/delete-button';
import Button from '../../../../js/renovation/button';

describe('DeleteButton', () => {
  describe('View', () => {
    const defaultProps: DeleteButtonProps = {
      ...(new DeleteButtonProps()),
      onClick: jest.fn(),
    };

    it('should render component correctly', () => {
      const tree = shallow(<DeleteButtonView props={{ ...defaultProps }} />);

      expect(tree.type())
        .toBe(Button);
      expect(tree.props())
        .toMatchObject({
          icon: 'trash',
          stylingMode: 'text',
          onClick: defaultProps.onClick,
        });
    });

    it('should combine `className` with predefined classes', () => {
      const tree = shallow(<DeleteButtonView props={{ ...defaultProps, className: 'custom-class' }} />);

      expect(tree.hasClass('dx-tooltip-appointment-item-delete-button'))
        .toBe(true);
      expect(tree.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const tree = shallow(<DeleteButtonView
        props={{ ...defaultProps }}
        restAttributes={{ customAttribute: 'customAttribute' }}
      />);

      expect(tree.prop('customAttribute')).toBe('customAttribute');
    });
  });
});
