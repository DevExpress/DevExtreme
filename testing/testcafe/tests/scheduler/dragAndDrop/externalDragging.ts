import { Selector } from 'testcafe';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Drag-n-drop from another draggable area`
  .page(url(__dirname, './pages/containerWithDnD.html'));

test('Drag-n-drop an appointment when "cellDuration" changes dynamically', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('cellDuration', 10);

  await t
    .dragToElement(Selector('.item'), scheduler.getDateTableCell(0, 0))
    .expect(scheduler.getAppointmentByIndex(0).date.time)
    .eql('9:00 AM - 9:10 AM');
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  appointmentDragging: {
    group: 'draggableGroup',
    onAdd(e): void {
      e.component.addAppointment(e.itemData);
      e.itemElement.remove();
    },
  },
}));
