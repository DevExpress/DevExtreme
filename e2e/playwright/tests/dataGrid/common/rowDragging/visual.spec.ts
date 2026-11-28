import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getOffsetToTriggerAutoScroll, isScrollAtEnd } from '../../helpers/rowDraggingHelpers';

const MAXIMIZED_WINDOW_SIZE = { width: 1920, height: 1080 };

test.describe('Row dragging.Visual', () => {
  // T1179218
  test('Rows should appear correctly during dragging when virtual scrolling is enabled and rowDragging.dropFeedbackMode = "push"', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      keyExpr: 'id',
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [...new Array(100)].fill(null).map((_, index) => ({ id: index })),
      columns: ['id'],
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // drag the row down
    await dataGrid.moveRow(0, 30, 150, true);
    await dataGrid.moveRow(0, 30, await getOffsetToTriggerAutoScroll(page, 0, 1, 'down'));

    // The grid scrolls while the pointer stays at its edge: the checks wait for the end.
    await expect(dataGrid.getDataRow(99).getDataCell(1).element).toHaveText('99');
    await expect.poll(() => isScrollAtEnd(page, 'vertical')).toBe(true);

    // drag the row up
    await dataGrid.moveRow(0, 30, await getOffsetToTriggerAutoScroll(page, 0, 1));

    await expect(dataGrid.getDataRow(0).getDataCell(1).element).toHaveText('0');
    // The simulated scrollable reports -0 at the top, which toBe(0) rejects.
    await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);
    // The dragging takes the rows rendered at the top a moment later, with a delayed resize.
    await expect.poll(() => dataGrid.hasResizeTimeout()).toBe(false);

    await testScreenshot(page, 'T1179218-virtual-scrolling-dragging-row.png', { element: dataGrid.element });
  });
});
