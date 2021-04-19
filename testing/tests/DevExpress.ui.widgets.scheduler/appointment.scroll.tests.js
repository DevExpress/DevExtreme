import $ from 'jquery';
import fx from 'animation/fx';
import Color from 'color';
import { DataSource } from 'data/data_source/data_source';
import {
    SchedulerTestWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'generic_light.css!';

const {
    module,
    test
} = QUnit;

initTestMarkup();

module('Integration: Appointment scroll', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options,
                {
                    height: options && options.height || 600
                })
            ).dxScheduler('instance');

            this.clock.tick(300);
            this.instance.focus();

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

                    createInstance(options);

                    if(scrollingMode === 'virtual') {
                        const virtualScrollingDispatcher = this.instance.getWorkSpace().virtualScrollingDispatcher;
                        if(virtualScrollingDispatcher) {
                            virtualScrollingDispatcher.renderer.getRenderTimeout = () => -1;
                        }
                    }
                };

                this.scrollTo = args => this.instance.getWorkSpace().getScrollable().scrollTo(args);
            }
        }, () => {
            module('Timeline views', () => {
                test('Scheduler should update scroll position if appointment is not visible, timeline view ', function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 1, 9),
                        dataSource: new DataSource({
                            store: []
                        }),
                        currentView: 'timelineDay',
                        height: 500
                    });

                    const appointment = { startDate: new Date(2015, 1, 9, 7), endDate: new Date(2015, 1, 9, 1, 8), text: 'caption' };
                    const workSpace = this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerTimelineDay('instance');
                    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                    try {
                        this.instance.showAppointmentPopup(appointment);
                        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                });

                test('Scheduler should update scroll position if appointment is not visible, timeline week view ', function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 1, 9),
                        dataSource: new DataSource({
                            store: []
                        }),
                        currentView: 'timelineWeek',
                        height: 500,
                        width: 500
                    });

                    const appointment = { startDate: new Date(2015, 1, 12, 7), endDate: new Date(2015, 1, 12, 1, 8), text: 'caption' };
                    const workSpace = this.instance.getWorkSpace();
                    const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                    try {
                        this.instance.showAppointmentPopup(appointment);
                        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                        assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                });
            });

            test('Scheduler should not update scroll position if appointment is visible ', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    width: 1000,
                });

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollTo = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.notOk(scrollTo.calledOnce, 'scrollTo was not called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible bottom area', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300,
                    width: 600
                });

                const appointment = { startDate: new Date(2015, 1, 9, 21), endDate: new Date(2015, 1, 9, 22), text: 'caption 2' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible top area', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300
                });

                this.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible top area: minutes case', function(assert) {
                this.createInstance({
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

                this.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9, 2), endDate: new Date(2015, 1, 9, 2, 30), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            test('Scheduler should update scroll position if appointment was added to invisible bottom area: minutes case', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    showAllDayPanel: false,
                    width: 600
                });

                this.instance.getWorkSpaceScrollable().scrollBy(140);

                const appointment = { startDate: new Date(2015, 1, 9, 5, 45), endDate: new Date(2015, 1, 9, 6, 30), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

        });
    });
});
