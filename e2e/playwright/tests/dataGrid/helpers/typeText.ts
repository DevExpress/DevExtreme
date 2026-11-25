import type { Locator } from '@playwright/test';

// A click only when the element is not focused yet, then the caret at the end of the value (or the
// whole value selected with "replace"), then a key event per character.
export const typeText = async (
  element: Locator,
  text: string,
  { replace = false }: { replace?: boolean } = {},
): Promise<void> => {
  const isFocused = await element.evaluate((node) => node === document.activeElement);

  if (!isFocused) {
    await element.click();
  }

  await element.evaluate((node: HTMLInputElement, selectAll) => {
    const end = node.value.length;

    node.setSelectionRange(selectAll ? 0 : end, end);
  }, replace);

  await element.pressSequentially(text);
};
