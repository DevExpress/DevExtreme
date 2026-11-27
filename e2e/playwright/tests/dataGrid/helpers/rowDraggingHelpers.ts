import type { Page } from '@playwright/test';
import { DEFAULT_SELECTOR } from '../../../helpers/const';

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

/**
 * Calculates offsetY for dragging a row to trigger autoscroll.
 * Autoscroll triggers when the cursor is within scrollSensitivity (default 60px)
 * from the edge of the container.
 * Autoscroll speed is calculated by formula:
 * Math.ceil(((sensitivity - distance) / sensitivity) ** 2 * maxSpeed)
 *
 * @param page - the test page
 * @param rowIndex - index of the row being dragged
 * @param speedFactor - speed factor from 0 to 1 (default 0.5):
 *   - 0 = minimum speed (cursor at scrollSensitivity boundary)
 *   - 0.5 = medium speed (cursor halfway to the edge)
 *   - 1 = maximum speed (cursor at the container edge)
 * @param direction - autoscroll direction (default 'up'):
 *   - 'up' = upward autoscroll (drag towards top edge)
 *   - 'down' = downward autoscroll (drag towards bottom edge)
 * @returns offsetY relative to the current row position to trigger autoscroll
 */
export const getOffsetToTriggerAutoScroll = (
  page: Page,
  rowIndex: number,
  speedFactor = 0.5,
  direction: 'up' | 'down' = 'up',
): Promise<number> => page.evaluate(({
  gridSelector, index, factor, scrollDirection,
}) => {
  const gridInstance = $(gridSelector).data('dxDataGrid');
  const $row = $(gridInstance.getRowElement(index));
  const $scrollContainer = $('.dx-datagrid-rowsview .dx-scrollable-container');

  if (!$row.length || !$scrollContainer.length) {
    return 0;
  }

  const rowOffset = $row.offset();
  const containerOffset = $scrollContainer.offset();

  if (!rowOffset || !containerOffset) {
    return 0;
  }

  // scrollSensitivity is 60px by default
  // To trigger autoscroll, the row must be dragged so that
  // the cursor is within scrollSensitivity from the edge of the container
  const scrollSensitivity = gridInstance.option('rowDragging.scrollSensitivity') ?? 60;

  // Clamp speedFactor to [0, 1] range
  const normalizedSpeedFactor = Math.max(0, Math.min(1, factor));

  // Calculate distance from the edge of the container:
  // - speedFactor = 0: distance = scrollSensitivity (minimum speed)
  // - speedFactor = 0.5: distance = scrollSensitivity / 2 (medium speed)
  // - speedFactor = 1: distance = 0 (maximum speed, cursor at the edge)
  const distance = scrollSensitivity * (1 - normalizedSpeedFactor);

  if (scrollDirection === 'up') {
    // Target Y-coordinate for upward autoscroll.
    // Add 1 to ensure the cursor is inside the autoscroll zone, not on its boundary.
    // Without this offset, boundary values may not reliably trigger autoscroll due to rounding.
    const targetY = containerOffset.top + distance + 1;

    return Math.round(targetY - rowOffset.top);
  }

  // Target Y-coordinate for downward autoscroll.
  // Subtract 1 to ensure the cursor is inside the autoscroll zone, not on its boundary.
  // Without this offset, boundary values may not reliably trigger autoscroll due to rounding.
  const containerHeight = $scrollContainer.height() ?? 0;
  const targetY = containerOffset.top + containerHeight - distance - 1;

  return Math.round(targetY - rowOffset.top);
}, {
  gridSelector: DEFAULT_SELECTOR, index: rowIndex, factor: speedFactor, scrollDirection: direction,
});
