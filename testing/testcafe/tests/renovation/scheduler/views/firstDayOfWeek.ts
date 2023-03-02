import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Renovated scheduler - firstDayOfWeek');

test(
  'WorkWeek should generate correct start view date',
  async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t.expect(await compareScreenshot(
      t,
      'work-week-first-day-of-week.png',
      scheduler.element,
      screenshotComparerOptions,
    ))
      .ok();
  },
).before(
  async (t, { platform }) => {
    await t.resizeWindow(1200, 800);
    await createWidget(platform, 'dxScheduler', {
      views: ['workWeek'],
      currentView: 'workWeek',
      firstDayOfWeek: 1,
      currentDate: new Date(2021, 11, 12),
      height: 600,
    });
  },
).after(async (t) => restoreBrowserSize(t));
