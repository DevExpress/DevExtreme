import type { Locator, Page } from '@playwright/test';

const pointWithin = (size: number, offset: number | undefined): number => {
  if (offset === undefined) {
    return Math.round(size / 2);
  }

  return offset < 0 ? size + offset : offset;
};

// Reads the offsets the way TestCafe's "t.click(target, { offsetX, offsetY })" did: a negative one
// counts from the opposite edge, a missing one is the middle. TestCafe clicked the point even when
// it lay outside the target ("body" with offsetY: 400 on a shorter page), so this clicks the page
// point with the mouse instead of asking the target to receive the click.
export const clickWithOffset = async (
  page: Page,
  target: Locator,
  { offsetX, offsetY }: { offsetX?: number; offsetY?: number } = {},
): Promise<void> => {
  await target.scrollIntoViewIfNeeded();

  const box = await target.boundingBox();

  if (!box) {
    throw new Error(`${target.toString()} has no box to click`);
  }

  await page.mouse.click(
    box.x + pointWithin(box.width, offsetX),
    box.y + pointWithin(box.height, offsetY),
  );
};
