import type { Item } from 'devextreme/ui/context_menu';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import ContextMenu from '../../../models/contextMenu';

test.describe('ContextMenu_common', () => {
  test.use({ browserSize: [500, 500] });

  test('ContextMenu items render', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'contextMenu');

    const items: Item[] = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

    items[98].items = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

    await createWidget(page, 'dxContextMenu', {
      items,
      target: 'body',
    }, '#contextMenu');

    const contextMenu = new ContextMenu(page, '#contextMenu');

    await contextMenu.show();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');

    await testScreenshot(page, 'ContextMenu scrolling.png');
  });
});
