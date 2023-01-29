import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const data = [
  {
    text: 'Website Re-Design Plan',
    priorityId: 2,
    startDate: new Date('2021-04-19T16:30:00.000Z'),
    endDate: new Date('2021-04-19T18:30:00.000Z'),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    priorityId: 1,
    startDate: new Date('2021-04-22T17:00:00.000Z'),
    endDate: new Date('2021-04-22T19:00:00.000Z'),
  }, {
    text: 'Install New Router in Dev Room',
    priorityId: 1,
    startDate: new Date('2021-04-19T20:00:00.000Z'),
    endDate: new Date('2021-04-19T22:30:00.000Z'),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    priorityId: 2,
    startDate: new Date('2021-04-20T17:00:00.000Z'),
    endDate: new Date('2021-04-20T18:00:00.000Z'),
  }, {
    text: 'Final Budget Review',
    priorityId: 2,
    startDate: new Date('2021-04-20T19:00:00.000Z'),
    endDate: new Date('2021-04-20T20:35:00.000Z'),
  }, {
    text: 'New Brochures',
    priorityId: 2,
    startDate: new Date('2021-04-19T20:00:00.000Z'),
    endDate: new Date('2021-04-19T22:15:00.000Z'),
  }, {
    text: 'Install New Database',
    priorityId: 1,
    startDate: new Date('2021-04-20T16:00:00.000Z'),
    endDate: new Date('2021-04-20T19:15:00.000Z'),
  }, {
    text: 'Approve New Online Marketing Strategy',
    priorityId: 2,
    startDate: new Date('2021-04-21T19:00:00.000Z'),
    endDate: new Date('2021-04-21T21:00:00.000Z'),
  }, {
    text: 'Upgrade Personal Computers',
    priorityId: 1,
    startDate: new Date('2021-04-19T16:00:00.000Z'),
    endDate: new Date('2021-04-19T18:30:00.000Z'),
  }, {
    text: 'Prepare 2021 Marketing Plan',
    priorityId: 2,
    startDate: new Date('2021-04-22T18:00:00.000Z'),
    endDate: new Date('2021-04-22T20:30:00.000Z'),
  }, {
    text: 'Brochure Design Review',
    priorityId: 1,
    startDate: new Date('2021-04-21T18:00:00.000Z'),
    endDate: new Date('2021-04-21T20:30:00.000Z'),
  }, {
    text: 'Create Icons for Website',
    priorityId: 2,
    startDate: new Date('2021-04-23T17:00:00.000Z'),
    endDate: new Date('2021-04-23T18:30:00.000Z'),
  }, {
    text: 'Upgrade Server Hardware',
    priorityId: 1,
    startDate: new Date('2021-04-23T16:00:00.000Z'),
    endDate: new Date('2021-04-23T22:00:00.000Z'),
  }, {
    text: 'Submit New Website Design',
    priorityId: 2,
    startDate: new Date('2021-04-23T23:30:00.000Z'),
    endDate: new Date('2021-04-24T01:00:00.000Z'),
  }, {
    text: 'Launch New Website',
    priorityId: 2,
    startDate: new Date('2021-04-23T19:20:00.000Z'),
    endDate: new Date('2021-04-23T21:00:00.000Z'),
  }, {
    text: 'Google AdWords Strategy',
    priorityId: 1,
    startDate: new Date('2021-04-26T16:00:00.000Z'),
    endDate: new Date('2021-04-26T19:00:00.000Z'),
  }, {
    text: 'Rollout of New Website and Marketing Brochures',
    priorityId: 1,
    startDate: new Date('2021-04-26T20:00:00.000Z'),
    endDate: new Date('2021-04-26T22:30:00.000Z'),
  }, {
    text: 'Non-Compete Agreements',
    priorityId: 2,
    startDate: new Date('2021-04-27T20:00:00.000Z'),
    endDate: new Date('2021-04-27T22:45:00.000Z'),
  }, {
    text: 'Approve Hiring of John Jeffers',
    priorityId: 2,
    startDate: new Date('2021-04-27T16:00:00.000Z'),
    endDate: new Date('2021-04-27T19:00:00.000Z'),
  }, {
    text: 'Update NDA Agreement',
    priorityId: 1,
    startDate: new Date('2021-04-27T18:00:00.000Z'),
    endDate: new Date('2021-04-27T21:15:00.000Z'),
  }, {
    text: 'Update Employee Files with New NDA',
    priorityId: 1,
    startDate: new Date('2021-04-30T16:00:00.000Z'),
    endDate: new Date('2021-04-30T18:45:00.000Z'),
  }, {
    text: 'Submit Questions Regarding New NDA',
    priorityId: 1,
    startDate: new Date('2021-04-28T17:00:00.000Z'),
    endDate: new Date('2021-04-28T18:30:00.000Z'),
  }, {
    text: 'Submit Signed NDA',
    priorityId: 1,
    startDate: new Date('2021-04-28T20:00:00.000Z'),
    endDate: new Date('2021-04-28T22:00:00.000Z'),
  }, {
    text: 'Review Revenue Projections',
    priorityId: 2,
    startDate: new Date('2021-04-28T18:00:00.000Z'),
    endDate: new Date('2021-04-28T21:00:00.000Z'),
  }, {
    text: 'Comment on Revenue Projections',
    priorityId: 2,
    startDate: new Date('2021-04-26T17:00:00.000Z'),
    endDate: new Date('2021-04-26T20:00:00.000Z'),
  }, {
    text: 'Provide New Health Insurance Docs',
    priorityId: 2,
    startDate: new Date('2021-04-30T19:00:00.000Z'),
    endDate: new Date('2021-04-30T22:00:00.000Z'),
  }, {
    text: 'Review Changes to Health Insurance Coverage',
    priorityId: 2,
    startDate: new Date('2021-04-29T16:00:00.000Z'),
    endDate: new Date('2021-04-29T20:00:00.000Z'),
  }, {
    text: 'Review Training Course for any Omissions',
    priorityId: 1,
    startDate: new Date('2021-04-29T18:00:00.000Z'),
    endDate: new Date('2021-04-29T21:00:00.000Z'),
  },
];

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Renovated scheduler - Cross-scrolling');

['day', 'week', 'workWeek', 'month'].forEach((currentView) => {
  test(`it should render appointments correctly if currentView is ${currentView} and cross-scrolling is enabled`, async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .expect(await compareScreenshot(
        t,
        `scheduler-appointments-cross-scrolling-${currentView}.png`,
        scheduler.element,
        screenshotComparerOptions,
      ))
      .ok();
  }).before(
    async (t, { platform }) => {
      await t.resizeWindow(1200, 800);
      await createWidget(platform, 'dxScheduler', {
        timeZone: 'America/Los_Angeles',
        dataSource: data,
        views: [{
          type: 'day',
        }, {
          type: 'week',
          intervalCount: 4,
        }, {
          type: 'workWeek',
          intervalCount: 4,
        }, {
          type: 'month',
        }],
        currentView,
        currentDate: new Date(2021, 3, 21),
        startDayHour: 9,
        endDayHour: 16,
        groups: ['priorityId'],
        resources: [
          {
            fieldExpr: 'priorityId',
            allowMultiple: false,
            dataSource: [{
              text: 'Low Priority',
              id: 1,
              color: '#1e90ff',
            }, {
              text: 'High Priority',
              id: 2,
              color: '#ff9747',
            }],
            label: 'Priority',
          },
        ],
        showCurrentTimeIndicator: false,
        crossScrollingEnabled: true,
        height: 800,
      });
    },
  );
});
