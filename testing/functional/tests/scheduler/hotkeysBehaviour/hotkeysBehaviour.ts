import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Hotkeys for appointments update and navigation`
    .page(url(__dirname, '../../container.html'));

[`week`, `month`].forEach(view => {
    test(`Navigate between appointments in the "${view}" view (Tab/Shift+Tab)`, async t => {
        const scheduler = new Scheduler("#container");
        const firstAppointment = scheduler.getAppointment(`Website Re-Design Plan`);
        const secondAppointment = scheduler.getAppointment(`Book Flights to San Fran for Sales Trip`);

        await t
            .click(firstAppointment.element)
            .expect(firstAppointment.isFocused).ok()
            .pressKey(`tab`)
            .expect(firstAppointment.isFocused).notOk()
            .expect(secondAppointment.isFocused).ok()
            .pressKey(`shift+tab`)
            .expect(secondAppointment.isFocused).notOk()
            .expect(firstAppointment.isFocused).ok()

    }).before(() => createScheduler({
        views: [view],
        currentView: view,
        dataSource: dataSource
    }));

    test(`Remove appointment in the "${view}" view (Del)`, async t => {
        const scheduler = new Scheduler("#container");
        const appointment = scheduler.getAppointment(`Website Re-Design Plan`);

        await t
            .click(appointment.element)
            .expect(appointment.isFocused).ok()
            .pressKey(`delete`)
            .expect(appointment.element.exists).notOk()

    }).before(() => createScheduler({
        views: [view],
        currentView: view,
        dataSource: dataSource
    }));

    test(`Show appointment popup in the "${view}" view (Enter)`, async t => {
        const scheduler = new Scheduler("#container");
        const appointment = scheduler.getAppointment(`Website Re-Design Plan`);
        const popup = scheduler.popup;

        await t
            .click(appointment.element)
            .expect(appointment.isFocused).ok()
            .pressKey(`enter`)
            .expect(popup.isVisible()).ok()

    }).before(() => createScheduler({
        views: [view],
        currentView: view,
        dataSource: dataSource
    }));

    test(`Navigate between tooltip appointments in the "${view}" view (Up/Down)`, async t => {
        const scheduler = new Scheduler("#container");
        const collector = scheduler.getAppointmentCollector(`3`);
        const popup = scheduler.popup;
        const tooltip = scheduler.tooltip;

        await t
            .click(collector.element)
            .expect(tooltip.isVisible()).ok()
            .pressKey(`down`)
            .expect(tooltip.getListItem('New Brochures').isFocused).ok()
            .pressKey(`up`)
            .expect(tooltip.getListItem('Approve New Online Marketing Strategy').isFocused).ok()
            .pressKey(`enter`)
            .expect(tooltip.isVisible()).notOk()
            .expect(popup.isVisible()).ok()

    }).before(() => createScheduler({
        views: [view],
        currentView: view,
        dataSource: dataSource
    }));

});
