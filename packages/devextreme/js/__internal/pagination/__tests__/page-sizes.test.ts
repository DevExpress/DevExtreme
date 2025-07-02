/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from '@jest/globals';
import { rerender } from 'inferno';

import Pagination from '../wrappers/pagination';

const config = {
  showInfo: true,
  showNavigationButtons: true,
  allowedPageSizes: [1, 4, 6, 'all'],
  itemCount: 51,
  pageIndex: 1,
  pageSize: 4,
};

describe('page-sizes', () => {
  it('should change page size by click on button', () => {
    const container = document.createElement('div');
    const result = { pageSize: 0, pageIndex: 0 };
    const pagination = new Pagination(container, {
      ...config,
      onOptionChanged(evt): void {
        const pageSize = evt.name === 'pageSize' ? evt.value : evt.component.option('pageSize');
        const pageIndex = evt.name === 'pageIndex' ? evt.value : evt.component.option('pageIndex');
        result.pageSize = pageSize;
        result.pageIndex = pageIndex;
      },
    });
    const click = (index: number): void => {
      const element = container.querySelectorAll('.dx-page-size').item(index) as HTMLDivElement;
      element.click();
    };

    rerender();

    click(0);
    expect(result).toEqual({ pageIndex: 1, pageSize: 1 });
    click(1);
    expect(result).toEqual({ pageIndex: 1, pageSize: 4 });
    click(2);
    expect(result).toEqual({ pageIndex: 1, pageSize: 6 });
    click(3);
    expect(result).toEqual({ pageIndex: 1, pageSize: 0 });
  });

  it('should change page size by set option', () => {
    const container = document.createElement('div');
    const pagination = new Pagination(container, config);
    const isSelected = (index: number): boolean => {
      const element = container.querySelectorAll('.dx-page-size').item(index) as HTMLDivElement;
      return element.classList.contains('dx-selection');
    };

    rerender();

    pagination.option('pageSize', 1);
    expect(pagination.option('pageSize')).toEqual(1);
    expect(isSelected(0)).toBe(true);

    pagination.option('pageSize', 4);
    expect(pagination.option('pageSize')).toEqual(4);
    expect(isSelected(1)).toBe(true);

    pagination.option('pageSize', 6);
    expect(pagination.option('pageSize')).toEqual(6);
    expect(isSelected(2)).toBe(true);

    pagination.option('pageSize', 0);
    expect(pagination.option('pageSize')).toEqual(0);
    expect(isSelected(3)).toBe(true);
  });
});
