import { describe, expect, it } from '@jest/globals';

import { PagesLarge } from '../pages/large';

const MAX_PAGES_COUNT = 10;

function createPages(pageCount: number, pageIndex: number): PagesLarge {
  return new PagesLarge({
    maxPagesCount: MAX_PAGES_COUNT,
    pageCount,
    pageIndex,
    pageIndexChangedInternal: (): void => {},
  });
}

function updateProps(pages: PagesLarge, pageCount: number, pageIndex: number): void {
  pages.props = { ...pages.props, pageCount, pageIndex };
}

function visiblePageNumbers(pages: PagesLarge): number[] {
  return pages.getPageIndexes()
    .filter((index): index is number => typeof index === 'number')
    .map((index) => index + 1);
}

describe('PagesLarge sliding window', () => {
  it('keeps a consistent page list when pageCount shrinks on the last page (T1322291)', () => {
    // 15 pages, sitting on the last one (0-based index 14).
    const pages = createPages(15, 14);
    expect(visiblePageNumbers(pages)).toEqual([1, 11, 12, 13, 14, 15]);

    // Expand a group on the last page -> a 16th page appears; still on page 15.
    updateProps(pages, 16, 14);
    expect(visiblePageNumbers(pages)).toEqual([1, 12, 13, 14, 15, 16]);

    // Collapse it -> pageCount is back to 15.
    updateProps(pages, 15, 14);
    expect(visiblePageNumbers(pages)).toEqual([1, 11, 12, 13, 14, 15]);

    // Expand / collapse again -> stays consistent.
    updateProps(pages, 16, 14);
    expect(visiblePageNumbers(pages)).toEqual([1, 12, 13, 14, 15, 16]);

    updateProps(pages, 15, 14);
    expect(visiblePageNumbers(pages)).toEqual([1, 11, 12, 13, 14, 15]);
  });

  it('handles the symmetric shrink when the stored window starts at the current page', () => {
    // Prime a stored window whose first slot is index 14: on a 30-page pager,
    // sitting on page 16 (index 15) yields the window [14, 15, 16, 17].
    const pages = createPages(30, 15);
    expect(visiblePageNumbers(pages)).toEqual([1, 15, 16, 17, 18, 30]);

    // Shrink count so index 14 is the last page, and it also equals the
    // stored window's first slot -> the "pageIndex === window[0]" branch.
    updateProps(pages, 15, 14);
    expect(visiblePageNumbers(pages)).toEqual([1, 11, 12, 13, 14, 15]);
  });
});
