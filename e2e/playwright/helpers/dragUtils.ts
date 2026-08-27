import type { Locator, Page } from '@playwright/test';

export interface DragOptions {
  // A drag has to travel in several moves: one jump does not pass the threshold the DevExtreme
  // draggable uses to tell a drag from a click.
  steps?: number;
}

const DEFAULT_STEPS = 10;

const centerOf = async (target: Locator): Promise<{ x: number; y: number }> => {
  const box = await target.boundingBox();

  if (!box) {
    throw new Error('The drag target has no bounding box — it is detached or not displayed.');
  }

  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

// Presses the mouse on the element and moves it, without releasing. This is the state the TestCafe
// tests reached by disabling the automation "_mouseup": the drag stays open so its markup can be
// captured, and "finishDrag" ends it.
export const startDragToOffset = async (
  page: Page,
  source: Locator,
  offsetX: number,
  offsetY: number,
  { steps = DEFAULT_STEPS }: DragOptions = {},
): Promise<void> => {
  const { x, y } = await centerOf(source);

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + offsetX, y + offsetY, { steps });
};

export const finishDrag = async (page: Page): Promise<void> => {
  await page.mouse.up();
};

export const dragToOffset = async (
  page: Page,
  source: Locator,
  offsetX: number,
  offsetY: number,
  options: DragOptions = {},
): Promise<void> => {
  await startDragToOffset(page, source, offsetX, offsetY, options);
  await finishDrag(page);
};

export const dragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  { steps = DEFAULT_STEPS }: DragOptions = {},
): Promise<void> => {
  const from = await centerOf(source);
  const to = await centerOf(target);

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps });
  await page.mouse.up();
};
