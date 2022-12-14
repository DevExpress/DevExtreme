import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { disposeWidgets } from '../../../helpers/createWidget';

fixture.disablePageReloads`Drag-and-drop appointments into allDay panel in the grouped Scheduler `
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Drag-n-drop between dateTable and allDay panel, groupByDate=true', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(1), {
      speed: 0.3,
    })
    .expect(draggableAppointment.element.exists).ok()
    .expect(draggableAppointment.isAllDay)
    .ok();
}).before(async () => createScheduler({
  dataSource,
  groupByDate: true,
}));
