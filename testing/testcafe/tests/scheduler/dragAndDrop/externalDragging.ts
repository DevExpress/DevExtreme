import { ClientFunction, Selector } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { appendElementTo } from '../../../helpers/domUtils';

fixture`Drag-n-drop from another draggable area`
  .page(url(__dirname, '../../container.html'));

test('Drag-n-drop an appointment when "cellDuration" changes dynamically', async (t) => {
  const scheduler = new Scheduler('#scheduler');

  await scheduler.option('cellDuration', 10);

  await t
    .dragToElement(Selector('.item'), scheduler.getDateTableCell(0, 0))
    .expect(scheduler.getAppointmentByIndex(0).date.time)
    .eql('9:00 AM - 9:10 AM');
}).before(async () => {
  await appendElementTo('#container', 'div', 'drag-area');

  await ClientFunction(() => {
    $('<div id=\'group\'>')
      .text('New Brochures')
      .addClass('item')
      .appendTo('#drag-area');
  })();

  await appendElementTo('#container', 'div', 'scheduler');

  await createWidget('dxDraggable', {
    group: 'draggableGroup',
    data: { text: 'New Brochures' },
    onDragStart(e) {
      e.itemData = e.fromData;
    },
  }, '#group');

  await createWidget('dxDraggable', {
    group: 'draggableGroup',
  }, '#drag-area');

  return createScheduler({
    views: ['week'],
    currentView: 'week',
    appointmentDragging: {
      group: 'draggableGroup',
      onAdd(e) {
        e.component.addAppointment(e.itemData);
        e.itemElement.remove();
      },
    },
  }, '#scheduler');
});
