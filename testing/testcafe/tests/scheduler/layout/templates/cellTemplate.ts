import { ClientFunction } from 'testcafe';
import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Templates:CellTemplate`
  .page(url(__dirname, '../../../container.html'));

['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`data-cell-template-currentView=${currentView}`, scheduler.element))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      dataCellTemplate: ClientFunction((itemData) => itemData.startDate),
      dateCellTemplate: ClientFunction((itemData) => itemData.date),
      height: 600,
    });
  });
});
