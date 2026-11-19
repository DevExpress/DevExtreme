import type { Locator } from '@playwright/test';
import { expect } from '../../../fixtures';

export const expectImagesLoaded = async (container: Locator, count: number): Promise<void> => {
  const images = container.locator('img');

  await expect(images).toHaveCount(count);
  await expect.poll(() => images.evaluateAll((elements: HTMLImageElement[]) => elements
    .every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
};
