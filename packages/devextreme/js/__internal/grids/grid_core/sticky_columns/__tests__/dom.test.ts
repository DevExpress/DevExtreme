import {
  describe,
  expect,
  it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import { GridCoreStickyColumnsDom } from '../dom';

const addWidgetPrefix = (className: string): string => `dx-datagrid-${className}`;

const createElement = (
  rect: { left: number; right: number },
  className = '',
  style: { left?: string; right?: string } = {},
): dxElementWrapper => {
  const element = document.createElement('td');

  element.className = className;
  Object.assign(element.style, style);
  element.getBoundingClientRect = (): DOMRect => ({
    ...rect,
    width: rect.right - rect.left,
  }) as DOMRect;

  return $(element);
};

const $container = createElement({ left: 0, right: 600 });

describe('GridCoreStickyColumnsDom.isFixedCellPinnedToLeft', () => {
  describe('when the cell is fixed to the left', () => {
    it('should return true', () => {
      const $cell = createElement({ left: 0, right: 100 }, 'dx-datagrid-sticky-column-left');

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToLeft($cell, $container, addWidgetPrefix))
        .toBe(true);
    });
  });

  describe('when the sticky cell is pinned to the left', () => {
    it('should return true', () => {
      const $cell = createElement({ left: 0, right: 100 }, 'dx-datagrid-sticky-column', { left: '0px' });

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToLeft($cell, $container, addWidgetPrefix))
        .toBe(true);
    });
  });

  describe('when the sticky cell is not pinned', () => {
    it('should return false', () => {
      const $cell = createElement({ left: 200, right: 300 }, 'dx-datagrid-sticky-column', { left: '0px' });

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToLeft($cell, $container, addWidgetPrefix))
        .toBe(false);
    });
  });

  describe('when the cell is fixed to the right', () => {
    it('should return false', () => {
      const $cell = createElement({ left: 500, right: 600 }, 'dx-datagrid-sticky-column-right');

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToLeft($cell, $container, addWidgetPrefix))
        .toBe(false);
    });
  });

  describe('when the cell is not fixed', () => {
    it('should return false', () => {
      const $cell = createElement({ left: 0, right: 100 });

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToLeft($cell, $container, addWidgetPrefix))
        .toBe(false);
    });
  });
});

describe('GridCoreStickyColumnsDom.isFixedCellPinnedToRight', () => {
  describe('when the cell is fixed to the right', () => {
    it('should return true', () => {
      const $cell = createElement({ left: 500, right: 600 }, 'dx-datagrid-sticky-column-right');

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToRight($cell, $container, addWidgetPrefix))
        .toBe(true);
    });
  });

  describe('when the sticky cell is pinned to the right', () => {
    it('should return true', () => {
      const $cell = createElement({ left: 500, right: 600 }, 'dx-datagrid-sticky-column', { right: '0px' });

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToRight($cell, $container, addWidgetPrefix))
        .toBe(true);
    });
  });

  describe('when the sticky cell is not pinned', () => {
    it('should return false', () => {
      const $cell = createElement({ left: 200, right: 300 }, 'dx-datagrid-sticky-column', { right: '0px' });

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToRight($cell, $container, addWidgetPrefix))
        .toBe(false);
    });
  });

  describe('when the cell is fixed to the left', () => {
    it('should return false', () => {
      const $cell = createElement({ left: 0, right: 100 }, 'dx-datagrid-sticky-column-left');

      expect(GridCoreStickyColumnsDom.isFixedCellPinnedToRight($cell, $container, addWidgetPrefix))
        .toBe(false);
    });
  });
});
