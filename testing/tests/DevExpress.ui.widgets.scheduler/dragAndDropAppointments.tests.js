import fx from 'animation/fx';
import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import browser from 'core/utils/browser';
import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment
} from './helpers.js';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const {
    testStart,
    test,
    module
} = QUnit;

testStart(() => initTestMarkup());

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

const moduleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
};

module('Drag and drop appointments', moduleConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }

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

    const priorityData = [{
        text: 'Low Priority',
        id: 1,
        color: '#1e90ff'
    }, {
        text: 'High Priority',
        id: 2,
        color: '#ff9747'
    }];

    const getAbsolutePosition = appointment => appointment.offset();

    module('Appointment should move a same distance in dragging from tooltip case', () => {
        const data = [
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
        ];

        const createScheduler = (views) => {
            return createWrapper({
                dataSource: $.extend(true, [], data),
                views: views,
                currentView: views[0].name,
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                width: 800,
                height: 600,
                groups: ['priorityId'],
                resources: [{
                    fieldExpr: 'priorityId',
                    dataSource: priorityData,
                    label: 'Priority'
                }]
            });
        };

        const scrollToButton = (scheduler, button) => {
            const scrollContainer = scheduler.workSpace.getDataTableScrollableContainer();

            scrollContainer.scrollTop($(button).offset().top - scrollContainer.offset().top);
            scrollContainer.scrollLeft($(button).offset().left - scrollContainer.offset().left);
        };

        const getFakeAppointmentPosition = scheduler => {
            const fakeAppointment = scheduler.appointments.compact.getFakeAppointment();
            const position = getAbsolutePosition(fakeAppointment.parent());

            return {
                left: position.left + fakeAppointment.width() / 2,
                top: position.top + fakeAppointment.height() / 2
            };
        };

        const createMousePosition = (compactAppointment) => {
            const position = getAbsolutePosition(compactAppointment);

            return {
                x: position.left + compactAppointment.width() / 2,
                y: position.top + compactAppointment.height() / 2
            };
        };

        const testViews = (views, assert) => {
            const scheduler = createScheduler(views);

            commonViews.forEach(view => {
                scheduler.option('currentView', view.name);

                [false, true].forEach(rtlEnabled => {
                    scheduler.option('rtlEnabled', rtlEnabled);
                    scheduler.option('dataSource', $.extend(true, [], data));

                    testFakeAppointmentPosition(scheduler, scheduler.appointments.compact.getButton(0), 0, view.name, rtlEnabled, assert);
                });
            });
        };

        const testFakeAppointmentPosition = (scheduler, button, index, viewName, rtlEnabled, assert) => {
            const dragOffset = { left: 100, top: 100 };

            scrollToButton(scheduler, button);
            scheduler.appointments.compact.click(index);

            const compactAppointment = scheduler.appointments.compact.getAppointment();
            const mousePosition = createMousePosition(compactAppointment);

            const pointer = pointerMock(compactAppointment).start();

            pointer
                .down(mousePosition.x, mousePosition.y)
                .move(dragOffset.left, dragOffset.top);

            const fakeAppointmentPosition = getFakeAppointmentPosition(scheduler);

            assert.roughEqual(Math.round(fakeAppointmentPosition.left - dragOffset.left), Math.round(mousePosition.x), 1.1,
                `appointment should have correct left position in ${viewName} and rtlEnable=${rtlEnabled}`);
            assert.roughEqual(Math.round(fakeAppointmentPosition.top - dragOffset.top), Math.round(mousePosition.y), 1.1,
                `appointment should have correct top position in ${viewName} and rtlEnable=${rtlEnabled}`);

            pointer
                .up();
        };

        test('in common views', function(assert) { testViews(commonViews, assert); });
        test('in time line views', function(assert) { testViews(timeLineViews, assert); });
        test('in group views', function(assert) { testViews(groupViews, assert); });
    });

    module('Appointment should move a same distance as mouse', () => {
        const createScheduler = views => {
            return createWrapper({
                dataSource: $.extend(true, [], data),
                width: 850,
                height: 600,
                views: views,
                currentView: views[0].name,
                crossScrollingEnabled: true,
                currentDate: new Date(2018, 4, 21),
                startDayHour: 9,
                endDayHour: 16,
                groups: ['priorityId'],
                resources: [{
                    fieldExpr: 'priorityId',
                    dataSource: priorityData,
                    label: 'Priority'
                }]
            });
        };

        const data = [{
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
        }];

        const dragCases = [
            {
                top: 20,
                left: 20
            }, {
                top: -10,
                left: 5
            }
        ];

        const testAppointmentPosition = (scheduler, text, rtlEnabled, dragCase, viewName, assert) => {
            const appointment = scheduler.appointments.find(text);

            const positionBeforeDrag = getAbsolutePosition(appointment);
            const pointer = pointerMock(appointment).start();
            pointer
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(dragCase.left, dragCase.top);

            const positionAfterDrag = getAbsolutePosition(appointment);

            pointer
                .up();

            assert.equal(positionAfterDrag.left - positionBeforeDrag.left, dragCase.left,
                `appointment '${text}' should have correct left position in ${viewName} and rtlEnabled=${rtlEnabled}`);
            assert.equal(positionAfterDrag.top - positionBeforeDrag.top, dragCase.top,
                `appointment '${text}' should have correct top position in ${viewName} and rtlEnabled=${rtlEnabled}`);
        };

        const testViews = (views, assert) => {
            const scheduler = createScheduler(views);

            views.forEach(view => {
                scheduler.option('currentView', view.name);

                [false, true].forEach(rtlEnabled => {
                    const items = $.extend(true, [], data);
                    scheduler.option('rtlEnabled', rtlEnabled);
                    scheduler.option('dataSource', items);

                    dragCases.forEach(dragCase =>
                        items.forEach(({ text }) => testAppointmentPosition(scheduler, text, rtlEnabled, dragCase, view.name, assert))
                    );
                });
            });
        };

        test('in common views', function(assert) { testViews(commonViews, assert); });
        test('in time line views', function(assert) { testViews(timeLineViews, assert); });
        test('in group views', function(assert) { testViews(groupViews, assert); });
    });

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

        assert.equal(phantomAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), '1:00 AM', 'Appointment start is correct');
        assert.equal(phantomAppointment.find('.dx-scheduler-appointment-content-date').eq(2).text(), '2:00 AM', 'Appointment edn is correct');

        pointer.dragEnd();
    });

    QUnit.test('Appointment should move to the first cell from tooltip case', function(assert) {
        const scheduler = createWrapper({
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

    QUnit.test('Appointment shouldn\'t move to the cell from tooltip case if it is disabled', function(assert) {
        const scheduler = createWrapper({
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

    QUnit.test('The recurring appointment should have correct position when dragging', function(assert) {
        const scheduler = createWrapper({
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
                .move(150, 0)
                .up();

            const positionAfterDrag = getAbsolutePosition($appointment);

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

        pointer.up();

        $appointment = scheduler.appointments.find('Task 1').first();
        let positionAfterDrag = getAbsolutePosition($appointment);

        assert.deepEqual(positionAfterDrag, {
            left: positionBeforeDrag.left + cellWidth,
            top: positionBeforeDrag.top
        }, 'appointment position is correct');
        assert.ok($appointment.hasClass('dx-draggable-dragging'), 'appointment is dragging');

        this.clock.tick(30); // waiting for data update

        $appointment = scheduler.appointments.find('Task 1').first();
        positionAfterDrag = getAbsolutePosition($appointment);

        assert.deepEqual(positionAfterDrag, {
            left: positionBeforeDrag.left + cellWidth,
            top: positionBeforeDrag.top
        }, 'appointment position is correct');
        assert.ok($appointment.hasClass('dx-draggable-dragging'), 'appointment is dragging');

        this.clock.tick(30); // waiting for data loading

        $appointment = scheduler.appointments.find('Task 1').first();
        positionAfterDrag = getAbsolutePosition($appointment);

        assert.deepEqual(positionAfterDrag, {
            left: positionBeforeDrag.left + cellWidth,
            top: positionBeforeDrag.top
        }, 'appointment position is correct');
        assert.notOk($appointment.hasClass('dx-draggable-dragging'), 'appointment isn\'t dragging');
    });

    // T832754
    QUnit.test('The appointment should be dropped correctly after pressing Esc key', function(assert) {
        const scheduler = createWrapper({
            editing: true,
            height: 600,
            views: [{ type: 'day' }],
            currentView: 'day',
            dataSource: [{
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 11, 30)
            }],
            currentDate: new Date(2015, 1, 9),
            startDayHour: 9
        });

        let $appointment = scheduler.appointments.find('Task 1').first();
        const positionBeforeDrag = getAbsolutePosition($appointment);
        const pointer = pointerMock($appointment).start();
        const cellHeight = scheduler.workSpace.getCellHeight();

        pointer
            .down(positionBeforeDrag.left, positionBeforeDrag.top)
            .move(0, -cellHeight);

        keyboardMock($appointment.get(0)).keyDown('esc');

        pointer.up();

        $appointment = scheduler.appointments.find('Task 1').first();
        const positionAfterDrag = getAbsolutePosition($appointment);

        assert.deepEqual(positionAfterDrag, {
            left: positionBeforeDrag.left,
            top: positionBeforeDrag.top - cellHeight
        }, 'appointment position is correct');
        assert.deepEqual(scheduler.option('dataSource')[0].startDate, new Date(2015, 1, 9, 10, 30), 'Start date is OK');
    });

    module('appointmentDragging customization', () => {
        const createScheduler = options => {
            return createWrapper($.extend(true, {}, {
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
                endDayHour: 16
            }, options));
        };

        const createDraggable = (options, data) => {
            return $('<div>')
                .css({ width: 100, height: 100 })
                .appendTo('#qunit-fixture')
                .dxDraggable($.extend({
                    clone: true,
                    onDragStart: function(e) {
                        e.itemData = data;
                    }
                }, options));
        };

        test('Event calls on appointment drag', function(assert) {
            const appointmentDragging = {
                onDragStart: sinon.spy(),
                onDragEnd: sinon.spy(),
                onAdd: sinon.spy(),
                onRemove: sinon.spy()
            };

            const scheduler = createScheduler({
                appointmentDragging
            });

            const dataSource = scheduler.instance.option('dataSource');
            const appointment = scheduler.appointments.find('App 1');
            const positionBeforeDrag = getAbsolutePosition(appointment);
            const pointer = pointerMock(appointment).start();

            pointer
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(0, 50);

            const positionAfterDrag = getAbsolutePosition(appointment);

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

            const scheduler = createScheduler({
                appointmentDragging
            });

            const dataSource = scheduler.instance.option('dataSource');
            const appointment = scheduler.appointments.find('App 1');
            const positionBeforeDrag = getAbsolutePosition(appointment);
            const pointer = pointerMock(appointment).start();

            pointer
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(0, 50);

            const positionAfterDrag = getAbsolutePosition(appointment);

            pointer.up();

            assert.strictEqual(positionAfterDrag.top, positionBeforeDrag.top, 'appointment position is not changed');
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

            const scheduler = createScheduler({
                appointmentDragging
            });

            const dataSource = scheduler.instance.option('dataSource');
            const appointment = scheduler.appointments.find('App 1');
            const positionBeforeDrag = getAbsolutePosition(appointment);
            const pointer = pointerMock(appointment).start();

            pointer
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(0, 50);

            const positionAfterDrag = getAbsolutePosition(appointment);

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

            const scheduler = createScheduler({
                appointmentDragging
            });

            const draggableData = { text: 'App from Draggable' };

            const draggable = createDraggable({ group: group }, draggableData);

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

            const scheduler = createScheduler({
                appointmentDragging
            });

            const draggable = createDraggable({ group: group });

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

        test('Move appointment to Draggable from tooltip', function(assert) {
            const group = 'testGroup';

            const appointmentDragging = {
                group,
                onRemove: sinon.spy(e => {
                    e.component.deleteAppointment(e.itemData);
                })
            };

            const scheduler = createScheduler({
                appointmentDragging
            });

            const draggable = createDraggable({ group: group });

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
            const $dragElement = createDraggable({ clone: false, group: group }, itemData);
            const scheduler = createScheduler({
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
                endDate: new Date(2018, 4, 21, 9, 30)
            }, 'added appointment data');
        });
    });
});
