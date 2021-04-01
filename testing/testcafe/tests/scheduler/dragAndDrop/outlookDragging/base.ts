import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';

fixture`Outlook dragging base tests`
  .page(url(__dirname, '../../../container.html'));

test('Basic drag-n-drop movements from tooltip in week view', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(scheduler.getAppointmentCollector('2').element)
    .expect(scheduler.appointmentTooltip.isVisible()).ok()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 3').element, 200, 50, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-\'Appointment 3\'-from-tooltip-in-week.png', scheduler.workSpace))
    .ok();

  await t
    .click(scheduler.getAppointmentCollector('1').element)
    .expect(scheduler.appointmentTooltip.isVisible()).ok()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 4').element, 350, 150, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-\'Appointment 4\'-from-tooltip-in-week.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Appointment 1',
    startDate: new Date(2021, 4, 23, 9, 30),
    endDate: new Date(2021, 4, 23, 12, 0),
  }, {
    text: 'Appointment 2',
    startDate: new Date(2021, 4, 23, 9, 30),
    endDate: new Date(2021, 4, 23, 12, 0),
  }, {
    text: 'Appointment 3',
    startDate: new Date(2021, 4, 23, 9, 30),
    endDate: new Date(2021, 4, 23, 11, 0),
  }, {
    text: 'Appointment 4',
    startDate: new Date(2021, 4, 23, 9, 30),
    endDate: new Date(2021, 4, 23, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 8,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements from tooltip in month view', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(scheduler.getAppointmentCollector('2').element)
    .expect(scheduler.appointmentTooltip.isVisible()).ok()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 3').element, -180, -30, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-\'Appointment 3\'-from-tooltip-in-month.png', scheduler.workSpace))
    .ok();

  await t
    .click(scheduler.getAppointmentCollector('1').element)
    .expect(scheduler.appointmentTooltip.isVisible()).ok()
    .drag(scheduler.appointmentTooltip.getListItem('Appointment 4').element, 320, 150, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-\'Appointment 4\'-from-tooltip-in-month.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Appointment 1',
    startDate: new Date(2021, 4, 26, 9, 30),
    endDate: new Date(2021, 4, 27, 12, 0),
  }, {
    text: 'Appointment 2',
    startDate: new Date(2021, 4, 26, 9, 30),
    endDate: new Date(2021, 4, 27, 12, 0),
  }, {
    text: 'Appointment 3',
    startDate: new Date(2021, 4, 26, 9, 30),
    endDate: new Date(2021, 4, 27, 11, 0),
  }, {
    text: 'Appointment 4',
    startDate: new Date(2021, 4, 26, 9, 30),
    endDate: new Date(2021, 4, 27, 12, 30),
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 8,
  height: 600,
  width: 1000,
}));

[{
  currentView: 'timelineWeek',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 23, 9, 30),
    endDate: new Date(2021, 4, 23, 10, 45),
  }],
}, {
  currentView: 'timelineMonth',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 2, 9, 30),
    endDate: new Date(2021, 4, 3, 11, 0),
  }],
}].forEach(({ currentView, dataSource }) => {
  test(`Basic drag-n-drop movements in ${currentView} view`, async (t) => {
    const scheduler = new Scheduler('#container');
    const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .drag(draggableAppointment.element, 250, 0, { speed: 0.1 })
      .expect(await takeScreenshot(`drag-n-drop-${currentView}-to-right.png`, scheduler.workSpace))
      .ok()

      .drag(draggableAppointment.element, -250, 0, { speed: 0.1 })
      .expect(await takeScreenshot(`drag-n-drop-${currentView}-to-left.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(() => createWidget('dxScheduler', {
    dataSource,
    views: ['timelineWeek', 'timelineMonth'],
    currentView,
    currentDate: new Date(2021, 4, 27),
    startDayHour: 9,
    height: 600,
    width: 1000,
  }));
});

test('Basic drag-n-drop movements', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 100, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -100, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 100, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -100, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 24, 10),
    endDate: new Date(2021, 4, 24, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements with mouse offset', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 100, 0, { offsetX: 10, offsetY: 200, speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -100, 0, { offsetX: 10, offsetY: 200, speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 100, { offsetX: 10, offsetY: 200, speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -100, { offsetX: 10, offsetY: 200, speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 24, 10),
    endDate: new Date(2021, 4, 24, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop all day appointment movements', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 200, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-all-day-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -200, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-all-day-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 260, 270, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-all-day-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -260, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-all-day-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 25, 10),
    endDate: new Date(2021, 4, 27, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements within the cell', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 55, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-within-cell-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -55, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-within-cell-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 30, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-within-cell-to-bottom.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 24, 10),
    endDate: new Date(2021, 4, 24, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop small appointments', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 250, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-small-appoint-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -250, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-small-appoint-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 170, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-small-appoint-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -170, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-small-appoint-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 12, 10),
    endDate: new Date(2021, 4, 12, 12, 30),
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop long appointments', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 150, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-long-appoint-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -30, 0, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-long-appoint-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 70, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-long-appoint-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -70, { speed: 0.1 })
    .expect(await takeScreenshot('drag-n-drop-long-appoint-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 11, 10),
    endDate: new Date(2021, 4, 13, 12, 30),
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));
