import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { getThemeName } from '../../../helpers/themeUtils';
import Scheduler from '../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const setStyleAttribute = async (element: Locator, styleValue: string): Promise<void> => {
  await element.evaluate((node, value) => {
    const styles = node.getAttribute('style') ?? '';

    node.setAttribute('style', `${styles} ${value}`);
  }, styleValue);
};

const createScheduler = async (page: Page, container: string, options?): Promise<void> => createWidget(page, 'dxScheduler', {
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
}, container);

test.describe('Re-render on resize', () => {
  test.describe('800x400', () => {
    test.use({ browserSize: [800, 400] });

    test('Appointment should re-rendered on window resize-up (T1139566)', async ({ page }) => {
      await createScheduler(page, '#container', { currentView: 'workWeek' });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const { element } = scheduler.getAppointment('test');

      await setStyleAttribute(element, 'background-color: red;');
      await expect(element).toHaveAttribute('style', /transform: translate\(0px, 0px\); width: \d+\.\d+px; height: \d+px; background-color: red;/);
    });
  });

  test.describe('300x300', () => {
    test.use({ browserSize: [300, 300] });

    test('Appointment should not re-rendered on window resize when width and height not set (T1139566)', async ({ page }) => {
      await createScheduler(page, '#container');

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const { element } = scheduler.getAppointment('test');

      await setStyleAttribute(element, 'background-color: red;');

      await expect(element).toHaveAttribute('style', 'transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
    });
  });

  test.describe('300x400', () => {
    test.use({ browserSize: [300, 400] });

    test('Appointment should not re-rendered on window resize when width and height have percent value (T1139566)', async ({ page }) => {
      await createScheduler(page, '#container', { width: '100%', height: '100%' });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const { element } = scheduler.getAppointment('test');

      await setStyleAttribute(element, 'background-color: red;');

      await expect(element).toHaveAttribute('style', 'transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
    });
  });

  test.describe('300x300', () => {
    test.use({ browserSize: [300, 300] });

    test('Appointment should not re-rendered on window resize when width and height have static value (T1139566)', async ({ page, theme }) => {
      await createScheduler(page, '#container', { width: 600, height: 400 });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const { element } = scheduler.getAppointment('test');

      await setStyleAttribute(element, 'background-color: red;');

      const height = getThemeName(theme) === 'fluent-next' ? '61.2539px' : '61.7539px';

      await expect(element).toHaveAttribute('style', `transform: translate(0px, 30px); width: 200px; height: ${height}; background-color: red;`);
    });
  });
});
