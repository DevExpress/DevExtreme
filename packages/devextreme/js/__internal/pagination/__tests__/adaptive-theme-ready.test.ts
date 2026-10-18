import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import { themeReadyCallback } from '@ts/ui/m_themes_callback';

import Pagination from '../wrappers/pagination';

jest.mock('@ts/ui/themes', () => ({
  ...jest.requireActual<object>('@ts/ui/themes'),
  isPendingThemeLoaded: (): boolean => false,
}));

const instances: Pagination[] = [];

function createAdaptivePagination(width: string): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const container = document.createElement('div');
  container.style.width = width;
  root.appendChild(container);
  instances.push(new Pagination(container, {
    pageCount: 10,
    pageIndex: 1,
    pageSize: 5,
    itemCount: 46,
    showPageSizeSelector: true,
    allowedPageSizes: [5, 10],
  }));
  return container;
}

function applyThemeLayout(container: HTMLElement): void {
  const pageIndexes = container.querySelector('.dx-page-indexes') as HTMLElement;
  const pageSizes = container.querySelector('.dx-page-sizes') as HTMLElement;
  pageIndexes.style.display = 'inline-block';
  pageIndexes.style.width = '300px';
  pageSizes.style.cssFloat = 'left';
  pageSizes.style.width = '100px';
}

afterEach(() => {
  instances.splice(0).forEach((pagination) => pagination.dispose());
  document.body.innerHTML = '';
});

describe('adaptive pagination and the theme loading', () => {
  it('switches a narrow pagination to the compact mode when the theme is loaded', () => {
    const container = createAdaptivePagination('200px');

    expect(container.classList.contains('dx-light-mode')).toBe(false);

    applyThemeLayout(container);
    themeReadyCallback.fire();

    expect(container.classList.contains('dx-light-mode')).toBe(true);
  });

  it('keeps a wide pagination in the full mode when the theme is loaded', () => {
    const container = createAdaptivePagination('1000px');

    applyThemeLayout(container);
    themeReadyCallback.fire();

    expect(container.classList.contains('dx-light-mode')).toBe(false);
  });
});
