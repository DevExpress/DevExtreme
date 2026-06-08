import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { logger } from '@ts/core/utils/m_console';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

jest.mock('@ts/core/m_devices', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalModule: any = jest.requireActual('@ts/core/m_devices');
  const real = jest.fn().mockReturnValue({
    platform: 'mac',
    mac: true,
    deviceType: 'desktop',
  });
  const current = jest.fn().mockReturnValue({
    platform: 'mac',
    mac: true,
    deviceType: 'desktop',
  });

  return {
    __esModule: true,
    default: {
      ...originalModule.default,
      isSimulator: originalModule.default.isSimulator,
      real,
      current,
    },
  };
});

describe('Scheduler scrollTo', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
    jest.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should log deprecation warning when using scrollTo API with deprecated signature', async () => {
    const loggerWarnSpy = jest.spyOn(logger, 'warn');

    const { scheduler } = await createScheduler({
      dataSource: [{
        text: 'Meeting',
        startDate: new Date(2025, 0, 15, 9, 0),
        endDate: new Date(2025, 0, 15, 10, 0),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2025, 0, 15),
      startDayHour: 8,
      endDayHour: 18,
    });
    loggerWarnSpy.mockReset();

    scheduler.scrollTo(new Date(2025, 0, 16, 14, 0), undefined, false);

    expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('W0002'),
    );
  });

  it('should not log deprecation warning when using scrollTo API with date only', async () => {
    setupSchedulerTestEnvironment();
    const loggerWarnSpy = jest.spyOn(logger, 'warn');

    const { scheduler } = await createScheduler({
      dataSource: [{
        text: 'Meeting',
        startDate: new Date(2025, 0, 15, 9, 0),
        endDate: new Date(2025, 0, 15, 10, 0),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2025, 0, 15),
      startDayHour: 8,
      endDayHour: 18,
    });
    loggerWarnSpy.mockReset();

    const testDate = new Date(2025, 0, 16, 14, 0);

    scheduler.scrollTo(testDate);

    expect(loggerWarnSpy).toHaveBeenCalledTimes(0);
  });

  it('should scroll to appointment position after saving from popup', async () => {
    const { container, scheduler, POM } = await createScheduler({
      dataSource: [{
        text: 'Late appointment',
        startDate: new Date(2017, 4, 25, 22, 0),
        endDate: new Date(2017, 4, 25, 23, 0),
      }],
      views: ['timelineDay'],
      currentView: 'timelineDay',
      currentDate: new Date(2017, 4, 25),
    });
    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;
    const scrollLeftBeforeSave = scrollableContainer.scrollLeft;

    const item = (scheduler as any).getDataSource().items()[0];
    scheduler.showAppointmentPopup(item);
    POM.popup.saveButton.click();
    await Promise.resolve();

    expect(scrollLeftBeforeSave).toBe(0);
    expect(scrollableContainer.scrollLeft).toBeGreaterThan(0);
  });

  it('should pass different left offsets for "start" vs "center" alignInView', async () => {
    const { container, scheduler } = await createScheduler({
      dataSource: [],
      views: ['timelineDay'],
      currentView: 'timelineDay',
      currentDate: new Date(2017, 4, 25),
    });

    const scrollableElement = container.querySelector('.dx-scheduler-date-table-scrollable') as HTMLElement;
    const scrollableContainer = scrollableElement.querySelector('.dx-scrollable-container') as HTMLElement;

    scheduler.scrollTo(new Date(2017, 4, 25, 22, 0), { alignInView: 'start' });
    const startScrollLeft = scrollableContainer.scrollLeft;

    scrollableContainer.scrollLeft = 0;

    scheduler.scrollTo(new Date(2017, 4, 25, 22, 0), { alignInView: 'center' });
    const centerScrollLeft = scrollableContainer.scrollLeft;

    expect(startScrollLeft).toBeCloseTo(11000);
    expect(centerScrollLeft).toBeCloseTo(11125);
  });
});
