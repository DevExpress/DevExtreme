import { SchedulerTestWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import $ from 'jquery';
import translator from 'common/core/animation/translator';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import fx from 'common/core/animation/fx';

import '__internal/scheduler/m_scheduler';
import 'generic_light.css!';

QUnit.testStart(() => initTestMarkup());

const createScheduler = (options) => {
    const data = [
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

    const defaultOption = {
        dataSource: data
    };
    const instance = $('#scheduler').dxScheduler($.extend(defaultOption, options)).dxScheduler('instance');
    return new SchedulerTestWrapper(instance);
};

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

QUnit.module('onContentReady event', moduleConfig, () => {
    QUnit.test('contentReady action should rise after change dataSource', function(assert) {
        const dataSource1 = [{
            text: '1',
            startDate: new Date(2016, 2, 15, 1),
            endDate: new Date(2016, 2, 15, 2)
        }];

        const dataSource2 = [{
            text: '2',
            startDate: new Date(2016, 2, 15, 1),
            endDate: new Date(2016, 2, 15, 2)
        }];

        let contentReadyCount = 0;
        const scheduler = createScheduler({
            onContentReady: e => contentReadyCount++,
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2016, 2, 15, 1)
        });

        assert.equal(contentReadyCount, 1, 'contentReady should be rise after first init control');

        scheduler.option('dataSource', dataSource1);
        assert.equal(scheduler.appointments.getTitleText(), '1', 'Appointment should be render');
        assert.equal(contentReadyCount, 2, 'contentReady should be rise after set dataSource');

        scheduler.option('dataSource', dataSource2);
        assert.equal(scheduler.appointments.getTitleText(), '2', 'Appointment should be re-render');
        assert.equal(contentReadyCount, 3, 'contentReady should be rise after change dataSource');
    });

    QUnit.test('contentReady action should rise after call repaint', function(assert) {
        let contentReadyCount = 0;
        const scheduler = createScheduler({
            onContentReady: e => contentReadyCount++
        });

        assert.equal(contentReadyCount, 1, 'contentReady should be rise after first init control');

        scheduler.instance.repaint();
        assert.equal(contentReadyCount, 2, 'contentReady should be rise after call repaint');
    });

    QUnit.test('contentReady action should rise on first init, data source load and after call repaint method', function(assert) {
        let contentReadyCount = 0;

        const dataSource = new DataSource({
            store: new CustomStore({
                load: () => {
                    const d = $.Deferred();
                    setTimeout(() => {
                        d.resolve([{
                            text: 'appointment',
                            startDate: new Date(2016, 2, 15, 1),
                            endDate: new Date(2016, 2, 15, 2)
                        }]);
                    }, 100);
                    return d.promise();
                }
            })
        });

        const scheduler = createScheduler({
            dataSource: dataSource,
            onContentReady: e => contentReadyCount++
        });

        assert.equal(contentReadyCount, 0, 'contentReady should be rise after first init control');

        this.clock.tick(200);
        assert.equal(contentReadyCount, 1, 'contentReady should be rise after dataSource loaded');

        scheduler.instance.repaint();
        assert.equal(contentReadyCount, 2, 'contentReady should be rise after call repaint');
    });

    QUnit.test('contentReady action should rise even if dataSource isn\'t set', function(assert) {
        let contentReadyCount = 0;

        createScheduler({
            onContentReady: e => contentReadyCount++
        });

        assert.equal(contentReadyCount, 1, 'contentReady is fired');
    });

    QUnit.test('contentReady action should rise at the right time', function(assert) {
        const done = assert.async();
        this.clock.restore();

        const dataSource = new DataSource({
            store: new CustomStore({
                load: () => {
                    const d = $.Deferred();
                    setTimeout(() => {
                        d.resolve([{
                            startDate: new Date(2016, 2, 15, 1).toString(),
                            endDate: new Date(2016, 2, 15, 2).toString()
                        }]);
                    }, 100);

                    return d.promise();
                }
            })
        });

        const scheduler = createScheduler({
            currentDate: new Date(2016, 2, 15),
            views: ['week'],
            currentView: 'week',
            width: 800,
            dataSource: dataSource,
            onContentReady: e => {
                const element = e.component;
                const $header = element.getHeader().$element();
                const $workSpace = element.getWorkSpace().$element();
                const appointmentPosition = translator.locate(scheduler.appointments.getAppointment());

                assert.equal($header.length, 1, 'Header is rendered');
                assert.equal($workSpace.length, 1, 'Work Space is rendered');
                assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');
                assert.roughEqual(appointmentPosition.top, 100, 2.001, 'Appointment top is OK');
                assert.roughEqual(appointmentPosition.left, 199, 1.001, 'Appointment left is OK');
                done();
            }
        });
    });

    QUnit.test('contentReady action should rise when appointment is added', function(assert) {
        const scheduler = createScheduler({
            currentDate: new Date(2016, 2, 15),
            views: ['week'],
            currentView: 'week',
            width: 800,
            dataSource: []
        });

        scheduler.instance.option('onContentReady', e => {
            const appointmentPosition = translator.locate(scheduler.appointments.getAppointment());

            assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');
            assert.roughEqual(appointmentPosition.top, 100, 2.001, 'Appointment top is OK');
            assert.roughEqual(appointmentPosition.left, 199, 1.001, 'Appointment left is OK');
        });

        scheduler.instance.addAppointment({
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        });
    });

    QUnit.test('contentReady action should rise when appointment is updated', function(assert) {
        const appointment = {
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        };

        const scheduler = createScheduler({
            currentDate: new Date(2016, 2, 15),
            views: ['week'],
            currentView: 'week',
            width: 800,
            dataSource: [appointment]
        });

        scheduler.instance.option('onContentReady', e => {
            const appointmentPosition = translator.locate(scheduler.appointments.getAppointment());

            assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');
            assert.roughEqual(appointmentPosition.top, 150, 2.001, 'Appointment top is OK');
            assert.roughEqual(appointmentPosition.left, 199, 1.001, 'Appointment left is OK');
        });

        scheduler.instance.updateAppointment(appointment, {
            startDate: new Date(2016, 2, 15, 1, 30).toString()
        });
    });

    QUnit.test('contentReady action should rise when appointment is deleted', function(assert) {
        const appointment = {
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        };

        const scheduler = createScheduler({
            currentDate: new Date(2016, 2, 15),
            views: ['week'],
            currentView: 'week',
            width: 800,
            dataSource: [appointment]
        });

        scheduler.instance.option('onContentReady', e => assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointment is not rendered'));
        scheduler.instance.deleteAppointment(appointment);
    });
});
