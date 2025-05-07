import { getOuterWidth, getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment
} from '../../helpers/scheduler/helpers.js';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import fx from 'common/core/animation/fx';
import translator from 'common/core/animation/translator';
import timeZoneUtils from '__internal/scheduler/m_utils_time_zone';
import { CustomStore } from 'common/data/custom_store';
import { noop } from 'core/utils/common';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'common/core/events/drag';

const { module, test, testStart } = QUnit;

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

module('Events', {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    module('add', () => {
        test('onAppointmentAdding', function(assert) {
            const addingSpy = sinon.spy(noop);

            const scheduler = createWrapper({
                onAppointmentAdding: addingSpy,
                dataSource: []
            });

            const newAppointment = {
                startDate: new Date(2015, 1, 9, 16),
                endDate: new Date(2015, 1, 9, 17),
                text: 'caption'
            };

            scheduler.instance.addAppointment(newAppointment);
            this.clock.tick(10);


            const args = addingSpy.getCall(0).args[0];

            assert.ok(addingSpy.calledOnce, 'onAppointmentAdding was called');
            assert.equal(args.element, scheduler.instance.element(), 'Element field is OK');
            assert.equal(args.component, scheduler.instance, 'Component field is OK');
            assert.strictEqual(args.cancel, false, '\'Cancel\' flag is OK');
            assert.deepEqual(args.appointmentData, newAppointment, 'Appointment field is OK');
        });

        test('Appointment should not be added to the data source if \'cancel\' flag is defined as true', function(assert) {
            const dataSource = new DataSource({
                store: []
            });
            const scheduler = createWrapper({
                onAppointmentAdding: function(args) {
                    args.cancel = true;
                },
                dataSource: dataSource
            });

            scheduler.instance.addAppointment({ startDate: new Date(), text: 'Appointment 1' });
            this.clock.tick(10);

            assert.strictEqual(dataSource.items().length, 0, 'Insert operation is canceled');
        });

        test('Appointment should not be added to the data source if \'cancel\' flag is defined as true during async operation', function(assert) {
            const dataSource = new DataSource({
                store: []
            });
            const scheduler = createWrapper({
                onAppointmentAdding: function(args) {
                    args.cancel = $.Deferred();
                    setTimeout(function() {
                        args.cancel.resolve(true);
                    }, 200);
                },
                dataSource: dataSource
            });

            scheduler.instance.addAppointment({ startDate: new Date(), text: 'Appointment 1' });
            this.clock.tick(200);

            assert.strictEqual(dataSource.items().length, 0, 'Insert operation is canceled');
        });

        test('Appointment should not be added to the data source if \'cancel\' flag is defined as Promise', function(assert) {
            const promise = new Promise(function(resolve) {
                setTimeout(function() {
                    resolve(true);
                }, 200);
            });
            const dataSource = new DataSource({
                store: []
            });
            const scheduler = createWrapper({
                onAppointmentAdding: function(args) {
                    args.cancel = promise;
                },
                dataSource: dataSource
            });

            scheduler.instance.addAppointment({ startDate: new Date(), text: 'Appointment 1' });
            this.clock.tick(200);

            promise.then(function() {
                assert.strictEqual(dataSource.items().length, 0, 'Insert operation is canceled');
            });

            return promise;
        });

        test('onAppointmentAdded', function(assert) {
            const addedSpy = sinon.spy(noop);

            const scheduler = createWrapper({
                onAppointmentAdded: addedSpy,
                dataSource: []
            });

            const newAppointment = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

            scheduler.instance.addAppointment(newAppointment);
            this.clock.tick(10);

            const args = addedSpy.getCall(0).args[0];

            assert.ok(addedSpy.calledOnce, 'onAppointmentAdded was called');
            assert.deepEqual(args.appointmentData, newAppointment, 'Appointment field is OK');
            assert.equal(args.element, scheduler.instance.element(), 'Element field is OK');
            assert.equal(args.component, scheduler.instance, 'Component field is OK');
            assert.strictEqual(args.error, undefined, 'Error field is not defined');
        });

        test('onAppointmentAdded should have error field in args if an error occurs while data inserting', function(assert) {
            const addedSpy = sinon.spy(noop);

            const scheduler = createWrapper({
                onAppointmentAdded: addedSpy,
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: noop,
                        insert: function() {
                            return $.Deferred().reject(new Error('Unknown error occurred'));
                        }
                    })
                })
            });

            scheduler.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' });
            this.clock.tick(10);

            const error = addedSpy.getCall(0).args[0].error;

            assert.ok(error instanceof Error, 'Error field is defined');
            assert.equal(error.message, 'Unknown error occurred', 'Error message is OK');
        });
    });

    module('Update', () => {
        isDesktopEnvironment() && test('oldData shouldn\'t has recurrenceException property', function(assert) {
            const appointment = {
                text: 'Watercolor Landscape',
                startDate: new Date(2021, 1, 25, 1),
                endDate: new Date(2021, 1, 25, 2),
                recurrenceRule: 'FREQ=DAILY'
            };

            const scheduler = createWrapper({
                _draggingMode: 'default',
                dataSource: [appointment],
                currentView: 'day',
                currentDate: new Date(2021, 2, 25),
                height: 600,
                recurrenceEditMode: 'occurrence',
                onAppointmentUpdating: function(e) {
                    assert.deepEqual(e.oldData, appointment, 'oldData argument should be equal initial appointment');
                    assert.equal(typeof (e.newData.recurrenceException), 'string', 'newData argument should has new recurrenceException property');
                }
            });

            scheduler.appointmentList[0].drag.toCell(5);
            assert.expect(2);
        });

        test('onAppointmentUpdating', function(assert) {
            const updatingSpy = sinon.spy(noop);
            const oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: 'title' };

            const scheduler = createWrapper({
                onAppointmentUpdating: updatingSpy,
                dataSource: new DataSource({ store: oldData })
            });

            scheduler.instance.updateAppointment($.extend({}, oldData[0]), newData);
            this.clock.tick(10);

            const args = updatingSpy.getCall(0).args[0];

            assert.ok(updatingSpy.calledOnce, 'onAppointmentUpdating was called');
            assert.equal(args.element, scheduler.instance.element(), 'Element field is OK');
            assert.equal(args.component, scheduler.instance, 'Component field is OK');
            assert.strictEqual(args.cancel, false, '\'Cancel\' flag is OK');
            assert.deepEqual(args.newData, newData, 'newData field is OK');
            assert.deepEqual(args.oldData, oldData[0], 'oldData field is OK');
        });

        test('Appointment should not be updated if \'cancel\' flag is defined as true', function(assert) {
            const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            scheduler.instance.updateAppointment(appointments[0], { startDate: new Date(), text: 'Appointment 1' });
            this.clock.tick(10);

            assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Update operation is canceled');
        });

        test('Appointment form should not be updated if \'cancel\' flag is defined as true (T653358)', function(assert) {
            const tzOffsetStub = sinon.stub(timeZoneUtils, 'getClientTimezoneOffset').returns(-10800000);

            try {
                const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
                const dataSource = new DataSource({
                    store: appointments
                });

                const scheduler = createWrapper({
                    timeZone: 'Etc/UTC',
                    onAppointmentUpdating: function(args) {
                        args.cancel = true;
                    },
                    dataSource: dataSource,
                    currentDate: new Date(2015, 1, 9)
                });

                scheduler.instance.showAppointmentPopup(appointments[0]);
                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                this.clock.tick(10);

                const appointmentForm = scheduler.instance._appointmentPopup.form;

                assert.deepEqual(appointmentForm.formData.startDate, new Date(2015, 1, 9, 13), 'Form data is correct');
            } finally {
                tzOffsetStub.restore();
            }
        });

        test('Appointment should not be updated if \'cancel\' flag is defined as true during async operation', function(assert) {
            const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = $.Deferred();
                    setTimeout(function() {
                        args.cancel.resolve(true);
                    }, 200);
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            scheduler.instance.updateAppointment(appointments[0], { startDate: new Date(), text: 'Appointment 1' });
            this.clock.tick(200);

            assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Update operation is canceled');
        });

        test('Appointment should be returned to the initial state if \'cancel\' flag is defined as true during async operation', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    const d = $.Deferred();
                    args.cancel = d.promise();
                    setTimeout(function() {
                        d.reject();
                    }, 200);
                },
                currentView: 'week',
                dataSource: [{ startDate: new Date(2015, 1, 11), endDate: new Date(2015, 1, 13), text: 'caption' }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialLeftPosition = translator.locate($appointment).left;
            const cellWidth = getOuterWidth(
                scheduler.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0)
            );
            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-left').eq(0)).start();

            pointer.dragStart().drag(-cellWidth * 2, 0).dragEnd();
            this.clock.tick(200);
            assert.equal(translator.locate(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)).left, initialLeftPosition, 'Left position is OK');
        });

        test('Appointment should have initial position if \'cancel\' flag is defined as true during update operation', function(assert) {
            const appointments = [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            const scheduler = createWrapper({
                _draggingMode: 'default',
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                dataSource: dataSource,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            let $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialPosition = translator.locate($appointment);

            $(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(5)).trigger(dragEvents.enter);

            pointerMock($appointment)
                .start()
                .down(initialPosition.left + 10, initialPosition.top + 10)
                .move(initialPosition.left + 10, initialPosition.top + 100)
                .up();

            $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            assert.deepEqual(translator.locate($appointment), initialPosition, 'Appointments position is OK');
        });

        test('Appointment should have initial size if \'cancel\' flag is defined as true during update operation (day view)', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                dataSource: [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: 'caption' }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialHeight = getOuterHeight($appointment);
            const cellHeight = getOuterHeight(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));

            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
            pointer.dragStart().drag(0, cellHeight * 2).dragEnd();

            assert.equal(getOuterHeight(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)), initialHeight, 'Height is OK');
        });

        test('Appointment should have initial size if "cancel" flag is defined as true during update operation (month view)', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                views: ['month'],
                currentView: 'month',
                dataSource: [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: 'caption' }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialWidth = getOuterWidth($appointment);
            const cellWidth = getOuterWidth(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));

            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
            pointer.dragStart().drag(cellWidth * 2, 0).dragEnd();

            assert.roughEqual(getOuterWidth(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)), initialWidth, 0.5, 'Width is OK');
        });

        test('Appointment should have initial size if \'cancel\' flag is defined as true during update operation (all day)', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                currentView: 'week',
                dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10), text: 'caption', allDay: true }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialWidth = getOuterWidth($appointment);
            const cellWidth = getOuterWidth(
                scheduler.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0)
            );

            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
            pointer.dragStart().drag(cellWidth * 2, 0).dragEnd();

            assert.roughEqual(getOuterWidth(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)), initialWidth, 1, 'Width is OK');
        });

        test('Appointment should have initial size if \'cancel\' flag is defined as true during update operation (if appointment takes few days)', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                currentView: 'week',
                dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 11), text: 'caption' }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialWidth = getOuterWidth($appointment);
            const cellWidth = getOuterWidth(
                scheduler.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0)
            );

            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
            pointer.dragStart().drag(cellWidth * 3, 0).dragEnd();

            assert.roughEqual(getOuterWidth(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)), 1.1, initialWidth, 'Width is OK');
        });

        test('Appointment should have initial left coordinate if \'cancel\' flag is defined as true during resize operation', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                currentView: 'week',
                dataSource: [{ startDate: new Date(2015, 1, 11), endDate: new Date(2015, 1, 13), text: 'caption' }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialLeftPosition = translator.locate($appointment).left;
            const cellWidth = getOuterWidth(
                scheduler.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0)
            );
            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-left').eq(0)).start();

            pointer.dragStart().drag(-cellWidth * 2, 0).dragEnd();

            assert.equal(translator.locate(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)).left, initialLeftPosition, 'Left position is OK');
        });

        test('Appointment should have initial top coordinate if \'cancel\' flag is defined as true during resize operation', function(assert) {
            const scheduler = createWrapper({
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                currentView: 'week',
                dataSource: [{ startDate: 1423620000000, endDate: 1423627200000, text: 'caption' }],
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 1, 9)
            });

            const $appointment = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
            const initialTopPosition = translator.locate($appointment).top;
            const cellHeight = getOuterHeight(
                scheduler.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0)
            );
            const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-top').eq(0)).start();

            pointer.dragStart().drag(0, -cellHeight * 2).dragEnd();

            assert.equal(translator.locate(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)).top, initialTopPosition, 'Top position is OK');
        });

        test('onAppointmentUpdated', function(assert) {
            const updatedSpy = sinon.spy(noop);
            const oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: 'title' };

            const scheduler = createWrapper({
                onAppointmentUpdated: updatedSpy,
                dataSource: new DataSource({ store: oldData }),
                currentDate: new Date(2015, 1, 9)
            });

            scheduler.instance.updateAppointment(oldData[0], newData);
            this.clock.tick(10);

            const args = updatedSpy.getCall(0).args[0];

            assert.ok(updatedSpy.calledOnce, 'onAppointmentUpdated was called');
            assert.equal(args.element, scheduler.instance.element(), 'Element field is OK');
            assert.equal(args.component, scheduler.instance, 'Component field is OK');
            assert.deepEqual(args.appointmentData, newData, 'newData field is OK');
            assert.strictEqual(args.error, undefined, 'Error field is not defined');
        });

        test('onAppointmentUpdated should have error field in args if an error occurs while data updating', function(assert) {
            const updatedSpy = sinon.spy(noop);
            const oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: 'title' };

            const scheduler = createWrapper({
                onAppointmentUpdated: updatedSpy,
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function(options) {
                            const d = $.Deferred();
                            d.resolve(oldData);
                            return d.promise();
                        },
                        update: function() {
                            return $.Deferred().reject(new Error('Unknown error occurred'));
                        }
                    })
                })
            });

            scheduler.instance.updateAppointment(oldData[0], newData);
            this.clock.tick(10);

            const error = updatedSpy.getCall(0).args[0].error;

            assert.ok(error instanceof Error, 'Error field is defined');
            assert.equal(error.message, 'Unknown error occurred', 'Error message is OK');
        });
    });

    module('Delete', () => {
        test('Args should be valid in event', function(assert) {
            const data = [{
                startDate: new Date(2020, 6, 10, 2),
                endDate: new Date(2020, 6, 10, 3),
                text: 'Test'
            }];

            const scheduler = createWrapper({
                dataSource: data,
                views: ['day'],
                currentView: 'day',
                currentDate: new Date(2020, 6, 10),
                onAppointmentDeleting: e => {
                    assert.equal(data.length, 1, 'dataSource should has deleted item on onAppointmentDeleting event');
                    assert.deepEqual(e.appointmentData, data[0], 'e.appointmentData arg should be equal with item from dataSource');
                },
                onAppointmentDeleted: e => {
                    assert.equal(data.length, 0, 'dataSource should be empty on onAppointmentDeleted event');
                    assert.deepEqual(e.appointmentData, {
                        startDate: new Date(2020, 6, 10, 2),
                        endDate: new Date(2020, 6, 10, 3),
                        text: 'Test'
                    }, 'e.appointmentData arg should be equal with deleted appointment');
                }
            }, this.clock);

            scheduler.appointmentList[0].click();
            scheduler.tooltip.clickOnDeleteButton();

            assert.expect(4);
        });

        test('onAppointmentDeleting', function(assert) {
            const deletingSpy = sinon.spy(noop);
            const appointments = [
                { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }
            ];

            const scheduler = createWrapper({
                onAppointmentDeleting: deletingSpy,
                currentDate: new Date(2015, 3, 29),
                dataSource: new DataSource({
                    store: appointments
                })
            });

            scheduler.instance.deleteAppointment(appointments[0]);
            this.clock.tick(10);

            const args = deletingSpy.getCall(0).args[0];

            assert.ok(deletingSpy.calledOnce, 'onAppointmentDeleting was called');
            assert.equal(args.element, scheduler.instance.element(), 'Element field is OK');
            assert.equal(args.component, scheduler.instance, 'Component field is OK');
            assert.deepEqual(args.appointmentData, { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }, 'Appointment field is OK');
            assert.strictEqual(args.cancel, false, '\'Cancel\' flag is OK');
        });

        test('Appointment should not be deleted if \'cancel\' flag is defined as true', function(assert) {
            const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            const scheduler = createWrapper({
                onAppointmentDeleting: function(args) {
                    args.cancel = true;
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            scheduler.instance.deleteAppointment(appointments[0]);
            this.clock.tick(10);

            assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Delete operation is canceled');
        });

        test('Appointment should not be deleted if \'cancel\' flag is defined as true during async operation', function(assert) {
            const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            const scheduler = createWrapper({
                onAppointmentDeleting: function(args) {
                    args.cancel = $.Deferred();
                    setTimeout(function() {
                        args.cancel.resolve(true);
                    }, 200);
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            scheduler.instance.deleteAppointment(appointments[0]);
            this.clock.tick(200);

            assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Delete operation is canceled');
        });

        test('Appointment should be deleted correctly if \'cancel\' flag is defined as false during async operation', function(assert) {
            const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            const scheduler = createWrapper({
                onAppointmentDeleting: function(args) {
                    args.cancel = $.Deferred();
                    setTimeout(function() {
                        args.cancel.resolve(false);
                    }, 200);
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            scheduler.instance.deleteAppointment(appointments[0]);
            this.clock.tick(200);

            assert.equal(dataSource.items().length, 0, 'Delete operation is completed');
        });

        test('onAppointmentDeleted', function(assert) {
            const deletedSpy = sinon.spy(noop);
            const appointments = [
                { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }
            ];

            const scheduler = createWrapper({
                onAppointmentDeleted: deletedSpy,
                currentDate: new Date(2015, 3, 29),
                dataSource: new DataSource({
                    store: appointments
                })
            });

            scheduler.instance.deleteAppointment(appointments[0]);
            this.clock.tick(10);

            const args = deletedSpy.getCall(0).args[0];
            assert.ok(deletedSpy.calledOnce, 'onAppointmentDeleted was called');
            assert.equal(args.element, scheduler.instance.element(), 'Element field is OK');
            assert.equal(args.component, scheduler.instance, 'Component field is OK');
            assert.deepEqual(args.appointmentData, { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }, 'newData field is OK');
            assert.strictEqual(args.error, undefined, 'Error field is not defined');
        });

        test('onAppointmentDeleted should have error field in args if an error occurs while data deleting', function(assert) {
            const deletedSpy = sinon.spy(noop);

            const scheduler = createWrapper({
                onAppointmentDeleted: deletedSpy,
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: noop,
                        remove: function() {
                            return $.Deferred().reject(new Error('Unknown error occurred'));
                        }
                    })
                })
            });

            scheduler.instance.deleteAppointment({});
            this.clock.tick(10);

            const error = deletedSpy.getCall(0).args[0].error;

            assert.ok(error instanceof Error, 'Error field is defined');
            assert.equal(error.message, 'Unknown error occurred', 'Error message is OK');
        });
    });
});

module('ArraySore(auto generated id)', moduleConfig, () => {
    test('onAppointmentAdd[*] events should be work right(T961110)', function(assert) {
        const dataSource = new DataSource({
            store: new ArrayStore({
                data: [],
                key: 'id'
            }),
        });

        const scheduler = createWrapper({
            dataSource,
            views: ['day'],
            currentView: 'day',
            height: 600,
            onAppointmentAdding: e => {
                assert.equal(e.appointmentData.id, undefined, 'Appointment shouldn\'t has key in onAppointmentAdding');
                assert.equal(dataSource.items().length, 0, 'Appointment shouldn\'t add to store in onAppointmentAdding');
            },
            onAppointmentAdded: e => {
                assert.equal(e.appointmentData.id.length, 36, 'New appointmentData should has GUID id');
                assert.equal(dataSource.items().length, 1, 'Appointment should be in DataSource');
                assert.equal(e.appointmentData, dataSource.items()[0], 'Appointment from arg and appointment from DataSource should be equal');
            }
        });

        scheduler.instance.showAppointmentPopup({
            startDate: new Date(2015, 1, 1, 1),
            endDate: new Date(2015, 1, 1, 2),
            text: 'Test'
        }, true);

        scheduler.appointmentPopup.clickDoneButton();

        assert.expect(5);
    });

    test('onAppointmentDelete[*] events should be work right', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const dataSource = new DataSource({
                store: new ArrayStore({
                    data: [{
                        id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
                        startDate: new Date(2020, 6, 10, 1),
                        endDate: new Date(2020, 6, 10, 2),
                        text: 'Test'
                    }],
                    key: 'id'
                }),
            });

            const scheduler = createWrapper({
                dataSource,
                views: ['day'],
                currentView: 'day',
                currentDate: new Date(2020, 6, 10),
                height: 600,
                onAppointmentDeleting: e => {
                    assert.deepEqual(e.appointmentData, {
                        id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
                        startDate: new Date(2020, 6, 10, 1),
                        endDate: new Date(2020, 6, 10, 2),
                        text: 'Test'
                    }, 'Appointment should be equal with dataSource appointment on onAppointmentDeleting event');
                },
                onAppointmentDeleted: e => {
                    assert.deepEqual(e.appointmentData, {
                        id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
                        startDate: new Date(2020, 6, 10, 1),
                        endDate: new Date(2020, 6, 10, 2),
                        text: 'Test'
                    }, 'Appointment should be equal with dataSource appointment on onAppointmentDeleted event');
                }
            }, clock);

            scheduler.appointmentList[0].click();
            scheduler.tooltip.clickOnDeleteButton();

            assert.expect(2);
        } finally {
            clock.restore();
        }
    });

    test('onAppointmentUpdate[*] events should be work right', function(assert) {
        const dataSource = new DataSource({
            store: new ArrayStore({
                data: [{
                    id: '08b17a7c-2a07-4fb2-8c34-0635f102d77f',
                    startDate: new Date(2020, 6, 12, 1),
                    endDate: new Date(2020, 6, 12, 2),
                    text: 'Test 2'
                }, {
                    id: 'c1d57728-0b83-4f75-854f-09fe103bb9c2',
                    startDate: new Date(2020, 6, 15, 1),
                    endDate: new Date(2020, 6, 16, 2),
                    text: 'Test 3'
                }, {
                    id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
                    startDate: new Date(2020, 6, 10, 1),
                    endDate: new Date(2020, 6, 10, 2),
                    text: 'Test'
                }],
                key: 'id'
            }),
        });

        const scheduler = createWrapper({
            dataSource,
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2020, 6, 10),
            height: 600,
            onAppointmentUpdating: e => {
                assert.deepEqual(e.oldData, {
                    id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
                    startDate: new Date(2020, 6, 10, 1),
                    endDate: new Date(2020, 6, 10, 2),
                    text: 'Test'
                }, 'e.oldData should be equal with dataSource appointment on onAppointmentUpdating event');

                assert.deepEqual(e.newData, { text: 'Done' },
                    'e.newData should be equal with part updated data on onAppointmentDeleting event');
            },
            onAppointmentUpdated: e => {
                assert.deepEqual(e.appointmentData, {
                    id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
                    startDate: new Date(2020, 6, 10, 1),
                    endDate: new Date(2020, 6, 10, 2),
                    text: 'Done'
                }, 'e.appointmentData should be updated on onAppointmentUpdated event');
            }
        });

        scheduler.instance.updateAppointment({
            id: 'bc0eadf8-608a-491f-9f23-e5a8100352e7',
            startDate: new Date(2020, 6, 10, 1),
            endDate: new Date(2020, 6, 10, 2),
            text: 'Test'
        }, { text: 'Done' });

        assert.expect(3);
    });

    if(isDesktopEnvironment()) {
        test('Excluded appointment\'s key property shouldn\'t equal to parent appointment(T929772)', function(assert) {
            const data = [{
                id: 'ff1dbf32-54d3-414c-8713-3a7c21de406b',
                text: 'Appointment',
                startDate: new Date(2017, 4, 22, 1, 30),
                endDate: new Date(2017, 4, 22, 2, 30),
                recurrenceRule: 'FREQ=DAILY',
            }];

            const scheduler = createWrapper({
                dataSource: {
                    store: new ArrayStore({
                        data: data,
                        key: 'id'
                    })
                },
                views: ['week'],
                currentView: 'week',
                recurrenceEditMode: 'occurrence',
                currentDate: new Date(2017, 4, 22),
                _draggingMode: 'default',
                onAppointmentAdding: e => {
                    assert.equal(e.appointmentData.id, undefined, 'key property \'id\' shouldn\'t exist in appointment on onAppointmentAdding event');
                },
                onAppointmentAdded: e => {
                    assert.equal(e.appointmentData.id.length, 36, 'key property \'id\' should be GUID type in appointment on onAppointmentAdded event');
                    assert.notStrictEqual(data[0].id, e.appointmentData.id, 'Excluded appointment\'s key property shouldn\'t equal to parent appointment');
                },
                height: 600
            });

            scheduler.appointmentList[3].drag.toCell(39);

            const appointments = scheduler.instance.getDataSource().items();
            const recurrenceAppointment = appointments[0];
            const excludedAppointment = appointments[1];

            const expectedDate = new Date(excludedAppointment.startDate);
            expectedDate.setHours(recurrenceAppointment.startDate.getHours() + 1);

            assert.equal(excludedAppointment.startDate.valueOf(), expectedDate.valueOf(), 'appointment should be shifted down');
            assert.equal(excludedAppointment.id.length, 36, 'id property should be equal GUID');

            assert.expect(5);
        });
    }
});

module('Timezones', moduleConfig, () => {
    const timeZones = {
        LosAngeles: 'America/Los_Angeles',
        UTC: 'Etc/UTC'
    };

    [undefined, timeZones.UTC, timeZones.LosAngeles].forEach(timeZone => {
        test(`Correct args should be passed into events when appointment is added, timezone='${timeZone}'`, function(assert) {
            const appointment = {
                text: 'test',
                startDate: new Date(2020, 6, 15, 14),
                endDate: new Date(2020, 6, 15, 15)
            };

            const scheduler = createWrapper({
                timeZone,
                views: ['day'],
                currentView: 'day',
                dataSource: [],
                onAppointmentAdded: e => {
                    assert.deepEqual(e.appointmentData, appointment, 'onAppointmentAdded should have right appointment');
                },
                onAppointmentAdding: e => {
                    assert.deepEqual(e.appointmentData, appointment, 'onAppointmentAdding should have right appointment');
                }
            });

            scheduler.instance.addAppointment(appointment);
            assert.deepEqual(scheduler.option('dataSource')[0], appointment, 'appointment should be push to dataSource right');

            assert.expect(3);
        });
    });

    [undefined, timeZones.UTC, timeZones.LosAngeles].forEach(timeZone => {
        test(`Correct args should be passed into events when appointment is updated, timezone='${timeZone}'`, function(assert) {
            const appointment = {
                text: 'test',
                startDate: new Date(2020, 6, 15, 14),
                endDate: new Date(2020, 6, 15, 15)
            };

            const newAppointment = {
                text: 'test',
                startDate: new Date(2020, 6, 16, 15),
                endDate: new Date(2020, 6, 16, 16)
            };

            const scheduler = createWrapper({
                timeZone,
                views: ['day'],
                currentView: 'day',
                dataSource: [appointment],
                onAppointmentUpdated: e => {
                    assert.deepEqual(e.appointmentData, newAppointment, 'onAppointmentUpdated should have right appointment');
                },
                onAppointmentUpdating: e => {
                    assert.deepEqual(e.newData, newAppointment, 'onAppointmentUpdating should have right appointment');
                }
            });

            scheduler.instance.updateAppointment(appointment, newAppointment);
            assert.deepEqual(scheduler.option('dataSource')[0], newAppointment, 'appointment should be updated in dataSource right');

            assert.expect(3);
        });
    });

    [undefined, timeZones.UTC, timeZones.LosAngeles].forEach(timeZone => {
        test(`Correct args should be passed into events when appointment is deleted, timezone='${timeZone}'`, function(assert) {
            const appointment = {
                text: 'test',
                startDate: new Date(2020, 6, 15, 14),
                endDate: new Date(2020, 6, 15, 15)
            };

            const scheduler = createWrapper({
                timeZone,
                views: ['day'],
                currentView: 'day',
                dataSource: [appointment],
                onAppointmentDeleted: e => {
                    assert.deepEqual(e.appointmentData, appointment, 'onAppointmentDeleted should have right appointment');
                },
                onAppointmentDeleting: e => {
                    assert.deepEqual(e.appointmentData, appointment, 'onAppointmentDeleting should have right appointment');
                }
            });

            scheduler.instance.deleteAppointment(appointment);
            assert.deepEqual(scheduler.option('dataSource').length, 0, 'appointment should be deleted');

            assert.expect(3);
        });
    });
});

module('Push API', () => {
    QUnit.test('Push new item to the store (remoteFiltering: true) (T900529)', function(assert) {
        const data = [{
            id: 0,
            text: 'Test Appointment',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }];

        const pushItem = {
            id: 1,
            text: 'Pushed Appointment',
            startDate: new Date(2017, 4, 23, 9, 30),
            endDate: new Date(2017, 4, 23, 11, 30)
        };

        const scheduler = createWrapper({
            dataSource: {
                pushAggregationTimeout: 0,
                reshapeOnPush: true,
                load: () => data,
                key: 'id'
            },
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2017, 4, 25)
        });

        const dataSource = scheduler.instance.getDataSource();
        dataSource.store().push([{ type: 'update', key: pushItem.id, data: pushItem }]);

        assert.equal(scheduler.appointments.getTitleText(0), 'Test Appointment', 'Appointment is rerendered');
        assert.equal(scheduler.appointments.getTitleText(1), 'Pushed Appointment', 'Pushed appointment is rerendered');
    });

    QUnit.test('Push API should work correctly for the wrong data item (T986087)', function(assert) {
        const data = [{
            id: 0,
            text: 'Test Appointment',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }];

        const { instance } = createWrapper({
            dataSource: {
                pushAggregationTimeout: 0,
                reshapeOnPush: true,
                load: () => data,
                key: 'id'
            },
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2017, 4, 25)
        });

        const dataSource = instance.getDataSource();

        [null, undefined].forEach((wrongData) => {
            try {
                dataSource.store().push([{ type: 'update', key: 123, data: wrongData }]);

                const dataSourceItems = instance.getDataSource().items();

                assert.equal(dataSourceItems.length, 1, `Item count is correct for '${wrongData}' data`);
            } catch(e) {
                assert.ok(false, e.message);
            }
        });
    });
});
