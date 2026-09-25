import type { Locator } from '@playwright/test';

export const hasClass = async (locator: Locator, className: string): Promise<boolean> => locator
  .evaluate((element, name) => element.classList.contains(name), className);
