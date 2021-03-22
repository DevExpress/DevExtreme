import fx from 'animation/fx';
import 'generic_light.css!';
import $ from 'jquery';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

const { test, module } = QUnit;

initTestMarkup();

module('Recurrence Dialog', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    },
}, () => {
    test('Recurrence dialog should be disposed of after it is closed', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 2, 22),
            currentView: 'week',
            dataSource: [{
                startDate: new Date(2021, 2, 22),
                endDate: new Date(2021, 2, 22, 0, 30),
                recurrenceRule: 'FREQ=DAILY',
            }],
        });

        assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 0, 'There are no dialogs');

        scheduler.appointmentList[0].drag.toCell(12);

        assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 1, 'There is one dialog');

        scheduler.appointmentPopup.dialog.clickEditAppointment();

        assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 0, 'There are no dialogs');
    });

    test('Recurrence dialog should be disposed of after scheduler is removed from DOM', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 2, 22),
            currentView: 'week',
            dataSource: [{
                startDate: new Date(2021, 2, 22),
                endDate: new Date(2021, 2, 22, 0, 30),
                recurrenceRule: 'FREQ=DAILY',
            }],
        });

        scheduler.drawControl();

        assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 0, 'There are no dialogs');

        scheduler.appointmentList[0].drag.toCell(12);

        assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 1, 'There is one dialog');

        scheduler.getElement().remove();

        assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 0, 'There are no dialogs');
    });
});
