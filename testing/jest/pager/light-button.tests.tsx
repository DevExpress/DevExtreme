
import { h } from 'preact';
import { mount } from 'enzyme';
import { EVENT, emit, getEventHandlers } from '../utils/events-mock';
import ClickableDiv from '../../../js/renovation/pager/light-button.p';
import { LightButtonProps } from '../../../js/renovation/pager/light-button';

describe('LightButton', () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const render = (props: LightButtonProps = {}) => {
    const { children, ...restProps } = props;
    return mount(<ClickableDiv {...restProps}>{children}</ClickableDiv>);
  };
  it('render', () => {
    const comp = render({ children: 'text', className: 'class', label: 'label' });
    expect(comp.childAt(0).getDOMNode().classList).toHaveLength(1);
    expect(comp.childAt(0).props()).toEqual({
      className: 'class', 'aria-label': 'label', role: 'button', tabIndex: 0,
    });
    expect(comp.childAt(0).childAt(0).text()).toBe('text');
  });
  it('click', () => {
    const clickHandler = jest.fn();
    const comp = render({ onClick: clickHandler });
    expect(clickHandler).toHaveBeenCalledTimes(0);
    expect(getEventHandlers(EVENT.dxClick).length).toBe(1);
    emit(EVENT.dxClick);
    expect(clickHandler).toHaveBeenCalledTimes(1);
    comp.unmount();
    expect(getEventHandlers(EVENT.dxClick).length).toBe(0);
  });
});
