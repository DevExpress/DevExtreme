
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import ClickableDiv from '../../../js/renovation/pager/clickable-div.p';
import { LightButtonProps } from '../../../js/renovation/pager/light-button';
import { EVENT, emit, eventHandlers } from '../utils/events-mock';

describe('LightButton', () => {
    const render = (props: LightButtonProps = {}) => {
        const { children, ...restProps } = props;
        return mount(<ClickableDiv {...restProps}>{children}</ClickableDiv>);
    };
    it('render', () => {
        const comp = render({ children: 'text', className: 'class', label: 'label' });
        expect(comp.childAt(0).getDOMNode().classList).toHaveLength(1);
        expect(comp.childAt(0).props()).toEqual({ className: 'class', label: 'label', role: 'button', tabIndex: 0 });
        expect(comp.childAt(0).childAt(0).text()).toBe('text');
    });
    it('click', () => {
        const clickHandler = jest.fn();
        const comp = render({ onClick: clickHandler });
        expect(clickHandler).toHaveBeenCalledTimes(0);
        expect(eventHandlers[EVENT.dxClick].length).toBe(1);
        emit(EVENT.dxClick);
        expect(clickHandler).toHaveBeenCalledTimes(1);
        comp.unmount();
        expect(eventHandlers[EVENT.dxClick].length).toBe(0);
    });
});
