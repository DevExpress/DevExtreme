import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:Appointments:allDayExpr`
  .page(url(__dirname, '../../../../container.html'));

[{
  config: {
    allDayExpr: 'AllDay',
  },
  data: {
    AllDay: true,
  },
}, {
  config: {
  },
  data: {
    allDay: true,
  },
}].forEach(({ config, data }) => {
  test('All day appointment should be render valid in case without endDate property(T1155630)', async (t) => {
    const { toolbar, workSpace } = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`week-all-day-expr-${config.allDayExpr}.png`, workSpace)).ok();

    await t
      .click(toolbar.viewSwitcher.getButton('Timeline Week').element);

    await t
      .expect(await takeScreenshot(`timelineWeek-all-day-expr-${config.allDayExpr}.png`, workSpace)).ok();

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'MY EVENT',
        startDate: new Date(2023, 2, 19, 23, 45),
        ...data,
      }],
      views: ['week', 'timelineWeek'],
      currentView: 'week',
      currentDate: new Date(2023, 2, 21),
      height: 600,
      ...config,
    });
  });
});
