import type { Page } from '@playwright/test';

const SCHEDULER_SELECTOR = '#container';

export const scrollTo = async (page: Page, x: number, y: number): Promise<void> => page.evaluate(
  ({ selector, left, top }) => {
    const instance = ($(selector) as any).dxScheduler('instance');

    instance.getWorkSpaceScrollable().scrollTo({ top, left });
  },
  { selector: SCHEDULER_SELECTOR, left: x, top: y },
);

export const scrollToDate = async (
  page: Page,
  date: Date,
  groups?: Record<string, unknown>,
): Promise<void> => page.evaluate(
  ({ selector, targetDate, targetGroups }) => {
    const instance = ($(selector) as any).dxScheduler('instance');

    instance.scrollTo(targetDate, targetGroups);
  },
  { selector: SCHEDULER_SELECTOR, targetDate: date, targetGroups: groups },
);
