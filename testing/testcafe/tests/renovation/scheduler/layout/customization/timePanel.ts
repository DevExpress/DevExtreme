import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../helpers/multi-platform-test/platform-type';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../../helpers/domUtils';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.skip('Scheduler: Layout Customization: Time Panel');

const createScheduler = async (
  platform: PlatformType,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    currentDate: new Date(2021, 4, 11),
    height: 500,
    width: 700,
    startDayHour: 9,
    showAllDayPanel: false,
    dataSource: [{
      text: 'Create Report on Customer Feedback',
      startDate: new Date('2021-05-11T22:15:00.000Z'),
      endDate: new Date('2021-05-12T00:30:00.000Z'),
    }, {
      text: 'Review Customer Feedback Report',
      startDate: new Date('2021-05-11T23:15:00.000Z'),
      endDate: new Date('2021-05-12T01:30:00.000Z'),
    }, {
      text: 'Customer Feedback Report Analysis',
      startDate: new Date('2021-05-12T16:30:00.000Z'),
      endDate: new Date('2021-05-12T17:30:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
    }, {
      text: 'Prepare Shipping Cost Analysis Report',
      startDate: new Date('2021-05-12T19:30:00.000Z'),
      endDate: new Date('2021-05-12T20:30:00.000Z'),
    }, {
      text: 'Provide Feedback on Shippers',
      startDate: new Date('2021-05-12T21:15:00.000Z'),
      endDate: new Date('2021-05-12T23:00:00.000Z'),
    }, {
      text: 'Select Preferred Shipper',
      startDate: new Date('2021-05-13T00:30:00.000Z'),
      endDate: new Date('2021-05-13T03:00:00.000Z'),
    }, {
      text: 'Complete Shipper Selection Form',
      startDate: new Date('2021-05-13T15:30:00.000Z'),
      endDate: new Date('2021-05-13T17:00:00.000Z'),
    }, {
      text: 'Upgrade Server Hardware',
      startDate: new Date('2021-05-13T19:00:00.000Z'),
      endDate: new Date('2021-05-13T21:15:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
    }, {
      text: 'Upgrade Personal Computers',
      startDate: new Date('2021-05-13T21:45:00.000Z'),
      endDate: new Date('2021-05-13T23:30:00.000Z'),
    }],
    ...additionalProps,
  }, true);
};

[false, true].forEach((crossScrollingEnabled) => {
  ['week'/* 'agenda' */].forEach((view) => {
    test(`Time panel customization should work in ${view} view`, async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(scheduler.getAppointmentCount())
        .eql(8)
        .expect(
          await takeScreenshot(
            `custom-time-panel-in-${view}-cross-scrolling=${crossScrollingEnabled}.png`,
            scheduler.element,
            screenshotComparerOptions,
          ),
        )
        .ok();

      await removeStylesheetRulesFromPage();

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (_, { platform }) => {
      await insertStylesheetRulesToPage('#container .dx-scheduler-time-panel { width: 150px;}');

      await createScheduler(platform, {
        views: [view],
        currentView: view,
        crossScrollingEnabled,
      });
    });
  });
});
