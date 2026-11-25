import { test, expect } from '@playwright/test';
import { describeManualTest, drag } from '../../../utils/visual-tests/playwright/manual-test';

const WINDOW_WIDTH = 600;

describeManualTest('List', 'DragAndDrop', { width: 900, height: WINDOW_WIDTH }, () => {
  test('DragAndDrop', async ({ page }) => {
    const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
    const LIST_CLASS = 'dx-list';
    const LIST_ITEM_CLASS = 'dx-list-item';
    const LIST_ITEM_TEXT = 'Review Health Insurance Options Under the Affordable Care Act';
    const LIST_ITEM_HEIGHT = 40;

    const itemToDrag = page.locator(`.${LIST_ITEM_CLASS}`).filter({ hasText: LIST_ITEM_TEXT });
    const dragHandle = itemToDrag.locator(`.${REORDER_HANDLE_CLASS}`);

    await drag(page, dragHandle, 0, -LIST_ITEM_HEIGHT - 10);

    const thirdItemRightList = page.locator(`.${LIST_CLASS}`).nth(1).locator(`.${LIST_ITEM_CLASS}`).nth(2);

    await expect(thirdItemRightList).toHaveText(LIST_ITEM_TEXT);

    await drag(page, dragHandle, -WINDOW_WIDTH, -LIST_ITEM_HEIGHT - 10);

    const secondItemLeftList = page.locator(`.${LIST_CLASS}`).nth(0).locator(`.${LIST_ITEM_CLASS}`).nth(1);

    await expect(secondItemLeftList).toHaveText(LIST_ITEM_TEXT);
  });
});
