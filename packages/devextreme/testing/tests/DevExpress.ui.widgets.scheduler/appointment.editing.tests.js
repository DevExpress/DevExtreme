import { getOuterWidth, getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import { noop } from 'core/utils/common';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import { hide } from '__internal/ui/tooltip/m_tooltip';
import { DataSource } from 'common/data/data_source/data_source';
import { Deferred } from 'core/utils/deferred';
import {
    initTestMarkup,
    createWrapper
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';

const {
    module,
    test,
    testStart,
} = QUnit;

testStart(() => initTestMarkup());

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';

module('Integration: Appointment editing', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = (options) => {
            const scheduler = createWrapper({
                height: 600,
                ...options,
            });

            this.clock.tick(300);
            scheduler.instance.focus();

            return scheduler;
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
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    [
        'standard',
        'virtual'
    ].forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, {
            beforeEach: function() {
                const createInstance = this.createInstance.bind(this);
                this.createInstance = options => {
                    options = options || {};
                    $.extend(
                        true,
                        options,
                        {
                            scrolling: {
                                mode: scrollingMode
                            }
                        }
                    );

                    const scheduler = createInstance(options);

                    if(scrollingMode === 'virtual') {
                        const workspace = scheduler.instance.getWorkSpace();
                        workspace.renderer.getRenderTimeout = () => -1;
                    }

                    return scheduler;
                };
            }
        }, () => {
            test('Scheduler appointment popup should correctly update recurrence appointment', function(assert) {
                const tasks = [{
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
                }];

                const scheduler = this.createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    recurrenceEditMode: 'series',
                    views: ['month'],
                    startDateExpr: 'start',
                    endDateExpr: 'end'
                });

                scheduler.appointments.dblclick(0);

                const form = scheduler.instance.getAppointmentDetailsForm();
                const repeatSwitch = form.getEditor('repeat');
                repeatSwitch.option('value', false);

                scheduler.appointmentPopup.clickDoneButton();

                assert.deepEqual(scheduler.instance.option('dataSource')[0], {
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: ''
                }, 'Appointment was updated correctly');
            });

            test('updateAppointment method should be called with right args when task was resized, timelineMonth view', function(assert) {
                const data = [{
                    text: 'Task 1',
                    startDate: new Date(2015, 1, 2, 1),
                    endDate: new Date(2015, 1, 2, 2)
                }];

                const scheduler = this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: data,
                    editing: true,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth'
                });

                this.clock.tick(10);

                const updateAppointment = scheduler.instance._updateAppointment;
                const spy = sinon.spy(noop);
                const oldItem = data[0];

                scheduler.instance._updateAppointment = spy;

                const cellWidth = getOuterWidth(scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0));

                try {
                    const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
                    pointer.dragStart().drag(cellWidth, 0).dragEnd();

                    assert.ok(spy.calledOnce, 'Update method is called');
                    assert.deepEqual(spy.getCall(0).args[0], oldItem, 'Target item is correct');
                    assert.deepEqual(spy.getCall(0).args[1], $.extend(true, oldItem, { endDate: new Date(2015, 1, 3, 2, 0) }), 'New data is correct');
                } finally {
                    scheduler.instance._updateAppointment = updateAppointment;
                }
            });

            test('updateAppointment method should be called when task was resized', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                const scheduler = this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });

                this.clock.tick(10);

                const updateAppointment = scheduler.instance._updateAppointment;
                const spy = sinon.spy(noop);
                const oldItem = this.tasks[0];

                scheduler.instance._updateAppointment = spy;

                const cellHeight = getOuterHeight(scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0));
                const hourHeight = cellHeight * 2;

                try {
                    const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
                    pointer.dragStart().drag(0, hourHeight).dragEnd();

                    assert.ok(spy.calledOnce, 'Update method is called');
                    assert.deepEqual(spy.getCall(0).args[0], oldItem, 'Target item is correct');
                    assert.deepEqual(spy.getCall(0).args[1], $.extend(true, oldItem, { endDate: new Date(2015, 1, 9, 3, 0) }), 'New data is correct');
                } finally {
                    scheduler.instance._updateAppointment = updateAppointment;
                }
            });

            test('Add new appointment', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                const scheduler = this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
                const addAppointment = scheduler.instance.addAppointment;
                const spy = sinon.spy(() => new Deferred());
                const newItem = { startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' };
                scheduler.instance.addAppointment = spy;
                try {
                    scheduler.instance.showAppointmentPopup(newItem, true);

                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(spy.calledOnce, 'Add method is called');
                    assert.deepEqual(spy.getCall(0).args[0], newItem, 'New item is correct');
                } finally {
                    scheduler.instance.addAppointment = addAppointment;
                }
            });

            test('Add new appointment with delay(T381444)', function(assert) {
                const done = assert.async();
                const data = [];

                this.clock.restore();

                const dataSource = new DataSource({
                    load: function() {
                        return data;
                    },
                    insert: function(appt) {
                        const d = $.Deferred();

                        setTimeout(function() {
                            assert.ok(popup.option('visible'), 'Popup is visible');

                            data.push(appt);
                            d.resolve(appt);

                            assert.notOk(popup.option('visible'), 'Popup isn\'t visible');
                            done();

                        }, 50);

                        return d.promise();
                    }
                });

                const scheduler = this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: dataSource });

                scheduler.instance.showAppointmentPopup({
                    startDate: new Date(2015, 1, 1, 1),
                    endDate: new Date(2015, 1, 1, 2),
                    text: 'caption'
                }, true);

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const popup = scheduler.instance._appointmentPopup.popup;
            });

            test('Add new appointment with delay and an error(T381444)', function(assert) {
                const done = assert.async();
                const data = [];

                this.clock.restore();

                const dataSource = new DataSource({
                    load: function() {
                        return data;
                    },
                    insert: function(appt) {
                        const d = $.Deferred();

                        setTimeout(function() {
                            assert.ok(popup.option('visible'), 'Popup is visible');
                            d.reject();
                            assert.ok(popup.option('visible'), 'Popup is still visible');
                            done();
                        }, 100);

                        return d.promise();
                    }
                });

                const scheduler = this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: dataSource });

                scheduler.instance.showAppointmentPopup({
                    startDate: new Date(2015, 1, 1, 1),
                    endDate: new Date(2015, 1, 1, 2),
                    text: 'caption'
                }, true);

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const popup = scheduler.instance._appointmentPopup.popup;
            });

            // TODO: update editors in popup
            test('Update appointment', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                const scheduler = this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

                this.clock.tick(10);

                const updateAppointment = scheduler.instance.updateAppointment;
                const spy = sinon.spy(() => new Deferred());
                const updatedItem = this.tasks[0];
                scheduler.instance.updateAppointment = spy;
                try {
                    scheduler.instance.showAppointmentPopup(updatedItem);

                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    hide();

                    assert.ok(spy.calledOnce, 'Update method is called');
                    assert.deepEqual(spy.getCall(0).args[0], updatedItem, 'Target item is correct');
                    assert.deepEqual(spy.getCall(0).args[1], updatedItem, 'New data is correct');
                } finally {
                    scheduler.instance.updateAppointment = updateAppointment;
                }
            });

            test('Scheduler should add only one appointment at multiple "done" button clicks on appointment form', function(assert) {
                const a = { text: 'a', startDate: new Date(2017, 7, 9), endDate: new Date(2017, 7, 9, 0, 15) };
                const scheduler = createWrapper({
                    dataSource: [],
                    currentDate: new Date(2017, 7, 9),
                    currentView: 'week',
                    views: ['week'],
                    onAppointmentAdding: function(e) {
                        const d = $.Deferred();

                        window.setTimeout(function() {
                            d.resolve();
                        }, 300);

                        e.cancel = d.promise();
                    }
                });
                const appointmentPopup = scheduler.appointmentPopup;

                scheduler.instance.showAppointmentPopup(a, true);

                appointmentPopup.clickDoneButton();
                appointmentPopup.clickDoneButton();

                this.clock.tick(300);

                assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'right appointment quantity');
            });
        });

        module(`Scroll after Editing if ${scrollingMode} scrolling mode`, () => {
            const createScheduler = (options = {}) => {
                return createWrapper({
                    scrolling: { mode: scrollingMode },
                    currentDate: new Date('2020-09-06T00:00:00'),
                    height: 500,
                    width: 500,
                    crossScrollingEnabled: true,
                    resources: [{
                        fieldExpr: 'ownerId',
                        dataSource: [{
                            id: 1, text: 'A',
                        }, {
                            id: 2, text: 'B',
                        }]
                    }],
                    ...options,
                });
            };

            const checkThatScrollToWasCalled = (assert, scheduler, appointment) => {
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollTo = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    scheduler.appointmentPopup.clickDoneButton();

                    assert.ok(scrollTo.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            };

            const checkThatScrollToWasNotCalled = (assert, scheduler, appointment) => {
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollTo = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    scheduler.appointmentPopup.clickDoneButton();

                    assert.notOk(scrollTo.calledOnce, 'scrollTo was not called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            };

            [{
                view: 'week',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'month',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'timelineWeek',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'timelineMonth',
                startDate: new Date('2020-09-01T00:00:00'),
                endDate: new Date('2020-09-01T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'week',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'vertical',
            }, {
                view: 'month',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'vertical',
            }, {
                view: 'timelineWeek',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'vertical',
            }, {
                view: 'timelineMonth',
                startDate: new Date('2020-09-01T00:00:00'),
                endDate: new Date('2020-09-01T01:00:00'),
                groupOrientation: 'vertical',
            }].forEach(({ view, startDate, endDate, groupOrientation }) => {
                test(
                    `Scroll position should not be updated if appointment is visible in ${view}, ${groupOrientation} grouping`,
                    function(assert) {
                        const scheduler = createScheduler({
                            views: [{
                                type: view,
                                groupOrientation,
                            }],
                            currentView: view,
                            groups: ['ownerId'],
                            width: 1000,
                        });

                        const appointment = {
                            startDate,
                            endDate,
                            text: 'text',
                            ownerId: 1,
                        };

                        checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                    });
            });

            [{
                view: 'week',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'month',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'timelineWeek',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'timelineMonth',
                startDate: new Date('2020-09-01T00:00:00'),
                endDate: new Date('2020-09-01T01:00:00'),
                groupOrientation: 'horizontal',
            }, {
                view: 'week',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'vertical',
            }, {
                view: 'month',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                groupOrientation: 'vertical',
            }, {
                view: 'timelineWeek',
                startDate: new Date('2020-09-08T00:00:00'),
                endDate: new Date('2020-09-08T01:00:00'),
                groupOrientation: 'vertical',
            }, {
                view: 'timelineMonth',
                startDate: new Date('2020-09-08T00:00:00'),
                endDate: new Date('2020-09-08T01:00:00'),
                groupOrientation: 'vertical',
            }].forEach(({ view, startDate, endDate, groupOrientation }) => {
                test(`Scroll position should be updated if appoinment is not visible in ${view}, ${groupOrientation} grouping`, function(assert) {
                    const scheduler = createScheduler({
                        views: [{
                            type: view,
                            groupOrientation,
                        }],
                        currentView: view,
                        groups: ['ownerId'],
                        scrolling: {
                            orientation: 'vertical'
                        }
                    });

                    const appointment = {
                        startDate,
                        endDate,
                        text: 'text',
                        ownerId: 2,
                    };

                    checkThatScrollToWasCalled(assert, scheduler, appointment);
                });
            });

            [{
                view: 'week',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
            }, {
                view: 'month',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
            }, {
                view: 'timelineWeek',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
            }, {
                view: 'timelineMonth',
                startDate: new Date('2020-09-01T00:00:00'),
                endDate: new Date('2020-09-01T01:00:00'),
            }].forEach(({ view, startDate, endDate }) => {
                test(
                    `Scroll position should not be updated if appointment is visible in ${view}, grouping by date`,
                    function(assert) {
                        const scheduler = createScheduler({
                            views: [{
                                type: view,
                                groupOrientation: 'horizontal',
                                groupByDate: true,
                            }],
                            currentView: view,
                            groups: ['ownerId'],
                            width: 1000,
                        });

                        const appointment = {
                            startDate,
                            endDate,
                            text: 'text',
                            ownerId: 1,
                        };

                        checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                    });
            });

            [{
                view: 'week',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
            }, {
                view: 'month',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
            }, {
                view: 'timelineWeek',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
            }, {
                view: 'timelineMonth',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
            }].forEach(({ view, startDate, endDate }) => {
                test(
                    `Scroll position should be updated if appointment is not visible in ${view}, grouping by date`,
                    function(assert) {
                        const scheduler = createScheduler({
                            views: [{
                                type: view,
                                groupOrientation: 'horizontal',
                                groupByDate: true,
                            }],
                            currentView: view,
                            groups: ['ownerId'],
                        });

                        const appointment = {
                            startDate,
                            endDate,
                            text: 'text',
                            ownerId: 2,
                        };

                        checkThatScrollToWasCalled(assert, scheduler, appointment);
                    });
            });

            test('Scroll position should not be updated if appointment is visible in all-day panel',
                function(assert) {
                    const scheduler = createScheduler({
                        views: [{
                            type: 'week',
                            groupOrientation: 'horizontal',
                        }],
                        currentView: 'week',
                        groups: ['ownerId'],
                    });

                    const appointment = {
                        startDate: new Date('2020-09-06T00:00:00'),
                        endDate: new Date('2020-09-06T01:00:00'),
                        text: 'text',
                        ownerId: 1,
                        allDay: true,
                    };

                    checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                });

            test('Scroll position should be updated if appointment is not visible in all-day panel', function(assert) {
                const scheduler = createScheduler({
                    views: [{
                        type: 'week',
                        groupOrientation: 'horizontal',
                    }],
                    currentView: 'week',
                    groups: ['ownerId'],
                });

                const appointment = {
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    text: 'text',
                    ownerId: 2,
                    allDay: true,
                };

                checkThatScrollToWasCalled(assert, scheduler, appointment);
            });

            test('Scroll position should not be updated if appointment is longer that one day and visible', function(assert) {
                const scheduler = createScheduler({
                    views: [{
                        type: 'week',
                        groupOrientation: 'horizontal',
                    }],
                    currentView: 'week',
                    groups: ['ownerId'],
                });

                const appointment = {
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-07T01:00:00'),
                    text: 'text',
                    ownerId: 1,
                };

                checkThatScrollToWasNotCalled(assert, scheduler, appointment);
            });

            test('Scroll position should be updated if appointment is longer that one day and is not visible', function(assert) {
                const scheduler = createScheduler({
                    views: [{
                        type: 'week',
                        groupOrientation: 'horizontal',
                    }],
                    currentView: 'week',
                    groups: ['ownerId'],
                });

                const appointment = {
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-07T01:00:00'),
                    text: 'text',
                    ownerId: 2,
                };

                checkThatScrollToWasCalled(assert, scheduler, appointment);
            });

            [{
                position: 'right',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
                scrollLeft: 0,
                scrollTop: 0,
            }, {
                position: 'left',
                startDate: new Date('2020-09-06T00:00:00'),
                endDate: new Date('2020-09-06T01:00:00'),
                scrollLeft: 2,
                scrollTop: 0,
            }, {
                position: 'top',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
                scrollLeft: 0,
                scrollTop: 2,
            }, {
                position: 'bottom',
                startDate: new Date('2020-09-11T00:00:00'),
                endDate: new Date('2020-09-11T01:00:00'),
                scrollLeft: 0,
                scrollTop: 0,
            }].forEach(({ position, startDate, endDate, scrollLeft, scrollTop }) => {
                test(`Scroll position should be updated if an appointment starts in a partially visible cell, ${position} end`, function(assert) {
                    const scheduler = createScheduler({
                        views: ['week'],
                        currentView: 'week',
                    });

                    const appointment = {
                        startDate,
                        endDate,
                        text: 'text',
                    };
                    const workSpace = scheduler.instance.getWorkSpace();
                    workSpace.getScrollable().scrollTo({ x: scrollLeft, y: scrollTop });

                    checkThatScrollToWasCalled(assert, scheduler, appointment);
                });
            });
        });
    });
});
