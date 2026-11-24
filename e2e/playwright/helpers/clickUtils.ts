import type { Locator, Page } from '@playwright/test';
import { pointWithin } from './dragUtils';

// TestCafe's "t.click(target, { offsetX, offsetY })" clicked the point even when it lay outside the
// target ("body" with offsetY: 400 on a shorter page), so this clicks the page point with the mouse
// instead of asking the target to receive the click.
export const clickWithOffset = async (
  page: Page,
  target: Locator,
  { offsetX, offsetY }: { offsetX?: number; offsetY?: number } = {},
): Promise<void> => {
  const { x, y } = await pointWithin(target, offsetX, offsetY);

  await page.mouse.click(x, y);
};
