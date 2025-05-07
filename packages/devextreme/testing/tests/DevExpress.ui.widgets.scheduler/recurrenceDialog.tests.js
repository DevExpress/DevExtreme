import fx from 'common/core/animation/fx';
import 'generic_light.css!';
import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment,
} from '../../helpers/scheduler/helpers.js';

const { test, module, testStart } = QUnit;

testStart(() => initTestMarkup());

module('Recurrence Dialog', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    },
}, () => {
    if(isDesktopEnvironment()) {
        test('Recurrence dialog should be disposed of after it is closed', function(assert) {
            const scheduler = createWrapper({
                _draggingMode: 'default',
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
                _draggingMode: 'default',
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

            scheduler.getElement().remove();

            assert.equal(scheduler.appointmentPopup.getRecurrenceDialog().length, 0, 'There are no dialogs');
        });

        test('Appointments should not be updated after scheduler\'s disposal', function(assert) {
            const dataSource = [{
                startDate: new Date(2021, 2, 22),
                endDate: new Date(2021, 2, 22, 0, 30),
                recurrenceRule: 'FREQ=DAILY',
            }];

            const scheduler = createWrapper({
                _draggingMode: 'default',
                currentDate: new Date(2021, 2, 22),
                currentView: 'week',
                dataSource,
            });

            scheduler.appointmentList[0].drag.toCell(12);
            scheduler.getElement().remove();

            const expectedDataSource = [{
                startDate: new Date(2021, 2, 22),
                endDate: new Date(2021, 2, 22, 0, 30),
                recurrenceRule: 'FREQ=DAILY',
            }];

            assert.deepEqual(dataSource, expectedDataSource, 'Data source was not updated');
        });
    }
});
