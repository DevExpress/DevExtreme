import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

[1, 2].forEach((intervalCount) => {
  ['horizontal', 'vertical'].forEach((groupOrientation) => {
    [true, false].forEach((showAllDayPanel) => {
      const testName = `Day view with interval and crossScrollingEnabled(groupOrientation='${groupOrientation}', showAllDayPanel='${showAllDayPanel}', intervalCount='${intervalCount}')
      layout test`;

      test(testName, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          resources: [{
            fieldExpr: 'roomId',
            dataSource: [{
              text: 'Room 1',
              id: 1,
            }, {
              text: 'Room 2',
              id: 2,
            }],
            label: 'Room',
          }],
          dataSource: [],
          views: [{
            name: 'dayView',
            type: 'day',
            intervalCount,
            groupOrientation,
          }],
          currentView: 'dayView',
          currentDate: new Date(2021, 2, 25),
          height: 600,
          groups: ['roomId'],
          showAllDayPanel,
          crossScrollingEnabled: true,
        });

        const scheduler = new Scheduler(page, '#container');

        await page.evaluate(() => {
          ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().option('useNative', true);
        });

        const pngName = `day-orientation=${groupOrientation}-allDay=${showAllDayPanel}-interval=${intervalCount}.png`;

        await testScreenshot(page, pngName, { element: scheduler.element });
      });
    });
  });
});
