import PagesComponent from '../../../js/renovation/pager/pages.p';
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import Page from '../../../js/renovation/pager/page.p';
import Pages, { PagesProps } from '../../../js/renovation/pager/pages';

describe('Pager pages', () => {
    const render = (props: PagesProps) => mount(<PagesComponent {...props} />);

    it('render all pages text', () => {
        const pages = render({ isLargeDisplayMode: true, pageCount: 3, maxPagesCount: 3, pageIndex: 2 } as PagesProps);
        expect(pages.find(Page)).toHaveLength(3);
        expect(pages.find(Page).map(p => p.text())).toEqual(['1', '2', '3']);
    });
    it('render all pages text', () => {
        const pages = render({ isLargeDisplayMode: true, pageCount: 3, maxPagesCount: 3, pageIndex: 1 } as PagesProps);
        expect(pages.find(Page).map(p => p.prop('selected'))).toEqual([false, true, false]);
    });
    it('render all limited pages text', () => {
        const pages = render({ isLargeDisplayMode: true, pageCount: 30, maxPagesCount: 3, pageIndex: 3 } as PagesProps);
        expect(pages.children().map(p => p.text())).toEqual(['1', '. . .', '3', '4', '5', '6', '. . .', '30']);
    });
    it('calculate pages for pageIndex = 0', () => {
        const pages = new Pages({ isLargeDisplayMode: true, pageCount: 30, maxPagesCount: 10, pageIndex: 0 } as PagesProps);
        expect(pages.pages.map(p => p && p.index)).toEqual([0, 1, 2, 3, null, 29]);
    });
    it('calculate pages for pageIndex = 1', () => {
        const pages = new Pages({ isLargeDisplayMode: true, pageCount: 30, maxPagesCount: 10, pageIndex: 0 } as PagesProps);
        expect(pages.pages.map(p => p && p.index)).toEqual([0, 1, 2, 3, null, 29]);
    });
    it('calculate pages for pageIndex = pageCount - 1 (last page)', () => {
        const pages = new Pages({ isLargeDisplayMode: true, pageCount: 30, maxPagesCount: 10, pageIndex: 29 } as PagesProps);
        expect(pages.pages.map(p => p && p.index)).toEqual([0, null, 26, 27, 28, 29]);
    });
    it('calculate pages for pageIndex = pageCount - 2 (last page - 1)', () => {
        const pages = new Pages({ isLargeDisplayMode: true, pageCount: 30, maxPagesCount: 10, pageIndex: 29 } as PagesProps);
        expect(pages.pages.map(p => p && p.index)).toEqual([0, null, 26, 27, 28, 29]);
    });
});
