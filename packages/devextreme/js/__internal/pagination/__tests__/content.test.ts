/* eslint-disable spellcheck/spell-checker */

import { describe, expect, it } from '@jest/globals';
import type { ComponentWrapperProps } from '@ts/core/r1/component_wrapper';
import { rerender } from 'inferno';

import Pagination from '../wrappers/pagination';

describe('pagination-container-visibility', () => {
  const createPagination = (config: ComponentWrapperProps): {
    container: HTMLElement;
    pagination: Pagination;
  } => {
    const container = document.createElement('div');
    const pagination = new Pagination(container, {
      pageSize: 10,
      pageIndex: 1,
      pageCount: 1,
      pagesNavigatorVisible: 'auto',
      hasKnownLastPage: true,
      showInfo: false,
      showNavigationButtons: false,
      showPageSizeSelector: false,
      ...config,
    });
    rerender();
    return { container, pagination };
  };

  const isVisible = (container: HTMLElement): boolean | undefined => {
    const pagesContainer = container.querySelector('.dx-pages');
    expect(pagesContainer).toBeTruthy();
    const style = pagesContainer?.getAttribute('style');
    return style === null || !style?.includes('visibility: hidden');
  };

  const isHidden = (container: HTMLElement): boolean | undefined => {
    const pagesContainer = container.querySelector('.dx-pages');
    expect(pagesContainer).toBeTruthy();
    return pagesContainer?.getAttribute('style')?.includes('visibility: hidden');
  };

  it('should hide when itemCount < pageSize', () => {
    const { container } = createPagination({ itemCount: 5, pageSize: 10 });
    expect(isHidden(container)).toBe(true);
  });

  it('should hide when itemCount = pageSize', () => {
    const { container } = createPagination({ itemCount: 10, pageSize: 10 });
    expect(isHidden(container)).toBe(true);
  });

  it('should show when itemCount <= pageSize but showInfo=true', () => {
    const { container } = createPagination({ itemCount: 8, pageSize: 10, showInfo: true });
    expect(isVisible(container)).toBe(true);
  });

  it('should show when itemCount <= pageSize but showNavigationButtons=true', () => {
    const { container } = createPagination({
      itemCount: 6,
      pageSize: 10,
      showNavigationButtons: true,
    });
    expect(isVisible(container)).toBe(true);
  });

  it('should show when itemCount <= pageSize but showPageSizeSelector=true', () => {
    const { container } = createPagination({
      itemCount: 9,
      pageSize: 10,
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 'all'],
    });
    expect(isVisible(container)).toBe(true);
  });

  it('should always show when itemCount > pageSize', () => {
    const { container } = createPagination({
      itemCount: 15,
      pageSize: 10,
      pageCount: 2,
    });
    expect(isVisible(container)).toBe(true);
  });

  it('should toggle visibility when showInfo changes', () => {
    const { container, pagination } = createPagination({
      itemCount: 7,
      pageSize: 10,
    });

    expect(isHidden(container)).toBe(true);

    pagination.option('showInfo', true);
    rerender();
    expect(isVisible(container)).toBe(true);

    pagination.option('showInfo', false);
    rerender();
    expect(isHidden(container)).toBe(true);
  });

  it('should toggle visibility when itemCount changes', () => {
    const { container, pagination } = createPagination({
      itemCount: 8,
      pageSize: 10,
    });

    expect(isHidden(container)).toBe(true);

    pagination.option('itemCount', 15);
    pagination.option('pageCount', 2);
    rerender();
    expect(isVisible(container)).toBe(true);

    pagination.option('itemCount', 5);
    pagination.option('pageCount', 1);
    rerender();
    expect(isHidden(container)).toBe(true);
  });
});
