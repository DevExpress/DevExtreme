import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';

const {
    module,
    test
} = QUnit;

QUnit.testStart(() => initTestMarkup());

const createInstanceBase = (options, clock) => {
    const scheduler = createWrapper({
        height: 600,
        ...options,
    });

    clock.tick(300);
    scheduler.instance.focus();

    return scheduler;
};

module('Integration: Appointment scroll', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
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
        module(`Scrolling mode ${scrollingMode}`, () => {
            const createInstance = (options, clock) => {
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

                const scheduler = createInstanceBase(options, clock);

                if(scrollingMode === 'virtual') {
                    const workspace = scheduler.instance.getWorkSpace();
                    workspace.renderer.getRenderTimeout = () => -1;
                }

                return scheduler;
            };
            module('Timeline views', () => {
                test('Scheduler should update scroll position if appointment is not visible, timeline view ', function(assert) {
                    const scheduler = createInstance({
                        currentDate: new Date(2015, 1, 9),
                        dataSource: new DataSource({
                            store: []
                        }),
                        currentView: 'timelineDay',
                        height: 500
                    }, this.clock);

                    const appointment = { startDate: new Date(2015, 1, 9, 7), endDate: new Date(2015, 1, 9, 1, 8), text: 'caption' };
                    const workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerTimelineDay('instance');
                    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                    try {
                        scheduler.instance.showAppointmentPopup(appointment);
                        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                });

                test('Scheduler should update scroll position if appointment is not visible, timeline week view ', function(assert) {
                    const scheduler = createInstance({
                        currentDate: new Date(2015, 1, 9),
                        dataSource: new DataSource({
                            store: []
                        }),
                        currentView: 'timelineWeek',
                        height: 500,
                        width: 500
                    }, this.clock);

                    const appointment = { startDate: new Date(2015, 1, 12, 7), endDate: new Date(2015, 1, 12, 1, 8), text: 'caption' };
                    const workSpace = scheduler.instance.getWorkSpace();
                    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                    try {
                        scheduler.instance.showAppointmentPopup(appointment);
                        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                });
            });

            test('Scheduler should not update scroll position if appointment is visible ', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    width: 1000,
                }, this.clock);

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollTo = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.notOk(scrollTo.calledOnce, 'scrollTo was not called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible bottom area', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300,
                    width: 600
                }, this.clock);

                const appointment = { startDate: new Date(2015, 1, 9, 21), endDate: new Date(2015, 1, 9, 22), text: 'caption 2' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible top area', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300
                }, this.clock);

                scheduler.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible top area: minutes case', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    scrolling: {
                        orientation: 'vertical'
                    }
                }, this.clock);

                scheduler.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9, 2), endDate: new Date(2015, 1, 9, 2, 30), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible bottom area: minutes case', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    showAllDayPanel: false,
                    width: 600
                }, this.clock);

                scheduler.instance.getWorkSpaceScrollable().scrollBy(140);

                const appointment = { startDate: new Date(2015, 1, 9, 5, 45), endDate: new Date(2015, 1, 9, 6, 30), text: 'caption' };
                const workSpace = scheduler.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    scheduler.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

        });
    });
});
