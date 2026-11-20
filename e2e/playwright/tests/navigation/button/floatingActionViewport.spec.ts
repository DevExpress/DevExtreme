import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';
const FAB_OFFSET = 16;

const getViewportClientSize = (page: Page): Promise<{ width: number; height: number }> => page
  .evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }));

const rectEdge = (element: Locator, edge: 'right' | 'bottom'): Promise<number> => element
  .evaluate((node, side) => node.getBoundingClientRect()[side], edge);

const expectWithin = async (
  value: () => Promise<number>,
  from: number,
  to: number,
): Promise<void> => {
  await expect.poll(value).toBeGreaterThanOrEqual(from);
  await expect.poll(value).toBeLessThanOrEqual(to);
};

test.describe('FloatingAction - visible area', () => {
  test('FAB should keep its offset from the visible area edges after scrollbars appear (T1334663)', async ({ page }) => {
    await createWidget(page, 'dxSpeedDialAction', {
      icon: 'add',
      visible: true,
    });

    const fabContent = page.locator(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`);
    const initialSize = await getViewportClientSize(page);

    await expectWithin(
      () => rectEdge(fabContent, 'right'),
      initialSize.width - FAB_OFFSET - 1,
      initialSize.width - FAB_OFFSET + 1,
    );
    await expectWithin(
      () => rectEdge(fabContent, 'bottom'),
      initialSize.height - FAB_OFFSET - 1,
      initialSize.height - FAB_OFFSET + 1,
    );

    await appendElementTo(page, '#container', 'div', 'tall-content', { width: '3000px', height: '3000px' });

    const sizeWithScrollbars = await getViewportClientSize(page);

    await expectWithin(
      () => rectEdge(fabContent, 'right'),
      sizeWithScrollbars.width - FAB_OFFSET - 1,
      sizeWithScrollbars.width - FAB_OFFSET + 1,
    );
    await expectWithin(
      () => rectEdge(fabContent, 'bottom'),
      sizeWithScrollbars.height - FAB_OFFSET - 1,
      sizeWithScrollbars.height - FAB_OFFSET + 1,
    );
  });
});
