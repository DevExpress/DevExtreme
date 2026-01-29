import { ClientFunction } from 'testcafe';

export const isScrollAtEnd = ClientFunction((orientation: 'vertical' | 'horizontal' = 'vertical') => {
  const element = $('.dx-datagrid-rowsview .dx-scrollable-container')[0];

  if (!element) {
    return false;
  }

  const scrollSize = element[orientation === 'vertical' ? 'scrollHeight' : 'scrollWidth'];
  const scrollPosition = element[orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'];
  const clientSize = element[orientation === 'vertical' ? 'clientHeight' : 'clientWidth'];

  return scrollPosition + clientSize >= scrollSize - 1;
});

/**
 * Calculates Y-offset for dragging a row to the top of the grid with upward autoscroll.
 * Autoscroll triggers when the cursor is within scrollSensitivity (default 60px)
 * from the top edge of the container.
 * Autoscroll speed is calculated by formula:
 * Math.ceil(((sensitivity - distance) / sensitivity) ** 2 * maxSpeed)
 *
 * @param rowIndex - index of the row being dragged
 * @param speedFactor - speed factor from 0 to 1 (default 0.5):
 *   - 0 = minimum speed (cursor at scrollSensitivity boundary)
 *   - 0.5 = medium speed (cursor halfway to the edge)
 *   - 1 = maximum speed (cursor at the container edge)
 * @returns Y-offset relative to the current row position to trigger upward autoscroll
 */
export const getOffsetToTriggerUpwardAutoScroll = ClientFunction(
  (rowIndex: number, speedFactor = 0.5): number => {
    const gridInstance = $('#container').data('dxDataGrid');
    const $row = $(gridInstance.getRowElement(rowIndex));
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
    // the cursor is within scrollSensitivity from the top edge of the container
    const scrollSensitivity = gridInstance.option('rowDragging.scrollSensitivity') ?? 60;

    // Clamp speedFactor to [0, 1] range
    const normalizedSpeedFactor = Math.max(0, Math.min(1, speedFactor));

    // Calculate distance from the top edge of the container:
    // - speedFactor = 0: distance = scrollSensitivity (minimum speed)
    // - speedFactor = 0.5: distance = scrollSensitivity / 2 (medium speed)
    // - speedFactor = 1: distance = 0 (maximum speed, cursor at the edge)
    const distance = scrollSensitivity * (1 - normalizedSpeedFactor);

    // Target Y-coordinate
    const targetY = containerOffset.top + distance;

    // Return offset relative to the current row position
    return Math.round(targetY - rowOffset.top);
  },
);
