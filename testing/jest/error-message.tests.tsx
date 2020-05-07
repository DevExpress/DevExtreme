import { h } from 'preact';
import { mount, ReactWrapper } from 'enzyme';
import ErrorMessage from '../../js/renovation/error-message.p';

describe('ErrorMessage', () => {
  const render = (props = {}): ReactWrapper => mount(<ErrorMessage {...props} />).childAt(0);

  describe('Props', () => {
    it('should render `messages` inside the component', () => {
      const errorMessage = render({ message: 'error-message' });

      expect(errorMessage.text()).toBe('error-message');
    });

    it('should combine `className` with ', () => {
      const errorMessage = render({ className: 'custom-class' });

      expect(errorMessage.hasClass('dx-validationsummary')).toBe(true);
      expect(errorMessage.hasClass('dx-validationsummary-item')).toBe(true);
      expect(errorMessage.hasClass('custom-class')).toBe(true);
    });

    it('should add custom property', () => {
      const tree = render({ data: 'custom-data' });

      expect(tree.prop('data')).toBe('custom-data');
    });
  });
});
