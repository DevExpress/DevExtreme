import type { Page } from '@playwright/test';

export const isScrollAtEnd = (
  page: Page,
  orientation: 'vertical' | 'horizontal' = 'vertical',
): Promise<boolean> => page.evaluate((direction) => {
  const element = $('.dx-datagrid-rowsview .dx-scrollable-container')[0];

  if (!element) {
    return false;
  }

  const scrollSize = element[direction === 'vertical' ? 'scrollHeight' : 'scrollWidth'];
  const scrollPosition = element[direction === 'vertical' ? 'scrollTop' : 'scrollLeft'];
  const clientSize = element[direction === 'vertical' ? 'clientHeight' : 'clientWidth'];

  // Subtract 1 from scrollSize to account for sub-pixel rendering and rounding errors.
  // Due to browser rounding, scrollPosition + clientSize may not exactly equal scrollSize
  // even when visually scrolled to the end.
  return Math.round(scrollPosition + clientSize) >= scrollSize - 1;
}, orientation);
