import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:Templates:CellTemplate`
  .page(url(__dirname, '../../../container.html'));

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`data-cell-template-currentView=${currentView}.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      showAllDayPanel: false,
      dataCellTemplate: ClientFunction((itemData) => ($('<div />') as any).dxDateBox({
        type: 'time',
        value: itemData.startDate,
      })),
      dateCellTemplate: ClientFunction((itemData) => ($('<div />') as any).dxTextBox({
        value: new Intl.DateTimeFormat('en-US').format(itemData.date),
      })),
      height: 600,
    });
  });
});

test(`resourceCellTemplate layout should be rendered right in the agenda view`, async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`resource-cell-template-currentView=agenda.png`, scheduler.workSpace))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const currentDate = new Date(2017, 4, 25);
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'appointment',
      startDate: currentDate,
      endDate: currentDate,
      resource: 1,
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate,
    resourceCellTemplate() {
      return 'Custom resource text';
    },
    groups: ['resource'],
    resources: [{
      fieldExpr: 'resource',
      dataSource: [{
          text: 'Resource text',
          id: 1,
      }],
      label: 'Resource',
    }],
    height: 600,
  });
});
