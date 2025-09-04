import { describe, expect, it } from '@jest/globals';
import type { ComponentWrapperProps } from '@ts/core/r1/component_wrapper';

import Pagination from '../wrappers/pagination';

describe('Pagination: pagination visibility', () => {
  const createPagination = (config: ComponentWrapperProps): {
    container: HTMLElement;
    pagination: Pagination;
  } => {
    const container = document.createElement('div');
    const pagination = new Pagination(container, {
      pageSize: 10,
      pageIndex: 1,
      pagesNavigatorVisible: 'auto',
      hasKnownLastPage: true,
      showInfo: false,
      showNavigationButtons: false,
      showPageSizeSelector: false,
      ...config,
    });
    return { container, pagination };
  };

  const isPagesContainerVisible = (container: HTMLElement): boolean => {
    const pagesContainer = container.querySelector('.dx-pages');
    expect(pagesContainer).toBeTruthy();
    const style = pagesContainer?.getAttribute('style');
    const isVisible = style === null || !style?.includes('visibility: hidden');
    return isVisible;
  };

  const isPagesContainerHidden = (container: HTMLElement): boolean => {
    const pagesContainer = container.querySelector('.dx-pages');
    expect(pagesContainer).toBeTruthy();
    const isHidden = pagesContainer?.getAttribute('style')?.includes('visibility: hidden') ?? false;
    return isHidden;
  };

  describe('when pageCount = 1', () => {
    it('should hide container when no explicit visible components are enabled', () => {
      const { container } = createPagination({ itemCount: 5, pageSize: 10 });

      expect(isPagesContainerHidden(container)).toBe(true);
    });

    it('should show container when showInfo is enabled', () => {
      const { container } = createPagination({
        itemCount: 8,
        pageSize: 10,
        showInfo: true,
      });

      expect(isPagesContainerVisible(container)).toBe(true);
    });

    it('should show container when showNavigationButtons is enabled', () => {
      const { container } = createPagination({
        itemCount: 6,
        pageSize: 10,
        showNavigationButtons: true,
      });

      expect(isPagesContainerVisible(container)).toBe(true);
    });

    it('should show container when showPageSizeSelector is enabled', () => {
      const { container } = createPagination({
        itemCount: 9,
        pageSize: 10,
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 'all'],
      });

      expect(isPagesContainerVisible(container)).toBe(true);
    });
  });

  describe('when pageCount > 1', () => {
    it('should always show container regardless of other settings', () => {
      const { container } = createPagination({
        itemCount: 25,
        pageSize: 10,
      });

      expect(isPagesContainerVisible(container)).toBe(true);
    });
  });

  describe('dynamic visibility changes', () => {
    it('should toggle visibility when showInfo changes at runtime', () => {
      const { container, pagination } = createPagination({
        itemCount: 7,
        pageSize: 10,
      });

      pagination.option('showInfo', true);

      expect(isPagesContainerVisible(container)).toBe(true);

      pagination.option('showInfo', false);

      expect(isPagesContainerHidden(container)).toBe(true);
    });
  });

  it('should keep info block visible when pageSize > itemCount and showInfo=true (T1299780)', () => {
    const { container } = createPagination({
      itemCount: 4,
      pageSize: 10,
      showInfo: true,
      allowedPageSizes: [4, 6, 11],
    });

    const infoBlock = container.querySelector('.dx-info');
    expect(infoBlock).toBeTruthy();
  });
});
