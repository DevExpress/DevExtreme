import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Layout:Appointments:AllDay');

test('Long all day appointment should be render, if him ended on next view day in currentView: \'day\' (T1021963)', async (t, { screenshotComparerOptions }) => {
  const { workSpace, toolbar } = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(toolbar.navigator.prevButton)
    .expect(await takeScreenshot('27-march-day-view.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .click(toolbar.navigator.nextButton)
    .expect(await takeScreenshot('28-march-day-view.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .click(toolbar.navigator.nextButton)
    .expect(await takeScreenshot('29-march-day-view.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .click(toolbar.navigator.nextButton)
    .expect(await takeScreenshot('30-march-day-view.png', workSpace, screenshotComparerOptions)).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: [{
      allDay: true,
      startDate: new Date(2021, 2, 28),
      endDate: new Date(2021, 2, 29),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    width: 400,
    height: 600,
  });
});

test('Long all day appointment should be render, if him ended on next view day in currentView:', async (t, { screenshotComparerOptions }) => {
  const { workSpace, toolbar } = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(toolbar.navigator.prevButton)
    .expect(await takeScreenshot('21-27-march-week-view.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .click(toolbar.navigator.nextButton)
    .expect(await takeScreenshot('28-march-3-apr-week-view.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .click(toolbar.navigator.nextButton)
    .expect(await takeScreenshot('4-10-apr-week-view.png', workSpace, screenshotComparerOptions)).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: [{
      allDay: true,
      startDate: new Date(2021, 2, 27),
      endDate: new Date(2021, 3, 4),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    width: 600,
    height: 600,
  });
});
