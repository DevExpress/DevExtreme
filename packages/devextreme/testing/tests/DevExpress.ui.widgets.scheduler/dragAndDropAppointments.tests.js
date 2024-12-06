import fx from 'common/core/animation/fx';
import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import browser from 'core/utils/browser';
import { DataSource } from 'common/data/data_source/data_source';
import translator from 'common/core/animation/translator';
import config from 'core/config';
import dragEvents from 'common/core/events/drag';
import dataUtils from 'core/element_data';
import Color from 'color';
import {
    SchedulerTestWrapper,
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment,
    CLASSES,
    supportedScrollingModes
} from '../../helpers/scheduler/helpers.js';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

const {
    testStart,
    test,
    module
} = QUnit;

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const realSetTimeout = window.setTimeout;

testStart(() => initTestMarkup());

const priorityData = [{
    text: 'Low Priority',
    id: 1,
    color: '#1e90ff'
}, {
    text: 'High Priority',
    id: 2,
    color: '#ff9747'
}];
const getAbsolutePosition = function(appointment) { return appointment.offset(); };
const commonViews = [{
    type: 'day',
    name: 'day'
}, {
    type: 'month',
    name: 'month'
}, {
    type: 'week',
    name: 'week'
}];
const timeLineViews = [{
    type: 'timelineDay',
    name: 'timelineDay'
}, {
    type: 'timelineWeek',
    name: 'timelineWeek'
}, {
    type: 'timelineWorkWeek',
    name: 'timelineWorkWeek'
}, {
    type: 'timelineMonth',
    name: 'timelineMonth'
}];
const groupViews = [{
    type: 'workWeek',
    name: 'Vertical Grouping',
    groupOrientation: 'vertical',
    cellDuration: 60,
    intervalCount: 2
}, {
    type: 'workWeek',
    name: 'Horizontal Grouping',
    groupOrientation: 'horizontal',
    cellDuration: 30,
    intervalCount: 2
}];

const zoomModuleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        fx.off = false;
        window.document.body.style.zoom = 'normal';
        this.clock.restore();
    }
};

const DROPPABLE_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';
const DRAG_SOURCE_CLASS = CLASSES.appointmentDragSource.slice(1);

module('Browser zoom', zoomModuleConfig, () => {
    if(!isDesktopEnvironment() || !browser.webkit) {
        return;
    }

    const views = ['day', 'week'];
    const createDataSource = () => [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 25, 9, 30),
        endDate: new Date(2017, 4, 25, 11, 30)
    }];

    QUnit.test('Appointment should drag to above cell in browser zoom case(T833310)', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: views,
            currentView: views[0],
            dataSource: createDataSource(),
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600
        });

        scheduler.drawControl();
        window.document.body.style.zoom = '125%';

        views.forEach(view => {
            scheduler.option('currentView', view);
            scheduler.option('dataSource', createDataSource());

            const appointment = scheduler.appointments.getAppointment();

            assert.equal(scheduler.appointments.getDateText(), '9:30 AM - 11:30 AM', `appointment should have correct date on init in ${view}  view`);

            const offset = appointment.offset();
            const pointer = pointerMock(appointment).start();

            pointer
                .down(offset.left, offset.top)
                .move(0, -30);
            pointer.up();

            assert.equal(scheduler.appointments.getDateText(), '9:00 AM - 11:00 AM', `appointment should move to previous cell in ${view} view`);
        });

        scheduler.hideControl();
    });
});

const commonModuleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
};

const draggingFromTooltipConfig = $.extend({}, {
    data: [
        {
            text: 'app1',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
            priorityId: 1
        }, {
            text: 'app2',
            startDate: new Date(2017, 4, 22, 10, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
            priorityId: 1
        }, {
            text: 'app3',
            startDate: new Date(2017, 4, 22, 10, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
            priorityId: 1
        }, {
            text: 'app-all-day-1',
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 12, 0),
            allDay: true,
            priorityId: 2
        }, {
            text: 'app-all-day-2',
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 12, 0),
            allDay: true,
            priorityId: 2
        }, {
            text: 'app-all-day-3',
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 12, 0),
            allDay: true,
            priorityId: 2
        }, {
            text: 'app-all-day-4',
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 12, 0),
            allDay: true,
            priorityId: 2
        }
    ],
    createScheduler: function(views, currentView, rtlEnabled) {
        return createWrapper({
            _draggingMode: 'default',
            dataSource: $.extend(true, [], this.data),
            views: views,
            currentView: currentView,
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            width: 800,
            height: 600,
            groups: ['priorityId'],
            rtlEnabled: rtlEnabled,
            resources: [{
                fieldExpr: 'priorityId',
                dataSource: priorityData,
                label: 'Priority'
            }]
        });
    },

    scrollToButton: function(scheduler, button) {
        const scrollContainer = scheduler.workSpace.getDataTableScrollableContainer();

        scrollContainer.scrollTop($(button).offset().top - scrollContainer.offset().top);
        scrollContainer.scrollLeft($(button).offset().left - scrollContainer.offset().left);
    },

    getFakeAppointmentPosition: function(scheduler) {
        const fakeAppointment = scheduler.appointments.getFakeAppointment();
        const position = getAbsolutePosition(fakeAppointment.parent());

        return {
            left: position.left + fakeAppointment.width() / 2,
            top: position.top + fakeAppointment.height() / 2
        };
    },

    createMousePosition: function(compactAppointment) {
        const position = getAbsolutePosition(compactAppointment);

        return {
            x: position.left + compactAppointment.width() / 2,
            y: position.top + compactAppointment.height() / 2
        };
    },

    testFakeAppointmentPosition: function(scheduler, button, index, viewName, assert) {
        const dragOffset = { left: 100, top: 100 };

        this.scrollToButton(scheduler, button);
        scheduler.appointments.compact.click(index);

        const compactAppointment = scheduler.appointments.compact.getAppointment();
        const mousePosition = this.createMousePosition(compactAppointment);

        const pointer = pointerMock(compactAppointment).start();

        pointer
            .down(mousePosition.x, mousePosition.y)
            .move(dragOffset.left, dragOffset.top);

        const fakeAppointmentPosition = this.getFakeAppointmentPosition(scheduler);

        assert.roughEqual(Math.round(fakeAppointmentPosition.left - dragOffset.left), Math.round(mousePosition.x), 1.1,
            `appointment should have correct left position in ${viewName}`);
        assert.roughEqual(Math.round(fakeAppointmentPosition.top - dragOffset.top), Math.round(mousePosition.y), 1.1,
            `appointment should have correct top position in ${viewName}`);

        pointer
            .up();
    },
}, commonModuleConfig);

module('Appointment should move a same distance in dragging from tooltip case, rtlEnabled = false', draggingFromTooltipConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }
    [commonViews, timeLineViews, groupViews].forEach(views => {
        views.forEach(view => {
            test(`Views: ${view.name}`, function(assert) {
                const scheduler = this.createScheduler(views, view.name, false);
                const compactAppointmentButton = scheduler.appointments.compact.getButton(0);

                const dragOffset = { left: 100, top: 100 };

                this.scrollToButton(scheduler, compactAppointmentButton);
                scheduler.appointments.compact.click(0);

                const compactAppointment = scheduler.appointments.compact.getAppointment();
                const mousePosition = this.createMousePosition(compactAppointment);

                const pointer = pointerMock(compactAppointment).start();

                pointer
                    .down(mousePosition.x, mousePosition.y)
                    .move(dragOffset.left, dragOffset.top);

                const fakeAppointmentPosition = this.getFakeAppointmentPosition(scheduler);

                assert.roughEqual(Math.round(fakeAppointmentPosition.left - dragOffset.left), Math.round(mousePosition.x), 1.1,
                    `appointment should have correct left position in ${view.name}`);
                assert.roughEqual(Math.round(fakeAppointmentPosition.top - dragOffset.top), Math.round(mousePosition.y), 1.1,
                    `appointment should have correct top position in ${view.name}`);

                pointer
                    .up();
            });
        });
    });
});


module('Appointment should move a same distance in dragging from tooltip case, rtlEnabled = true', draggingFromTooltipConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }

    [commonViews, timeLineViews, groupViews].forEach(views => {
        views.forEach(view => {
            test(`Views: ${view.name}`, function(assert) {
                const scheduler = this.createScheduler(views, view.name, true);
                const compactAppointmentButton = scheduler.appointments.compact.getButton(0);

                const dragOffset = { left: 100, top: 100 };

                this.scrollToButton(scheduler, compactAppointmentButton);
                scheduler.appointments.compact.click(0);

                const compactAppointment = scheduler.appointments.compact.getAppointment();
                const mousePosition = this.createMousePosition(compactAppointment);

                const pointer = pointerMock(compactAppointment).start();

                pointer
                    .down(mousePosition.x, mousePosition.y)
                    .move(dragOffset.left, dragOffset.top);

                const fakeAppointmentPosition = this.getFakeAppointmentPosition(scheduler);

                assert.roughEqual(Math.round(fakeAppointmentPosition.left - dragOffset.left), Math.round(mousePosition.x), 1.1,
                    `appointment should have correct left position in ${view.name}`);
                assert.roughEqual(Math.round(fakeAppointmentPosition.top - dragOffset.top), Math.round(mousePosition.y), 1.1,
                    `appointment should have correct top position in ${view.name}`);

                pointer
                    .up();
            });
        });
    });
});

const moveAsMouseConfig = $.extend({}, {
    data: [{
        text: 'Website Re-Design Plan',
        priorityId: 2,
        startDate: new Date(2018, 4, 21, 9, 30),
        endDate: new Date(2018, 4, 21, 11, 30)
    }, {
        text: 'Book Flights to San Fran for Sales Trip',
        priorityId: 1,
        startDate: new Date(2018, 4, 21, 10, 0),
        endDate: new Date(2018, 4, 21, 12, 0),
        allDay: true
    }],
    dragCases: [
        {
            top: 20,
            left: 20
        }, {
            top: -10,
            left: 5
        }
    ],
    testAppointmentPosition: function(scheduler, text, dragCase, viewName, assert) {
        const appointment = scheduler.appointments.find(text);

        const positionBeforeDrag = getAbsolutePosition(appointment);
        const pointer = pointerMock(appointment).start();
        pointer
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(dragCase.left, dragCase.top);

        const draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();

        const positionAfterDrag = getAbsolutePosition(draggedAppointment);

        pointer
            .up();

        assert.equal(positionAfterDrag.left - positionBeforeDrag.left, dragCase.left,
            `appointment '${text}' should have correct left position in ${viewName}`);
        assert.equal(positionAfterDrag.top - positionBeforeDrag.top, dragCase.top,
            `appointment '${text}' should have correct top position in ${viewName}`);
    },
    testViews: function(views, assert, rtlEnabled) {
        const scheduler = this.createScheduler(views, rtlEnabled);

        views.forEach(view => {
            scheduler.option('currentView', view.name);

            this.dragCases.forEach(dragCase =>
                this.data.forEach(({ text }) => this.testAppointmentPosition(scheduler, text, dragCase, view.name, assert))
            );
        });
    },
    createScheduler: function(views, rtlEnabled) {
        return createWrapper({
            _draggingMode: 'default',
            dataSource: $.extend(true, [], this.data),
            width: 850,
            height: 600,
            views: views,
            currentView: views[0].name,
            crossScrollingEnabled: true,
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            groups: ['priorityId'],
            rtlEnabled: rtlEnabled,
            resources: [{
                fieldExpr: 'priorityId',
                dataSource: priorityData,
                label: 'Priority'
            }]
        });
    },
}, commonModuleConfig);


module('Appointment should move a same distance as mouse, rtlEnabled = false', moveAsMouseConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }
    test('Common Views', function(assert) { this.testViews(commonViews, assert, false); });
    test('Time Line Views', function(assert) { this.testViews(timeLineViews, assert, false); });
    test('Group Views', function(assert) { this.testViews(groupViews, assert, false); });
});

module('Appointment should move a same distance as mouse, rtlEnabled = true', moveAsMouseConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }
    test('Common Views', function(assert) { this.testViews(commonViews, assert, true); });
    test('Time Line Views', function(assert) { this.testViews(timeLineViews, assert, true); });
    test('Group Views', function(assert) { this.testViews(groupViews, assert, true); });
});

module('Common', commonModuleConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }
    test('DropDownAppointment shouldn\'t be draggable if editing.allowDragging is false', function(assert) {
        const tasks = [
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

        const scheduler = createWrapper({
            _draggingMode: 'default',
            editing: {
                allowDragging: false
            },
            height: 600,
            views: ['month'],
            currentView: 'month',
            dataSource: tasks,
            currentDate: new Date(2015, 1, 9)
        });

        scheduler.appointments.compact.click();

        const appointment = scheduler.tooltip.getItemElement();
        const renderStub = sinon.stub(scheduler.instance.getAppointmentsInstance(), '_renderItem');

        appointment.trigger('dxdragstart');

        assert.notOk(renderStub.calledOnce, 'Phanton item was not rendered');
    });

    test('Phantom appointment should have correct template', function(assert) {
        const scheduler = createWrapper({
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

        const pointer = pointerMock(scheduler.tooltip.getItemElement())
            .start()
            .dragStart();

        const phantomAppointment = scheduler.appointments.getAppointment();

        assert.equal(phantomAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), '1:00 AM - 2:00 AM', 'Appointment start is correct');

        pointer.dragEnd();
    });

    test('Appointment should move to the first cell from tooltip case', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            editing: true,
            height: 600,
            views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
            currentView: 'month',
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

        scheduler.appointments.compact.click(0);
        const compactAppointment = scheduler.appointments.compact.getAppointment();
        const compactAppointmentOffset = getAbsolutePosition(compactAppointment);

        pointerMock(compactAppointment).start().down(compactAppointmentOffset.left, compactAppointmentOffset.top).move(0, -100).up();

        const data = scheduler.instance.option('dataSource')[1];
        assert.deepEqual(data.startDate, new Date(2015, 1, 1, 1), 'start date is correct');
        assert.deepEqual(data.endDate, new Date(2015, 1, 1, 2), 'end date is correct');
    });

    test('Appointment shouldn\'t move to the cell from tooltip case if it is disabled', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            editing: true,
            height: 600,
            views: [{ type: 'month', maxAppointmentsPerCell: 1 }],
            currentView: 'month',
            dataSource: [{
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                disabled: true,
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                disabled: true,
            }],
            currentDate: new Date(2015, 1, 9)
        });

        scheduler.appointments.compact.click(0);
        const compactAppointment = scheduler.appointments.compact.getAppointment();
        const compactAppointmentOffset = getAbsolutePosition(compactAppointment);

        pointerMock(compactAppointment).start().down(compactAppointmentOffset.left, compactAppointmentOffset.top).move(0, -100).up();

        const data = scheduler.instance.option('dataSource')[1];
        assert.deepEqual(data.startDate, new Date(2015, 1, 9, 1, 0), 'start date is correct');
        assert.deepEqual(data.endDate, new Date(2015, 1, 9, 2, 0), 'end date is correct');
    });

    test('The recurring appointment should have correct position when dragging', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            editing: true,
            height: 600,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            dataSource: [{
                text: 'Watercolor Landscape',
                roomId: [1],
                startDate: new Date(2017, 4, 1, 9, 30),
                endDate: new Date(2017, 4, 1, 11),
                recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,FR;COUNT=10'
            }],
            resources: [{
                fieldExpr: 'roomId',
                dataSource: [{
                    text: 'Room 101',
                    id: 1,
                    color: '#bbd806'
                }],
                label: 'Room'
            }]
        });

        const $appointment = scheduler.appointments.find('Watercolor Landscape').first();
        const positionBeforeDrag = getAbsolutePosition($appointment);
        const pointer = pointerMock($appointment).start();

        try {
            pointer
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(150, 0);

            const $draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();

            const positionAfterDrag = getAbsolutePosition($draggedAppointment);

            pointer.up();

            assert.deepEqual(positionAfterDrag, {
                left: positionBeforeDrag.left + 150,
                top: positionBeforeDrag.top
            });
        } finally {
            scheduler.appointmentPopup.dialog.hide();
        }
    });

    // T835049
    QUnit.test('The appointment should have correct position after a drop when the store is asynchronous', function(assert) {
        const data = [{
            text: 'Task 1',
            startDate: new Date(2015, 1, 1, 11, 0),
            endDate: new Date(2015, 1, 1, 11, 30)
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            editing: true,
            height: 600,
            views: [{ type: 'timelineMonth' }],
            currentView: 'timelineMonth',
            dataSource: {
                load: () => {
                    const d = $.Deferred();

                    setTimeout(() => d.resolve(data), 30);

                    return d.promise();
                },
                update: (key, values) => {
                    const d = $.Deferred();

                    setTimeout(function() {
                        $.extend(data[0], values);
                        d.resolve(data[0]);
                    }, 30);

                    return d.promise();
                }
            },
            currentDate: new Date(2015, 1, 1),
            startDayHour: 9
        });

        this.clock.tick(30);

        let $appointment = scheduler.appointments.find('Task 1').first();
        const positionBeforeDrag = getAbsolutePosition($appointment);
        const pointer = pointerMock($appointment).start();
        const cellWidth = scheduler.workSpace.getCellWidth();

        pointer
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(cellWidth, 0);

        $appointment = scheduler.appointments.getFakeAppointmentWrapper();
        let positionAfterDrag = getAbsolutePosition($appointment);

        pointer.up();

        assert.deepEqual(positionAfterDrag, {
            left: positionBeforeDrag.left + cellWidth,
            top: positionBeforeDrag.top
        }, 'appointment position is correct');
        assert.ok($appointment.hasClass('dx-draggable-dragging'), 'appointment is dragging');

        this.clock.tick(30); // waiting for data update

        const $appointments = scheduler.appointments.find('Task 1');

        assert.equal($appointments.length, 1, 'Dragged appointment disappeared');

        this.clock.tick(30); // waiting for data loading

        $appointment = scheduler.appointments.find('Task 1').first();
        positionAfterDrag = getAbsolutePosition($appointment);

        assert.deepEqual(positionAfterDrag, {
            left: positionBeforeDrag.left + cellWidth,
            top: positionBeforeDrag.top
        }, 'appointment position is correct');
        assert.notOk($appointment.hasClass('dx-draggable-dragging'), 'appointment isn\'t dragging');
    });

    // Timezone-sensitive test, use US/Pacific for proper testing
    QUnit.test('Appointment should have correct dates after dragging through timezone change (T835544)', function(assert) {
        const isPacificTimezone = new Date('2024-01-01T08:00:00Z').getTimezoneOffset() === 480;
        const expectedTimeText = !isPacificTimezone
            ? '12:00 AM - 12:00 AM'
            // NOTE: It's okay that after drag-n-drop through DST appointment time is "reduced" by an hour
            // Because summer -> winter DST change has one specific nuance - the DST day has 25 hours
            // The clock's arrow goes back for the hour, so we can see the interval 02:00AM -> 03:00AM twice in one day (+1 hour)
            // If we drag-n-drop this appointment one day left, everything will be ok and it will be 12:00AM -> 12:00AM
            // Because the appointment's duration wasn't changed.
            : '12:00 AM - 11:00 PM';

        const scheduler = createWrapper({
            _draggingMode: 'default',
            dataSource: [{
                text: 'Staff Productivity Report',
                startDate: '2019-11-04T00:00',
                endDate: '2019-11-06T00:00',
            }],
            views: ['timelineMonth'],
            currentView: 'timelineMonth',
            currentDate: new Date(2019, 10, 1),
            height: 300,
            startDayHour: 0,
        });

        const $element = scheduler.appointments.getAppointment();
        let elementPosition = getAbsolutePosition($element);
        const cellWidth = scheduler.workSpace.getCellWidth();
        const pointer = pointerMock($element).start();

        pointer.down(elementPosition.left, elementPosition.top).move(-(cellWidth * 2), 0);
        pointer.up();

        let appointmentContent = scheduler.appointments.getAppointment().find('.dx-scheduler-appointment-content-date').text();
        assert.equal(appointmentContent, expectedTimeText, 'Dates when dragging to timezone change are correct');

        elementPosition = getAbsolutePosition($element);
        pointer.down(elementPosition.left, elementPosition.top).move(cellWidth * 2, 0);
        pointer.up();

        appointmentContent = scheduler.appointments.getAppointment().find('.dx-scheduler-appointment-content-date').text();
        assert.equal(appointmentContent, expectedTimeText, 'Dates when dragging from timezone change are correct');
    });

    QUnit.test('The appointment should be dragged into the all-day panel when there is a scroll offset(T851985)', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            dataSource: [{
                text: 'Task 1',
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }, {
                text: 'Task 2',
                startDate: new Date(2017, 4, 25, 14, 0),
                endDate: new Date(2017, 4, 25, 15, 30)
            }],
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600
        });

        const scrollable = scheduler.workSpace.getScrollable();
        scrollable.scrollTo({ y: 270 });

        const $appointment = scheduler.appointments.find('Task 2').first();
        const positionBeforeDrag = getAbsolutePosition($appointment);
        const $allDayPanel = scheduler.workSpace.getAllDayPanel();
        const allDayPanelPosition = getAbsolutePosition($allDayPanel);

        pointerMock($appointment)
            .start()
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, -(positionBeforeDrag.top - allDayPanelPosition.top - $allDayPanel.outerHeight() / 2))
            .up();

        const data = scheduler.instance.option('dataSource')[1];
        assert.ok(data.allDay, 'second appointment - allDay is true');
    });

    // T938908
    test('Appointment dragged from tooltip should have correct css', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            dataSource: [{
                text: 'App 1',
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            }, {
                text: 'App 2',
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            }],
            height: 600,
            views: [{ type: 'day', maxAppointmentsPerCell: 1 }],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16
        });

        scheduler.appointments.compact.click(0);

        const appointment = scheduler.appointments.compact.getAppointment();
        const appointmentPosition = getAbsolutePosition(appointment);

        const pointer = pointerMock(appointment).start();

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(50, 50);

        const draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();

        assert.equal(draggedAppointment.css('z-index'), 1000, 'Correct z-index');
        assert.equal(draggedAppointment.css('position'), 'fixed', 'Appointment has fixed position');

        pointer.up();
    });

    test('Dragged appointment should not have a right border', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            dataSource: [{
                text: 'App 1',
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            }],
            height: 600,
            views: ['day'],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16
        });

        const $appointment = scheduler.appointments.getAppointment();
        const positionBeforeDrag = getAbsolutePosition($appointment);

        const pointer = pointerMock($appointment)
            .start()
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(50, 50);

        const fakeAppointment = scheduler.appointments.getFakeAppointment();
        fakeAppointment.css('border-left', 'none');

        assert.equal(fakeAppointment.outerWidth() - fakeAppointment.innerWidth(), 0, 'Correct width');

        pointer.up();
    });
});

module('appointmentDragging customization', $.extend({}, {
    createScheduler: options => {
        return createWrapper({
            _draggingMode: 'default',
            dataSource: [{
                text: 'App 1',
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            }, {
                text: 'App 2',
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            }],
            width: 800,
            height: 600,
            views: [{ type: 'day', maxAppointmentsPerCell: 1 }],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            ...options,
        });
    },

    createDraggable: (options, data) => {
        return $('<div>')
            .css({ width: 100, height: 100 })
            .appendTo('#qunit-fixture')
            .dxDraggable($.extend({
                clone: true,
                onDragStart: function(e) {
                    e.itemData = data;
                }
            }, options));
    },
}, commonModuleConfig), () => {
    if(!isDesktopEnvironment()) {
        return;
    }
    test('Event calls on appointment drag', function(assert) {
        const appointmentDragging = {
            onDragStart: sinon.spy(),
            onDragEnd: sinon.spy(),
            onAdd: sinon.spy(),
            onRemove: sinon.spy()
        };

        const scheduler = this.createScheduler({
            appointmentDragging
        });

        const dataSource = scheduler.instance.option('dataSource');
        const appointment = scheduler.appointments.find('App 1');
        const positionBeforeDrag = getAbsolutePosition(appointment);
        const pointer = pointerMock(appointment).start();

        pointer
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, 50);

        const $draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();

        const positionAfterDrag = getAbsolutePosition($draggedAppointment);

        pointer.up();

        assert.strictEqual(positionAfterDrag.top - positionBeforeDrag.top, 50, 'appointment position is changed correctly');

        assert.deepEqual(dataSource[0].startDate, new Date(2018, 4, 21, 10, 0), 'startDate is changed');
        assert.strictEqual(appointmentDragging.onDragStart.callCount, 1, 'onDragStart is called once');
        assert.strictEqual(appointmentDragging.onDragStart.getCall(0).args[0].itemData, dataSource[0], 'onDragStart itemData param');
        assert.strictEqual(appointmentDragging.onDragEnd.callCount, 1, 'onDragEnd is called once');
        assert.strictEqual(appointmentDragging.onAdd.callCount, 0, 'onAdd is not called');
        assert.strictEqual(appointmentDragging.onRemove.callCount, 0, 'onRemove is not called');
    });

    test('Cancel onDragStart event', function(assert) {
        const appointmentDragging = {
            onDragStart: sinon.spy(e => {
                e.cancel = true;
            }),
            onDragEnd: sinon.spy()
        };

        const scheduler = this.createScheduler({
            appointmentDragging
        });

        const text = 'App 1';
        const dataSource = scheduler.instance.option('dataSource');
        const appointment = scheduler.appointments.find(text);
        const positionBeforeDrag = getAbsolutePosition(appointment);
        const pointer = pointerMock(appointment).start();

        pointer
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, 50);

        const $draggedAppointment = scheduler.appointments.getFakeAppointment();

        pointer.up();

        assert.strictEqual($draggedAppointment.length, 0, 'Fake dragged appointment has not been created');
        assert.deepEqual(dataSource[0].startDate, new Date(2018, 4, 21, 9, 30), 'startDate is not changed');
        assert.strictEqual(appointmentDragging.onDragStart.callCount, 1, 'onDragStart is called once');
        assert.strictEqual(appointmentDragging.onDragEnd.callCount, 0, 'onDragEnd is not called');
    });

    test('Cancel onDragEnd event', function(assert) {
        const appointmentDragging = {
            onDragEnd: e => {
                e.cancel = true;
            }
        };
        const text = 'App 1';

        const scheduler = this.createScheduler({
            appointmentDragging
        });

        const dataSource = scheduler.instance.option('dataSource');
        const appointment = scheduler.appointments.find(text);
        const positionBeforeDrag = getAbsolutePosition(appointment);
        const pointer = pointerMock(appointment).start();

        pointer
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, 50);

        const $draggedAppointment = scheduler.appointments.getFakeAppointment();

        const positionAfterDrag = getAbsolutePosition($draggedAppointment);

        pointer.up();

        assert.strictEqual(positionAfterDrag.top - positionBeforeDrag.top, 50, 'appointment position is changed correctly');
        assert.deepEqual(dataSource[0].startDate, new Date(2018, 4, 21, 9, 30), 'startDate is not changed');
    });

    test('Move appointment from Draggable', function(assert) {
        const group = 'testGroup';

        const appointmentDragging = {
            group,
            onAdd: e => {
                e.component.addAppointment(e.itemData);
            }
        };

        const scheduler = this.createScheduler({
            appointmentDragging
        });

        const draggableData = { text: 'App from Draggable' };

        const draggable = this.createDraggable({ group: group }, draggableData);

        const appointment = scheduler.appointments.find('App 1');
        const appointmentPosition = getAbsolutePosition(appointment);
        const draggablePosition = getAbsolutePosition(draggable);
        const dataSource = scheduler.instance.option('dataSource');

        const pointer = pointerMock(draggable).start();

        pointer
            .down(draggablePosition.left, draggablePosition.top)
            .move(appointmentPosition.left - draggablePosition.left, appointmentPosition.top - draggablePosition.top)
            .up();

        assert.strictEqual(dataSource.length, 3, 'appointment is added');
        delete dataSource[2].settings;
        assert.deepEqual(dataSource[2], {
            text: 'App from Draggable',
            allDay: false,
            startDate: new Date(2018, 4, 21, 9, 30),
            endDate: new Date(2018, 4, 21, 10, 0)
        }, 'added appointment data');
        assert.deepEqual(draggableData, { text: 'App from Draggable' }, 'draggable data is not changed');
    });

    test('Move appointment to Draggable', function(assert) {
        const group = 'testGroup';

        const appointmentDragging = {
            group,
            onRemove: sinon.spy(e => {
                e.component.deleteAppointment(e.itemData);
            })
        };

        const scheduler = this.createScheduler({
            appointmentDragging
        });

        const draggable = this.createDraggable({ group: group });

        const appointment = scheduler.appointments.find('App 1');
        const appointmentPosition = getAbsolutePosition(appointment);
        const draggablePosition = getAbsolutePosition(draggable);
        const dataSource = scheduler.instance.option('dataSource');

        const pointer = pointerMock(appointment).start();

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(draggablePosition.left - appointmentPosition.left, draggablePosition.top - appointmentPosition.top)
            .up();

        assert.strictEqual(dataSource.length, 1, 'appointment is removed');
        assert.strictEqual(appointmentDragging.onRemove.getCall(0).args[0].itemData.text, 'App 1', 'onRemove itemData parameter');
    });

    // T895576
    [true, false].forEach(createDraggableFirst => {
        [true, false].forEach(allDay => {
            const testAppointmentDraggingFromSchedulerWithScroll = (assert, that, data, pointerMove, draggablePos, schedulerPos, scrollPos) => {
                const group = 'testGroup';

                const appointmentDragging = {
                    group,
                    onRemove: sinon.spy(e => {
                        e.component.deleteAppointment(e.itemData);
                    })
                };

                const createDraggable = (top, left) => {
                    return that.createDraggable({ group: group }).css({
                        position: 'absolute',
                        top: draggablePos.top,
                        left: draggablePos.left,
                        height: '500px',
                        width: '200px'
                    });
                };

                const createScheduler = () => {
                    return createWrapper({
                        _draggingMode: 'default',
                        appointmentDragging,
                        dataSource: data,
                        currentView: 'week',
                        crossScrollingEnabled: true,
                        currentDate: new Date(2017, 3, 30),
                        height: 300,
                        width: 300
                    });
                };

                let draggable;
                let scheduler;

                if(createDraggableFirst) {
                    draggable = createDraggable();
                    scheduler = createScheduler();
                } else {
                    scheduler = createScheduler();
                    draggable = createDraggable();
                }

                const instance = scheduler.instance;

                scheduler.drawControl();
                if(schedulerPos) {
                    $(instance.element()).css({
                        position: 'absolute',
                        top: schedulerPos.top,
                        left: schedulerPos.left
                    });
                }

                if(scrollPos) {
                    const scrollable = scheduler.workSpace.getScrollable();
                    scrollable.scrollTo(scrollPos);
                }

                const appointment = scheduler.appointments.find('App 1');
                const appointmentPosition = getAbsolutePosition(appointment);
                const draggablePosition = getAbsolutePosition(draggable);
                const dataSource = instance.option('dataSource');

                const pointer = pointerMock(appointment).start();
                const pointerMoveCoordinates = {
                    x: pointerMove.x ? draggablePosition.left - appointmentPosition.left : 0,
                    y: pointerMove.y ? draggablePosition.top - appointmentPosition.top : 0
                };

                pointer
                    .down(appointmentPosition.left, appointmentPosition.top)
                    .move(pointerMoveCoordinates.x, pointerMoveCoordinates.y)
                    .up();

                assert.strictEqual(dataSource.length, 0, 'appointment is removed');
                assert.strictEqual(appointmentDragging.onRemove.callCount, 1, 'onRemove call count');
                assert.strictEqual(appointmentDragging.onRemove.getCall(0).args[0].itemData.text, 'App 1', 'onRemove itemData parameter');
            };

            test(`Move appointment to Draggable when scheduler has horizontal scroll (allDay=${allDay}, createDraggableFirst=${createDraggableFirst})`, function(assert) {
                const draggablePosition = {
                    top: '0px',
                    left: '400px'
                };

                const dataSource = [{
                    text: 'App 1',
                    startDate: new Date(2017, 3, 30),
                    allDay
                }];

                const pointerMove = {
                    x: true,
                    y: false
                };

                testAppointmentDraggingFromSchedulerWithScroll(assert, this, dataSource, pointerMove, draggablePosition);
            });

            test(`Move appointment to Draggable when scheduler has horizontal scroll and it is scrolled right (allDay=${allDay}, createDraggableFirst=${createDraggableFirst})`, function(assert) {
                const draggablePosition = {
                    top: '0px',
                    left: '0px'
                };

                const schedulerPos = {
                    top: '0px',
                    left: '200px'
                };

                const dataSource = [{
                    text: 'App 1',
                    startDate: new Date(2017, 4, 6, 0, 0),
                    endDate: new Date(2017, 4, 6, 0, 30),
                    allDay
                }];

                const pointerMove = {
                    x: true,
                    y: false
                };

                const scrollPos = {
                    x: 10000,
                    y: 0
                };

                testAppointmentDraggingFromSchedulerWithScroll(assert, this, dataSource, pointerMove, draggablePosition, schedulerPos, scrollPos);
            });


            test(`Move appointment to Draggable when scheduler has vertical scroll (allDay=${allDay}, createDraggableFirst=${createDraggableFirst})`, function(assert) {
                const draggablePosition = {
                    top: '350px',
                    left: '0px'
                };

                const dataSource = [{
                    text: 'App 1',
                    startDate: new Date(2017, 3, 30),
                    allDay
                }];

                const pointerMove = {
                    x: true,
                    y: true
                };

                testAppointmentDraggingFromSchedulerWithScroll(assert, this, dataSource, pointerMove, draggablePosition);
            });

            test(`Move appointment to Draggable when scheduler has vertical scroll and it is scrolled down (allDay=${allDay}, createDraggableFirst=${createDraggableFirst})`, function(assert) {
                const draggablePosition = {
                    top: '0px',
                    left: '100px'
                };

                const schedulerPos = {
                    top: '500px',
                    left: '0px'
                };

                const dataSource = [{
                    text: 'App 1',
                    startDate: new Date(2017, 3, 30, 23, 0),
                    endDate: new Date(2017, 3, 30, 23, 30),
                    allDay
                }];

                const pointerMove = {
                    x: true,
                    y: true
                };

                const scrollPos = {
                    x: 0,
                    y: 10000
                };

                testAppointmentDraggingFromSchedulerWithScroll(assert, this, dataSource, pointerMove, draggablePosition, schedulerPos, scrollPos);
            });
        });
    });

    test('Move appointment to Draggable from tooltip', function(assert) {
        const group = 'testGroup';

        const appointmentDragging = {
            group,
            onRemove: sinon.spy(e => {
                e.component.deleteAppointment(e.itemData);
            })
        };

        const scheduler = this.createScheduler({
            appointmentDragging
        });

        const draggable = this.createDraggable({ group: group });

        scheduler.appointments.compact.click(0);

        const appointment = scheduler.appointments.compact.getAppointment();
        const appointmentPosition = getAbsolutePosition(appointment);
        const draggablePosition = getAbsolutePosition(draggable);
        const dataSource = scheduler.instance.option('dataSource');

        const pointer = pointerMock(appointment).start();

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(draggablePosition.left - appointmentPosition.left, draggablePosition.top - appointmentPosition.top)
            .up();

        assert.strictEqual(dataSource.length, 1, 'appointment is removed');
        assert.strictEqual(appointmentDragging.onRemove.getCall(0).args[0].itemData.text, 'App 2', 'onRemove itemData parameter');
    });

    test('The external appointment should move in the month view', function(assert) {
        const group = 'shared';
        const itemData = { text: 'Test' };
        const $dragElement = this.createDraggable({ clone: false, group: group }, itemData);
        const scheduler = this.createScheduler({
            views: ['month'],
            currentView: 'month',
            appointmentDragging: {
                group: group,
                onAdd: (e) => {
                    e.component.addAppointment(e.itemData);
                    $(e.itemElement).remove();
                }
            }
        });

        const appointment = scheduler.appointments.find('App 1');
        const appointmentPosition = getAbsolutePosition(appointment);
        const draggablePosition = getAbsolutePosition($dragElement);
        const dataSource = scheduler.instance.option('dataSource');

        const pointer = pointerMock($dragElement).start();

        pointer
            .down(draggablePosition.left, draggablePosition.top)
            .move(appointmentPosition.left - draggablePosition.left, appointmentPosition.top - draggablePosition.top)
            .up();

        assert.strictEqual(dataSource.length, 3, 'appointment is added');
        assert.deepEqual(dataSource[2], {
            text: 'Test',
            startDate: new Date(2018, 4, 21, 9, 0),
            endDate: new Date(2018, 4, 21, 16, 0)
        }, 'added appointment data');
    });

    // T885459
    test('Move appointment to Draggable - droppable class should be removed', function(assert) {
        const group = 'shared';
        const scheduler = this.createScheduler({
            views: ['month'],
            currentView: 'month',
            dataSource: [{
                text: 'App 1',
                startDate: new Date(2018, 4, 1, 9, 30),
                endDate: new Date(2018, 4, 1, 11, 30)
            }],
            appointmentDragging: {
                group: group
            }
        });
        const $dragElement = this.createDraggable({ group: group });

        const appointment = scheduler.appointments.find('App 1');
        const appointmentPosition = getAbsolutePosition(appointment);
        const draggablePosition = getAbsolutePosition($dragElement);
        const $cellElement = $(scheduler.workSpace.getCell(0, 2));

        const pointer = pointerMock(appointment).start();

        pointer.down(appointmentPosition.left, appointmentPosition.top);
        pointer.move(5, 5).move(draggablePosition.left - appointmentPosition.left - 5, draggablePosition.top - appointmentPosition.top - 5).move(5, 5);

        assert.notOk($cellElement.hasClass(DROPPABLE_CELL_CLASS), 'cell has not droppable class');

        pointer.up();

        assert.notOk($cellElement.hasClass(DROPPABLE_CELL_CLASS), 'cell has not droppable class');
    });

    // T885459
    test('Move item from Draggable to Scheduler and back - droppable class should be removed', function(assert) {
        const group = 'shared';
        const $dragElement = this.createDraggable({ group: group });
        const scheduler = this.createScheduler({
            views: ['month'],
            currentView: 'month',
            dataSource: [{
                text: 'App 1',
                startDate: new Date(2018, 4, 1, 9, 30),
                endDate: new Date(2018, 4, 1, 11, 30)
            }],
            appointmentDragging: {
                group: group
            }
        });

        const appointment = scheduler.appointments.find('App 1');
        const appointmentPosition = getAbsolutePosition(appointment);
        const draggablePosition = getAbsolutePosition($dragElement);
        const $cellElement = $(scheduler.workSpace.getCell(0, 2));

        const pointer = pointerMock($dragElement).start();

        pointer.down(draggablePosition.left, draggablePosition.top);
        pointer
            .move(5, 5)
            .move(appointmentPosition.left - draggablePosition.left - 5, appointmentPosition.top - draggablePosition.top - 5)
            .move(draggablePosition.left - appointmentPosition.left, draggablePosition.top - appointmentPosition.top)
            .up();

        assert.notOk($cellElement.hasClass(DROPPABLE_CELL_CLASS), 'cell has not droppable class');
    });

    // T885459
    test('Move appointment outside Scheduler - droppable class should not be removed', function(assert) {
        const group = 'shared';
        const scheduler = this.createScheduler({
            views: ['month'],
            currentView: 'month',
            dataSource: [{
                text: 'App 1',
                startDate: new Date(2018, 4, 1, 9, 30),
                endDate: new Date(2018, 4, 1, 11, 30)
            }],
            appointmentDragging: {
                group: group
            }
        });
        const $schedulerElement = $(scheduler.instance.element());

        const appointment = scheduler.appointments.find('App 1');
        const appointmentPosition = getAbsolutePosition(appointment);
        const schedulerPosition = getAbsolutePosition($schedulerElement);
        const $cellElement = $(scheduler.workSpace.getCell(0, 2));

        const pointer = pointerMock(appointment).start();

        pointer.down(appointmentPosition.left, appointmentPosition.top);
        pointer.move(5, 5).move(schedulerPosition - 15, schedulerPosition - 15);

        assert.ok($cellElement.hasClass(DROPPABLE_CELL_CLASS), 'cell has droppable class');

        pointer.up();

        assert.notOk($cellElement.hasClass(DROPPABLE_CELL_CLASS), 'cell has not droppable class');
    });

    [true, false].forEach((isDragFromTooltip) => {
        const testText = isDragFromTooltip
            ? 'tooltip'
            : 'grid';
        const data = [{
            text: 'App 1',
            startDate: new Date(2018, 4, 21, 9, 30),
            endDate: new Date(2018, 4, 21, 11, 30)
        }, {
            text: 'App 2',
            startDate: new Date(2018, 4, 21, 9, 30),
            endDate: new Date(2018, 4, 21, 10, 30)
        }];
        const checkItemData = (assert) => (e) => {
            const index = isDragFromTooltip ? 1 : 0;
            assert.strictEqual(e.itemData, data[index], 'Correct itemData');
        };

        test(`itemData should be correct in appointmentDragging events when dragging from ${testText}`, function(assert) {
            assert.expect(3);

            const scheduler = this.createScheduler({
                dataSource: data,
                appointmentDragging: {
                    onDragStart: checkItemData(assert),
                    onDragMove: checkItemData(assert),
                    onDragEnd: checkItemData(assert),
                }
            });

            if(isDragFromTooltip) {
                scheduler.appointments.compact.click(0);
            }

            const appointment = isDragFromTooltip
                ? scheduler.appointments.compact.getAppointment()
                : scheduler.appointments.find('App 1');
            const appointmentPosition = getAbsolutePosition(appointment);

            const pointer = pointerMock(appointment).start();

            pointer
                .down(appointmentPosition.left, appointmentPosition.top)
                .move(50, 50)
                .up();
        });
    });
});

module('Phantom Appointment Dragging', commonModuleConfig, () => {
    if(!isDesktopEnvironment() || !browser.webkit) {
        return;
    }

    const checkAppointmentDragging = (
        assert, scheduler, appointmentTitle, dX, dY, appointmentCount = 1, dragSourceCount,
    ) => {
        let appointments = scheduler.appointments.find(appointmentTitle);
        let dragSource = scheduler.appointments.getDragSource();
        const validDragSourceCount = dragSourceCount || appointmentCount;

        assert.equal(appointments.length, appointmentCount, 'Phantom appointment does not exist');
        assert.equal(dragSource.length, 0, 'Drag source does not exist');

        const appointment = $(appointments[0]);

        const appointmentPosition = getAbsolutePosition(appointment);
        const pointer = pointerMock(appointment).start();

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(dX, dY);

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, appointmentCount + 1, 'Phantom appointment exists');
        assert.equal(dragSource.length, validDragSourceCount, 'Drag source exists');

        pointer.up();

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, appointmentCount, 'Phantom appointment does not exist');
        assert.equal(dragSource.length, 0, 'Drag source does not exist');
    };

    const checkVirtualAppointmentDragging = (
        assert, scheduler, appointmentTitle,
        appointmentCount, appointmentCountAfterDND, isCloseDialog = false,
    ) => {
        const schedulerInstance = scheduler.instance;

        const $appointment = scheduler.appointments.find(appointmentTitle).first();
        const positionBeforeDrag = getAbsolutePosition($appointment);

        let appointments = scheduler.appointments.find(appointmentTitle);
        let dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, appointmentCount, 'Phantom appointment does not exist');
        assert.equal(dragSource.length, 0, 'Drag source does not exist');

        pointerMock($appointment)
            .start()
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, 50);

        const workSpace = schedulerInstance.getWorkSpace();

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, appointmentCount + 1, 'Phantom appointment exists');
        assert.equal(dragSource.length, 1, 'Drag source exists');

        workSpace.renderer.getRenderTimeout = () => -1;

        // Cause rerender of the grid and appointments
        workSpace.renderer.updateRender();

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, appointmentCount + 1, 'Phantom appointment exists');
        assert.equal(dragSource.length, 1, 'Drag source exists');

        const draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();
        const nextPointer = pointerMock(draggedAppointment);
        nextPointer.up();

        isCloseDialog && scheduler.appointmentPopup.dialog.hide();

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, appointmentCountAfterDND, 'Phantom appointment exists');
        assert.equal(dragSource.length, 0, 'Drag source exists');
    };

    test('A phantom appointment should be created on appointment dragging', function(assert) {
        const views = ['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'];
        const appointmentTitle = 'App';
        const getDataSource = () => [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 14, 9, 30),
            endDate: new Date(2020, 10, 14, 11, 30),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: views,
            currentView: views[0],
            dataSource: getDataSource(),
            currentDate: new Date(2020, 10, 14),
            startDayHour: 9,
            height: 600,
        });

        views.forEach((view, index) => {
            scheduler.option('currentView', view);
            scheduler.option('dataSource', getDataSource());

            const dX = index < 3 ? 0 : 30;
            const dY = index < 3 ? 30 : 0;

            checkAppointmentDragging(assert, scheduler, appointmentTitle, dX, dY);
        });
    });

    test('Dragging should work correctly when an appointment is dragged from the all-day panel', function(assert) {
        const appointmentTitle = 'App';
        const dataSource = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 14, 9, 30),
            endDate: new Date(2020, 10, 14, 11, 30),
            allDay: true,
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: ['week'],
            currentView: 'week',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 14),
            startDayHour: 9,
            height: 600,
        });

        checkAppointmentDragging(assert, scheduler, appointmentTitle, -30, 0);
    });

    test('Dragging should work correctly with long appoinments', function(assert) {
        const appointmentTitle = 'App';
        const dataSource = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 13, 10, 30),
            endDate: new Date(2020, 10, 14, 9, 30),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: ['week'],
            currentView: 'week',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 14),
            startDayHour: 9,
            height: 600,
        });

        checkAppointmentDragging(assert, scheduler, appointmentTitle, -30, 0, 2);
    });

    test('Dragging should work correctly with long appoinments in month view', function(assert) {
        const appointmentTitle = 'App';
        const dataSource = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 1, 10, 30),
            endDate: new Date(2020, 10, 30, 9, 30),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: ['month'],
            currentView: 'month',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 14),
            startDayHour: 9,
            height: 600,
        });

        checkAppointmentDragging(assert, scheduler, appointmentTitle, 30, 0, 5);
    });

    test('Phantom appointment should be removed after DnD from tooltip', function(assert) {
        const dataSource = [{
            text: 'App 1',
            startDate: new Date(2020, 10, 12, 9, 30),
            endDate: new Date(2020, 10, 12, 10, 30),
        }, {
            text: 'App 2',
            startDate: new Date(2020, 10, 12, 9, 30),
            endDate: new Date(2020, 10, 12, 10, 30),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: [{ type: 'week', maxAppointmentsPerCell: 1 }],
            currentView: 'week',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 12),
            startDayHour: 9,
            height: 600,
        });

        scheduler.appointments.compact.click(0);

        const appointment = scheduler.appointments.compact.getAppointment();
        const appointmentPosition = getAbsolutePosition(appointment);

        const pointer = pointerMock(appointment).start();

        const $collectorCell = scheduler.workSpace.getCell(1, 4);
        const cellPosition = getAbsolutePosition($collectorCell);
        const cellHeight = $collectorCell.outerHeight();
        const cellWidth = $collectorCell.outerWidth();
        const cellCenter = {
            x: cellPosition.left + cellWidth / 2,
            y: cellPosition.top + cellHeight / 2,
        };

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(0, 60);
        const nextTop = appointmentPosition.top + 60;

        pointer.move(cellCenter.x - appointmentPosition.left, cellCenter.y - nextTop);

        pointer.up();

        const appointments = scheduler.appointments.find('App 2');

        assert.equal(appointments.length, 0, 'Phantom appointment does not exist');
    });

    test('Dragging should work correctly with recurrent appointments', function(assert) {
        const appointmentTitle = 'App 1';
        const dataSource = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 10, 30),
            endDate: new Date(2020, 10, 16, 9, 30),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: ['week'],
            currentView: 'week',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 16),
            startDayHour: 9,
            height: 600,
        });

        let appointments = scheduler.appointments.find(appointmentTitle);
        let dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, 3, 'Phantom appointment does not exist');
        assert.equal(dragSource.length, 0, 'Drag source does not exist');

        const appointment = $(appointments[0]);

        const appointmentPosition = getAbsolutePosition(appointment);
        const pointer = pointerMock(appointment).start();

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(30, 30);

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, 4, 'Phantom appointment exists');
        assert.equal(dragSource.length, 1, 'Drag source exists');

        pointer.up();

        scheduler.appointmentPopup.dialog.hide();

        appointments = scheduler.appointments.find(appointmentTitle);
        dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, 3, 'Phantom appointment does not exist');
        assert.equal(dragSource.length, 0, 'Drag source does not exist');
    });

    test('Dragging should work correctly with multiple resources', function(assert) {
        const appointmentTitle = 'App';
        const dataSource = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 9, 30),
            endDate: new Date(2020, 10, 16, 10, 30),
            priorityId: [1, 2],
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: ['month'],
            currentView: 'month',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 16),
            startDayHour: 9,
            height: 600,
            resources: [{
                fieldExpr: 'priorityId',
                dataSource: priorityData,
                label: 'Priority',
            }],
            groups: ['priorityId'],
        });

        checkAppointmentDragging(assert, scheduler, appointmentTitle, 30, 0, 2, 1);
    });

    test('DnD should work correctly with virtual scrolling while scrolling', function(assert) {
        const done = assert.async();
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 9, 14, 0, 0),
            endDate: new Date(2020, 9, 14, 0, 5),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: ['day'],
            currentView: 'day',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 9, 14),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' },
        });
        const schedulerInstance = scheduler.instance;

        const $appointment = scheduler.appointments.find(appointmentTitle).first();
        const positionBeforeDrag = getAbsolutePosition($appointment);

        let appointments = scheduler.appointments.find(appointmentTitle);
        let dragSource = scheduler.appointments.getDragSource();

        assert.equal(appointments.length, 1, 'Phantom appointment does not exist');
        assert.equal(dragSource.length, 0, 'Drag source does not exist');

        const pointer = pointerMock($appointment)
            .start()
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, 50);

        schedulerInstance.getWorkSpace().renderer.getRenderTimeout = () => -1;

        scheduler.instance.scrollTo(new Date(2020, 9, 14, 18));

        realSetTimeout(() => {
            appointments = scheduler.appointments.find(appointmentTitle);
            dragSource = scheduler.appointments.getDragSource();

            assert.equal(appointments.length, 1, 'Phantom appointment exists');
            assert.equal(dragSource.length, 0, 'Drag source exists');

            pointer.up();

            appointments = scheduler.appointments.find(appointmentTitle);
            dragSource = scheduler.appointments.getDragSource();

            assert.equal(appointments.length, 1, 'Phantom appointment does not exist');
            assert.equal(dragSource.length, 0, 'Drag source does not exist');
            done();
        });
    });

    [{
        getData: () => [{
            text: 'App 1',
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 0, 30),
        }, {
            text: 'App 2',
            startDate: new Date(2020, 10, 16, 1, 0),
            endDate: new Date(2020, 10, 16, 1, 30),
        }],
        resources: undefined,
        groups: undefined,
        draggedAppointmentIndex: 0,
        dragSourceIndex: 1,
        text: 'in a simple case',
    }, {
        getData: () => [{
            text: 'App 1',
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 0, 30),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
        }, {
            text: 'App 2',
            startDate: new Date(2020, 10, 16, 1, 0),
            endDate: new Date(2020, 10, 16, 1, 30),
        }],
        resources: undefined,
        groups: undefined,
        draggedAppointmentIndex: 1,
        dragSourceIndex: 2,
        text: 'in case of dragging a recurrent appointment',
    }, {
        getData: () => [{
            text: 'App 1',
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 0, 30),
            priorityId: [1, 2],
        }, {
            text: 'App 2',
            startDate: new Date(2020, 10, 16, 1, 0),
            endDate: new Date(2020, 10, 16, 1, 30),
            priorityId: [1, 2],
        }],
        resources: [{
            fieldExpr: 'priorityId',
            dataSource: priorityData,
            label: 'Priority'
        }],
        groups: ['priorityId'],
        draggedAppointmentIndex: 1,
        dragSourceIndex: 2,
        text: 'in case of grouping and multiple resources',
    }].forEach(({ getData, resources, groups, draggedAppointmentIndex, dragSourceIndex, text }) => {
        const firstAppointmentTitle = getData()[0].text;
        const secondAppointmentTitle = getData()[1].text;

        test(`Drag Source should be selected correctly ${text}`, function(assert) {
            const data = getData();

            const scheduler = createWrapper({
                _draggingMode: 'default',
                height: 600,
                views: ['week'],
                currentView: 'week',
                dataSource: data,
                currentDate: new Date(2020, 10, 16),
                showAllDayPanel: false,
                resources,
                groups,
            });

            const $appointment = scheduler.appointments.find(firstAppointmentTitle).eq(draggedAppointmentIndex);
            const positionBeforeDrag = getAbsolutePosition($appointment);

            const pointer = pointerMock($appointment)
                .start()
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(0, 50);

            const $firstAppointment = scheduler.appointments.find(firstAppointmentTitle).eq(dragSourceIndex);
            const $secondAppointment = scheduler.appointments.find(secondAppointmentTitle);

            assert.ok($firstAppointment.hasClass(DRAG_SOURCE_CLASS), 'Correct drag source');
            $secondAppointment.each(function() {
                const $element = $(this);

                assert.notOk($element.hasClass(DRAG_SOURCE_CLASS), 'Second appointment is not drag source');
            });

            pointer.up();

            data[0].recurrenceRule && scheduler.appointmentPopup.dialog.hide();
        });

        test(`Drag Source should be updated correctly when using virtual scrolling ${text}`, function(assert) {
            const data = getData();

            const scheduler = createWrapper({
                _draggingMode: 'default',
                height: 600,
                views: ['week'],
                currentView: 'week',
                dataSource: data,
                currentDate: new Date(2020, 10, 16),
                showAllDayPanel: false,
                scrolling: { mode: 'virtual' },
                resources,
                groups,
            });

            const $appointment = scheduler.appointments.find(firstAppointmentTitle).eq(draggedAppointmentIndex);
            const positionBeforeDrag = getAbsolutePosition($appointment);

            const pointer = pointerMock($appointment)
                .start()
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(0, 50);

            const schedulerInstance = scheduler.instance;

            schedulerInstance.getWorkSpace().renderer.getRenderTimeout = () => -1;
            // Cause rerender of the grid and appointments
            schedulerInstance.getWorkSpace().renderer.updateRender();


            const $firstAppointment = scheduler.appointments.find(firstAppointmentTitle).eq(dragSourceIndex);
            const $secondAppointment = scheduler.appointments.find(secondAppointmentTitle);

            assert.ok($firstAppointment.hasClass(DRAG_SOURCE_CLASS), 'Correct drag source');
            $secondAppointment.each(function() {
                const $element = $(this);

                assert.notOk($element.hasClass(DRAG_SOURCE_CLASS), 'Second appointment is not drag source');
            });

            pointer.up();

            data[0].recurrenceRule && scheduler.appointmentPopup.dialog.hide();
        });
    });

    test('Drag Source should be rerendered correctly when virtual scrolling is used', function(assert) {
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 9, 14, 0, 0),
            endDate: new Date(2020, 9, 14, 0, 5),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: ['day'],
            currentView: 'day',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 9, 14),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' }
        });

        checkVirtualAppointmentDragging(assert, scheduler, appointmentTitle, 1, 1);
    });

    test('Drag Source should be rerendered correctly when virtual scrolling and multiple resources are used', function(assert) {
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 9, 14, 0, 0),
            endDate: new Date(2020, 9, 14, 0, 5),
            priorityId: [1, 2],
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: [{
                type: 'day',
                groupOrientation: 'horizontal',
            }],
            currentView: 'day',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 9, 14),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' },
            resources: [{
                fieldExpr: 'priorityId',
                dataSource: priorityData,
                label: 'Priority'
            }],
            groups: ['priorityId'],
            width: 600
        });

        checkVirtualAppointmentDragging(assert, scheduler, appointmentTitle, 2, 1);
    });

    test('Drag Source should be rerendered correctly when virtual scrolling and recurrent appointments are used', function(assert) {
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 0, 5),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: ['week'],
            currentView: 'week',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 10, 16),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' },
        });

        checkVirtualAppointmentDragging(assert, scheduler, appointmentTitle, 3, 3, true);
    });

    test('Drag source should not be rendered if an appointment is not being dragged', function(assert) {
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 0, 5),
        }, {
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 0, 5),
            endDate: new Date(2020, 10, 16, 0, 10),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: ['week'],
            currentView: 'week',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 10, 16),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' },
        });

        const schedulerInstance = scheduler.instance;
        const workSpace = schedulerInstance.getWorkSpace();

        workSpace.renderer.getRenderTimeout = () => -1;

        // Cause rerender of the grid and appointments
        workSpace.renderer.updateRender();

        const dragSource = scheduler.appointments.getDragSource(0);

        assert.equal(dragSource.length, 0, 'Drag Source was not rendered');
    });

    test('Appointment should be updated correctly after DnD with virtual scrolling', function(assert) {
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 0, 5),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: ['week'],
            currentView: 'week',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 10, 16),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' },
        });

        const schedulerInstance = scheduler.instance;
        const workSpace = schedulerInstance.getWorkSpace();

        workSpace.renderer.getRenderTimeout = () => -1;

        const $appointment = scheduler.appointments.find(appointmentTitle).first();
        const positionBeforeDrag = getAbsolutePosition($appointment);

        const $nextCell = scheduler.workSpace.getCell(1, 1);
        const cellHeight = $nextCell.outerHeight();
        const cellWidth = $nextCell.outerWidth();
        const cellAbsolutePosition = getAbsolutePosition($nextCell);
        const cellCenter = {
            left: cellAbsolutePosition.left + cellWidth / 2,
            top: cellAbsolutePosition.top + cellHeight / 2,
        };

        pointerMock($appointment)
            .start()
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(cellCenter.left - positionBeforeDrag.left, cellCenter.top - positionBeforeDrag.top);

        // Cause rerender of the grid and appointments
        workSpace.renderer.updateRender();

        const draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();
        const nextPointer = pointerMock(draggedAppointment);
        nextPointer.up();

        assert.equal(scheduler.appointments.getDateText(0), '12:01 AM - 12:06 AM', 'Correct appointment after drag');
    });

    test('Drag source should not be created while dragging from tooltip', function(assert) {
        const dataSource = [{
            text: 'App 1',
            startDate: new Date(2020, 10, 12, 9, 30),
            endDate: new Date(2020, 10, 12, 10, 30),
        }, {
            text: 'App 2',
            startDate: new Date(2020, 10, 12, 9, 30),
            endDate: new Date(2020, 10, 12, 10, 30),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            views: [{ type: 'week', maxAppointmentsPerCell: 1 }],
            currentView: 'week',
            dataSource: dataSource,
            currentDate: new Date(2020, 10, 12),
            startDayHour: 9,
            height: 600,
        });

        scheduler.appointments.compact.click(0);

        const appointment = scheduler.appointments.compact.getAppointment();
        const appointmentPosition = getAbsolutePosition(appointment);

        const pointer = pointerMock(appointment).start();

        pointer
            .down(appointmentPosition.left, appointmentPosition.top)
            .move(0, 60);

        const dragSource = scheduler.appointments.getDragSource();

        assert.equal(dragSource.length, 0, 'Drag source does not exist');

        pointer.up();
    });

    test('Drag Source should be rerendered correctly while dragging a long appointment and using virtual scrolling', function(assert) {
        const done = assert.async();
        const appointmentTitle = 'Appointment';
        const data = [{
            text: appointmentTitle,
            startDate: new Date(2020, 10, 16, 0, 0),
            endDate: new Date(2020, 10, 16, 15, 0),
        }];

        const scheduler = createWrapper({
            _draggingMode: 'default',
            height: 600,
            views: ['week'],
            currentView: 'week',
            cellDuration: 1,
            dataSource: data,
            currentDate: new Date(2020, 10, 16),
            showAllDayPanel: false,
            scrolling: { mode: 'virtual' },
        });

        const schedulerInstance = scheduler.instance;
        const workSpace = schedulerInstance.getWorkSpace();

        workSpace.renderer.getRenderTimeout = () => -1;

        const $appointment = scheduler.appointments.find(appointmentTitle).first();
        const positionBeforeDrag = getAbsolutePosition($appointment);

        pointerMock($appointment)
            .start()
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, 50);

        schedulerInstance.scrollTo(new Date(2020, 10, 16, 0, 0));

        realSetTimeout(() => {
            const dragSource = scheduler.appointments.getDragSource();
            assert.equal(dragSource.length, 1, 'Drag source has been rerendered');

            const draggedAppointment = scheduler.appointments.getFakeAppointmentWrapper();
            const nextPointer = pointerMock(draggedAppointment);
            nextPointer.up();

            done();
        });
    });
});

module('Appointment dragging', {
    beforeEach: function() {

        fx.off = true;

        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler({ _draggingMode: 'default', ...options }).dxScheduler('instance');

            this.clock.tick(300);

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };

        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || 'backgroundColor';
            return new Color($task.css(checkedProperty)).toHex();
        };

        this.clock = sinon.useFakeTimers();

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
            }
        ];

        this.scrollTo = args => this.instance.getWorkSpace().getScrollable().scrollTo(args);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test('Draggable rendering option "immediate" should be turned off', function(assert) {
        const tasks = [
            { text: 'Task', startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        this.createInstance({
            currentView: 'week',
            currentDate: new Date(2015, 2, 16),
            dataSource: dataSource,
            editing: true,
        });

        const $workspace = $(this.instance.$element()).find('.dx-scheduler-date-table-container');
        const immediate = $workspace.dxDraggable('instance').option('immediate');

        assert.notOk(immediate, 'immediate option is false');
    });

    ['default', 'outlook'].forEach((draggingMode) => {
        test(`Drag and drop appointment when draggingMode = ${draggingMode}`, function(assert) {
            $('#qunit-fixture').addClass('qunit-fixture-visible');

            try {
                const tasks = [
                    { text: 'Task', startDate: new Date(2015, 2, 15), endDate: new Date(2015, 2, 15, 0, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentView: 'week',
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    editing: true,
                    _draggingMode: draggingMode,
                });

                this.scheduler.appointmentList[0].drag.toCell(1);

                assert.deepEqual(tasks[0].startDate, new Date(2015, 2, 16), 'Start date is correct');
                assert.deepEqual(tasks[0].endDate, new Date(2015, 2, 16, 0, 30), 'End date is correct');
            } finally {
                $('#qunit-fixture').removeClass('qunit-fixture-visible');
            }
        });
    });

    supportedScrollingModes.forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, {
            beforeEach: function() {
                this.createInstance = function(options) {
                    this.instance = $('#scheduler').dxScheduler($.extend(options,
                        {
                            _draggingMode: 'default',
                            height: options && options.height || 600,
                            scrolling: {
                                mode: scrollingMode
                            }
                        })
                    ).dxScheduler('instance');

                    this.clock.tick(300);

                    this.scheduler = new SchedulerTestWrapper(this.instance);

                    if(scrollingMode === 'virtual') {
                        const workspace = this.instance.getWorkSpace();
                        workspace.renderer.getRenderTimeout = () => -1;
                    }
                };
            }
        }, () => {
            test('Appointment should be returned back if an error occurs during drag (T453486)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: {
                        load: function() {
                            return [{
                                text: 'a',
                                startDate: new Date(2015, 4, 13, 8),
                                endDate: new Date(2015, 4, 13, 9, 30)
                            }];
                        },
                        update: function() {
                            throw new Error('An error occured');
                        }
                    }
                });

                let $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const initialPosition = $appointment.position();

                assert.throws(function() {
                    this.scheduler.appointmentList[0].drag.toCell(16);
                }, function(err) {
                    $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                    const updatedPosition = $appointment.position();

                    assert.roughEqual(updatedPosition.top, initialPosition.top, 0.5, 'Top is OK');
                    assert.roughEqual(updatedPosition.left, initialPosition.left, 0.5, 'Left is OK');
                    assert.equal(err.message, 'An error occured', 'Error message is OK');
                    assert.notOk($appointment.hasClass('dx-draggable-dragging'), 'appointment hasn\'t \'dx-draggable-dragging\' class');

                    return true;
                }.bind(this));
            });

            test('Appointment should be returned back if the "update" method rejects deferred during drag (T453486)', function(assert) {
                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: {
                        load: function() {
                            return [{
                                text: 'a',
                                startDate: new Date(2015, 4, 13, 8),
                                endDate: new Date(2015, 4, 13, 9, 30)
                            }];
                        },
                        update: function() {
                            return $.Deferred().reject('An error occured');
                        }
                    }
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const initialPosition = $appointment.position();

                this.scheduler.appointmentList[0].drag.toCell(16);

                const updatedPosition = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0).position();

                assert.equal(updatedPosition.top, initialPosition.top, 'Top is OK');
                assert.equal(updatedPosition.left, initialPosition.left, 'Left is OK');
            });

            test('Appointment should be dragged correctly between the groups in vertical grouped workspace Month', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 16, 12),
                        endDate: new Date(2018, 2, 16, 12, 30),
                        id: 1
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    editing: true,
                    currentView: 'month',
                    groups: ['id'],
                    resources: [
                        {
                            field: 'id',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    height: 1500,
                    width: 600
                });

                const { scheduler } = this;

                const appointment = scheduler.appointmentList[0];
                appointment.drag.toCell(54);

                const appointmentData = appointment.data;

                assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 9, 12), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 9, 12, 30), 'End date is correct');
                assert.deepEqual(appointmentData.id, 2, 'Group is OK');
            });

            test('Long appt parts should have correct coordinates after drag to the last row cell in vertical grouped workspace Month', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 4, 12),
                        endDate: new Date(2018, 2, 5, 13, 30),
                        id: 1
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    editing: true,
                    currentView: 'month',
                    groups: ['id'],
                    resources: [
                        {
                            field: 'id',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    width: 600
                });

                const { scheduler } = this;

                const appointment = scheduler.appointmentList[0];
                appointment.drag.toCell(6);

                const $secondPart = scheduler.appointmentList[1];
                const cellPosition = scheduler.workSpace.getCell(6).position();

                assert.roughEqual(appointment.position.left, cellPosition.left, 2, 'correct left position');
                assert.roughEqual($secondPart.position.left, 0, 0.1, 'second part has correct left position');
            });

            test('Appointment should be dragged correctly in grouped timeline (T739132)', function(assert) {
                const data = new DataSource({
                    store: [{
                        'text': 'Google AdWords Strategy',
                        'ownerId': [2],
                        'startDate': new Date(2017, 4, 2, 9, 0),
                        'endDate': new Date(2017, 4, 2, 10, 30),
                        'priority': 1
                    }]
                });

                const priorityData = [
                    {
                        text: 'Low Priority',
                        id: 1,
                        color: '#1e90ff'
                    }, {
                        text: 'High Priority',
                        id: 2,
                        color: '#ff9747'
                    }
                ];

                this.createInstance({
                    dataSource: data,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    currentDate: new Date(2017, 4, 1),
                    startDayHour: 8,
                    endDayHour: 20,
                    cellDuration: 60,
                    editing: true,
                    groups: ['priority'],
                    resources: [{
                        fieldExpr: 'priority',
                        allowMultiple: false,
                        dataSource: priorityData,
                        label: 'Priority'
                    }]
                });

                this.clock.tick(10);

                const updatedItem = {
                    'text': 'Google AdWords Strategy',
                    'ownerId': [2],
                    'startDate': new Date(2017, 4, 1, 9, 0),
                    'endDate': new Date(2017, 4, 1, 10, 30),
                    'priority': 1
                };

                this.scheduler.appointmentList[0].drag.toCell(0);

                const dataSourceItem = this.instance.option('dataSource').items()[0];

                this.clock.tick(10);
                assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
                assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
            });

            test('Appointment should not be updated if it is dropped to the initial cell (month view)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    currentView: 'month',
                    firstDayOfWeek: 0,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 8, 7),
                        endDate: new Date(2015, 1, 9, 8, 37)
                    }]
                });

                this.scheduler.appointmentList[0].drag.toCell(8);

                this.clock.tick(10);

                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 9, 8, 7), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 9, 8, 37), 'End date is correct');
            });

            test('Appointment should be updated correctly if it is dropped to the neighbor cell (month view)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    editing: true,
                    currentView: 'month',
                    firstDayOfWeek: 0,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 8, 0),
                        endDate: new Date(2015, 1, 9, 9, 0),
                    }]
                });

                this.scheduler.appointmentList[0].drag.toCell(9);

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 10, 8, 0), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 10, 9, 0), 'End date is correct');
            });

            test('Dropping appointment should keep predefined hours (month view)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 4, 13, 10),
                        endDate: new Date(2015, 4, 13, 17)
                    }]
                });

                this.scheduler.appointmentList[0].drag.toCell(16);

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 4, 12, 10), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 4, 12, 17), 'End date is correct');
            });

            test('Dropping appointment to the neighbor cell (month view) with predefined start & end day hours', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 4, 13, 8),
                        endDate: new Date(2015, 4, 13, 9, 30)
                    }]
                });

                this.scheduler.appointmentList[0].drag.toCell(16);

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 4, 12, 8), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 4, 12, 9, 30), 'End date is correct');
            });

            // TODO: also need test when task is dragging outside the area. updated dates should be equal to old dates
            test('Task dragging', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });

                this.clock.tick(10);

                const updatedItem = {
                    text: 'Task 1',
                    startDate: new Date(2015, 1, 9, 2, 30),
                    endDate: new Date(2015, 1, 9, 3, 30),
                    allDay: false
                };

                this.scheduler.appointmentList[0].drag.toCell(5);

                const dataSourceItem = this.instance.option('dataSource').items()[0];

                this.clock.tick(10);
                assert.equal(dataSourceItem.text, updatedItem.text, 'New data is correct');
                assert.equal(dataSourceItem.allDay, updatedItem.allDay, 'New data is correct');
                assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
                assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
            });

            [false, true].forEach(function(forceIsoDateParsing) {
                test('Drag task that contains timestamps when forceIsoDateParsing is ' + forceIsoDateParsing, function(assert) {
                    const defaultForceIsoDateParsing = config().forceIsoDateParsing;

                    try {
                        config().forceIsoDateParsing = forceIsoDateParsing;

                        const data = new DataSource({
                            store: [
                                {
                                    text: 'Task 1',
                                    startDate: new Date(2015, 1, 9).getTime(),
                                    endDate: new Date(2015, 1, 9, 1).getTime()
                                }
                            ]
                        });

                        this.createInstance({
                            currentDate: new Date(2015, 1, 9),
                            dataSource: data,
                            editing: true,
                            allDayExpr: 'AllDay'
                        });

                        this.clock.tick(10);

                        const updatedItem = {
                            text: 'Task 1',
                            startDate: forceIsoDateParsing ? new Date(2015, 1, 9, 2, 30).getTime() : new Date(2015, 1, 9, 2, 30),
                            endDate: forceIsoDateParsing ? new Date(2015, 1, 9, 3, 30).getTime() : new Date(2015, 1, 9, 3, 30),
                            AllDay: false
                        };

                        this.scheduler.appointmentList[0].drag.toCell(5);

                        this.clock.tick(10);

                        const dataSourceItem = this.instance.option('dataSource').items()[0];

                        assert.equal(dataSourceItem.text, updatedItem.text, 'New data is correct');
                        assert.equal(dataSourceItem.AllDay, updatedItem.AllDay, 'New data is correct');
                        assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
                        assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
                    } finally {
                        config().forceIsoDateParsing = defaultForceIsoDateParsing;
                    }
                });
            });

            test('Appointment should have correct position while dragging from group', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: ['week'],
                    currentView: 'week',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: { id: 1 }
                    }],
                    groups: ['ownerId.id'],
                    resources: [
                        {
                            field: 'ownerId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    width: 800
                });

                this.scheduler.appointmentList[0].drag.toCell(7);

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 5, 0), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 5, 0, 30), 'End date is correct');
                assert.deepEqual(appointmentData.ownerId, { id: 2 }, 'Resources is correct');
            });

            test('Appointment should have correct position while dragging from group, vertical grouping', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: [{
                        type: 'week',
                        name: 'Week',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'week',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 7, 10),
                        endDate: new Date(2015, 6, 7, 10, 30),
                        ownerId: { id: 2 },
                        roomId: { id: 1 }
                    }],
                    startDayHour: 9,
                    endDayHour: 12,
                    groups: ['ownerId.id', 'roomId.id'],
                    resources: [
                        {
                            field: 'ownerId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        },
                        {
                            field: 'roomId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'room one' },
                                { id: 2, text: 'room two' }
                            ]
                        }
                    ],
                    width: 800,
                    height: 700
                });
                const $appointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).eq(0);

                const startPosition = $appointment.offset();

                const pointer = pointerMock($appointment).start().down().move(10, 10);

                const $draggedAppointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).parent().eq(0);

                assert.roughEqual(translator.locate($draggedAppointment).top, startPosition.top + 10, 1.5, 'Start position is correct');
                assert.roughEqual(translator.locate($draggedAppointment).left, startPosition.left + 10, 1.5, 'Start position is correct');

                $(this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS)).eq(7).trigger(dragEvents.enter);
                pointer.up();

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 5, 9, 30), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 5, 10, 0), 'End date is correct');
                assert.deepEqual(appointmentData.ownerId, { id: 1 }, 'Resources is correct');
            });

            test('Appointment should have correct position while dragging into allDay panel, vertical grouping', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: [{
                        type: 'week',
                        name: 'Week',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'week',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 7, 10),
                        endDate: new Date(2015, 6, 7, 10, 30),
                        ownerId: { id: 2 }
                    }],
                    startDayHour: 9,
                    endDayHour: 12,
                    groups: ['ownerId.id'],
                    resources: [
                        {
                            field: 'ownerId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    width: 800
                });

                const $appointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).eq(0);
                const startPosition = $appointment.offset();

                const pointer = pointerMock($appointment).start().down().move(10, 10);

                const $draggedAppointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).parent().eq(0);

                assert.roughEqual(translator.locate($draggedAppointment).top, startPosition.top + 10, 2.1, 'Start position is correct');
                assert.roughEqual(translator.locate($draggedAppointment).left, startPosition.left + 10, 1.5, 'Start position is correct');

                $(this.instance.$element().find('.dx-scheduler-all-day-table-cell')).eq(11).trigger(dragEvents.enter);
                pointer.up();

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 9, 0), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 9, 0, 30), 'End date is correct');
                assert.deepEqual(appointmentData.ownerId, { id: 2 }, 'Resources is correct');
            });

            test('Appointment should have correct coordinates after drag if onAppointmentUpdating is canceled (T813826)', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    editing: true,
                    views: ['workWeek'],
                    currentView: 'workWeek',
                    dataSource: [{
                        text: 'Test appointment',
                        priorityId: 1,
                        startDate: new Date(2015, 4, 25, 14, 30),
                        endDate: new Date(2015, 4, 25, 15, 30),
                        recurrenceRule: 'FREQ=YEARLY'
                    }],
                    groups: ['priorityId'],
                    resources: [
                        {
                            fieldExpr: 'priorityId',
                            allowMultiple: false,
                            dataSource: [
                                { text: 'Low Priority', id: 1 },
                                { text: 'High Priority', id: 2 }
                            ],
                            label: 'Priority'
                        }
                    ],
                    onAppointmentUpdating: function(e) {
                        e.cancel = true;
                    },
                    width: 800,
                    height: 1100
                });
                const $appointment = this.scheduler.appointments.getAppointment(0);
                const oldAppointmentCoords = translator.locate($appointment);

                this.scheduler.appointmentList[0].drag.toCell(7);

                this.scheduler.appointmentForm.clickFormDialogButton(1);

                const newAppointmentCoords = translator.locate(this.scheduler.appointments.getAppointment(0));

                assert.deepEqual(oldAppointmentCoords, newAppointmentCoords, 'Appointment has correct coords');

                this.clock.tick(10);
            });

            test('Appointment should push correct data to the onAppointmentUpdating event on changing group by dragging', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    editing: true,
                    views: ['workWeek'],
                    currentView: 'workWeek',
                    dataSource: [{
                        text: 'Test appointment',
                        priorityId: 1,
                        startDate: new Date(2015, 4, 25, 14, 30),
                        endDate: new Date(2015, 4, 25, 15, 30)
                    }],
                    groups: ['priorityId'],
                    resources: [
                        {
                            fieldExpr: 'priorityId',
                            allowMultiple: false,
                            dataSource: [
                                { text: 'Low Priority', id: 1 },
                                { text: 'High Priority', id: 2 }
                            ],
                            label: 'Priority'
                        }
                    ],
                    onAppointmentUpdating: function(e) {},
                    width: 800,
                    height: 1500
                });

                const stub = sinon.stub(this.instance.option(), 'onAppointmentUpdating');

                this.scheduler.appointmentList[0].drag.toCell(7);

                const result = stub.getCall(0).args[0];

                assert.equal(result.oldData.priorityId, 1, 'Appointment was located in the first group');
                assert.equal(result.newData.priorityId, 2, 'Appointment located in the second group now');

                this.clock.tick(10);
            });

            test('Appointment should not be updated if it is dropped to the initial cell (week view)', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 0, 7),
                        endDate: new Date(2015, 1, 9, 0, 37)
                    }]
                });

                this.scheduler.appointmentList[0].drag.toCell(1);

                this.clock.tick(10);
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 9, 0, 7), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 9, 0, 37), 'End date is correct');
            });
        });
    });
});
