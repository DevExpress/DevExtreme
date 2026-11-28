import type { Page } from '@playwright/test';

// Some grid steps end on zero-delay timers, one queuing the next, and leave nothing on the page to
// wait for: after a Tab into a command cell, the grid focuses the cell's first link again. Timers
// with the same delay run in the order they were queued, so two queued now, one from the other,
// run after such a pair.
export const waitForQueuedTimers = async (page: Page): Promise<void> => {
  await page.evaluate(() => new Promise<void>((resolve) => {
    // eslint-disable-next-line no-restricted-syntax -- waits for queued timers, not for time
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-syntax -- waits for queued timers, not for time
      setTimeout(resolve);
    });
  }));
};

// The browser sends the scroll event with the next frame. On it the grid renders what the new
// position shows, and after that it restores the focused cell on a zero-delay timer.
export const waitForScrollHandled = async (page: Page): Promise<void> => {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  await waitForQueuedTimers(page);
};
