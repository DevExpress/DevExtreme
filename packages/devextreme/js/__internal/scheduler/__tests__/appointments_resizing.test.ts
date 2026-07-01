import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/scheduler';
import eventsEngine from '@ts/events/core/m_events_engine';

import { createScheduler as baseCreateScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const createScheduler = (config: Properties):
ReturnType<typeof baseCreateScheduler> => baseCreateScheduler({
  ...config,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _newAppointments: true,
});

const RESIZE_HANDLE_SELECTOR = '.dx-resizable-handle';

const baseConfig: Properties = {
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2024, 0, 1),
  height: 600,
};

const timedAppointment = {
  text: 'Timed',
  startDate: new Date(2024, 0, 1, 9, 0),
  endDate: new Date(2024, 0, 1, 10, 0),
};

const countResizeHandles = (element: Element | null | undefined): number => (
  element?.querySelectorAll(RESIZE_HANDLE_SELECTOR).length ?? 0
);

describe('Appointments Resizing', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
    fx.off = true;
  });

  afterEach(() => {
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
  });

  it('should render resize handles on a grid appointment when resizing is allowed', async () => {
    const { POM } = await createScheduler({
      ...baseConfig,
      dataSource: [timedAppointment],
      editing: { allowUpdating: true, allowResizing: true },
    });

    expect(countResizeHandles(POM.getAppointment('Timed').element)).toBeGreaterThan(0);
  });

  it('should not render resize handles when resizing is disabled', async () => {
    const { POM } = await createScheduler({
      ...baseConfig,
      dataSource: [timedAppointment],
      editing: { allowUpdating: true, allowResizing: false },
    });

    expect(countResizeHandles(POM.getAppointment('Timed').element)).toBe(0);
  });

  it('should not render resize handles on all-day appointments', async () => {
    const { POM } = await createScheduler({
      ...baseConfig,
      dataSource: [{ ...timedAppointment, text: 'AllDay', allDay: true }],
      editing: { allowUpdating: true, allowResizing: true },
    });

    expect(countResizeHandles(POM.getAppointment('AllDay').element)).toBe(0);
  });

  it('should focus the appointment on resize start', async () => {
    const { POM } = await createScheduler({
      ...baseConfig,
      dataSource: [timedAppointment],
      editing: { allowUpdating: true, allowResizing: true },
    });

    const appointment = POM.getAppointment('Timed').element as HTMLElement;
    const handle = appointment.querySelector(RESIZE_HANDLE_SELECTOR) as HTMLElement;

    eventsEngine.trigger(handle, { type: 'dxdragstart', target: handle });

    expect(document.activeElement).toBe(appointment);
  });
});
