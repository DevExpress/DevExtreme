/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import { h } from 'preact';
import { shallow } from 'enzyme';
import PagesLarge, { viewFunction as PagesLargeComponent } from '../../../js/renovation/pager/pages-large';
import Page from '../../../js/renovation/pager/page';

describe('View', () => {
  it('render', () => {
    const pages = [
      { index: 0, selected: true, onClick: jest.fn() },
      null,
      { index: 1, selected: false, onClick: jest.fn() },
    ];
    const tree = shallow(<PagesLargeComponent {...{ pages } as any} /> as any);
    expect(tree.find(Page).at(0).props()).toEqual({ children: [], ...pages[0] });
    expect(tree.childAt(1).html()).toBe('<div class="dx-separator">. . .</div>');
    expect(tree.find(Page).at(1).props()).toEqual({ children: [], ...pages[2] });
  });
});

describe('Pager pages logic', () => {
  it('pageIndexes, pageCount = 0', () => {
    const pages = new PagesLarge({ pageCount: 0, maxPagesCount: 5, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([]);
  });
  it('pageIndexes, pageCount = maxPagesCount', () => {
    const pages = new PagesLarge({ pageCount: 5, maxPagesCount: 5, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4]);
  });
  it('pageIndexes, pageCount = PAGES_LIMITER = 4', () => {
    const pages = new PagesLarge({ pageCount: 4, maxPagesCount: 5, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3]);
  });
  it('pageIndexes, pageIndex: 0', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 29]);
  });
  it('pageIndexes, pageIndex: 3', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 3 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 29]);
  });
  it('pageIndexes, pageIndex: 4', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 4 });
    expect(pages.pageIndexes).toEqual([0, null, 3, 4, 5, 6, null, 29]);
  });
  it('pageIndexes, pageIndex: pageCount - 1', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 29 });
    expect(pages.pageIndexes).toEqual([0, null, 25, 26, 27, 28, 29]);
  });
  it('pageIndexes, pageIndex: pageCount - 1 - 3', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 26 });
    expect(pages.pageIndexes).toEqual([0, null, 25, 26, 27, 28, 29]);
  });
  it('pageIndexes, pageIndex: pageCount - 1 - 4', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 25 });
    expect(pages.pageIndexes).toEqual([0, null, 24, 25, 26, 27, null, 29]);
  });
  it('storeState+pageIndexes, pageIndex: 0 to 1', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 1 };
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 29]);
  });
  it('storeState+pageIndexes, pageIndex: 0 to 4', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 4 };
    expect(pages.pageIndexes).toEqual([0, null, 2, 3, 4, 5, null, 29]);
  });
  it('storeState+pageIndexes, pageCount: 8, maxPagesCount: 7, pageIndex: 0 to 4', () => {
    const pages = new PagesLarge({ pageCount: 8, maxPagesCount: 7, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 7]);
    pages.props = { pageCount: 8, maxPagesCount: 7, pageIndex: 4 };
    expect(pages.pageIndexes).toEqual([0, null, 2, 3, 4, 5, null, 7]);
  });
  it('storeState+pageIndexes, pageIndex: 4 to 5', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 4 });
    expect(pages.pageIndexes).toEqual([0, null, 3, 4, 5, 6, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 5 };
    expect(pages.pageIndexes).toEqual([0, null, 3, 4, 5, 6, null, 29]);
  });
  it('storeState+pageIndexes, pageIndex: 4 to 6', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 4 });
    expect(pages.pageIndexes).toEqual([0, null, 3, 4, 5, 6, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 6 };
    expect(pages.pageIndexes).toEqual([0, null, 4, 5, 6, 7, null, 29]);
  });
  it('storeState+pageIndexes, pageIndex: 6 to 7 to 5', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 6 });
    expect(pages.pageIndexes).toEqual([0, null, 5, 6, 7, 8, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 7 };
    expect(pages.pageIndexes).toEqual([0, null, 5, 6, 7, 8, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 5 };
    expect(pages.pageIndexes).toEqual([0, null, 4, 5, 6, 7, null, 29]);
  });
  it('storeState+pageIndexes, pageIndex: 3 to 4 to 5', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 3 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 4 };
    expect(pages.pageIndexes).toEqual([0, null, 2, 3, 4, 5, null, 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 5 };
    expect(pages.pageIndexes).toEqual([0, null, 3, 4, 5, 6, null, 29]);
  });
  it('storeState+(pageIndexes, pageCount), (pageIndex: 12, pageCount: 15) -> (pageIndex: 12, pageCount: 13)', () => {
    const pages = new PagesLarge({ pageCount: 15, pageIndex: 12, maxPagesCount: 10 });
    expect(pages.pageIndexes).toEqual([0, null, 10, 11, 12, 13, 14]);
    pages.props = { pageCount: 13, pageIndex: 12, maxPagesCount: 10 };
    expect(pages.pageIndexes).toEqual([0, null, 8, 9, 10, 11, 12]);
  });
  it('storeState+(pageIndexes, pageCount), (pageIndex: 12, pageCount: 20) -> (pageIndex: 13, pageCount: 19)', () => {
    const pages = new PagesLarge({ pageCount: 20, pageIndex: 12, maxPagesCount: 10 });
    expect(pages.pageIndexes).toEqual([0, null, 11, 12, 13, 14, null, 19]);
    pages.props = { pageCount: 19, pageIndex: 13, maxPagesCount: 10 };
    expect(pages.pageIndexes).toEqual([0, null, 11, 12, 13, 14, null, 18]);
  });
  it('pages: pageIndex: 4', () => {
    const pageIndexChange = jest.fn();
    const pages = new PagesLarge({
      pageCount: 30, maxPagesCount: 10, pageIndex: 4, pageIndexChange,
    });
    expect(pages.pages[0]).toMatchObject({ index: 0, selected: false });
    expect(pages.pages[1]).toEqual(null);
    expect(pages.pages[3]).toMatchObject({ index: 4, selected: true });
    expect(pages.pages).toHaveLength(8);
    expect(pageIndexChange).not.toBeCalledWith(0);
    pages.pages[0]?.onClick?.();
    expect(pageIndexChange).toBeCalledWith(0);
  });
  it('pages: rtlEnabled: true', () => {
    const pages = new PagesLarge({
      pageCount: 30, maxPagesCount: 10, pageIndex: 4, rtlEnabled: true,
    });
    expect(pages.pages[0]).toMatchObject({ index: 29, selected: false });
    expect(pages.pages[1]).toEqual(null);
    expect(pages.pages[2]).toMatchObject({ index: 6, selected: false });
    expect(pages.pages[3]).toMatchObject({ index: 5, selected: false });
    expect(pages.pages[4]).toMatchObject({ index: 4, selected: true });
    expect(pages.pages[7]).toMatchObject({ index: 0, selected: false });
    expect(pages.pages).toHaveLength(8);
  });
});
