import { ClientFunction } from 'testcafe';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import createScheduler from '../dragAndDrop/init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture.disablePageReloads`Cancel appointment Resizing`
  .page(url(__dirname, '../../container.html'));

test('onAppointmentUpdating - newDate should be correct after cancel appointment resize and cellDuration=24h (T1070565)', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');
  const etalonEndDateIso = '2021-06-03T00:00:00Z';

  // 1st iteration
  await t
    .drag(resizableAppointment.resizableHandle.right, 200, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 8:00 PM')
    .expect(ClientFunction(() => (window as any).newEndDate)())
    .eql(etalonEndDateIso);

  // 2nd iteration
  await t
    .drag(resizableAppointment.resizableHandle.right, 200, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 8:00 PM')
    .expect(ClientFunction(() => (window as any).newEndDate)())
    .eql(etalonEndDateIso);
}).before(async () => createScheduler({
  timeZone: 'Etc/GMT',
  width: 400,
  currentDate: '2021-06-01T00:00:00Z',
  dataSource: [{
    text: 'Test Resize',
    startDate: '2021-06-01T01:00:00Z',
    endDate: '2021-06-01T20:00:00Z',
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  startDayHour: 0,
  cellDuration: 1440,
  onAppointmentUpdating: (e) => {
    (window as any).newEndDate = e.newData.endDate;
    e.cancel = true;
  },
})).after(async () => {
  await ClientFunction(() => {
    delete (window as any).newEndDate;
  })();
});

test('on escape - date should not changed when it\'s pressed after resize (T1125615)', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');

  await t
    .drag(resizableAppointment.resizableHandle.right, 50, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 12:00 AM')
    .click(resizableAppointment.element)
    .pressKey('esc')
    .drag(resizableAppointment.resizableHandle.right, 150, 0)
    .expect(resizableAppointment.date.time)
    .eql('1:00 AM - 12:00 AM');
}).before(async () => createScheduler({
  timeZone: 'Etc/GMT',
  width: 400,
  currentDate: '2021-06-01T00:00:00Z',
  dataSource: [{
    text: 'Test Resize',
    startDate: '2021-06-01T01:00:00Z',
    endDate: '2021-06-01T20:00:00Z',
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  startDayHour: 0,
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
  timeZone: 'Etc/GMT',
  width: 400,
  currentDate: '2021-06-01T00:00:00Z',
  dataSource: [{
    text: 'Test Resize',
    startDate: '2021-06-01T01:00:00Z',
    endDate: '2021-06-01T20:00:00Z',
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  startDayHour: 0,
  cellDuration: 1440,
}));
