import type { Page } from '@playwright/test';

// A pointer released over the headers leaves the header under it in the hover state. The shots
// after a drop or a resize are about the columns, so the pointer goes to the bottom left corner of
// the viewport, below the grid.
export const movePointerOffGrid = async (page: Page): Promise<void> => {
  const { height } = page.viewportSize() ?? { height: 0 };

  await page.mouse.move(0, height - 1);
};
