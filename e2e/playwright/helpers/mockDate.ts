import type { Page } from '@playwright/test';

// Runs before any page script, so the widgets see the mocked date from their very first render.
export async function mockDate(page: Page, date: string): Promise<void> {
  await page.clock.install({ time: new Date(date) });
}

export async function setSystemTime(page: Page, date: string): Promise<void> {
  await page.clock.setSystemTime(new Date(date));
}
