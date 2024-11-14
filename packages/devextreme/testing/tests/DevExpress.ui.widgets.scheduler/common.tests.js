import { getOuterHeight, getHeight } from 'core/utils/size';
import fx from 'common/core/animation/fx';
import config from 'core/config';
import dataUtils from 'core/element_data';
import { isRenderer } from 'core/utils/type';
import { CustomStore } from 'common/data/custom_store';
import { DataSource } from 'common/data/data_source/data_source';
import timeZoneDataUtils from '__internal/scheduler/timezones/m_utils_timezones_data';

import { triggerHidingEvent, triggerShownEvent } from 'common/core/events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';
import { getTimeZones } from 'time_zone_utils';
import themes from 'ui/themes';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import Scrollable from 'ui/scroll_view/ui.scrollable.js';

const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

QUnit.testStart(() => initTestMarkup());

QUnit.module('Loading', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    const baseProps = {
        currentView: 'day',
        currentDate: new Date(2015, 10, 1),
        showCurrentTimeIndicator: false,
    };

    QUnit.test('Loading panel should be shown while datasource is reloading', function(assert) {
        const scheduler = createWrapper({
            ...baseProps,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([]);
                        }, 100);

                        return d.promise();
                    }
                })
            })
        });

        this.clock.tick(100);

        scheduler.instance.option('currentView', 'week');

        assert.equal(scheduler.instance.$element().find('.dx-loadpanel-wrapper').length, 1, 'loading panel is shown');
    });

    QUnit.test('Loading panel should hide', function(assert) {
        const scheduler = createWrapper({
            ...baseProps,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([]);
                        }, 100);

                        return d.promise();
                    }
                })
            })
        });

        this.clock.tick(100);

        scheduler.instance.option('currentView', 'week');

        this.clock.tick(100);

        assert.equal($('.dx-loadpanel-wrapper').length, 0, 'loading panel hide');
    });

    QUnit.test('Loading panel should be shown in centre of scheduler', function(assert) {
        const scheduler = createWrapper({
            ...baseProps,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([]);
                        }, 100);

                        return d.promise();
                    }
                })
            })
        });

        this.clock.tick(100);

        scheduler.instance.option('currentView', 'week');
        const loadingInstance = $('.dx-loadpanel').last().dxLoadPanel('instance');
        assert.deepEqual(loadingInstance.option('position.of').get(0), scheduler.instance.$element().get(0), 'loading panel is shown in right place');
    });
});

QUnit.module('Filtering', () => {
    QUnit.test('Start view date & end view date should be passed to the load method as filter expression', function(assert) {
        const dataSource = new DataSource({
            load: function(options) {

                const filter = options.filter;
                const dateFilter = filter[0][0];
                const zeroDurationFilter = filter[0][4];

                assert.ok($.isArray(filter), 'Filter is array');

                assert.equal(filter[0].length, 5, 'Filter size is OK');

                assert.equal(dateFilter.length, 2, 'Date filter contains 2 items');

                assert.deepEqual(dateFilter[0], ['endDate', '>=', startViewDate]);

                assert.deepEqual(dateFilter[1], ['startDate', '<', endViewDate]);

                assert.equal(filter.length, 1, 'Filter contains only dates');

                assert.deepEqual(zeroDurationFilter[0], ['endDate', startViewDate]);
                assert.deepEqual(zeroDurationFilter[1], ['startDate', startViewDate]);
            }
        });
        const startViewDate = new Date(2015, 11, 7);
        const endViewDate = new Date(2015, 11, 14);

        createWrapper({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test('Recurrent appointments should be always loaded, if recurrenceRuleExpr !=null', function(assert) {
        const dataSource = new DataSource({
            load: function(options) {
                const filter = options.filter;
                assert.equal(filter[0][1], 'or');
                assert.deepEqual(filter[0][2], ['recurrenceRule', 'startswith', 'freq']);
            }
        });
        createWrapper({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test('There is no filter expression by recurrenceRule, if recurrenceRuleExpr is null', function(assert) {
        const dataSource = new DataSource({
            load: function(options) {
                const filter = options.filter;
                assert.equal(filter[0].length, 3, 'recurrenceRule expression is absent');
            }
        });
        createWrapper({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            views: ['week'],
            dataSource: dataSource,
            remoteFiltering: true,
            recurrenceRuleExpr: null
        });

    });

    QUnit.test('Internal scheduler filter should be merged with user\'s filter if it exists', function(assert) {
        const userFilter = ['someField', 'contains', 'abc'];
        const dataSource = new DataSource({
            filter: ['someField', 'contains', 'abc'],
            load: function(options) {
                const filter = options.filter;

                assert.equal(filter.length, 2);
                assert.deepEqual(filter[1], userFilter);
            }
        });

        createWrapper({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test('Scheduler should filter data on client side if the remoteFiltering option is false', function(assert) {
        const dataSource = new DataSource([
            { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
            { StartDate: new Date(2015, 11, 19).toString(), EndDate: new Date(2015, 11, 19, 0, 30).toString() }
        ]);

        const scheduler = createWrapper({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        const $appointments = $(scheduler.instance.$element().find('.dx-scheduler-appointment'));

        assert.equal($appointments.length, 1, 'There is only one appt');
        assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() }, 'Appointment data is OK');
    });

    QUnit.test('Scheduler should filter data on client side if the remoteFiltering option is false and forceIsoDateParsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            const dataSource = new DataSource([
                { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
                { StartDate: new Date(2015, 11, 19).toString(), EndDate: new Date(2015, 11, 19, 0, 30).toString() }
            ]);

            const scheduler = createWrapper({
                currentDate: new Date(2015, 11, 24),
                firstDayOfWeek: 1,
                currentView: 'week',
                dataSource: dataSource,
                remoteFiltering: false,
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate'
            });

            const $appointments = $(scheduler.instance.$element().find('.dx-scheduler-appointment'));

            assert.equal($appointments.length, 1, 'There is only one appt');
            assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() }, 'Appointment data is OK');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('Scheduler should filter data on server side if the remoteFiltering option is true', function(assert) {
        const dataSource = new DataSource([
            { StartDate: '2015-12-23T00:00', EndDate: '2015-12-23T00:30' },
            { StartDate: '2015-12-19T00:00', EndDate: '2015-12-19T00:30' }
        ]);

        const scheduler = createWrapper({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        assert.equal(scheduler.instance.option('dataSource').items().length, 0, 'Appointments are filtered correctly');
    });

    QUnit.test('Scheduler should filter data on client side depends on user filter', function(assert) {
        const dataSource = new DataSource({
            filter: ['UserId', 1],
            store: [
                { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString(), UserId: 1 },
                { StartDate: new Date(2015, 11, 24).toString(), EndDate: new Date(2015, 11, 24, 0, 30).toString(), UserId: 2 }
            ]
        });

        const scheduler = createWrapper({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        assert.deepEqual(scheduler.instance.option('dataSource').items(), [{ StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString(), UserId: 1 }], 'Appointments are filtered correctly');
    });

    QUnit.test('Date filter should be used everytime before render', function(assert) {
        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return [
                        { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
                        { StartDate: new Date(2015, 9, 24).toString(), EndDate: new Date(2015, 9, 24, 0, 30).toString() }
                    ];
                }
            })
        });

        const scheduler = createWrapper({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');
    });
});

QUnit.module('Small size', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Scheduler should have a small css class on init', function(assert) {
        const scheduler = createWrapper({
            width: 300
        });

        assert.ok(scheduler.instance.$element().hasClass('dx-scheduler-small'), 'Scheduler has \'dx-scheduler-small\' css class');
    });

    QUnit.test('Scheduler should have adaptive css class depend on adaptivityEnabled option', function(assert) {
        const scheduler = createWrapper({
            width: 300,
            adaptivityEnabled: true
        });

        assert.ok(scheduler.instance.$element().hasClass('dx-scheduler-adaptive'), 'Scheduler has \'dx-scheduler-adaptive\' css class');

        scheduler.instance.option('adaptivityEnabled', false);

        assert.notOk(scheduler.instance.$element().hasClass('dx-scheduler-adaptive'), 'Scheduler hasn\'t \'dx-scheduler-adaptive\' css class');
    });

    QUnit.test('Scheduler should have a small css class', function(assert) {
        const scheduler = createWrapper({
            width: 600
        });

        scheduler.instance.option('width', 300);
        assert.ok(scheduler.instance.$element().hasClass('dx-scheduler-small'), 'Scheduler has \'dx-scheduler-small\' css class');
        scheduler.instance.option('width', 600);
        assert.notOk(scheduler.instance.$element().hasClass('dx-scheduler-small'), 'Scheduler has no \'dx-scheduler-small\' css class');
    });

    QUnit.test('Rendering small scheduler inside invisible element', function(assert) {
        try {
            triggerHidingEvent($('#scheduler'));
            createWrapper({
                width: 300,
                currentView: 'week',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 6, 5, 0, 0),
                    endDate: new Date(2015, 6, 5, 3, 0),
                }],
                currentDate: new Date(2015, 6, 6)
            });
            $('#scheduler').hide();
        } finally {
            $('#scheduler').show();
            triggerShownEvent($('#scheduler'));
            const schedulerInstance = $('#scheduler').dxScheduler('instance');
            schedulerInstance.option('width', 600);
            this.clock.tick(10);

            const $appointment = $(schedulerInstance.$element().find('.dx-scheduler-appointment'));
            assert.roughEqual($appointment.position().left, 0, 1.001, 'Appointment is rendered correctly');
        }
    });
});

QUnit.module('View with configuration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Scheduler should have specific cellDuration setting of the view', function(assert) {
        const viewCellDuration = 60;
        const scheduler = createWrapper({
            views: [{
                type: 'day',
                cellDuration: viewCellDuration
            }, 'week'],
            cellDuration: 40,
            currentView: 'day'
        });

        let workSpace = scheduler.instance.getWorkSpace();

        assert.equal(workSpace.option('hoursInterval') * 60, viewCellDuration, 'value of the cellDuration');

        scheduler.instance.option('currentView', 'week');

        workSpace = scheduler.instance.getWorkSpace();

        assert.equal(workSpace.option('hoursInterval') * 60, scheduler.instance.option('cellDuration'), 'workspace has correct cellDuration after change');

    });

    QUnit.test('Scheduler should have specific startDayHour setting of the view', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'day',
                startDayHour: 10
            }],
            startDayHour: 8,
            currentView: 'day'
        });

        assert.equal(scheduler.instance._workSpace.option('startDayHour'), 10, 'value of the startDayHour');
    });

    QUnit.test('Scheduler should have specific endDayHour setting of the view', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'day',
                endDayHour: 20
            }],
            endDayHour: 23,
            currentView: 'day'
        });

        assert.equal(scheduler.instance._workSpace.option('endDayHour'), 20, 'value of the endDayHour');
    });

    QUnit.test('Scheduler should have specific firstDayOfWeek setting of the view', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'workWeek',
                firstDayOfWeek: 0
            }],
            firstDayOfWeek: 3,
            currentView: 'workWeek'
        });

        assert.equal(scheduler.instance._workSpace.option('firstDayOfWeek'), 0, 'value of the firstDayOfWeek in workSpace');
        assert.equal(scheduler.instance._header.option('firstDayOfWeek'), 0, 'value of the firstDayOfWeek in header');
    });

    QUnit.test('Scheduler should have specific groups setting of the view', function(assert) {
        const dataSource1 = [
            { id: 1, text: 'group1' },
            { id: 2, text: 'group2' }
        ];
        const dataSource2 = [
            { id: 1, text: 'group3' },
            { id: 2, text: 'group4' }
        ];

        const scheduler = createWrapper({
            views: [{
                type: 'workWeek',
                groups: ['test2']
            }],
            groups: ['test1'],
            resources: [
                {
                    field: 'test1',
                    dataSource: dataSource1
                },
                {
                    field: 'test2',
                    dataSource: dataSource2
                }
            ],
            currentView: 'workWeek'
        });

        assert.deepEqual(scheduler.instance._workSpace.option('groups'), [{
            data: dataSource2,
            items: dataSource2,
            name: 'test2'
        }], 'value of the groups');
    });

    QUnit.test('Scheduler should have specific agendaDuration setting of the view', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'agenda',
                agendaDuration: 4
            }],
            agendaDuration: 7,
            currentView: 'agenda'
        });

        assert.equal(scheduler.instance._workSpace.option('agendaDuration'), 4, 'value of the agendaDuration');
    });

    QUnit.test('Scheduler should have specific appointmentTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1)
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'week',
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate2++;
                }
            }],
            appointmentTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentTemplate setting of the view after current view changing', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 26, 9, 10),
                endDate: new Date(2015, 4, 26, 11, 1)
            }],
            currentDate: new Date(2015, 4, 26),
            views: [{
                type: 'week',
                name: 'Week',
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate1++;
                }
            }, {
                type: 'workWeek',
                name: 'WorkWeek',
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate2++;
                }
            }],
            currentView: 'Week'
        });

        scheduler.instance.option('currentView', 'WorkWeek');

        assert.notEqual(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentTooltipTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'month',
                appointmentTooltipTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate2++;
                }
            }],
            appointmentTooltipTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'month'
        });

        $(scheduler.instance.$element().find('.dx-scheduler-appointment-collector').eq(0)).trigger('dxclick');

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentCollectorTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'month',
                appointmentCollectorTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            appointmentCollectorTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'month'
        });

        $(scheduler.instance.$element().find('.dx-scheduler-appointment-collector').eq(0)).trigger('dxclick');

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentTooltipTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1)
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'week',
                appointmentTooltipTemplate: function(model, index, container) {
                    assert.equal(isRenderer(container), !!config().useJQuery, 'element is correct');
                    countCallTemplate2++;
                }
            }],
            appointmentTooltipTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0)).trigger('dxclick');
        this.clock.tick(300);

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Check appointment takes all day by certain startDayHour and endDayHour', function(assert) {
        const scheduler = createWrapper({
            startDayHour: 9,
            endDayHour: 18,
            views: [{
                type: 'week',
                startDayHour: 7,
                endDayHour: 23
            }],
            currentView: 'week'
        });

        let result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 9),
            endDate: new Date(2015, 5, 4, 18)
        });

        assert.ok(!result, 'Appointment doesn\'t takes all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 7),
            endDate: new Date(2015, 5, 4, 23)
        });

        assert.ok(!result, 'Appointment doesn\'t takes all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 7),
            endDate: new Date(2015, 5, 5, 7)
        });

        assert.ok(result, 'Appointment takes all day');
    });


    ['day', 'week', 'month'].forEach(viewName => {
        QUnit.test(`Cell should have default height if view: '${viewName}'`, function(assert) {
            const DEFAULT_CELL_HEIGHT = 50;

            const scheduler = createWrapper({
                views: [viewName],
                currentView: viewName
            });

            const cellHeight = scheduler.workSpace.getCellHeight(0, 0);
            assert.equal(cellHeight, DEFAULT_CELL_HEIGHT, 'Cell has min height');
        });
    });

    ['timelineDay', 'timelineWeek', 'timelineMonth'].forEach(viewName => {
        QUnit.test(`Group header height should be equals to the grouping cell height if view: '${viewName}'`, function(assert) {
            const scheduler = createWrapper({
                views: [viewName],
                currentView: viewName,
                groups: ['any'],
                resources: [{
                    fieldExpr: 'any',
                    dataSource: [
                        { text: 'Group_1', id: 1 },
                        { text: 'Group_2', id: 2 },
                        { text: 'Group_3', id: 3 }
                    ],
                }]
            });

            const $groupHeaders = $(scheduler.workSpace.groups.getGroupHeaders(0));
            $groupHeaders.each((index, groupHeader) => {
                const groupHeaderHeight = getOuterHeight($(groupHeader));
                const groupingCellHeight = scheduler.workSpace.getCellHeight(index, 0);
                assert.equal(groupHeaderHeight, groupingCellHeight, `Group header ${index} has min height`);
            });
        });
    });

    ['day', 'week', 'month'].forEach(viewName => {
        [undefined, 2, 3].forEach(intervalCount => {
            [undefined, 200, 300, 800].forEach(height => {
                QUnit.test(`Workspace vertical scroll should be equal to the dataTable height if view: '${viewName}', view.intervalCount: ${intervalCount}, height: ${height}`, function(assert) {
                    const scheduler = createWrapper({
                        height: height,
                        views: [{
                            type: viewName,
                            name: viewName,
                            intervalCount: intervalCount
                        }],
                        currentView: viewName
                    });

                    const dateTableHeight = scheduler.workSpace.getDateTableHeight();
                    const scrollable = scheduler.workSpace.getScrollable();
                    assert.roughEqual(scrollable.scrollHeight(), dateTableHeight, 1.01, 'Scroll height > minWorspaceHeight');
                });

                [true, false].forEach((renovateRender) => {
                    QUnit.test(`Workspace vertical scroll should be equal to the dataTable height if grouping, view: '${viewName}', view.intervalCount=${intervalCount}, height: ${height}`, function(assert) {
                        const scheduler = createWrapper({
                            height: height,
                            views: [{
                                type: viewName,
                                name: viewName,
                                intervalCount: intervalCount
                            }],
                            currentView: viewName,
                            groups: ['any'],
                            resources: [{
                                fieldExpr: 'any',
                                dataSource: [
                                    { text: 'Group_1', id: 1 },
                                    { text: 'Group_2', id: 2 },
                                    { text: 'Group_3', id: 3 }
                                ],
                            }],
                            renovateRender,
                        });

                        const dateTableHeight = scheduler.workSpace.getDateTableHeight();
                        const scrollable = scheduler.workSpace.getScrollable();
                        assert.roughEqual(scrollable.scrollHeight(), dateTableHeight, 1.01, 'Scroll height > minWorspaceHeight');
                    });
                });
            });
        });
    });

    QUnit.test('Scrollable content should have correct height when native scrolling is used and a cell\'s height is greater than default', function(assert) {
        if(isRenovatedScrollable) {
            // this scenario doesn't relevant for renovated widget
            assert.ok(true, 'skip test');
            return;
        }

        const scheduler = createWrapper({
            height: 1500,
            views: ['month'],
            currentView: 'month',
        });

        const scrollable = scheduler.workSpace.getScrollable();
        scrollable.option('useNative', true);

        const dateTableHeight = scheduler.workSpace.getDateTableHeight();
        const scrollHeight = scrollable.scrollHeight();
        const scrollableHeight = getHeight(scrollable.$element());

        assert.roughEqual(scrollableHeight, dateTableHeight, 1.001, 'Correct dateTable height');
        assert.equal(scrollableHeight, scrollHeight, 'Correct scroll content height');
    });

    QUnit.test('Scrollable content should have correct height when native scrolling is used and a cell\'s height is equal to default', function(assert) {
        if(isRenovatedScrollable) {
            // this scenario doesn't relevant for renovated widget
            assert.ok(true, 'skip test');
            return;
        }

        const scheduler = createWrapper({
            height: 500,
            views: [{
                type: 'month',
                intervalCount: 5,
            }],
            currentView: 'month',
        });

        const scrollable = scheduler.workSpace.getScrollable();
        scrollable.option('useNative', true);

        const dateTableHeight = scheduler.workSpace.getDateTableHeight();
        const scrollHeight = scrollable.scrollHeight();
        const scrollableHeight = getHeight(scrollable.$element());

        assert.equal(scrollHeight, dateTableHeight, 'Correct dateTable height');
        assert.notEqual(scrollableHeight, scrollHeight, 'Correct scroll content height');
    });
});

QUnit.module('Options for Material-based themes in components', {
    beforeEach: function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        themes.isMaterialBased = this.origIsMaterialBased;
    }
}, () => {
    QUnit.test('_collectorOffset option should be passed to SchedulerAppointments depending on the view', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            showCurrentTimeIndicator: false
        });

        const appointments = scheduler.instance.getAppointmentsInstance();

        assert.equal(appointments.option('_collectorOffset'), 20, 'SchedulerAppointments has correct _collectorOffset');

        scheduler.instance.option('currentView', 'week');
        assert.equal(appointments.option('_collectorOffset'), 0, 'SchedulerAppointments has correct _collectorOffset');
    });

    QUnit.test('Real _collectorOffset option should be passed to SchedulerAppointments depending on the adaptivityEnabled', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            showCurrentTimeIndicator: false,
            adaptivityEnabled: false
        });

        let appointments = scheduler.instance.getAppointmentsInstance();

        assert.equal(appointments.option('_collectorOffset'), 20, 'SchedulerAppointments has correct _collectorOffset');

        scheduler.instance.option('adaptivityEnabled', true);
        appointments = scheduler.instance.getAppointmentsInstance();

        assert.equal(appointments.option('_collectorOffset'), 0, 'SchedulerAppointments has correct _collectorOffset');
    });
});

QUnit.module('Getting timezones', {}, () => {
    const findTimeZone = (timeZones, id) => {
        return timeZones.filter((timeZone) => timeZone.id === id)[0];

    };
    QUnit.test('getTimeZones method should return accepted timezones with correct format', function(assert) {
        const date = new Date(2020, 5, 1);
        const timeZones = getTimeZones(date);
        const firstTimeZone = timeZones[0];

        assert.ok(timeZones instanceof Array, 'method returns an array');
        assert.ok(Object.prototype.hasOwnProperty.call(firstTimeZone, 'id'), 'returned timeZone has an id');
        assert.ok(Object.prototype.hasOwnProperty.call(firstTimeZone, 'offset'), 'returned timeZone has an offset');
        assert.ok(Object.prototype.hasOwnProperty.call(firstTimeZone, 'title'), 'returned timeZone has a title');
    });

    QUnit.test('getTimeZones should take into account custom timezones', function(assert) {
        try {
            const timezone = 'America/Los_Angeles';
            config({
                timezones: [{
                    id: timezone,
                    untils: 'Infinity',
                    offsets: '60000',
                    offsetIndices: '0',
                }]
            });
            const date = new Date(2020, 5, 1);
            const timeZones = getTimeZones(date);
            const targetTimezone = timeZones.filter(tz => tz.id === timezone)[0];

            assert.ok(timeZones instanceof Array, 'method returns an array');
            assert.ok(Object.prototype.hasOwnProperty.call(targetTimezone, 'id'), 'returned timeZone has an id');
            assert.ok(Object.prototype.hasOwnProperty.call(targetTimezone, 'offset'), 'returned timeZone has an offset');
            assert.ok(Object.prototype.hasOwnProperty.call(targetTimezone, 'title'), 'returned timeZone has a title');

            assert.equal(targetTimezone.offset, -1000);

            const nonConfigTimezone = timeZones.filter(tz => tz.id === 'Europe/Berlin')[0];
            assert.equal(nonConfigTimezone.offset, 2);
        } finally {
            config({ timezones: null });
        }
    });

    QUnit.test('getTimeZones method should work properly without date passing', function(assert) {
        const timeZones = getTimeZones();
        const timeZone = findTimeZone(timeZones, 'Europe/Moscow');

        assert.deepEqual(timeZone, {
            id: 'Europe/Moscow',
            offset: 3,
            title: '(GMT +03:00) Europe - Moscow'
        }, 'some of returned timeZone is ok');
    });

    QUnit.test('getTimeZones method should return correct offsets depending on the date', function(assert) {
        const winter = '2020-03-08T01:00:00-08:00';
        const summer = '2020-03-08T02:00:00-08:00';

        let timeZones = getTimeZones(new Date(winter));
        let timeZone = findTimeZone(timeZones, 'America/Los_Angeles');

        assert.equal(timeZone.offset, -8, 'returned offset for timeZone with DST is OK');
        assert.equal(timeZone.title, '(GMT -08:00) America - Los Angeles', 'returned title for timeZone with DST is OK');

        timeZones = getTimeZones(new Date(summer));
        timeZone = findTimeZone(timeZones, 'America/Los_Angeles');

        assert.equal(timeZone.offset, -7, 'returned offset for timeZone with DST is OK');
        assert.equal(timeZone.title, '(GMT -07:00) America - Los Angeles', 'returned title for timeZone with DST is OK');
    });

    QUnit.test('Appointment should process resource names with spaces', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 10, 3, 9),
                    endDate: new Date(2015, 10, 3, 11),
                    someId: 'with space'
                }
            ],
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2015, 10, 3),
            resources: [{
                fieldExpr: 'someId',
                allowMultiple: false,
                dataSource: [{
                    text: 'with space',
                    id: 1,
                }],
                label: 'Priority',
            }],
        });

        const appointment = scheduler.appointmentList[0];
        const value = appointment.getElement().data('someidWith__32__space');

        assert.ok(value, 'attr is right');
    });
});
