import { describe, expect, it } from '@jest/globals';
import type { ComponentWrapperProps } from '@ts/core/r1/component_wrapper';

import Pagination from '../wrappers/pagination';

const createPagination = (config: ComponentWrapperProps = {}): {
  container: HTMLElement;
  pagination: Pagination;
} => {
  const container = document.createElement('div');
  const pagination = new Pagination(container, {
    itemCount: 25,
    pageSize: 10,
    pageIndex: 1,
    showNavigationButtons: true,
    showInfo: false,
    showPageSizeSelector: false,
    ...config,
  });

  return { container, pagination };
};

const ariaDisabled = (
  container: HTMLElement,
  selector: string,
): string | null | undefined => container.querySelector(selector)?.getAttribute('aria-disabled');

describe('Pagination navigation buttons', () => {
  it('should mark the button that cannot navigate with aria-disabled', () => {
    const { container, pagination } = createPagination();

    expect(ariaDisabled(container, '.dx-prev-button')).toBe('true');
    expect(ariaDisabled(container, '.dx-next-button')).toBe(null);

    pagination.option('pageIndex', 3);

    expect(ariaDisabled(container, '.dx-prev-button')).toBe(null);
    expect(ariaDisabled(container, '.dx-next-button')).toBe('true');
  });

  it('should not mark either button in the middle of the range', () => {
    const { container } = createPagination({ pageIndex: 2 });

    expect(ariaDisabled(container, '.dx-prev-button')).toBe(null);
    expect(ariaDisabled(container, '.dx-next-button')).toBe(null);
  });
});
