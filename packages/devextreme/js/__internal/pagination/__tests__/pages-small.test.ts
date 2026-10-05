import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import NumberBox from '@js/ui/number_box';
import SelectBox from '@js/ui/select_box';
import { themeReadyCallback } from '@ts/ui/m_themes_callback';

import Pagination from '../wrappers/pagination';

jest.mock('@ts/ui/themes', () => ({
  ...jest.requireActual<object>('@ts/ui/themes'),
  isPendingThemeLoaded: (): boolean => false,
}));

const FALLBACK_MIN_WIDTH = 10;
const ONE_DIGIT_WIDTH = 10;

function createCompactPagination(config: object = {}): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  // eslint-disable-next-line no-new
  new Pagination(container, {
    displayMode: 'compact',
    pageCount: 10,
    pageIndex: 1,
    pageSize: 5,
    itemCount: 46,
    pagesCountText: 'of',
    ...config,
  });
  return container;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('compact pagination editors', () => {
  it('re-reads the css min-width of the page index after the next update', async () => {
    const container = createCompactPagination();
    const pagination = Pagination.getInstance(container) as Pagination;
    const pageIndex = container.querySelector('.dx-page-index') as HTMLElement;
    const numberBox = NumberBox.getInstance(pageIndex) as NumberBox;

    expect(numberBox.option('width')).toBe(FALLBACK_MIN_WIDTH + 2 * ONE_DIGIT_WIDTH);

    pageIndex.style.minWidth = '32px';
    pagination.option('pageIndex', 2);
    await new Promise((resolve) => { setTimeout(resolve); });

    expect(numberBox.option('width')).toBe(32 + 2 * ONE_DIGIT_WIDTH);
  });

  it('re-reads the css min-width of the page index when the theme is loaded', () => {
    const container = createCompactPagination();
    const pageIndex = container.querySelector('.dx-page-index') as HTMLElement;
    const numberBox = NumberBox.getInstance(pageIndex) as NumberBox;

    pageIndex.style.minWidth = '32px';
    themeReadyCallback.fire();

    expect(numberBox.option('width')).toBe(32 + 2 * ONE_DIGIT_WIDTH);
  });

  it('re-reads the css min-width of the page sizes when the theme is loaded', () => {
    const container = createCompactPagination({
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
    });
    const pageSizes = container.querySelector('.dx-page-sizes') as HTMLElement;
    const selectBox = SelectBox.getInstance(pageSizes.querySelector('.dx-selectbox') as HTMLElement) as SelectBox;

    expect(selectBox.option('width')).toBe(FALLBACK_MIN_WIDTH + 2 * ONE_DIGIT_WIDTH);

    pageSizes.style.minWidth = '62px';
    themeReadyCallback.fire();

    expect(selectBox.option('width')).toBe(62 + 2 * ONE_DIGIT_WIDTH);
  });
});
