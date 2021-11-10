import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import cloneTest from '../../../../helpers/check-all-platforms';

const SCHEDULER_SELECTOR = '.test-scheduler';

const test = (options?: any): any => cloneTest(
  'declaration/scheduler',
  ['react'],
  options,
);

fixture('Renovated scheduler - Reduced appointment')
  .beforeEach((t) => t.resizeWindow(1200, 800));

test({
  dataSource: [{
    text: 'Reduced',
    priorityId: [1, 2],
    startDate: new Date(2021, 3, 4, 12),
    endDate: new Date(2021, 3, 19, 12),
  }],
  views: [{
    type: 'month',
    groupOrientation: 'vertical',
  }],
  currentView: 'month',
  currentDate: new Date(2021, 3, 21),
  startDayHour: 10,
  endDayHour: 14,
  groups: ['priorityId'],
  resources: [
    {
      fieldExpr: 'priorityId',
      allowMultiple: true,
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
})('it should render reduced appointment correctly if currentView is month', async (t, { screenshotComparerOptions }) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentCount = scheduler.getAppointmentCount();
  const headReduced0 = scheduler.getAppointmentByIndex(0);
  const bodyReduced0 = scheduler.getAppointmentByIndex(1);
  const tailReduced0 = scheduler.getAppointmentByIndex(2);
  const headReduced1 = scheduler.getAppointmentByIndex(3);
  const bodyReduced1 = scheduler.getAppointmentByIndex(4);
  const tailReduced1 = scheduler.getAppointmentByIndex(5);

  await t
    .expect(appointmentCount)
    .eql(6)

    .expect(headReduced0.isReduced)
    .ok()
    .expect(headReduced0.isReducedHead)
    .ok()
    .expect(headReduced0.isReducedBody)
    .notOk()
    .expect(headReduced0.isReducedTail)
    .notOk()

    .expect(bodyReduced0.isReduced)
    .ok()
    .expect(bodyReduced0.isReducedHead)
    .notOk()
    .expect(bodyReduced0.isReducedBody)
    .ok()
    .expect(bodyReduced0.isReducedTail)
    .notOk()

    .expect(tailReduced0.isReduced)
    .ok()
    .expect(tailReduced0.isReducedHead)
    .notOk()
    .expect(tailReduced0.isReducedBody)
    .notOk()
    .expect(tailReduced0.isReducedTail)
    .ok()

    .expect(headReduced1.isReduced)
    .ok()
    .expect(headReduced1.isReducedHead)
    .ok()
    .expect(headReduced1.isReducedBody)
    .notOk()
    .expect(headReduced1.isReducedTail)
    .notOk()

    .expect(bodyReduced1.isReduced)
    .ok()
    .expect(bodyReduced1.isReducedHead)
    .notOk()
    .expect(bodyReduced1.isReducedBody)
    .ok()
    .expect(bodyReduced1.isReducedTail)
    .notOk()

    .expect(tailReduced1.isReduced)
    .ok()
    .expect(tailReduced1.isReducedHead)
    .notOk()
    .expect(tailReduced1.isReducedBody)
    .notOk()
    .expect(tailReduced1.isReducedTail)
    .ok()

    .expect(await compareScreenshot(
      t,
      'scheduler-appointments-reduced-month.png',
      scheduler.element,
      screenshotComparerOptions,
    ))
    .ok();
});

test({
  dataSource: [{
    text: 'Reduced',
    priorityId: [1, 2],
    startDate: new Date(2021, 3, 4, 12),
    endDate: new Date(2021, 3, 19, 12),
  }],
  views: [{
    type: 'timelineDay',
    groupOrientation: 'vertical',
  }],
  currentView: 'timelineDay',
  currentDate: new Date(2021, 3, 10),
  startDayHour: 10,
  endDayHour: 14,
  groups: ['priorityId'],
  resources: [
    {
      fieldExpr: 'priorityId',
      allowMultiple: true,
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
})('it should render reduced appointment correctly if currentView is timelineDay', async (t, { screenshotComparerOptions }) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentCount = scheduler.getAppointmentCount();
  const headReduced0 = scheduler.getAppointmentByIndex(0);
  const headReduced1 = scheduler.getAppointmentByIndex(1);

  await t
    .expect(appointmentCount)
    .eql(2)

    .expect(headReduced0.isReduced)
    .ok()
    .expect(headReduced0.isReducedHead)
    .ok()
    .expect(headReduced0.isReducedBody)
    .notOk()
    .expect(headReduced0.isReducedTail)
    .notOk()

    .expect(headReduced1.isReduced)
    .ok()
    .expect(headReduced1.isReducedHead)
    .ok()
    .expect(headReduced1.isReducedBody)
    .notOk()
    .expect(headReduced1.isReducedTail)
    .notOk()

    .expect(await compareScreenshot(
      t,
      'scheduler-appointments-reduced-timelineDay.png',
      scheduler.element,
      screenshotComparerOptions,
    ))
    .ok();
});
