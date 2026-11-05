import type { Locator, Page } from '@playwright/test';

export interface DragOptions {
  offsetX?: number;
  offsetY?: number;
  steps?: number;
}

interface Point { x: number; y: number }

const DEFAULT_STEPS = 10;

const offsetWithin = (size: number, offset: number | undefined): number => {
  if (offset === undefined) {
    return size / 2;
  }

  return offset < 0 ? size + offset : offset;
};

const pointWithin = async (
  element: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<Point> => {
  await element.scrollIntoViewIfNeeded();

  const box = await element.boundingBox();

  if (!box) {
    throw new Error(`${element.toString()} has no box to point at`);
  }

  return {
    x: Math.round(box.x + offsetWithin(box.width, offsetX)),
    y: Math.round(box.y + offsetWithin(box.height, offsetY)),
  };
};

const press = async (
  page: Page,
  source: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<Point> => {
  const start = await pointWithin(source, offsetX, offsetY);

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();

  return start;
};

export const startDragToOffset = async (
  page: Page,
  source: Locator,
  deltaX: number,
  deltaY: number,
  { offsetX, offsetY, steps = DEFAULT_STEPS }: DragOptions = {},
): Promise<void> => {
  const start = await press(page, source, offsetX, offsetY);

  await page.mouse.move(start.x + deltaX, start.y + deltaY, { steps });
};

export const startDragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  { offsetX, offsetY, steps = DEFAULT_STEPS }: DragOptions = {},
): Promise<void> => {
  await press(page, source, offsetX, offsetY);

  const end = await pointWithin(target);

  await page.mouse.move(end.x, end.y, { steps });
};

export const finishDrag = async (page: Page): Promise<void> => {
  await page.mouse.up();
};

export const dragToOffset = async (
  page: Page,
  source: Locator,
  deltaX: number,
  deltaY: number,
  options?: DragOptions,
): Promise<void> => {
  await startDragToOffset(page, source, deltaX, deltaY, options);
  await finishDrag(page);
};

export const dragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  options?: DragOptions,
): Promise<void> => {
  await startDragToElement(page, source, target, options);
  await finishDrag(page);
};
