import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Renovated scheduler - Cell Duration modification');

test(
  'cellDuration modification should work correctly',
  async (t, { screenshotComparerOptions, platform }) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await updateComponentOptions(platform, { cellDuration: 30 });

    await t.expect(await compareScreenshot(
      t,
      'cell_duration_modification.png',
      scheduler.workSpace,
      screenshotComparerOptions,
    ))
      .ok();
  },
).before(
  async (t, { platform }) => {
    await t.resizeWindow(1200, 800);
    await createWidget(platform, 'dxScheduler', {
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 4),
      startDayHour: 9,
      endDayHour: 14,
      cellDuration: 60,
    });
  },
).after(async (t) => restoreBrowserSize(t));
