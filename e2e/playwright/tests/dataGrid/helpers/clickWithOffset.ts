import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

const getSize = async (target: Locator): Promise<{ width: number; height: number }> => {
  const size = { width: 0, height: 0 };

  // The box is null while the target is hidden, for example in the middle of a re-render.
  await expect.poll(async () => {
    const box = await target.boundingBox();

    Object.assign(size, box);

    return box;
  }).not.toBeNull();

  return size;
};

// Offsets from the top-left corner: a negative one counts from the opposite edge, a missing one is
// the middle of the element.
export const clickWithOffset = async (
  target: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<void> => {
  const isAbsolute = (offset: number | undefined): offset is number => (offset ?? -1) >= 0;

  if (isAbsolute(offsetX) && isAbsolute(offsetY)) {
    await target.click({ position: { x: offsetX, y: offsetY } });

    return;
  }

  const { width, height } = await getSize(target);
  const getPosition = (offset: number | undefined, size: number): number => {
    if (offset === undefined) {
      return Math.round(size / 2);
    }

    return offset < 0 ? size + offset : offset;
  };

  await target.click({
    position: { x: getPosition(offsetX, width), y: getPosition(offsetY, height) },
  });
};
