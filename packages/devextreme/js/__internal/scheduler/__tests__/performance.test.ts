import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import timezoneUtils from '../utils_time_zone';
import { createScheduler } from './__mock__/create_scheduler';

const startDate = new Date(2025, 0, 6);
const delta = 15 * 60 * 1000;
const dataSource = Array.from({ length: 10 }, (_, i) => ({
  startDate: startDate.getTime() + i * delta,
  endDate: startDate.getTime() + (i + 1) * delta,
  recurrenceRule: 'FREQ=DAILY;INTERVAL=7',
  text: `Appointment ${i + 1}`,
}));

describe('scheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    { timeZone: 'Europe/London' },
    { timeZone: undefined },
  ])('should memo Intl object for timezone: $timeZone', async ({ timeZone }) => {
    const { container } = await createScheduler({
      dataSource,
      timeZone,
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2025, 0, 8, 15),
      startDayHour: 8,
      firstDayOfWeek: 1,
      height: 600,
    });
    await timezoneUtils.cacheTimeZones();
    timezoneUtils.getMachineTimezoneName();

    expect(container.classList).toContain('dx-scheduler');

    jest.spyOn(Intl, 'DateTimeFormat');

    const navigator = container.querySelector('.dx-scheduler-header .dx-scheduler-navigator') as HTMLDivElement;
    const nextButton = navigator.querySelector('.dx-scheduler-navigator-next') as HTMLDivElement;
    nextButton.click();
    expect(navigator.querySelector('.dx-scheduler-navigator-caption')?.textContent).toBe('13-19 January 2025');
    nextButton.click();
    expect(navigator.querySelector('.dx-scheduler-navigator-caption')?.textContent).toBe('20-26 January 2025');

    expect(Intl.DateTimeFormat).toHaveBeenCalledTimes(0);
  });
});
