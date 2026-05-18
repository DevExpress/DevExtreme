import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';
import 'fluent_blue_light.css!';

const {
    module,
    test
} = QUnit;

QUnit.testStart(() => initTestMarkup());

const createInstanceBase = async(options) => {
    const scheduler = await createWrapper({
        height: 600,
        ...options,
    });

    scheduler.instance.focus();

    return scheduler;
};

module('Integration: Appointment scroll', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    [
        'standard',
        'virtual'
    ].forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, () => {
            const createInstance = async(options) => {
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

                const scheduler = await createInstanceBase(options);

                if(scrollingMode === 'virtual') {
                    const workspace = scheduler.instance.getWorkSpace();
                    workspace.renderer.getRenderTimeout = () => -1;
                }

                return scheduler;
            };
            module('Timeline views', () => {
                test('Scheduler should update scroll position if appointment is not visible, timeline view ', async function(assert) {
                    const scheduler = await createInstance({
                        currentDate: new Date(2015, 1, 9),
                        dataSource: new DataSource({
                            store: []
                        }),
                        currentView: 'timelineDay',
                        height: 500
                    });

                    const appointment = { startDate: new Date(2015, 1, 9, 7), endDate: new Date(2015, 1, 9, 1, 8), text: 'caption' };
                    const workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerTimelineDay('instance');
                    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                    try {
                        scheduler.instance.showAppointmentPopup(appointment);
                        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                        await Promise.resolve();

                        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                });

                test('Scheduler should update scroll position if appointment is not visible, timeline week view ', async function(assert) {
                    const scheduler = await createInstance({
                        currentDate: new Date(2015, 1, 9),
                        dataSource: new DataSource({
                            store: []
                        }),
                        currentView: 'timelineWeek',
                        height: 500,
                        width: 500
                    });

                    const appointment = { startDate: new Date(2015, 1, 12, 7), endDate: new Date(2015, 1, 12, 1, 8), text: 'caption' };
                    const workSpace = scheduler.instance.getWorkSpace();
                    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                    try {
                        scheduler.instance.showAppointmentPopup(appointment);
                        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                        await Promise.resolve();

                        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                });
            });

            test('Scheduler should not update scroll position if appointment is visible ', async function(assert) {
                const scheduler = await createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    width: 1000,
                });

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollTo = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                    await Promise.resolve();

                    assert.notOk(scrollTo.calledOnce, 'scrollTo was not called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible bottom area', async function(assert) {
                const scheduler = await createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300,
                    width: 600
                });

                const appointment = { startDate: new Date(2015, 1, 9, 21), endDate: new Date(2015, 1, 9, 22), text: 'caption 2' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                    await Promise.resolve();

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible top area', async function(assert) {
                const scheduler = await createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300
                });

                scheduler.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                    await Promise.resolve();

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible top area: minutes case', async function(assert) {
                const scheduler = await createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                scheduler.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9, 2), endDate: new Date(2015, 1, 9, 2, 30), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                    await Promise.resolve();

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible bottom area: minutes case', async function(assert) {
                const scheduler = await createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 400,
                    showAllDayPanel: false,
                    width: 400
                });

                scheduler.instance.getWorkSpaceScrollable().scrollBy(140);

                const appointment = { startDate: new Date(2015, 1, 9, 5, 45), endDate: new Date(2015, 1, 9, 6, 30), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
                    await Promise.resolve();

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

        });
    });
});
