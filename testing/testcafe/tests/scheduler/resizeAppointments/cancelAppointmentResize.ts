import { ClientFunction } from 'testcafe';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import createScheduler from '../dragAndDrop/init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Cancel appointment Resizing`
  .page(url(__dirname, '../../container.html'));

test('onAppointmentUpdating - newDate should be correct after cancel appointment resize and cellDuration=24h (T1070565)', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');
  const etalonISOEndDate = 'Fri Jun 04 2021';

  // 1st iteration
  await t
    .drag(resizableAppointment.resizableHandle.right, 200, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 8:00 PM')
    .expect(ClientFunction(() => (window as any).newEndDate)())
    .eql(etalonISOEndDate);

  // 2nd iteration
  await t
    .drag(resizableAppointment.resizableHandle.right, 200, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 8:00 PM')
    .expect(ClientFunction(() => (window as any).newEndDate)())
    .eql(etalonISOEndDate);
}).before(async () => createScheduler({
  width: 400,
  currentDate: new Date(2021, 5, 1),
  dataSource: [{
    text: 'Test Resize',
    startDate: new Date(2021, 5, 1, 1),
    endDate: new Date(2021, 5, 1, 20),
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  cellDuration: 1440,
  onAppointmentUpdating: (e) => {
    (window as any).newEndDate = e.newData.endDate.toDateString();
    e.cancel = true;
  },
}));

test('on escape - date should not changed when it\'s pressed after resize (T1125615)', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');

  await t
    .drag(resizableAppointment.resizableHandle.right, 50, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 6:00 PM')
    .click(resizableAppointment.element)
    .pressKey('esc')
    .drag(resizableAppointment.resizableHandle.right, 150, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 12:00 PM');
}).before(async () => createScheduler({
  width: 400,
  currentDate: new Date(2021, 5, 1),
  dataSource: [{
    text: 'Test Resize',
    startDate: new Date(2021, 5, 1, 1),
    endDate: new Date(2021, 5, 1, 20),
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  cellDuration: 1440,
}));

test('on escape - date should not changed when it\'s pressed during resize (T1125615)', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');
  await MouseUpEvents.disable(MouseAction.dragToOffset);

  await t
    .drag(resizableAppointment.resizableHandle.right, 150, 0)
    .pressKey('esc');

  await MouseUpEvents.enable(MouseAction.dragToOffset);

  await t
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 8:00 PM');
}).before(async () => createScheduler({
  width: 400,
  currentDate: new Date(2021, 5, 1),
  dataSource: [{
    text: 'Test Resize',
    startDate: new Date(2021, 5, 1, 1),
    endDate: new Date(2021, 5, 1, 20),
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  cellDuration: 1440,
}));
