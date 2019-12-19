import $ from 'jquery';
import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import translator from 'animation/translator';
import { SchedulerTestWrapper } from './helpers.js';

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

QUnit.module('Integration: Dragging from Tooltip', {
    beforeEach: function() {
        fx.off = true;
        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            },
            {
                text: 'Task 3',
                startDate: new Date(2015, 1, 9, 13, 0),
                endDate: new Date(2015, 1, 9, 14, 0)
            }
        ];

        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend({
                editing: true,
                height: 600,
                views: ['month'],
                currentView: 'month',
                dataSource: this.tasks,
                currentDate: new Date(2015, 1, 9)
            }, options)).dxScheduler('instance');

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };

        this.clock = sinon.useFakeTimers();
    },

    getCompactAppointmentButton: function() {
        return this.scheduler.appointments.compact.getButton();
    },

    showTooltip: function() {
        this.scheduler.appointments.compact.click();
    },

    getTooltipListItem: function() {
        return this.scheduler.tooltip.getItemElement();
    },

    getPhantomAppointment: function() {
        return this.instance.$element().find('.dx-scheduler-appointment.dx-draggable-dragging').eq(0);
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test('Phantom appointment should be removed after stop dragging under current cell', function(assert) {
    this.createInstance();
    this.showTooltip();

    const $ddAppointment = this.getTooltipListItem();
    const pointer = pointerMock($ddAppointment).start().dragStart();

    assert.equal(this.getPhantomAppointment().length, 1, 'Phantom appointment created after start drag appointment in tooltip');

    pointer.drag(10, 10);
    pointer.dragEnd();

    assert.equal(this.getPhantomAppointment().length, 0, 'Phantom appointment removed after stop drag appointment');
});

QUnit.test('DropDownAppointment shouldn\'t be draggable if editing.allowDragging is false', function(assert) {
    this.createInstance({
        editing: {
            allowDragging: false
        }
    });

    this.showTooltip();
    var $ddAppointment = this.getTooltipListItem();

    var apptsInstance = this.instance.getAppointmentsInstance(),
        renderStub = sinon.stub(apptsInstance, '_renderItem');

    $ddAppointment.trigger('dxdragstart');
    assert.notOk(renderStub.calledOnce, 'Phanton item was not rendered');
});

QUnit.test('Phantom appointment should be rendered after tooltip item dragStart', function(assert) {
    this.createInstance();

    this.showTooltip();
    var $ddAppointment = this.getTooltipListItem();

    var apptsInstance = this.instance.getAppointmentsInstance(),
        renderStub = sinon.stub(apptsInstance, '_renderItem');

    $ddAppointment.trigger('dxdragstart');
    assert.ok(renderStub.calledOnce, 'Item was rendered');
});

QUnit.test('Phantom appointment should have correct appointmentData', function(assert) {
    this.createInstance();
    this.showTooltip();

    var $ddAppointment = this.getTooltipListItem();
    var apptsInstance = this.instance.getAppointmentsInstance(),
        renderStub = sinon.stub(apptsInstance, '_renderItem');

    $ddAppointment.trigger('dxdragstart');
    var phantomData = renderStub.getCall(0).args[1];

    assert.deepEqual(phantomData.itemData, this.tasks[2], 'Data is OK');
    assert.equal(phantomData.settings[0].isCompact, false, 'Some settings is OK');
    assert.equal(phantomData.settings[0].virtual, false, 'Some settings is OK');
});

QUnit.test('Phantom appointment position should be recalculated during dragging tooltip item', function(assert) {
    this.createInstance();
    this.showTooltip();

    var $ddAppointment = this.getTooltipListItem();
    var pointer = pointerMock($ddAppointment).start().dragStart(),
        $phantomAppointment = this.getPhantomAppointment(),
        initialPhantomPosition = translator.locate($phantomAppointment);

    pointer.drag(30, 60);

    var phantomPosition = translator.locate($phantomAppointment);
    assert.roughEqual(phantomPosition.top, initialPhantomPosition.top + 60 + 51, 1.5, 'Phantom top is OK');
    assert.roughEqual(phantomPosition.left, initialPhantomPosition.left + 30, 1.5, 'Phantom left is OK');

    pointer.dragEnd();
});

QUnit.test('Phantom appointment position should be corrected during dragging tooltip item', function(assert) {
    this.createInstance();
    this.showTooltip();

    var $ddAppointment = this.getTooltipListItem();
    var pointer = pointerMock($ddAppointment).start().dragStart(),
        $phantomAppointment = this.getPhantomAppointment(),
        initialPhantomPosition = translator.locate($phantomAppointment);

    pointer.drag(30, 60);

    var correctCoordinatesStub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('correctAppointmentCoordinates');

    pointer.dragStart().drag(0, 0);

    assert.ok(correctCoordinatesStub.calledOnce, 'Observers are notified');
    var args = correctCoordinatesStub.getCall(0).args;
    assert.deepEqual(args[1].coordinates, { left: initialPhantomPosition.left + 60, top: initialPhantomPosition.top + 120 }, 'Arguments are OK');
    assert.deepEqual(args[1].allDay, undefined, 'Arguments are OK');

    pointer.dragEnd();
});

QUnit.test('Phantom appointment should have correct template', function(assert) {
    this.createInstance({
        editing: true,
        height: 600,
        views: [{ type: 'timelineDay', maxAppointmentsPerCell: 1 }],
        currentView: 'timelineDay',
        dataSource: [{
            text: 'Task 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        },
        {
            text: 'Task 2',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        }],
        currentDate: new Date(2015, 1, 9)
    });

    var $ddAppointment = this.scheduler.tooltip.getItemElement();
    var pointer = pointerMock($ddAppointment).start().dragStart(),
        $phantomAppointment = this.instance.$element().find('.dx-scheduler-appointment').eq(0);

    assert.equal($phantomAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), '1:00 AM', 'Appointment start is correct');
    assert.equal($phantomAppointment.find('.dx-scheduler-appointment-content-date').eq(2).text(), '2:00 AM', 'Appointment edn is correct');

    pointer.dragEnd();
});
