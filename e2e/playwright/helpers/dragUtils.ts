import type { Locator, Page } from '@playwright/test';

interface BoundingBox { x: number; y: number; width: number; height: number }

export interface DragOptions {
  // A drag has to travel in several moves: one jump does not pass the threshold the DevExtreme
  // draggable uses to tell a drag from a click.
  steps?: number;
  // Where inside the source to take hold of it, with the meaning the offsets of "t.drag" and
  // "t.dragToElement" had: measured from the top-left corner, and from the bottom-right one when
  // negative. Left out, the drag starts at the centre.
  offsetX?: number;
  offsetY?: number;
}

const DEFAULT_STEPS = 10;

const MEASURE_ATTEMPTS = 20;
const MEASURE_INTERVAL_MS = 100;

const boxOf = async (target: Locator): Promise<BoundingBox> => {
  // A drag re-renders the area it happened in, so the next target can be replaced between the
  // moment it is found and the moment it is measured — the measurement is retried until it lands.
  for (let attempt = 0; attempt < MEASURE_ATTEMPTS; attempt += 1) {
    await target.waitFor({ state: 'visible' });

    const box = await target.boundingBox();

    if (box) {
      return box;
    }

    await target.page().waitForTimeout(MEASURE_INTERVAL_MS);
  }

  throw new Error('The drag target never reported a bounding box — it keeps being detached.');
};

const offsetWithin = (size: number, offset?: number): number => {
  if (offset === undefined) {
    return Math.round(size / 2);
  }

  return offset < 0 ? size + offset : offset;
};

const pointIn = async (
  target: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<{ x: number; y: number }> => {
  const box = await boxOf(target);

  // Whole pixels, as the TestCafe automation used: half a pixel decides which side of a field the
  // drop indicator appears on, and the etalons record that.
  return {
    x: Math.round(box.x + offsetWithin(box.width, offsetX)),
    y: Math.round(box.y + offsetWithin(box.height, offsetY)),
  };
};

const centerOf = async (target: Locator): Promise<{ x: number; y: number }> => pointIn(target);

const isInViewport = (page: Page, { x, y }: { x: number; y: number }): boolean => {
  const size = page.viewportSize();

  return !!size && x >= 0 && y >= 0 && x < size.width && y < size.height;
};

// The TestCafe automation scrolled what it was about to press on into view. The mouse here works
// in viewport coordinates, so an element outside the viewport would be pressed at coordinates that
// land on something else — or nowhere at all.
const prepareSource = async (source: Locator): Promise<void> => {
  await source.scrollIntoViewIfNeeded();
  // The TestCafe automation also focused the element it pressed on, and the widgets draw a focus
  // ring for it; a bare mouse press does not, which would leave that state out of the screenshots.
  await source.focus();
};

// Presses the mouse on the element and moves it, without releasing. This is the state the TestCafe
// tests reached by disabling the automation "_mouseup": the drag stays open so its markup can be
// captured, and "finishDrag" ends it.
export const startDragToOffset = async (
  page: Page,
  source: Locator,
  offsetX: number,
  offsetY: number,
  { steps = DEFAULT_STEPS, offsetX: grabX, offsetY: grabY }: DragOptions = {},
): Promise<void> => {
  await prepareSource(source);

  const { x, y } = await pointIn(source, grabX, grabY);

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

export const startDragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  { steps = DEFAULT_STEPS, offsetX, offsetY }: DragOptions = {},
): Promise<void> => {
  await prepareSource(source);

  let from = await pointIn(source, offsetX, offsetY);
  let to = await centerOf(target);

  // A drop point outside the viewport never reaches the target, so the target is scrolled in and
  // both ends are measured again — the way the TestCafe automation scrolled on its way there.
  if (!isInViewport(page, to)) {
    await target.scrollIntoViewIfNeeded();

    from = await pointIn(source, offsetX, offsetY);
    to = await centerOf(target);
  }

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps });
};

export const dragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  options: DragOptions = {},
): Promise<void> => {
  await startDragToElement(page, source, target, options);
  await finishDrag(page);
};
