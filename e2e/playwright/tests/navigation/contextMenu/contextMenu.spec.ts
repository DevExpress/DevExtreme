import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import ContextMenu from '../../../models/contextMenu';

test.describe('ContextMenu', () => {
  test('Context menu should be shown in the same position when item was added in runtime (T755681)', async ({ page }) => {
    const menuTargetID = 'menuTarget';

    await appendElementTo(page, '#container', 'div', 'contextMenu');
    await appendElementTo(page, '#container', 'button', menuTargetID, {
      width: '150px', height: '50px', backgroundColor: 'steelblue',
    });

    await createWidget(page, 'dxContextMenu', (target) => ({
      items: [{ text: 'item1' }],
      showEvent: 'dxclick',
      target,
      onShowing: (e) => {
        if (!(window as any).isItemAdded) {
          // The item arrives while the menu is open, the way a late answer would add it.
          // eslint-disable-next-line no-restricted-syntax
          setTimeout(() => {
            (window as any).isItemAdded = true;
            const items = e.component.option('items');
            items.push({ text: 'item 2' });
            e.component.option('items', items);
          }, 1000);
        }
      },
    }), '#contextMenu', { arg: `#${menuTargetID}` });

    const contextMenu = new ContextMenu(page, '#contextMenu');

    await page.locator(`#${menuTargetID}`).click();
    await expect(page.locator('.dx-context-menu').first(), 'Context menu element should exist').toBeAttached();
    await expect(contextMenu.overlay.getContent()).toHaveCSS('visibility', 'visible');

    const initialOverlayOffset = await contextMenu.overlay.getOverlayOffset();

    await expect(contextMenu.items).toHaveCount(1);

    await expect(contextMenu.items).toHaveCount(2);
    await expect.poll(() => contextMenu.overlay.getOverlayOffset()).toEqual(initialOverlayOffset);
  });
});
