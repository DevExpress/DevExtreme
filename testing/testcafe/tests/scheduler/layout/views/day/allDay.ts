import { ClientFunction } from 'testcafe';
import Scheduler from '../../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../../helpers/screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';

fixture`Layout:Views:Day:AllDay`
  .page(url(__dirname, '../../../../container.html'));

const enableNativeScroll = ClientFunction(() => {
  ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().option('useNative', true);
});

[1, 2].forEach((intervalCount) => {
  ['horizontal', 'vertical'].forEach((groupOrientation) => {
    [true, false].forEach((showAllDayPanel) => {
      const testName = `Day view with interval and crossScrollingEnabled(groupOrientation='${groupOrientation}', showAllDayPanel='${showAllDayPanel}', intervalCount='${intervalCount}')
      layout test`;

      test(testName, async (t) => {
        const scheduler = new Scheduler('#container');
        await enableNativeScroll();

        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const pngName = `day-orientation=${groupOrientation}-allDay=${showAllDayPanel}-interval=${intervalCount}.png`;

        await t
          .expect(await takeScreenshot(pngName, scheduler.element))
          .ok()

          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => createWidget('dxScheduler', {
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
      }));
    });
  });
});
