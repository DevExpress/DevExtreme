import React from 'react';
import { shallow, mount } from 'enzyme';
import { Page, PageProps, viewFunction as PageComponent } from '../page';
import { PAGER_PAGE_CLASS, PAGER_SELECTION_CLASS } from '../../common/consts';
import messageLocalization from '../../../../../localization/message';
import { LightButton } from '../../common/light_button';

jest.mock('../../../../../localization/message', () => ({
  getFormatter: jest.fn(),
}));

describe('Small pager pages', () => {
  it('view', () => {
    const click = {};
    const tree = shallow<typeof PageComponent>(<PageComponent {...{
      className: 'className', value: 1, label: 'label', onClick: click, props: { onClick: click },
    } as any}
    /> as any);
    expect(tree.props()).toEqual({
      children: 1, className: 'className', label: 'label', onClick: click,
    });
  });

  // T1109686
  it('pageIndexes: check aria-current attribute', () => {
    const props = { props: { selected: true, onClick: () => {} } };
    const tree = mount<typeof PageComponent>(<PageComponent {...props as any} />);

    const pageButton = tree.find(LightButton);

    expect(pageButton.prop('selected')).toBeTruthy();
  });

  describe('Logic', () => {
    describe('className', () => {
      it('default', () => {
        const props = new PageProps();
        const component = new Page(props);
        expect(component.className).toBe(PAGER_PAGE_CLASS);
      });

      it('selected', () => {
        const props = new PageProps();
        props.selected = true;
        const component = new Page(props);
        expect(component.className).toBe(`${PAGER_PAGE_CLASS} ${PAGER_SELECTION_CLASS}`);
      });

      it('custom class', () => {
        const props = new PageProps();
        props.className = 'custom';
        const component = new Page(props);
        expect(component.className).toBe('custom');
      });
    });

    it('value', () => {
      const component = new Page({ index: 0 });
      expect(component.value).toBe(1);
    });

    it('label', () => {
      (messageLocalization.getFormatter as jest.Mock).mockReturnValue((n) => `Page ${n}`);
      const component = new Page({ index: 0 });
      expect(component.label).toBe('Page 1');
    });
  });
});
