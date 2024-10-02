import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const SCHEDULER_SELECTOR = '#container';

fixture.disablePageReloads`Month view vertical grouping `
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Scrolling: usual. Shouldn\'t overlap the next group with long all-day appointment in the month view (T1122185)', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot('month-view_vertical-grouping_fist-app-part_T1122185.png', scheduler.workSpace);
  await t.click(await scheduler.toolbar.navigator.nextButton());
  await takeScreenshot('month-view_vertical-grouping_middle-app-part_T1122185.png', scheduler.workSpace);
  await t.click(await scheduler.toolbar.navigator.nextButton());
  await takeScreenshot('month-view_vertical-grouping_last-app-part_T1122185.png', scheduler.workSpace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1200, 800]).before(async () => {
  await createWidget(
    'dxScheduler',
    {
      dataSource: [
        {
          text: 'Appointment group 1',
          groupId: 1,
          startDate: '2021-04-29T14:00:00Z',
          endDate: '2021-06-20T14:00:00Z',
          allDay: true,
        },
      ],
      views: [{
        type: 'month',
        groupOrientation: 'vertical',
      }],
      currentView: 'month',
      currentDate: '2021-04-29T00:00:00Z',
      groups: ['groupId'],
      resources: [
        {
          fieldExpr: 'groupId',
          allowMultiple: false,
          dataSource: [{
            text: 'Group 1',
            id: 1,
            color: '#ff0000',
          }, {
            text: 'Group 2',
            id: 2,
            color: '#0000ff',
          }],
          label: 'Group',
        },
      ],
    },
  );
});
