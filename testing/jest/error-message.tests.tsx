import ErrorMessage from '../../js/renovation/error-message.p.js';
import { h } from 'preact';
import { mount } from 'enzyme';

describe('ErrorMessage', () => {
    const render = (props = {}) => mount(<ErrorMessage {...props} />).childAt(0);

    describe('Props', () => {
        it('should render `messages` inside the component', () => {
            const errorMessage = render({ message: 'error-code' });

            expect(errorMessage.children()).toHaveLength(1);
        });
        it('should combine `className` with ', () => {
            const errorMessage = render({ className: 'custom-class' });

            expect(errorMessage.hasClass('dx-validationsummary')).toBe(true);
            expect(errorMessage.hasClass('dx-validationsummary-item')).toBe(true);
            expect(errorMessage.hasClass('custom-class')).toBe(true);
        });
    });
});
