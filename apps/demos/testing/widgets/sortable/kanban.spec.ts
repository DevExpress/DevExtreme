import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const CLASSES = {
  listTitle: '.list-title',
  card: '.card',
};

describeManualTest('Sortable', 'Kanban', { width: 900, height: 600 }, () => {
  test('Drag-n-drop kanban columns', async ({ page }) => {
    await drag(page, page.locator(CLASSES.listTitle).nth(0), 600, 50);
    await testScreenshot(page, 'kanban_list_drag-n-drop.png');
  });

  test('Drag-n-drop card inside the same column', async ({ page }) => {
    await drag(page, page.locator(CLASSES.card).nth(3), 25, 200);
    await testScreenshot(page, 'kanban_card_drag-n-drop_same-column.png');
  });

  test('Drag-n-drop card to a different column', async ({ page }) => {
    await drag(page, page.locator(CLASSES.card).nth(3), 300, 150);
    await testScreenshot(page, 'kanban_card_drag-n-drop_different-column.png');
  });
});
