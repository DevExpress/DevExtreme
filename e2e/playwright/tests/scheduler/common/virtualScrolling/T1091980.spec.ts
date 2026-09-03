import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test('it should correctly render virtual table if scheduler sizes are set in % (T1091980)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    width: '100%',
    height: '100%',
    dataSource: [],
    views: [{
      type: 'week',
      intervalCount: 10,
    }],
    currentView: 'week',
    currentDate: new Date(2021, 3, 5),
    startDayHour: 8,
    endDayHour: 20,
    crossScrollingEnabled: true,
    scrolling: {
      mode: 'virtual',
    },
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.allDayTableCells).toHaveCount(24);
  await expect(scheduler.dateTableCells).toHaveCount(576);

  await scheduler.scrollTo(new Date(2021, 5, 12, 19));

  await expect(scheduler.allDayTableCells).toHaveCount(24);
  await expect(scheduler.dateTableCells).toHaveCount(576);
});
