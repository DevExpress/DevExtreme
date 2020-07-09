import { h } from 'preact';
import { shallow } from 'enzyme';
import { ErrorMessage } from '../../js/renovation/error-message';

describe('ErrorMessage', () => {
  describe('Props', () => {
    it('should render `messages` inside the component', () => {
      const tree = shallow(<ErrorMessage message="error-message" />);

      expect(tree.text()).toBe('error-message');
    });

    it('should combine `className` with predefined classes', () => {
      const tree = shallow(<ErrorMessage className="custom-class" />);

      expect(tree.hasClass('dx-validationsummary')).toBe(true);
      expect(tree.hasClass('dx-validationsummary-item')).toBe(true);
      expect(tree.hasClass('custom-class')).toBe(true);
    });

    it('should spread restAttributes', () => {
      const tree = shallow(<ErrorMessage />);

      expect(tree.prop('restAttributes')).toBe('restAttributes');
    });
  });
});
