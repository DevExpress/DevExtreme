import { describe, expect, it } from '@jest/globals';

import { createScheduler } from './__tests__/__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__tests__/__mock__/m_mock_scheduler';

describe('Recurrence focus restore', () => {
  it('should restore focus on appointment after closing recurrence dialog and allow reopening with Enter', async () => {
    setupSchedulerTestEnvironment();

    const { container, keydown } = await createScheduler({
      timeZone: 'Etc/UTC',
      dataSource: [{
        text: 'Recurring meeting',
        startDate: new Date('2021-02-02T09:00:00.000Z'),
        endDate: new Date('2021-02-02T10:00:00.000Z'),
        recurrenceRule: 'FREQ=DAILY',
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date('2021-02-02T10:00:00.000Z'),
      startDayHour: 8,
      endDayHour: 20,
      height: 600,
      focusStateEnabled: true,
      editing: true,
    });

    const appointmentEl = container.querySelector('.dx-scheduler-appointment');
    appointmentEl!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(appointmentEl!.classList.contains('dx-state-focused')).toBe(true);

    keydown(appointmentEl!, 'Enter');
    await new Promise(process.nextTick);

    const dialog = document.body.querySelector('.dx-dialog');
    const closeButton = dialog!.querySelector('.dx-closebutton.dx-button') as HTMLElement;
    closeButton.click();

    keydown(appointmentEl!, 'Enter');
    await new Promise(process.nextTick);

    const dialogAgain = document.body.querySelector('.dx-dialog');
    expect(dialogAgain).toBeTruthy();
  });
});
