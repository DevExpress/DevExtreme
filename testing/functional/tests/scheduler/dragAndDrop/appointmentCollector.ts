import { appointmentCollectorData } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Drag-and-drop behaviour for the appointment tooltip`
    .page(url(__dirname, '../../container.html'));

test(`Drag-n-drop between a scheduler table cell and the appointment tooltip`, async t => {
    const scheduler = new Scheduler("#container");
    const appointment = scheduler.getAppointment(`New Brochures`);
    const collector = scheduler.getAppointmentCollector(`3`);
    const tooltip = scheduler.tooltip;
    const tooltipAppointment = tooltip.getListItem('New Brochures');

    await t
        .click(collector.element)
        .expect(tooltip.isVisible()).ok()
        .dragToElement(tooltipAppointment.element, scheduler.getDateTableCell(0, 1))
        .expect(tooltipAppointment.element.exists).notOk()
        .expect(appointment.element.exists).ok()
        .expect(appointment.size.height).eql(`250px`)
        .expect(appointment.date.startTime).eql(`9:00 AM`)
        .expect(appointment.date.endTime).eql(`11:30 AM`)
        .dragToElement(appointment.element, scheduler.getDateTableCell(0, 0))
        .click(collector.element)
        .expect(tooltipAppointment.element.exists).ok()
        .expect(appointment.element.exists).notOk()

}).before(() => createScheduler(`week`, appointmentCollectorData));
