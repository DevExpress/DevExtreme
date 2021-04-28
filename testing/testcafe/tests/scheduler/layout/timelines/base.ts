import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import Scheduler from '../../../../model/scheduler';
import url from '../../../../helpers/getPageUrl';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../../container.html'));

const data = [{
  text: 'Google AdWords Strategy',
  startDate: new Date(2017, 4, 1, 9, 0),
  endDate: new Date(2017, 4, 1, 10, 30),
  priority: 1,
}, {
  text: 'New Brochures',
  startDate: new Date(2017, 4, 1, 11, 30),
  endDate: new Date(2017, 4, 1, 14, 15),
  priority: 2,
}, {
  text: 'Comment on Revenue Projections',
  startDate: new Date(2017, 4, 1, 9, 15),
  endDate: new Date(2017, 4, 5, 11, 15),
  priority: 1,
}, {
  text: 'Brochure Design Review',
  startDate: new Date(2017, 4, 1, 13, 15),
  endDate: new Date(2017, 4, 1, 16, 15),
  priority: 1,
}, {
  text: 'Website Re-Design Plan',
  startDate: new Date(2017, 4, 1, 16, 45),
  endDate: new Date(2017, 4, 2, 11, 15),
  priority: 2,
}, {
  text: 'Rollout of New Website and Marketing Brochures',
  startDate: new Date(2017, 4, 2, 8, 15),
  endDate: new Date(2017, 4, 2, 10, 45),
  priority: 2,
}, {
  text: 'Update Sales Strategy Documents',
  startDate: new Date(2017, 4, 2, 12, 0),
  endDate: new Date(2017, 4, 2, 13, 45),
  priority: 1,
}, {
  text: 'Non-Compete Agreements',
  startDate: new Date(2017, 4, 3, 8, 15),
  endDate: new Date(2017, 4, 3, 9, 0),
  priority: 1,
}, {
  text: 'Approve Hiring of John Jeffers',
  startDate: new Date(2017, 4, 3, 10, 0),
  endDate: new Date(2017, 4, 3, 11, 15),
  priority: 2,
}, {
  text: 'Update NDA Agreement',
  startDate: new Date(2017, 4, 3, 11, 45),
  endDate: new Date(2017, 4, 3, 13, 45),
  priority: 2,
}, {
  text: 'Update Employee Files with New NDA',
  startDate: new Date(2017, 4, 3, 14, 0),
  endDate: new Date(2017, 4, 3, 16, 45),
  priority: 1,
}, {
  text: 'Submit Questions Regarding New NDA',
  startDate: new Date(2017, 4, 4, 8, 0),
  endDate: new Date(2017, 4, 4, 9, 30),
  priority: 1,
}, {
  text: 'Submit Signed NDA',
  ownerId: [2],
  startDate: new Date(2017, 4, 4, 12, 45),
  endDate: new Date(2017, 4, 4, 14, 0),
  priority: 1,
}, {
  text: 'Review Revenue Projections',
  startDate: new Date(2017, 4, 4, 17, 15),
  endDate: new Date(2017, 4, 4, 18, 0),
  priority: 2,
}, {
  text: 'Comment on Revenue Projections',
  startDate: new Date(2017, 4, 5, 9, 15),
  endDate: new Date(2017, 4, 5, 11, 15),
  priority: 1,
}, {
  text: 'Provide New Health Insurance Docs',
  startDate: new Date(2017, 4, 5, 12, 45),
  endDate: new Date(2017, 4, 5, 14, 15),
  priority: 2,
}, {
  text: 'Review Changes to Health Insurance Coverage',
  startDate: new Date(2017, 4, 5, 14, 15),
  endDate: new Date(2017, 4, 5, 15, 30),
  priority: 1,
}];

const priorityData = [
  {
    text: 'Low Priority',
    id: 1,
    color: '#1e90ff',
  }, {
    text: 'High Priority',
    id: 2,
    color: '#ff9747',
  },
];

['timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  const testName = `Appointments in ${currentView} view`;

  test(testName, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot('', scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(() => createWidget('dxScheduler', {
    dataSource: data,
    views: [currentView],
    currentView,
    currentDate: new Date(2017, 4, 1),
    startDayHour: 8,
    endDayHour: 20,
    cellDuration: 60,
    groups: ['priority'],
    resources: [{
      fieldExpr: 'priority',
      dataSource: priorityData,
      label: 'Priority',
    }],
    height: 580,
  }));
});
