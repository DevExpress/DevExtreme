import PagesComponent, { SmallPagesPropsType } from '../../../js/renovation/pager/pages-small.p';
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
// import Pages, { SmallPagesProps } from '../../../js/renovation/pager/pages-small';
import PageIndexSelector from '../../../js/renovation/pager/page-index-selector.p';

jest.mock('../../../js/renovation/number-box.p', () => { });
jest.mock('../../../js/renovation/pager/page.p', () => { });

describe('Small pager pages', () => {
    const render = (props: SmallPagesPropsType) => {
        const root = mount(<PagesComponent {...props} />);
        const container = root.childAt(0);
        const pageIndexNumberBox = container.childAt(0);
        const span = container.childAt(1);
        const maxPage = container.childAt(2);

        return {
            root,
            container,
            pageIndexNumberBox,
            span,
            maxPage,
        };
    };

    it('render pages', () => {
        const { container, pageIndexNumberBox, span, maxPage } = render({ pageCount: 3, pageIndex: 2, rtlEnabled: true });
        expect(container.props().className).toBe('dx-light-pages');
        expect(pageIndexNumberBox.props()).toMatchObject({ max: 3, min: 1, value: 3, width: 50, rtlEnabled: true });
        expect(span.text()).toEqual('of');
        expect(maxPage.props()).toEqual({ index: 2, selected: false });
    });
    it('setValue', () => {
        const pageIndexChangedHandler = jest.fn();
        const { pageIndexNumberBox } = render({ pageCount: 3, pageIndex: 2, pageIndexChange: pageIndexChangedHandler });
        expect(pageIndexChangedHandler).not.toBeCalled();
        pageIndexNumberBox.props().valueChange(1);
        expect(pageIndexChangedHandler).toBeCalledWith(0);
    });
});
