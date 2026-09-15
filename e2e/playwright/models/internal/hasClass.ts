import type { Locator } from '@playwright/test';

export const hasClass = async (locator: Locator, className: string): Promise<boolean> => {
  const classes = await locator.getAttribute('class');

  return classes?.split(' ').includes(className) ?? false;
};
