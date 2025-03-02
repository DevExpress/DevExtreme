import Scheduler from 'devextreme-testcafe-models/scheduler';
import { ClientFunction, Selector } from 'testcafe';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler Drag-and-Drop Fix`
  .page(url(__dirname, '../../container.html'));

const DRAGGABLE_ITEM_CLASS = 'dx-card';
const draggingGroupName = 'appointmentsGroup';

const initList = ClientFunction(() => {
  $('<div>', { id: 'list' }).appendTo('#parentContainer');
});

const addTasksToList = ClientFunction((tasks) => {
  tasks.forEach((task) => {
    $('<div>', {
      class: 'dx-card',
      text: task.text,
    }).appendTo('#list');
  });
});

const createItemElement = async (task) => {
  await createWidget('dxDraggable', {
    group: draggingGroupName,
    data: task,
    clone: true,
    onDragStart(e) {
      e.itemData = e.fromData;
    },
  }, `.${DRAGGABLE_ITEM_CLASS}:contains(${task.text})`);
};

test('Scheduler - The \'Cannot read properties of undefined (reading \'getTime\')\' error is thrown on an attempt to drag an outside element if the previous drag operation was canceled', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Book').element;
  const targetCell = scheduler.getDateTableCell(5, 0);
  const draggableItem = Selector(`.${DRAGGABLE_ITEM_CLASS}`).withText('Brochures');

  await t.expect(scheduler.element.exists).ok();

  await MouseUpEvents.disable(MouseAction.dragToElement);

  await t
    .dragToElement(draggableAppointment, targetCell)
    .pressKey('esc');

  await MouseUpEvents.enable(MouseAction.dragToElement);

  await t
    .expect(draggableItem.exists)
    .ok()
    .dragToElement(draggableItem, targetCell);

  const newAppointment = scheduler.getAppointment('Brochures');

  await t
    .expect(newAppointment.element.exists)
    .ok();
}).before(async () => {
  const tasks = [
    { text: 'Brochures' },
  ];

  await initList();
  await addTasksToList(tasks);
  await Promise.all(tasks.map((task) => createItemElement(task)));
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [
      {
        text: 'Book',
        startDate: new Date('2021-04-26T19:00:00.000Z'),
        endDate: new Date('2021-04-26T20:00:00.000Z'),
      },
    ],
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    height: 600,
    editing: true,
    appointmentDragging: {
      group: draggingGroupName,
      onDragEnd(e) {
        e.cancel = e.event.ctrlKey;
      },
      onRemove(e) {
        e.component.deleteAppointment(e.itemData);
      },
      onAdd(e) {
        e.component.addAppointment(e.itemData);
      },
    },
  });
});
