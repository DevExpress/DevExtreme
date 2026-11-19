import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export const classMatcher = (className: string): RegExp => new RegExp(`(^|\\s)${className}(\\s|$)`);

export const expectClass = async (
  locator: Locator,
  className: string,
  present = true,
): Promise<void> => {
  const assertion = expect(locator);

  await (present ? assertion : assertion.not).toHaveClass(classMatcher(className));
};
