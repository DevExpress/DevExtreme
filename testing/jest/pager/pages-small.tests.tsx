import { h } from 'preact';
import { mount } from 'enzyme';
import PagesComponent from '../../../js/renovation/pager/pages-small.p';
import type { SmallPagesPropsType } from '../../../js/renovation/pager/pages-small.p';
import getElementComputedStyle from '../../../js/renovation/pager/get-computed-style.p';

jest.mock('../../../js/renovation/number-box.p', () => { });
jest.mock('../../../js/renovation/pager/page.p', () => { });
jest.mock('../../../js/renovation/pager/get-computed-style.p');


describe('Small pager pages', () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const render = (props: SmallPagesPropsType) => {
    const root = mount(<PagesComponent {...props} />);
    const container = root.childAt(0);
    const pageIndexNumberBoxContainer = container.childAt(0);
    const pageIndexNumberBox = pageIndexNumberBoxContainer.childAt(0);
    const span = container.childAt(1);
    const maxPage = container.childAt(2);

    return {
      root,
      container,
      pageIndexNumberBoxContainer,
      pageIndexNumberBox,
      span,
      maxPage,
    };
  };

  it('render pages', () => {
    (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '19px' });
    const {
      container, pageIndexNumberBox, span, maxPage,
    } = render({ pageCount: 100, pageIndex: 2, rtlEnabled: true });
    expect(container.props().className).toBe('dx-light-pages');
    expect(pageIndexNumberBox.props()).toMatchObject({
      max: 100, min: 1, value: 3, width: 19 + 10 * 3, rtlEnabled: true,
    });
    expect(span.text()).toEqual('of');
    expect(maxPage.props()).toEqual({ index: 99, selected: false });
  });
  it('setValue', () => {
    const pageIndexChangedHandler = jest.fn();
    const { pageIndexNumberBox } = render({
      pageCount: 3,
      pageIndex: 2,
      pageIndexChange: pageIndexChangedHandler,
    });
    expect(pageIndexChangedHandler).not.toBeCalled();
    pageIndexNumberBox.props().valueChange(1);
    expect(pageIndexChangedHandler).toBeCalledWith(0);
  });
});
