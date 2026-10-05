import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import NumberBox from '@js/ui/number_box';

import Pagination from '../wrappers/pagination';

const FALLBACK_MIN_WIDTH = 10;
const ONE_DIGIT_WIDTH = 10;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PagesSmall page index width', () => {
  it('re-reads the css min-width of the page index after the theme css is applied', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const pagination = new Pagination(container, {
      displayMode: 'compact',
      pageCount: 10,
      pageIndex: 1,
      pageSize: 5,
      itemCount: 46,
      pagesCountText: 'of',
    });
    const pageIndex = container.querySelector('.dx-page-index') as HTMLElement;
    const numberBox = NumberBox.getInstance(pageIndex) as NumberBox;

    expect(numberBox.option('width')).toBe(FALLBACK_MIN_WIDTH + 2 * ONE_DIGIT_WIDTH);

    pageIndex.style.minWidth = '32px';
    pagination.option('pageIndex', 2);
    await new Promise((resolve) => { setTimeout(resolve); });

    expect(numberBox.option('width')).toBe(32 + 2 * ONE_DIGIT_WIDTH);
  });
});
