import { h } from 'preact';
import { shallow } from 'enzyme';
import { Page, viewFunction as PageComponent } from '../../../js/renovation/pager/page';
import { PAGER_PAGE_CLASS, PAGER_SELECTION_CLASS } from '../../../js/renovation/pager/consts';

describe('Small pager pages', () => {
  it('view', () => {
    const click = {};
    const tree = shallow<typeof PageComponent>(<PageComponent {...{
      className: 'className', value: 1, label: 'label', onClick: click, props: { onClick: click },
    } as any}
    />);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(tree.props()).toEqual({
      children: 1, className: 'className', label: 'label', onClick: click,
    });
  });
  it('className, default', () => {
    const component = new Page({ index: 0 });
    expect(component.className).toBe(PAGER_PAGE_CLASS);
  });
  it('className, selected', () => {
    const component = new Page({ index: 0, selected: true });
    expect(component.className).toBe(`${PAGER_PAGE_CLASS} ${PAGER_SELECTION_CLASS}`);
  });
  it('className, custom class', () => {
    const component = new Page({ index: 0, className: 'custom' });
    expect(component.className).toBe(`${PAGER_PAGE_CLASS} custom`);
  });
  it('value', () => {
    const component = new Page({ index: 0 });
    expect(component.value).toBe(1);
  });
  it('label', () => {
    const component = new Page({ index: 0 });
    expect(component.label).toBe('Page 1');
  });
});
