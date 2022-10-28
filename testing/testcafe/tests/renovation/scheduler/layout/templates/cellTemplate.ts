import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.skip('Layout:Templates:CellTemplate');

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`data-cell-template-currentView=${currentView}.png`, scheduler.workSpace, screenshotComparerOptions))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => {
    await createWidget(platform, 'dxScheduler', {
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
