import { describe, expect, it } from '@jest/globals';
import type { ComponentWrapperProps } from '@ts/core/r1/component_wrapper';

import Pagination from '../wrappers/pagination';

describe('pages-container-visibility', () => {
  const arrangePaginationWith = (config: ComponentWrapperProps): {
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
    return { container, pagination };
  };

  const assertPagesContainerIsVisible = (container: HTMLElement): void => {
    const pagesContainer = container.querySelector('.dx-pages');
    expect(pagesContainer).toBeTruthy();
    const style = pagesContainer?.getAttribute('style');
    const isVisible = style === null || !style?.includes('visibility: hidden');
    expect(isVisible).toBe(true);
  };

  const assertPagesContainerIsHidden = (container: HTMLElement): void => {
    const pagesContainer = container.querySelector('.dx-pages');
    expect(pagesContainer).toBeTruthy();
    const isHidden = pagesContainer?.getAttribute('style')?.includes('visibility: hidden') ?? false;
    expect(isHidden).toBe(true);
  };

  describe('when pageCount = 1', () => {
    it('should hide container when no explicit visible components are enabled', () => {
      const { container } = arrangePaginationWith({ itemCount: 5, pageSize: 10 });

      assertPagesContainerIsHidden(container);
    });

    it('should show container when showInfo is enabled', () => {
      const { container } = arrangePaginationWith({
        itemCount: 8,
        pageSize: 10,
        showInfo: true,
      });

      assertPagesContainerIsVisible(container);
    });

    it('should show container when showNavigationButtons is enabled', () => {
      const { container } = arrangePaginationWith({
        itemCount: 6,
        pageSize: 10,
        showNavigationButtons: true,
      });

      assertPagesContainerIsVisible(container);
    });

    it('should show container when showPageSizeSelector is enabled', () => {
      const { container } = arrangePaginationWith({
        itemCount: 9,
        pageSize: 10,
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 'all'],
      });

      assertPagesContainerIsVisible(container);
    });
  });

  describe('when pageCount > 1', () => {
    it('should always show container regardless of other settings', () => {
      const { container } = arrangePaginationWith({
        itemCount: 25,
        pageSize: 10,
        pageCount: 3,
      });

      assertPagesContainerIsVisible(container);
    });
  });

  describe('dynamic visibility changes', () => {
    it('should toggle visibility when showInfo changes at runtime', () => {
      const { container, pagination } = arrangePaginationWith({
        itemCount: 7,
        pageSize: 10,
      });

      assertPagesContainerIsHidden(container);

      pagination.option('showInfo', true);

      assertPagesContainerIsVisible(container);

      pagination.option('showInfo', false);

      assertPagesContainerIsHidden(container);
    });

    it('should toggle visibility when itemCount changes pageCount', () => {
      const { container, pagination } = arrangePaginationWith({
        itemCount: 8,
        pageSize: 10,
      });

      assertPagesContainerIsHidden(container);

      pagination.option('itemCount', 25);
      pagination.option('pageCount', 3);

      assertPagesContainerIsVisible(container);

      pagination.option('itemCount', 5);
      pagination.option('pageCount', 1);

      assertPagesContainerIsHidden(container);
    });
  });
});
