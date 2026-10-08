import type { Page } from '@playwright/test';

export async function mockDate(page: Page, date: string): Promise<void> {
  await page.clock.setFixedTime(new Date(date));
}

export async function setSystemTime(page: Page, date: string): Promise<void> {
  await page.clock.setSystemTime(new Date(date));
}
