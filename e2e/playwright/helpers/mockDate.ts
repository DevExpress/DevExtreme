import type { Page } from '@playwright/test';

// Runs before any page script, so the widgets see the mocked date from their very first render.
export async function mockDate(page: Page, date: string): Promise<void> {
  await page.clock.install({ time: new Date(date) });
}

export async function setSystemTime(page: Page, date: string): Promise<void> {
  await page.clock.setSystemTime(new Date(date));
}

// Pins what the page reads as "now" while leaving the timers alone. A widget that renders today's
// date — the recurrence form's end date editor does — draws the same pixels on every run, which
// is what the TestCafe "_mask.png" ignore regions were there to work around.
export async function setFixedDate(page: Page, date: string): Promise<void> {
  await page.clock.setFixedTime(new Date(date));
}
