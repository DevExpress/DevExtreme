/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import React from 'react';
import { shallow } from 'enzyme';
import { PagesLarge, viewFunction as PagesLargeComponent } from '../large';
import { Page } from '../page';

describe('View', () => {
  it('render', () => {
    const page1 = { key: '0', pageProps: { index: 0, selected: true, onClick: jest.fn() } };
    const page2 = { key: '1', pageProps: { index: 1, selected: false, onClick: jest.fn() } };
    const pages = [
      page1,
      { key: 'low' },
      page2,
    ];
    const tree = shallow(<PagesLargeComponent {...{ pages } as any} /> as any);
    expect(tree.find(Page).at(0).props()).toEqual({ ...page1.pageProps });
    expect(tree.find(Page).at(0).key()).toBe('0');
    expect(tree.childAt(1).html()).toBe('<div class="dx-separator">. . .</div>');
    expect(tree.childAt(1).key()).toBe('low');
    expect(tree.find(Page).at(1).props()).toEqual({ ...page2.pageProps });
    expect(tree.find(Page).at(1).key()).toBe('1');
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
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 29]);
  });

  it('pageIndexes, pageIndex: 3', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 3 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 29]);
  });

  it('pageIndexes, pageIndex: 4', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 4 });
    expect(pages.pageIndexes).toEqual([0, 'low', 3, 4, 5, 6, 'high', 29]);
  });

  it('pageIndexes, pageIndex: pageCount - 1', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 29 });
    expect(pages.pageIndexes).toEqual([0, 'low', 25, 26, 27, 28, 29]);
  });

  it('pageIndexes, pageIndex: pageCount - 1 - 3', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 26 });
    expect(pages.pageIndexes).toEqual([0, 'low', 25, 26, 27, 28, 29]);
  });

  it('pageIndexes, pageIndex: pageCount - 1 - 4', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 25 });
    expect(pages.pageIndexes).toEqual([0, 'low', 24, 25, 26, 27, 'high', 29]);
  });

  it('storeState+pageIndexes, pageIndex: 0 to 1', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 1 };
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 29]);
  });

  it('storeState+pageIndexes, pageIndex: 0 to 4', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 4 };
    expect(pages.pageIndexes).toEqual([0, 'low', 2, 3, 4, 5, 'high', 29]);
  });

  it('storeState+pageIndexes, pageCount: 8, maxPagesCount: 7, pageIndex: 0 to 4', () => {
    const pages = new PagesLarge({ pageCount: 8, maxPagesCount: 7, pageIndex: 0 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 7]);
    pages.props = { pageCount: 8, maxPagesCount: 7, pageIndex: 4 };
    expect(pages.pageIndexes).toEqual([0, 'low', 2, 3, 4, 5, 'high', 7]);
  });

  it('storeState+pageIndexes, pageIndex: 4 to 5', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 4 });
    expect(pages.pageIndexes).toEqual([0, 'low', 3, 4, 5, 6, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 5 };
    expect(pages.pageIndexes).toEqual([0, 'low', 3, 4, 5, 6, 'high', 29]);
  });

  it('storeState+pageIndexes, pageIndex: 4 to 6', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 4 });
    expect(pages.pageIndexes).toEqual([0, 'low', 3, 4, 5, 6, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 6 };
    expect(pages.pageIndexes).toEqual([0, 'low', 4, 5, 6, 7, 'high', 29]);
  });

  it('storeState+pageIndexes, pageIndex: 6 to 7 to 5', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 6 });
    expect(pages.pageIndexes).toEqual([0, 'low', 5, 6, 7, 8, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 7 };
    expect(pages.pageIndexes).toEqual([0, 'low', 5, 6, 7, 8, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 5 };
    expect(pages.pageIndexes).toEqual([0, 'low', 4, 5, 6, 7, 'high', 29]);
  });

  it('storeState+pageIndexes, pageIndex: 3 to 4 to 5', () => {
    const pages = new PagesLarge({ pageCount: 30, maxPagesCount: 10, pageIndex: 3 });
    expect(pages.pageIndexes).toEqual([0, 1, 2, 3, 4, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 4 };
    expect(pages.pageIndexes).toEqual([0, 'low', 2, 3, 4, 5, 'high', 29]);
    pages.props = { pageCount: 30, maxPagesCount: 10, pageIndex: 5 };
    expect(pages.pageIndexes).toEqual([0, 'low', 3, 4, 5, 6, 'high', 29]);
  });

  it('storeState+(pageIndexes, pageCount), (pageIndex: 12, pageCount: 15) -> (pageIndex: 12, pageCount: 13)', () => {
    const pages = new PagesLarge({ pageCount: 15, pageIndex: 12, maxPagesCount: 10 });
    expect(pages.pageIndexes).toEqual([0, 'low', 10, 11, 12, 13, 14]);
    pages.props = { pageCount: 13, pageIndex: 12, maxPagesCount: 10 };
    expect(pages.pageIndexes).toEqual([0, 'low', 8, 9, 10, 11, 12]);
  });

  it('storeState+(pageIndexes, pageCount), (pageIndex: 12, pageCount: 20) -> (pageIndex: 13, pageCount: 19)', () => {
    const pages = new PagesLarge({ pageCount: 20, pageIndex: 12, maxPagesCount: 10 });
    expect(pages.pageIndexes).toEqual([0, 'low', 11, 12, 13, 14, 'high', 19]);
    pages.props = { pageCount: 19, pageIndex: 13, maxPagesCount: 10 };
    expect(pages.pageIndexes).toEqual([0, 'low', 11, 12, 13, 14, 'high', 18]);
  });

  it('pages: pageIndex: 4', () => {
    const pageIndexChange = jest.fn();
    const pages = new PagesLarge({
      pageCount: 30, maxPagesCount: 10, pageIndex: 4,
    });
    expect(pages.pages[0].pageProps).toMatchObject({ index: 0, selected: false });
    expect(pages.pages[0].key).toEqual('0');
    expect(pages.pages[1].key).toEqual('low');
    expect(pages.pages[3].pageProps).toMatchObject({ index: 4, selected: true });
    expect(pages.pages).toHaveLength(8);
    expect(pageIndexChange).not.toBeCalledWith(0);
    pages.pages[0].pageProps!.onClick?.();
    pages.props.pageIndexChange = pageIndexChange;
    pages.pages[0].pageProps!.onClick?.();
    expect(pageIndexChange).toBeCalledWith(0);
  });

  it('pages: rtlEnabled: true', () => {
    const pages = new PagesLarge({
      pageCount: 30, maxPagesCount: 10, pageIndex: 4,
    });
    pages.config = { rtlEnabled: true };
    expect(pages.pages[0].pageProps).toMatchObject({ index: 29, selected: false });
    expect(pages.pages[1].key).toEqual('high');
    expect(pages.pages[2].pageProps).toMatchObject({ index: 6, selected: false });
    expect(pages.pages[3].pageProps).toMatchObject({ index: 5, selected: false });
    expect(pages.pages[4].pageProps).toMatchObject({ index: 4, selected: true });
    expect(pages.pages[7].pageProps).toMatchObject({ index: 0, selected: false });
    expect(pages.pages).toHaveLength(8);
  });
});
