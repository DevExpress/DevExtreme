import fx from 'common/core/animation/fx';
import $ from 'jquery';
import keyboardMock from '../../helpers/keyboardMock.js';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

QUnit.testStart(() => initTestMarkup());

QUnit.module('Keyboard Navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Focus options should be passed to scheduler parts', function(assert) {
        const scheduler = createWrapper({ focusStateEnabled: true, tabIndex: 1, currentView: 'day' });
        const header = scheduler.instance.getHeader();
        const workspace = scheduler.instance.getWorkSpace();
        const appointments = scheduler.instance.getAppointmentsInstance();

        assert.equal(scheduler.instance.$element().attr('tabindex'), null, 'scheduler has no tabIndex');

        assert.equal(header.option('focusStateEnabled'), true, 'header has correct focusStateEnabled');
        assert.equal(workspace.option('focusStateEnabled'), true, 'workspace has correct focusStateEnabled');
        assert.equal(appointments.option('focusStateEnabled'), true, 'appointments has correct focusStateEnabled');

        assert.equal(header.option('tabIndex'), 1, 'header has correct tabIndex');
        assert.equal(workspace.option('tabIndex'), 1, 'workspace has correct tabIndex');
        assert.equal(appointments.option('tabIndex'), 1, 'appointments has correct tabIndex');

    });

    QUnit.test('Focus options should be passed to scheduler parts after option changed', function(assert) {
        const scheduler = createWrapper({ focusStateEnabled: true, tabIndex: 1, currentView: 'day' });
        const header = scheduler.instance.getHeader();
        const workspace = scheduler.instance.getWorkSpace();
        const appointments = scheduler.instance.getAppointmentsInstance();

        scheduler.instance.option('tabIndex', 2);

        assert.equal(header.option('tabIndex'), 2, 'header has correct tabIndex');
        assert.equal(workspace.option('tabIndex'), 2, 'workspace has correct tabIndex');
        assert.equal(appointments.option('tabIndex'), 2, 'appointments has correct tabIndex');

        scheduler.instance.option('focusStateEnabled', false);

        assert.equal(header.option('focusStateEnabled'), false, 'header has correct focusStateEnabled');
        assert.equal(workspace.option('focusStateEnabled'), false, 'workspace has correct focusStateEnabled');
        assert.equal(appointments.option('focusStateEnabled'), false, 'appointments has correct focusStateEnabled');

    });

    QUnit.test('AllowMultipleCellSelection option should be passed to scheduler workspace', function(assert) {
        const scheduler = createWrapper({ focusStateEnabled: true, allowMultipleCellSelection: false });
        const workspace = scheduler.instance.getWorkSpace();

        assert.equal(workspace.option('allowMultipleCellSelection'), false, 'allowMultipleCellSelection');

        scheduler.instance.option('allowMultipleCellSelection', true);

        assert.equal(workspace.option('allowMultipleCellSelection'), true, 'allowMultipleCellSelection');

    });

    QUnit.test('focusedStateEnabled option value should be passed to ddAppointments', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: ['month'],
            currentView: 'month',
            focusStateEnabled: false
        });

        scheduler.appointments.compact.click();
        assert.notOk(scheduler.instance._appointmentTooltip._list.option('focusStateEnabled'), 'focusStateEnabled was passed correctly');

        scheduler.instance._appointmentTooltip.hide();

        scheduler.instance.option('focusStateEnabled', true);
        scheduler.appointments.compact.click();
        assert.ok(scheduler.instance._appointmentTooltip._list.option('focusStateEnabled'), 'focusStateEnabled was passed correctly');
    });

    QUnit.test('Workspace navigation by arrows should work correctly with opened dropDown appointments', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: ['month'],
            currentView: 'month',
            focusStateEnabled: true
        });

        const $workSpace = scheduler.instance.getWorkSpace().$element();
        const keyboard = keyboardMock($workSpace);

        $(scheduler.instance.$element().find('.dx-scheduler-appointment-collector')).trigger('dxclick');

        keyboard.keyDown('down');
        keyboard.keyDown('up');
        keyboard.keyDown('right');
        keyboard.keyDown('left');

        assert.ok(true, 'Scheduler works correctly');
    });
});
