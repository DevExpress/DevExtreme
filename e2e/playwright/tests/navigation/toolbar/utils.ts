import type { Locator } from '@playwright/test';
import { expect } from '../../../fixtures';

// The item itself or something inside it (the nested widget's input) holds the focus.
export const expectItemFocused = async (
  item: Locator,
  present = true,
  message?: string,
): Promise<void> => {
  await expect.poll(
    () => item.evaluate((node) => node === document.activeElement
      || node.contains(document.activeElement)),
    { message },
  ).toBe(present);
};
