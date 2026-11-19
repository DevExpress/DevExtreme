import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

// Overlays pop in (scale 0.55 → 1) while fx is on; waits until every overlay content settles.
export const waitForOverlayAnimations = (page: Page): Promise<void> => expect.poll(
  () => page.evaluate(() => Array.from(document.querySelectorAll('.dx-overlay-content'))
    .some((content) => (window as any).DevExpress.fx.isAnimating(content))),
).toBe(false);
