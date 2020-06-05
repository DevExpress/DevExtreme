import { dataSource } from './init/widget.data';
import { createScheduler, scroll } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Appointment tooltip behavior during scrolling in the Scheduler (T755449)`
    .page(url(__dirname, '../../container.html'));

test('The tooltip shouldn\'t hide after automatic scrolling during an appointment click', async t => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Brochure Design Review');

    await t
        .resizeWindow(600, 400)
        .click(appointment.element)
        .wait(500)
        .expect(scheduler.appointmentTooltip.isVisible()).ok();

}).before(() => createScheduler({
    views: ['week'],
    currentView: 'week',
    dataSource: dataSource
}));

test('The tooltip should hide after manually scrolling in the browser', async t => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Brochure Design Review');

    await t
        .resizeWindow(600, 400)
        .click(appointment.element)
        .wait(500)
        .expect(scheduler.appointmentTooltip.isVisible()).ok();
    await scroll(0, 100);
    await t
        .wait(500)
        .expect(scheduler.appointmentTooltip.isVisible()).notOk();

}).before(() => createScheduler({
    views: ['week'],
    currentView: 'week',
    dataSource: dataSource
}));
