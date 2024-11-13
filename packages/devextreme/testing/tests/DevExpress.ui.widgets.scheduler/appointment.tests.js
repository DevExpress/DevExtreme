import $ from 'jquery';
import { Appointment } from '__internal/scheduler/appointments/m_appointment';
import { Deferred } from 'core/utils/deferred';
import fx from 'common/core/animation/fx';

const { module, test, testStart } = QUnit;

const CELL_HEIGHT = 20;
const CELL_WIDTH = 25;
const APPOINTMENT_DRAG_SOURCE_CLASS = 'dx-scheduler-appointment-drag-source';

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointment"></div>');
});

const createInstance = () => {
    const dataAccessorsMock = {
        getter: {},
        setter: {}
    };
    const observer = {
        fire: (command) => {
            switch(command) {
                case 'getCellHeight':
                    return CELL_HEIGHT;
                case 'getCellWidth':
                    return CELL_WIDTH;
                case 'isGroupedByDate':
                    return false;
                default:
                    break;
            }
        }
    };

    return $('#scheduler-appointment').dxSchedulerAppointment({
        observer,
        getAppointmentColor: () => new Deferred(),
        dataAccessors: dataAccessorsMock
    }).dxSchedulerAppointment('instance');
};

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};


module('Appointments', moduleOptions, () => {
    test('Scheduler appointment should be initialized', function(assert) {
        const instance = createInstance();
        assert.ok(instance instanceof Appointment, 'dxSchedulerAppointment was initialized');
    });

    test('Scheduler appointment has right direction css-class', function(assert) {
        const instance = createInstance();

        assert.notOk(instance.$element().hasClass('dx-scheduler-appointment-horizontal'), 'appointment doesn\'t have css-class');
        assert.ok(instance.$element().hasClass('dx-scheduler-appointment-vertical'), 'appointment has right class');

        instance.option('direction', 'horizontal');
        assert.ok(instance.$element().hasClass('dx-scheduler-appointment-horizontal'), 'appointment has right class');
    });

    test('Scheduler appointment has right resizable config for vertical direction', function(assert) {
        const instance = createInstance();

        instance.option({
            direction: 'vertical',
            cellHeight: 20
        });

        assert.ok(instance.$element().dxResizable, 'appointment has right class');

        const resizableInstance = instance.$element().dxResizable('instance');

        assert.equal(resizableInstance.option('handles'), 'top bottom', 'Appointment can resize only horizontal');
        assert.equal(resizableInstance.option('step'), CELL_HEIGHT, 'Resizable has a right step');
        assert.equal(resizableInstance.option('minWidth'), 0, 'Resizable has a right minWidth');
        assert.equal(resizableInstance.option('minHeight'), CELL_HEIGHT, 'Resizable has a right minHeight');
    });

    test('Scheduler appointment has right resizable config for horizontal direction', function(assert) {
        const instance = createInstance();

        instance.option({
            direction: 'horizontal',
            cellWidth: 25,
            getResizableStep: () => 25
        });

        assert.ok(instance.$element().dxResizable, 'appointment has right class');

        const resizableInstance = instance.$element().dxResizable('instance');

        assert.equal(resizableInstance.option('handles'), 'left right', 'Appointment can resize only horizontal');
        assert.equal(resizableInstance.option('step'), CELL_WIDTH, 'Resizable has a right step');
        assert.equal(resizableInstance.option('minWidth'), CELL_WIDTH, 'Resizable has a right minWidth');
        assert.equal(resizableInstance.option('minHeight'), 0, 'Resizable has a right minHeight');
    });

    test('Scheduler appointment has right resizing handles, horizontal direction', function(assert) {
        const instance = createInstance();

        instance.option({
            direction: 'horizontal',
            cellHeight: 20,
            cellWidth: 25,
            reduced: 'head'
        });

        const resizableInstance = instance.$element().dxResizable('instance');

        assert.equal(resizableInstance.option('handles'), 'left', 'Appointment has right resizing handle');

        instance.option('reduced', 'body');
        assert.equal(resizableInstance.option('handles'), '', 'Appointment has right resizing handle');

        instance.option('reduced', 'tail');
        assert.equal(resizableInstance.option('handles'), 'right', 'Appointment has right resizing handle');
    });

    test('Scheduler appointment has right resizing handles, horizontal direction, RTL', function(assert) {
        const instance = createInstance();

        instance.option({
            direction: 'horizontal',
            cellHeight: 20,
            cellWidth: 25,
            rtlEnabled: true,
            reduced: 'head'
        });

        const resizableInstance = instance.$element().dxResizable('instance');

        assert.equal(resizableInstance.option('handles'), 'right', 'Appointment has right resizing handle');

        instance.option('reduced', 'body');
        assert.equal(resizableInstance.option('handles'), '', 'Appointment has right resizing handle');

        instance.option('reduced', 'tail');
        assert.equal(resizableInstance.option('handles'), 'left', 'Appointment has right resizing handle');
    });

    test('Appointment should process "isDragSource" property', function(assert) {
        const instance = createInstance();

        assert.ok(
            !instance.$element().hasClass(APPOINTMENT_DRAG_SOURCE_CLASS),
            'Appointment is not a drag source by default',
        );

        instance.option('isDragSource', true);

        assert.ok(
            instance.$element().hasClass(APPOINTMENT_DRAG_SOURCE_CLASS),
            'Appointment is a drag source by',
        );
    });

});
