import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Drag-and-drop appointments in the Scheduler with vertical grouping`
  .page(url(__dirname, '../../container.html'));

test('Should drag appoinment to the previous day`s cell (T1025952)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('appointment');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .dragToElement(appointment.element, scheduler.getDateTableCell(1, 1))

    .expect(await takeScreenshot('drag-n-drop-previous-day-cell.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createScheduler({
  dataSource: [
    {
      text: 'appointment',
      startDate: new Date(2021, 3, 21, 9, 30),
      endDate: new Date(2021, 3, 21, 10),
      priorityId: 1,
    },
  ],
  views: [
    {
      type: 'week',
      groupOrientation: 'vertical',
    },
  ],
  currentView: 'week',
  currentDate: new Date(2021, 3, 21),
  groups: ['priorityId'],
  resources: [
    {
      dataSource: [
        {
          text: 'Low Priority',
          id: 1,
        }, {
          text: 'High Priority',
          id: 2,
        },
      ],
      fieldExpr: 'priorityId',
      displayExpr: 'name',
      allowMultiple: false,
    },
  ],
  startDayHour: 9,
  endDayHour: 12,
  height: 600,
}));
