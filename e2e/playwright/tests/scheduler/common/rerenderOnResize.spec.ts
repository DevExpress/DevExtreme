import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { getElementStyle, setElementStyle } from '../../../helpers/domUtils';
import Scheduler from '../../../models/scheduler';

const createScheduler = async (page: Page, options?: object): Promise<void> => createWidget(page, 'dxScheduler', {
  currentDate: new Date(2020, 8, 7),
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  scrolling: {
    mode: 'virtual',
  },
  currentView: 'Timeline',
  views: [{
    type: 'timelineWorkWeek',
    name: 'Timeline',
    groupOrientation: 'vertical',
  }],
  dataSource: [{
    startDate: new Date(2020, 8, 7, 8),
    endDate: new Date(2020, 8, 7, 9),
    text: 'test',
  }],
  ...options,
});

const getAppointmentStyle = async (page: Page): Promise<string> => {
  const { element } = new Scheduler(page, '#container').getAppointment('test');

  await setElementStyle(element, 'background-color: red;');

  return getElementStyle(element);
};

// The viewport is the point of these tests, so each one states its own size.
test.describe(() => {
  test.use({ browserSize: [800, 400] });

  test('Appointment should re-rendered on window resize-up (T1139566)', async ({ page }) => {
    await createScheduler(page, { currentView: 'workWeek' });

    expect(await getAppointmentStyle(page))
      .toMatch(/transform: translate\(0px, 0px\); width: \d+\.\d+px; height: \d+px; background-color: red;/);
  });
});

test.describe(() => {
  test.use({ browserSize: [300, 300] });

  test('Appointment should not re-rendered on window resize when width and height not set (T1139566)', async ({ page }) => {
    await createScheduler(page);

    expect(await getAppointmentStyle(page))
      .toBe('transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
  });
});

test.describe(() => {
  test.use({ browserSize: [300, 400] });

  test('Appointment should not re-rendered on window resize when width and height have percent value (T1139566)', async ({ page }) => {
    await createScheduler(page, { width: '100%', height: '100%' });

    expect(await getAppointmentStyle(page))
      .toBe('transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
  });
});

test.describe(() => {
  test.use({ browserSize: [300, 300] });

  test('Appointment should not re-rendered on window resize when width and height have static value (T1139566)', async ({ page }) => {
    await createScheduler(page, { width: 600, height: 400 });

    expect(await getAppointmentStyle(page))
      .toBe('transform: translate(0px, 30px); width: 200px; height: 61.7539px; background-color: red;');
  });
});
