import $ from 'jquery';
import dateLocalization from 'common/core/localization/date';
import { createWrapper, CLASSES, initTestMarkup, isDesktopEnvironment } from '../../helpers/scheduler/helpers.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import localization from 'localization';
import eventsEngine from 'common/core/events/core/events_engine';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'common/core/events/drag';
import { CustomStore } from 'common/data/custom_store';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import translator from 'common/core/animation/translator';
import { getOuterHeight, getInnerHeight, getOuterWidth } from 'core/utils/size';

const SELECTED_CELL_CLASS = CLASSES.selectedCell.slice(1);
const FOCUSED_CELL_CLASS = CLASSES.focusedCell.slice(1);

const { testStart, module, test } = QUnit;

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    },
};

module('Integration: Work space', { ...moduleConfig }, () => {
    test('Scheduler should have a right work space', function(assert) {
        const scheduler = createWrapper({
            views: ['day', 'week'],
            currentView: 'day'
        });
        const $element = scheduler.instance.$element();

        assert.ok($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance'), 'Work space is day on init');

        scheduler.instance.option('currentView', 'week');

        assert.ok($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance'), 'Work space is week after change option ');
    });

    test('Work space should have correct currentDate option', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 0, 28)
        });
        const $element = scheduler.instance.$element();

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('currentDate'), new Date(2015, 0, 28), 'Work space has a right currentDate option');

        scheduler.instance.option('currentDate', new Date(2015, 1, 28));

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('currentDate'), new Date(2015, 1, 28), 'Work space has a right currentDate option');
    });

    test('Work space should have correct firstDayOfWeek option', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            firstDayOfWeek: 2
        });
        const $element = scheduler.instance.$element();

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('firstDayOfWeek'), 2, 'Work space has a right first day of week');

        scheduler.instance.option('firstDayOfWeek', 1);

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('firstDayOfWeek'), 1, 'Work space has a right first day of week');
    });

    test('Scheduler work space should have a single type class', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            firstDayOfWeek: 2,
            views: ['day', 'week', 'workWeek', 'month']
        });

        const $element = scheduler.instance.$element();

        const check = function(className) {
            let checked = true;
            $.each([
                'dx-scheduler-work-space-day',
                'dx-scheduler-work-space-week',
                'dx-scheduler-work-space-work-week',
                'dx-scheduler-work-space-month'
            ], function(_, item) {
                if(className === item) {
                    checked = checked && $element.find('.' + className).length === 1;
                } else {
                    checked = checked && (!$element.find('.' + item).length);
                }
            });

            return checked;
        };

        scheduler.instance.option('currentView', 'day');
        assert.ok(check('dx-scheduler-work-space-day'), 'Work space has a right type class');

        scheduler.instance.option('currentView', 'week');
        assert.ok(check('dx-scheduler-work-space-week'), 'Work space has a right type class');

        scheduler.instance.option('currentView', 'workWeek');
        assert.ok(check('dx-scheduler-work-space-work-week'), 'Work space has a right type class');

        scheduler.instance.option('currentView', 'month');
        assert.ok(check('dx-scheduler-work-space-month'), 'Work space has a right type class');
    });

    ['standard', 'virtual'].forEach((scrollingMode) => {
        test(`Pointer down on workspace cell should focus cell in ${scrollingMode} mode`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 1, 10),
                scrolling: { mode: scrollingMode, orientation: 'both' },
            });

            const $firstCell = $(scheduler.instance.$element()).find('.dx-scheduler-date-table td').eq(0);
            const $otherCell = $(scheduler.instance.$element()).find('.dx-scheduler-date-table td').eq(1);

            $firstCell.trigger('dxpointerdown');

            assert.ok($firstCell.hasClass('dx-state-focused'), 'first cell was focused after first pointerdown');

            $otherCell.trigger('dxpointerdown');

            assert.ok(!$firstCell.hasClass('dx-state-focused'), 'first cell is not focused');
            assert.ok($otherCell.hasClass('dx-state-focused'), 'other cell is focused');
        });
    });

    test('Double click on workspace cell should call scheduler.showAppointmentPopup method in day view', function(assert) {
        const scheduler = createWrapper({ currentDate: new Date(2015, 1, 10) });
        const spy = sinon.spy();
        const showAppointmentPopup = scheduler.instance.showAppointmentPopup;
        scheduler.instance.showAppointmentPopup = spy;
        try {

            pointerMock(scheduler.instance.$element().find('.dx-scheduler-all-day-table-cell').first()).start().click().click();

            assert.ok(spy.calledOnce, 'showAppointmentPopup is called');
            assert.deepEqual(spy.getCall(0).args[0], {
                startDate: new Date(2015, 1, 10, 0, 0),
                endDate: new Date(2015, 1, 10, 0, 0),
                allDay: true
            }, 'showAppointmentPopup has a right arguments');
            assert.ok(spy.calledOn(scheduler.instance), 'showAppointmentPopup has a right context');

            pointerMock(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(3)).start().click().click();
            assert.deepEqual(spy.getCall(1).args[0], {
                startDate: new Date(2015, 1, 10, 1, 30),
                endDate: new Date(2015, 1, 10, 2, 0),
                allDay: false
            }, 'showAppointmentPopup has a right arguments');

        } finally {
            scheduler.instance.showAppointmentPopup = showAppointmentPopup;
        }
    });

    test('Double click on works space cell should call scheduler.showAppointmentPopup method in week view', function(assert) {
        const scheduler = createWrapper({ currentDate: new Date(2015, 1, 9), currentView: 'week', firstDayOfWeek: 1 });
        const spy = sinon.spy();
        const showAppointmentPopup = scheduler.instance.showAppointmentPopup;
        scheduler.instance.showAppointmentPopup = spy;
        try {

            pointerMock(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(22)).start().click().click();
            assert.deepEqual(spy.getCall(0).args[0], {
                startDate: new Date(2015, 1, 10, 1, 30),
                endDate: new Date(2015, 1, 10, 2, 0),
                allDay: false
            }, 'showAppointmentPopup has a right arguments');

        } finally {
            scheduler.instance.showAppointmentPopup = showAppointmentPopup;
        }
    });

    test('Double click on work space cell should call scheduler.showAppointmentPopup method in month view', function(assert) {
        const scheduler = createWrapper({ currentDate: new Date(2015, 1, 9), currentView: 'month', firstDayOfWeek: 1 });
        const spy = sinon.spy();
        const showAppointmentPopup = scheduler.instance.showAppointmentPopup;
        scheduler.instance.showAppointmentPopup = spy;
        try {

            pointerMock(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(22)).start().click().click();
            assert.deepEqual(spy.getCall(0).args[0], {
                startDate: new Date(2015, 1, 17),
                endDate: new Date(2015, 1, 18)
            }, 'showAppointmentPopup has a right arguments');

        } finally {
            scheduler.instance.showAppointmentPopup = showAppointmentPopup;
        }
    });

    test('scheduler.showAppointmentPopup method should have resource arg if there is some resource', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            firstDayOfWeek: 1,
            groups: ['ownerId'],
            resources: [
                {
                    fieldExpr: 'ownerId',
                    dataSource: [
                        { id: 1, text: 'John' },
                        { id: 2, text: 'Mike' }
                    ]
                }
            ]
        });
        const spy = sinon.spy();
        const showAppointmentPopup = scheduler.instance.showAppointmentPopup;
        scheduler.instance.showAppointmentPopup = spy;
        try {
            pointerMock(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(24)).start().click().click();
            assert.deepEqual(spy.getCall(0).args[0], {
                startDate: new Date(2015, 1, 12, 0, 30),
                endDate: new Date(2015, 1, 12, 1),
                ownerId: 2,
                allDay: false
            }, 'showAppointmentPopup has a right arguments');

        } finally {
            scheduler.instance.showAppointmentPopup = showAppointmentPopup;
        }
    });

    test('scheduler.showAppointmentPopup method should have resource arg if there is some resource and view is month', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            firstDayOfWeek: 1,
            groups: ['ownerId'],
            resources: [
                {
                    fieldExpr: 'ownerId',
                    dataSource: [
                        { id: 1, text: 'John' },
                        { id: 2, text: 'Mike' }
                    ]
                }
            ]
        });
        const spy = sinon.spy();
        const showAppointmentPopup = scheduler.instance.showAppointmentPopup;
        scheduler.instance.showAppointmentPopup = spy;
        try {

            pointerMock(scheduler.instance.$element().find('.dx-scheduler-date-table-cell').eq(22)).start().click().click();
            assert.deepEqual(spy.getCall(0).args[0], {
                startDate: new Date(2015, 1, 3),
                endDate: new Date(2015, 1, 4),
                ownerId: 2
            }, 'showAppointmentPopup has a right arguments');

        } finally {
            scheduler.instance.showAppointmentPopup = showAppointmentPopup;
        }
    });

    test('WorkSpace should have a correct \'groups\' option', function(assert) {
        const scheduler = createWrapper({
            groups: ['resource1'],
            resources: [
                {
                    displayExpr: 'name',
                    valueExpr: 'key',
                    fieldExpr: 'resource1',
                    dataSource: [
                        { key: 1, name: 'One' },
                        { key: 2, name: 'Two' }
                    ]
                },
                {
                    fieldExpr: 'resource2',
                    dataSource: [
                        { id: 1, text: 'Room 1' }
                    ]
                }
            ]
        });

        let workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

        assert.deepEqual(workSpace.option('groups'),
            [
                {
                    name: 'resource1',
                    items: [
                        { id: 1, text: 'One' },
                        { id: 2, text: 'Two' }
                    ],
                    data: [
                        { key: 1, name: 'One' },
                        { key: 2, name: 'Two' }
                    ]
                }
            ],
            'Groups are OK');

        scheduler.instance.option('groups', ['resource2']);

        workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');
        assert.deepEqual(workSpace.option('groups'),
            [
                {
                    name: 'resource2',
                    items: [
                        { id: 1, text: 'Room 1' }
                    ],
                    data: [
                        { id: 1, text: 'Room 1' }
                    ]
                }
            ],
            'Groups are OK');
    });

    test('updateScrollPosition should work correctly when groups were not set (T946739)', function(assert) {
        const scheduler = createWrapper({
            resources: [
                {
                    displayExpr: 'name',
                    valueExpr: 'key',
                    fieldExpr: 'resource1',
                    dataSource: [
                        { key: 1, name: 'One' },
                        { key: 2, name: 'Two' }
                    ]
                }
            ]
        });

        const resources = { name: [1] };
        const workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');
        workSpace.updateScrollPosition(new Date(2015, 2, 4), resources);
        assert.ok(true, 'Scroll position was updated');
    });

    test('WorkSpace should have a correct \'startDayHour\' option', function(assert) {
        const scheduler = createWrapper({
            startDayHour: 1
        });

        const workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

        assert.equal(workSpace.option('startDayHour'), 1, 'Start day hour is OK on init');

        scheduler.instance.option('startDayHour', 5);
        assert.equal(workSpace.option('startDayHour'), 5, 'Start day hour is OK if option is changed');
    });

    test('WorkSpace should have a correct \'endDayHour\' option', function(assert) {
        const scheduler = createWrapper({
            endDayHour: 10
        });

        const workSpace = scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

        assert.equal(workSpace.option('endDayHour'), 10, 'End day hour is OK on init');

        scheduler.instance.option('endDayHour', 12);
        assert.equal(workSpace.option('endDayHour'), 12, 'End day hour is OK if option is changed');
    });

    test('drop and dragenter handlers should be different for date table and allDay table, T245137', function(assert) {
        const log = {};

        log[dragEvents.drop] = {};
        log[dragEvents.enter] = {};

        const onSpy = sinon.spy(eventsEngine, 'on');

        createWrapper({
            editing: true
        });

        onSpy.getCalls().forEach(function(spyCall) {
            const $element = $(spyCall.args[0]);
            const eventName = spyCall.args[1];
            const logByEvent = log[eventName.split('.')[0]];
            const namespace = eventName.split('.')[1];

            if(!logByEvent || namespace !== 'dxSchedulerDateTable') {
                return;
            }

            if($element.hasClass('dx-scheduler-work-space')) {
                logByEvent['selector'] = spyCall.args[2];
            }
        });

        assert.strictEqual(log[dragEvents.drop].selector, '.dx-scheduler-date-table td, .dx-scheduler-all-day-table td', 'Drop event: selector is correct');
        assert.strictEqual(log[dragEvents.enter].selector, '.dx-scheduler-date-table td, .dx-scheduler-all-day-table td', 'Drag enter event: selector is correct');

        eventsEngine.on.restore();
    });

    test('event handlers should be reattached after changing allDayExpanded', function(assert) {
        const onSpy = sinon.spy(eventsEngine, 'on').withArgs(sinon.match(function(element) {
            return $(element).hasClass('dx-scheduler-work-space');
        }), sinon.match(function(eventName) {
            const namespace = eventName.split('.')[1];
            eventName = eventName.split('.')[0];

            return eventName === dragEvents.drop && namespace === 'dxSchedulerDateTable';
        }));

        const scheduler = createWrapper();

        const previousSubscriptionsLength = onSpy.callCount;

        scheduler.instance.getWorkSpace().option('allDayExpanded', true);

        assert.ok(onSpy.callCount > previousSubscriptionsLength, 'Events were reattached');

        eventsEngine.on.restore();
    });

    test('Work space should have right all-day-collapsed class on init', function(assert) {
        const scheduler = createWrapper({
            showAllDayPanel: true,
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 1, 9, 7),
                endDate: new Date(2015, 1, 9, 8),
            }]
        });
        const $element = scheduler.instance.$element();
        const $workSpace = $element.find('.dx-scheduler-work-space');

        assert.ok($workSpace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work-space has right class');

        scheduler.instance.option('dataSource', [{
            text: 'a',
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 7, 30),
            allDay: true
        }]);

        assert.notOk($workSpace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work-space has not \'all-day-expanded\' class');
    });

    test('Work space should have right showAllDayPanel option value', function(assert) {
        const { instance } = createWrapper({
            showAllDayPanel: false
        });
        const workspace = instance.getWorkSpace();

        assert.equal(workspace.type, 'day', 'WorkSpace type is Day');
        assert.equal(workspace.option('showAllDayPanel'), false, 'Work space has a correct allDay visibility');

        workspace.option('showAllDayPanel', true);

        assert.equal(workspace.option('showAllDayPanel'), true, 'Work space has a correct allDay visibility');
        assert.equal(workspace.type, 'day', 'WorkSpace type is Day');
    });

    test('Work space \'allDayExpanded\' option value when \'showAllDayPanel\' = true', function(assert) {
        const scheduler = createWrapper({
            showAllDayPanel: true,
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 1, 9, 7),
                endDate: new Date(2015, 1, 9, 7, 30),
                allDay: true
            }]
        });

        const $element = scheduler.instance.$element();

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), true, 'Work space has a right allDay visibility');

        scheduler.instance.option('dataSource', [{
            text: 'a',
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 9),
            allDay: false
        }]);

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), false, 'Work space has a right allDay visibility');
    });

    test('Work space "allDayExpanded" option value should be correct after changing view', function(assert) {
        const scheduler = createWrapper({
            showAllDayPanel: true,
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 1, 10, 7),
                endDate: new Date(2015, 1, 10, 7, 30),
                allDay: true
            }]
        });

        const $element = scheduler.instance.$element();

        scheduler.instance.option('currentView', 'day');
        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), false, 'Work space has a right allDay visibility');

        scheduler.instance.option('currentView', 'week');
        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), true, 'Work space has a right allDay visibility');
    });

    test('Work space \'allDayExpanded\' option value should be correct after changing currentDate', function(assert) {
        const scheduler = createWrapper({
            showAllDayPanel: true,
            currentDate: new Date(2015, 1, 9),
            currentView: 'day',
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 1, 9),
                endDate: new Date(2015, 1, 9, 0, 30),
                allDay: true
            }]
        });

        const $element = scheduler.instance.$element();

        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), true, 'Work space has a right allDay visibility');

        scheduler.instance.option('currentDate', new Date(2015, 1, 10));
        assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), false, 'Work space has a right allDay visibility');
    });

    test('Work space \'allDayExpanded\' option value should be correct after deleting last allDay appointment', function(assert) {
        const appointment = {
            text: 'a',
            startDate: new Date(2015, 1, 10, 7),
            allDay: true
        };

        const scheduler = createWrapper({
            showAllDayPanel: true,
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            dataSource: [appointment]
        });

        scheduler.instance.deleteAppointment(appointment);

        assert.deepEqual(scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), false, 'Work space has correct allDay visibility');
    });

    test('Work space \'allDayExpanded\' option should depend on client-side filtered appointments', function(assert) {
        const appointment = {
            text: 'All-day',
            startDate: new Date(2015, 2, 4),
            endDate: new Date(2015, 2, 5),
            allDay: true,
            recurrenceRule: 'FREQ=DAILY'
        };

        const scheduler = createWrapper({
            showAllDayPanel: true,
            currentView: 'day',
            startDayHour: 3,
            endDayHour: 10,
            currentDate: new Date(2015, 2, 3),
            firstDayOfWeek: 1,
            dataSource: [appointment]
        });

        assert.deepEqual(scheduler.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), false, 'Work space has correct allDay visibility');
    });

    test('Cell data should be applied when resources are loaded', function(assert) {
        const done = assert.async();
        const scheduler = createWrapper({
            currentView: 'day',
            groups: ['owner'],
            startDayHour: 10,
            endDayHour: 12,
            resources: [
                {
                    fieldExpr: 'owner',
                    dataSource: new CustomStore({
                        load: function() {
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([{ id: 1 }, { id: 2 }]);
                            }, 300);
                            return d.promise();
                        }
                    })
                }
            ],
            dataSource: [],
            onContentReady: (e) => {
                if(!e.component.option('renovateRender')) {
                    const groups = e.component.$element().find('.dx-scheduler-date-table-cell').data('dxCellData').groups;
                    assert.deepEqual(groups, { owner: 1 });
                }

                const cellCount = scheduler.workSpace.getCells().length;

                assert.equal(cellCount, 8, 'Correct cell count');

                done();
            }
        });
    });

    test('Duplicated elements should not be rendered when resources are loaded asynchronously (T661335)', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const scheduler = createWrapper({
                currentView: 'day',
                groups: ['owner'],
                resources: [
                    {
                        fieldExpr: 'owner',
                        dataSource: [{ id: 1 }]
                    },
                    {
                        fieldExpr: 'room',
                        dataSource: new CustomStore({
                            load: function() {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{ id: 1 }]);
                                }, 100);
                                return d.promise();
                            }
                        })
                    }
                ],
                dataSource: []
            });

            scheduler.instance.option('groups', ['room']);
            scheduler.instance.repaint();
            clock.tick(100);

            const $workspace = scheduler.instance.$element().find('.dx-scheduler-work-space');
            assert.equal($workspace.length, 1, 'Duplicated workSpace wasn\'t rendered');
        } finally {
            clock.restore();
        }
    });

    test('Cell data should be updated after view changing', function(assert) {
        const scheduler = createWrapper({
            views: ['day', 'week'],
            currentView: 'day',
            dataSource: [{
                text: 'test',
                startDate: new Date(2016, 8, 5, 1),
                endDate: new Date(2016, 8, 5, 1),
            }],
            currentDate: new Date(2016, 8, 5),
            firstDayOfWeek: 0
        });

        scheduler.instance.option('currentView', 'week');

        const workSpace = scheduler.instance.getWorkSpace();
        assert.deepEqual(workSpace.getCellDataByCoordinates({
            top: 10,
            left: 100,
        }), {
            allDay: false,
            startDate: new Date(2016, 8, 4),
            endDate: new Date(2016, 8, 4, 0, 30),
            groupIndex: 0,
        }, 'Cell data is OK!');
    });

    test('Appointments in month view should be sorted same as in all-day section', function(assert) {
        const items = [{
            text: '1',
            startDate: new Date(2016, 1, 11, 13, 0),
            endDate: new Date(2016, 1, 10, 14, 0),
            allDay: true
        }, {
            text: '2',
            startDate: new Date(2016, 1, 11, 12, 0),
            endDate: new Date(2016, 1, 10, 13, 0),
            allDay: true
        }, {
            text: '3',
            startDate: new Date(2016, 1, 11, 11, 0),
            endDate: new Date(2016, 1, 10, 12, 0),
            allDay: true
        }];
        const scheduler = createWrapper({
            dataSource: items,
            currentDate: new Date(2016, 1, 11),
            currentView: 'week',
            height: 600,
            maxAppointmentsPerCell: 'unlimited'
        });

        const allDayAppointments = scheduler.instance.$element().find('.dx-scheduler-appointment');
        let i;

        for(i = 0; i < 3; i++) {
            assert.deepEqual(allDayAppointments.eq(i).data('dxItemData'), items[i], 'Order is right');
        }

        scheduler.instance.option('currentView', 'month');

        const monthAppointments = scheduler.instance.$element().find('.dx-scheduler-appointment');
        for(i = 0; i < 3; i++) {
            assert.deepEqual(monthAppointments.eq(i).data('dxItemData'), items[i], 'Order is right');
        }
    });

    test('Timepanel text should be calculated correctly if DST makes sense (T442904)', function(assert) {
        // can be reproduced in PST timezone
        const scheduler = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2016, 10, 6),
            firstDayOfWeek: 0,
            startDayHour: 1,
            timeZone: 'America/Los_Angeles',
            height: 600
        });

        const $cells = scheduler.instance.$element().find('.dx-scheduler-time-panel-cell div');

        assert.equal($cells.eq(0).text(), dateLocalization.format(new Date(2016, 10, 6, 1), 'shorttime'), 'Cell text is OK');
        assert.equal($cells.eq(2).text(), dateLocalization.format(new Date(2016, 10, 6, 2), 'shorttime'), 'Cell text is OK');
    });

    test('DateTimeIndicator should show correct time in current time zone', function(assert) {
        const currentDate = new Date(2021, 4, 26);

        const scheduler = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            cellDuration: 60,
            startDayHour: 8,
            showCurrentTimeIndicator: true,
            currentDate: currentDate,
            timeZone: 'Europe/Moscow',
            indicatorTime: new Date('2021-05-26T08:30:00.000Z'),
            height: 600
        });

        const indicatorPositionBefore = scheduler.instance.$element().find('.dx-scheduler-date-time-indicator').position();
        const cellHeight = $(scheduler.instance.$element()).find('.dx-scheduler-date-table td').eq(0).get(0).getBoundingClientRect().height;

        scheduler.instance.option('timeZone', 'Asia/Yekaterinburg');

        const indicatorPositionAfter = scheduler.instance.$element().find('.dx-scheduler-date-time-indicator').position();

        assert.equal(indicatorPositionAfter.top, indicatorPositionBefore.top + cellHeight * 2, 'indicator has correct position');
    });

    if(isDesktopEnvironment()) {
        test('ScrollToTime works correctly with timelineDay and timelineWeek view (T749957)', function(assert) {
            const date = new Date(2019, 5, 1, 9, 40);

            const scheduler = createWrapper({
                dataSource: [],
                views: ['timelineDay', 'day', 'timelineWeek', 'week', 'timelineMonth'],
                currentView: 'timelineDay',
                currentDate: date,
                firstDayOfWeek: 0,
                startDayHour: 0,
                endDayHour: 20,
                cellDuration: 60,
                groups: ['priority'],
                height: 580,
            });

            scheduler.instance.scrollToTime(date.getHours() - 1, 30, date);
            let scroll = scheduler.workSpace.getDateTableScrollable().find('.dx-scrollable-scroll')[0];

            assert.notEqual(translator.locate($(scroll)).left, 0, 'Container is scrolled in timelineDay');

            scheduler.instance.option('currentView', 'timelineWeek');

            scheduler.instance.scrollToTime(date.getHours() - 1, 30, date);
            scroll = scheduler.workSpace.getDateTableScrollable().find('.dx-scrollable-scroll')[0];

            assert.notEqual(translator.locate($(scroll)).left, 0, 'Container is scrolled in timelineWeek');
        });
    }

    test('intervalCount should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2017, 3, 16),
            views: [{
                type: 'day',
                name: 'Test Day',
                intervalCount: 2
            }],
            currentView: 'day',
            height: 500
        });

        const workSpace = scheduler.instance.getWorkSpace();

        assert.equal(workSpace.option('intervalCount'), 2, 'option intervalCount was passed');
    });

    test('Group header should contain group header content with right height, groupOrientation = vertical', function(assert) {
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

        const scheduler = createWrapper({
            dataSource: [],
            views: [{
                type: 'day',
                name: 'day',
                groupOrientation: 'vertical' }],
            currentView: 'day',
            showAllDayPanel: true,
            currentDate: new Date(2018, 2, 16),
            groups: ['priorityId'],
            resources: [{
                fieldExpr: 'priorityId',
                allowMultiple: false,
                dataSource: priorityData,
                label: 'Priority'
            }
            ],
            startDayHour: 9,
            endDayHour: 12,
            height: 600
        });
        const $headerContent = getOuterHeight(scheduler.workSpace.groups.getGroupHeader(0));
        const cellHeight = getOuterHeight(scheduler.workSpace.getCell(1));

        assert.roughEqual($headerContent, 7 * cellHeight, 1, 'Group header content has right height');
    });

    test('WorkSpace should be refreshed after groups changed', function(assert) {
        const scheduler = createWrapper({
            groups: ['resource1'],
            resources: [
                {
                    displayExpr: 'name',
                    valueExpr: 'key',
                    fieldExpr: 'resource1',
                    dataSource: [
                        { key: 1, name: 'One' },
                        { key: 2, name: 'Two' }
                    ]
                },
                {
                    fieldExpr: 'resource2',
                    dataSource: [
                        { id: 1, text: 'Room 1' }
                    ]
                }
            ]
        });

        const refreshStub = sinon.stub(scheduler.instance, '_refreshWorkSpace');

        try {
            scheduler.instance.option('groups', ['resource2']);

            assert.ok(refreshStub.calledOnce, 'Workspace was refreshed');

        } finally {
            refreshStub.restore();
        }
    });

    ['standard', 'virtual'].forEach((scrollingMode) => {
        test(`SelectedCellData option should have rigth data of focused cell when scrolling is ${scrollingMode}`, function(assert) {
            const scheduler = createWrapper({
                dataSource: [],
                views: ['week'],
                currentView: 'week',
                showAllDayPanel: true,
                currentDate: new Date(2018, 3, 11),
                height: 600,
                scrolling: { mode: scrollingMode, orientation: 'both' },
            });

            const $cells = scheduler.instance.$element().find('.dx-scheduler-date-table-cell');

            $($cells.eq(0)).trigger('dxpointerdown');

            const baseData = {
                startDate: new Date(2018, 3, 8),
                endDate: new Date(2018, 3, 8, 0, 30),
                allDay: false,
            };

            assert.deepEqual(scheduler.instance.option('selectedCellData'), [{
                ...baseData,
                groupIndex: 0,
                groups: undefined,
            }], 'option has right value');
        });

        test(`SelectedCellData option should be applied correctly in ungrouped workspace when scrolling is ${scrollingMode}`, function(assert) {
            createWrapper({
                dataSource: [],
                views: ['week'],
                currentView: 'week',
                showAllDayPanel: true,
                groups: undefined,
                currentDate: new Date(2018, 3, 11),
                height: 600,
                selectedCellData: [{
                    allDay: false,
                    startDate: new Date(2018, 3, 8),
                    endDate: new Date(2018, 3, 8, 0, 30),
                    groups: {
                        groupId: 1
                    }
                }],
                scrolling: { mode: scrollingMode },
            });

            assert.ok(true, 'WorkSpace works correctly');
        });

        test(`SelectedCellData option should make cell in focused state when scrolling is ${scrollingMode}`, function(assert) {
            const scheduler = createWrapper({
                dataSource: [],
                views: ['week'],
                currentView: 'week',
                showAllDayPanel: true,
                selectedCellData: [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }],
                currentDate: new Date(2018, 3, 11),
                height: 600,
                scrolling: { mode: scrollingMode },
            });

            const $cells = scheduler.instance.$element().find('.dx-scheduler-date-table-cell');

            assert.ok($($cells.eq(0)).hasClass('dx-state-focused', 'correct cell is focused'));
        });

        // It will work differently in renovated scheduler, but we need to take it into account
        test(`Focused cells cash should be correct (T640466) when scrolling is ${scrollingMode}`, function(assert) {
            const scheduler = createWrapper({
                dataSource: [],
                views: ['week'],
                currentView: 'week',
                showAllDayPanel: true,
                selectedCellData: [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }],
                currentDate: new Date(2018, 3, 11),
                height: 600,
                scrolling: { mode: scrollingMode },
            });
            const workSpace = scheduler.instance.getWorkSpace();

            assert.deepEqual(
                workSpace.cellsSelectionState.getSelectedCells()[0],
                {
                    startDate: new Date(2018, 3, 8),
                    endDate: new Date(2018, 3, 8, 0, 30),
                    allDay: false,
                    groupIndex: 0,
                },
                'Cashed cells is correct',
            );
        });
    });

    test('Vertical scrollable should work after switching currentDate if allDayPanel and crossScrollingEnabled are turned on', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: ['day'],
            currentView: 'day',
            showAllDayPanel: true,
            crossScrollingEnabled: true,
            currentDate: new Date(2018, 5, 14),
            height: 600
        });

        scheduler.instance.option('currentDate', new Date(2018, 5, 15));
        const $scroll = scheduler.instance.$element().find('.dx-scrollbar-vertical').eq(1);

        assert.notEqual($scroll.css('display'), 'none', 'ok');
    });

    test('Month view; dates are rendered correctly with grouping by date & empty resources in groups (T759160)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: ['month'],
            currentView: 'month',
            crossScrollingEnabled: true,
            groupByDate: true,
            currentDate: new Date(2018, 4, 21),
            groups: [],
            resources: [{
                fieldExpr: 'priorityId',
                allowMultiple: false,
                dataSource: [],
                label: 'Priority'
            }],
            height: 700
        });

        const hasNaNCellData = scheduler.workSpace.getCells().filter((index, cell) => {
            return isNaN(parseInt(cell.innerText));
        }).length;

        assert.notOk(hasNaNCellData, 'Container has valid data');
    });

    test('Workspace view has correct viewEndDate with empty groups and groupByDate = true (T815379)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            groupByDate: true,
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            groups: [],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: [],
                    label: 'Priority'
                }
            ],
            height: 700
        });

        assert.deepEqual(scheduler.instance.getEndViewDate(), new Date(2018, 4, 26, 15, 59), 'View has corrent endViewDate');
    });

    test('Workspace view group header cells have same height as table cells (T837711)', function(assert) {
        const priorityData = [
            {
                text: 'Low Priority',
                id: 1
            }, {
                text: 'High Priority',
                id: 2
            }, {
                text: 'High Priority',
                id: 3,
            }, {
                text: 'HigHigh PriorityHigh PriorityHigh Priorityh Priority',
                id: 4,
            }, {
                text: 'High PriorityHigh PriorityHigh PriorityHigh PriorityHigh Priority Priority',
                id: 5
            }, {
                text: 'High PriorityHighPriorityHighPriorityHighPriorityHighPriorityHigh Priority',
                id: 6
            }
        ];

        const scheduler = createWrapper({
            dataSource: [],
            views: ['timelineMonth'],
            currentView: 'timelineMonth',
            currentDate: new Date(2018, 4, 21),
            crossScrollingEnabled: true,
            groups: ['priority'],
            resources: [{
                fieldExpr: 'priority',
                allowMultiple: false,
                dataSource: priorityData,
                label: 'Priority'
            }],
            height: 700
        });

        const headerCells = scheduler.workSpace.groups.getGroupHeaders();

        const firstHeaderCell = headerCells.eq(0);
        const fifthHeaderCell = headerCells.eq(4);
        const dateTableCell = scheduler.workSpace.getCells().eq(0);

        assert.equal(getInnerHeight(firstHeaderCell), getInnerHeight(fifthHeaderCell), 'Header cells have same height');
        assert.equal(getInnerHeight(fifthHeaderCell), getInnerHeight(dateTableCell), 'Header cell and table cell have same height');
    });

    isDesktopEnvironment() && test('SelectedCellData option should be correct when virtual scrolling is enabled', function(assert) {
        const instance = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            showAllDayPanel: true,
            currentDate: new Date(2020, 8, 21),
            height: 300,
            scrolling: { mode: 'virtual' },
        });

        const $cells = instance.workSpace.getCells();
        const $table = instance.workSpace.getDateTable();

        $($table).trigger(
            $.Event('dxpointerdown', { target: $cells.eq(0).get(0), which: 1, pointerType: 'mouse' }),
        );
        $($table).trigger($.Event('dxpointermove', { target: $cells.eq(1).get(0), which: 1 }));

        const firstCell = {
            allDay: false,
            endDate: new Date(2020, 8, 20, 0, 30),
            groupIndex: 0,
            startDate: new Date(2020, 8, 20, 0, 0),
            groups: undefined,
        };
        const bottomCell = {
            allDay: false,
            endDate: new Date(2020, 8, 21, 0, 0),
            groupIndex: 0,
            startDate: new Date(2020, 8, 20, 23, 30),
            groups: undefined,
        };
        const lastCell = {
            allDay: false,
            endDate: new Date(2020, 8, 21, 0, 30),
            groupIndex: 0,
            startDate: new Date(2020, 8, 21, 0, 0),
            groups: undefined,
        };

        const selectedCellData = instance.option('selectedCellData');

        assert.equal(selectedCellData.length, 49, 'Correct number of selected cells');
        assert.deepEqual(selectedCellData[0], firstCell, 'First selected cell is correct');
        assert.deepEqual(selectedCellData[47], bottomCell, 'Bottom cell is correct');
        assert.deepEqual(selectedCellData[48], lastCell, 'Last selected cell is correct');
    });

    test('SelectedCellData option should not change when dateTable is scrolled', function(assert) {
        const done = assert.async();
        const scheduler = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            showAllDayPanel: true,
            currentDate: new Date(2020, 8, 21),
            height: 300,
            scrolling: { mode: 'virtual', orientation: 'both' },
        });
        scheduler.instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

        const $cells = scheduler.workSpace.getCells();
        const $table = scheduler.workSpace.getDateTable();

        $($table).trigger(
            $.Event('dxpointerdown', { target: $cells.eq(0).get(0), which: 1, pointerType: 'mouse' }),
        );

        const selectedCells = [{
            allDay: false,
            endDate: new Date(2020, 8, 20, 0, 30),
            groupIndex: 0,
            startDate: new Date(2020, 8, 20, 0, 0),
            groups: undefined,
        }];

        assert.deepEqual(scheduler.option('selectedCellData'), selectedCells, 'Correct selected cells');

        const dateTableScrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');

        dateTableScrollable.scrollTo({ y: 400 });

        setTimeout(() => {
            assert.deepEqual(scheduler.option('selectedCellData'), selectedCells, 'Correct selected cells');

            done();
        });
    });

    test('"onOptionChanged" should not be called on scroll when virtual scrolling is enabled', function(assert) {
        const done = assert.async();
        let onOptionChangedCalls = 0;
        const scheduler = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            showAllDayPanel: true,
            currentDate: new Date(2020, 8, 21),
            height: 300,
            scrolling: { mode: 'virtual', orientation: 'both' },
            onOptionChanged: ({ name }) => {
                if(name !== 'loadedResources') {
                    onOptionChangedCalls += 1;
                }
            },
        });
        scheduler.instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

        const $cells = scheduler.workSpace.getCells();
        const $table = scheduler.workSpace.getDateTable();

        const onOptionChangedSpy = sinon.spy();

        scheduler.onOptionChanged = onOptionChangedSpy;

        $($table).trigger(
            $.Event('dxpointerdown', { target: $cells.eq(0).get(0), which: 1, pointerType: 'mouse' }),
        );

        assert.equal(onOptionChangedCalls, 1, '"onOptionChanged" was triggered because selected cells have been changed');

        const dateTableScrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');

        dateTableScrollable.scrollTo({ y: 400 });

        setTimeout(() => {
            assert.equal(
                onOptionChangedCalls, 1,
                '"onOptionChanged" was not triggered again because selected cells have not been changed',
            );
            done();
        });

    });

    isDesktopEnvironment() && test('Appointment popup should be opened with correct parameters if virtual scrolling is enabled', function(assert) {
        const done = assert.async();
        const scheduler = createWrapper({
            dataSource: [],
            views: ['week'],
            currentView: 'week',
            showAllDayPanel: true,
            currentDate: new Date(2020, 8, 20),
            height: 300,
            scrolling: { mode: 'virtual', orientation: 'both' },
        });

        const { instance } = scheduler;
        instance.getWorkSpace().renderer.getRenderTimeout = () => -1;
        const showAppointmentPopupSpy = sinon.spy();
        instance.showAppointmentPopup = showAppointmentPopupSpy;

        const $cells = scheduler.workSpace.getCells();
        const $table = scheduler.workSpace.getDateTable();

        $($table).trigger(
            $.Event('dxpointerdown', { target: $cells.eq(0).get(0), which: 1, pointerType: 'mouse' }),
        );
        $($table).trigger($.Event('dxpointermove', { target: $cells.eq(1).get(0), which: 1 }));

        const dateTableScrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');

        dateTableScrollable.scrollTo({ y: 400 });

        setTimeout(() => {
            const keyboard = keyboardMock(instance.getWorkSpace().$element());
            keyboard.keyDown('enter');

            assert.ok(showAppointmentPopupSpy.calledOnce, '"showAppointmentPopup" was called');
            assert.deepEqual(
                showAppointmentPopupSpy.getCall(0).args[0],
                {
                    allDay: false,
                    endDate: new Date(2020, 8, 21, 0, 30),
                    startDate: new Date(2020, 8, 20, 0, 0),
                },
                '"showAppointmentPopup" was called with correct parameters',
            );
            done();
        });
    });

    [
        'month',
        'week'
    ].forEach(view => {
        test(`First day of week should be correct in "en-GB" locale (T988896) in ${view} view`, function(assert) {
            const locale = localization.locale();
            localization.locale('en-GB');

            const scheduler = createWrapper({
                views: [view],
                currentView: view,
                currentDate: new Date(2021, 4, 27),
                firstDayOfWeek: 0,
            });

            const firstDayOfWeek = scheduler.workSpace.getOrdinaryHeaderPanelCells().eq(0).text().substr(0, 3);
            const lastDayOfWeek = scheduler.workSpace.getOrdinaryHeaderPanelCells().eq(6).text().substr(0, 3);

            assert.equal(firstDayOfWeek, 'Sun', 'First day of week is sunday');
            assert.equal(lastDayOfWeek, 'Sat', 'Last day of week is saturday');

            localization.locale(locale);
        });
    });
});

isDesktopEnvironment() && module('Cells selection', { ...moduleConfig }, () => {
    const resources = [
        {
            fieldExpr: 'ownerId',
            dataSource: [
                { id: 1, text: 'John' },
                { id: 2, text: 'Mike' }
            ]
        }
    ];

    const checkSelection = (assert, scheduler, firstCellIndex, lastCellIndex) => {
        scheduler.workSpace.selectCells(firstCellIndex, lastCellIndex);

        const selectedCells = scheduler.workSpace.getSelectedCells();
        const cellsNumber = lastCellIndex - firstCellIndex + 1;

        assert.equal(selectedCells.length, cellsNumber, 'Correct number of cells');

        [...(new Array(cellsNumber))].forEach((_, index) => {
            const currentIndex = index + firstCellIndex;
            const cell = scheduler.workSpace.getCell(currentIndex);
            assert.ok(cell.hasClass(SELECTED_CELL_CLASS), 'Cell is selected');
            assert.equal(cell.hasClass(FOCUSED_CELL_CLASS), currentIndex === lastCellIndex, 'Cell has correct classes');
        });
    };

    module(' Multiple selection when dragging is not enabled', () => {
        [{
            view: 'day',
            startCell: {
                index: 0,
                cellData: {
                    startDate: new Date(2018, 3, 8, 0, 0),
                    endDate: new Date(2018, 3, 8, 0, 30),
                    allDay: false,
                    groups: undefined,
                    groupIndex: 0,
                },
            },
            endCell: {
                index: 1,
                cellData: {
                    startDate: new Date(2018, 3, 8, 0, 30),
                    endDate: new Date(2018, 3, 8, 1, 0),
                    allDay: false,
                    groups: undefined,
                    groupIndex: 0,
                },
            },
        }, {
            view: 'week',
            startCell: {
                index: 0,
                cellData: {
                    startDate: new Date(2018, 3, 8, 0, 0),
                    endDate: new Date(2018, 3, 8, 0, 30),
                    allDay: false,
                    groups: undefined,
                    groupIndex: 0,
                },
            },
            endCell: {
                index: 7,
                cellData: {
                    startDate: new Date(2018, 3, 8, 0, 30),
                    endDate: new Date(2018, 3, 8, 1, 0),
                    allDay: false,
                    groups: undefined,
                    groupIndex: 0,
                },
            },
        }, {
            view: 'month',
            startCell: {
                index: 0,
                cellData: {
                    startDate: new Date(2018, 3, 1),
                    endDate: new Date(2018, 3, 2),
                    groups: undefined,
                    groupIndex: 0,
                    allDay: undefined,
                },
            },
            endCell: {
                index: 1,
                cellData: {
                    startDate: new Date(2018, 3, 2),
                    endDate: new Date(2018, 3, 3),
                    groups: undefined,
                    groupIndex: 0,
                    allDay: undefined,
                },
            },
        }].forEach((config) => {
            const { view, startCell, endCell } = config;
            test(`Multiple selection should work in ${view} when dragging is not enabled`, function(assert) {
                const instance = createWrapper({
                    dataSource: [],
                    views: [view],
                    currentView: view,
                    showAllDayPanel: true,
                    currentDate: new Date(2018, 3, 8),
                    height: 600,
                    editing: { allowDragging: false },
                });

                const $cells = instance.workSpace.getCells();
                const $table = instance.workSpace.getDateTable();

                $($table).trigger(
                    $.Event('dxpointerdown', { target: $cells.eq(startCell.index).get(0), which: 1, pointerType: 'mouse' }),
                );
                $($table).trigger($.Event('dxpointermove', { target: $cells.eq(endCell.index).get(0), which: 1 }));

                assert.deepEqual(
                    instance.option('selectedCellData'),
                    [
                        startCell.cellData, endCell.cellData,
                    ], 'correct cells have been selected');
            });

            if(view !== 'month') {
                test(`Multiple selection should work in ${view} when dragging is not enabled when scrolling is virtual`, function(assert) {
                    const instance = createWrapper({
                        dataSource: [],
                        views: [view],
                        currentView: view,
                        showAllDayPanel: true,
                        currentDate: new Date(2018, 3, 8),
                        height: 600,
                        width: 1000,
                        editing: { allowDragging: false },
                        scrolling: { mode: 'virtual', orientation: 'both' },
                    });

                    const $cells = instance.workSpace.getCells();
                    const $table = instance.workSpace.getDateTable();

                    $($table).trigger(
                        $.Event('dxpointerdown', { target: $cells.eq(startCell.index).get(0), which: 1, pointerType: 'mouse' }),
                    );
                    $($table).trigger($.Event('dxpointermove', { target: $cells.eq(endCell.index).get(0), which: 1 }));

                    assert.deepEqual(
                        instance.option('selectedCellData'),
                        [
                            startCell.cellData, endCell.cellData,
                        ], 'correct cells have been selected');
                });
            }
        });
    });

    test('Correct cells should be selected in Month View in basic case and virtual scrolling is enabled', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: ['month'],
            currentView: 'month',
            showAllDayPanel: true,
            currentDate: new Date(2020, 11, 23),
            height: 1000,
            width: 1000,
            scrolling: { mode: 'virtual', orientation: 'both' },
        });

        checkSelection(assert, scheduler, 0, 5);
    });

    test('Correct cells should be selected in Month when horizontal grouping is used and virtual scrolling is enabled', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: [{
                type: 'month',
                groupOrientation: 'horizontal',
            }],
            currentView: 'month',
            showAllDayPanel: true,
            currentDate: new Date(2020, 11, 23),
            height: 1000,
            width: 1000,
            scrolling: { mode: 'virtual', orientation: 'both' },
            resources,
            groups: ['ownerId'],
        });

        checkSelection(assert, scheduler, 7, 9);

        scheduler.workSpace.selectCells(6, 7);

        const selectedCells = scheduler.workSpace.getSelectedCells();
        const cell = scheduler.workSpace.getCell(6);

        assert.equal(selectedCells.length, 1, 'Correct number of cells');
        assert.ok(cell.hasClass(SELECTED_CELL_CLASS), 'Cell is selected');
        assert.ok(cell.hasClass(FOCUSED_CELL_CLASS), 'Cell is focused');
    });

    test('Correct cells should be selected in Month when vertical grouping is used and virtual scrolling is enabled', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: [{
                type: 'month',
                groupOrientation: 'vertical',
            }],
            currentView: 'month',
            showAllDayPanel: true,
            currentDate: new Date(2020, 11, 23),
            height: 1000,
            width: 1000,
            scrolling: { mode: 'virtual', orientation: 'both' },
            resources,
            groups: ['ownerId'],
        });

        checkSelection(assert, scheduler, 0, 5);

        scheduler.workSpace.selectCells(6, 58);

        const selectedCells = scheduler.workSpace.getSelectedCells();
        const cell = scheduler.workSpace.getCell(6);

        assert.equal(selectedCells.length, 1, 'Correct number of cells');
        assert.ok(cell.hasClass(SELECTED_CELL_CLASS), 'Cell is selected');
        assert.ok(cell.hasClass(FOCUSED_CELL_CLASS), 'Cell is focused');
    });

    test('Correct cells should be selected in Month when grouping by date is used and virtual scrolling is enabled', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: [{
                type: 'month',
                groupOrientation: 'horizontal',
                groupByDate: true,
            }],
            currentView: 'month',
            showAllDayPanel: true,
            currentDate: new Date(2020, 11, 23),
            height: 1000,
            width: 1000,
            scrolling: { mode: 'virtual', orientation: 'both' },
            resources,
            groups: ['ownerId'],
        });

        scheduler.workSpace.selectCells(0, 2);

        const selectedCells = scheduler.workSpace.getSelectedCells();

        assert.equal(selectedCells.length, 2, 'Correct number of cells');

        [...(new Array(3))].forEach((_, index) => {
            if(index !== 1) {
                const cell = scheduler.workSpace.getCell(index);
                assert.ok(cell.hasClass(SELECTED_CELL_CLASS), 'Cell is selected');
                assert.equal(cell.hasClass(FOCUSED_CELL_CLASS), index === 2, 'Cell has correct classes');
            }
        });
    });

    test('Correct selectedCellData should be generated when selecting cells in Month when virtual scrolling is enabled', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: ['month'],
            currentView: 'month',
            showAllDayPanel: true,
            currentDate: new Date(2020, 11, 23),
            height: 1000,
            width: 1000,
            scrolling: { mode: 'virtual', orientation: 'both' },
        });

        scheduler.workSpace.selectCells(0, 5);

        const selectedCellData = scheduler.option('selectedCellData');

        assert.equal(selectedCellData.length, 6, 'Correct number of cells');
        assert.deepEqual(selectedCellData[0], {
            startDate: new Date(2020, 10, 29, 0, 0),
            endDate: new Date(2020, 10, 30, 0, 0),
            allDay: undefined,
            groupIndex: 0,
            groups: undefined,
        }, 'Correct first cell');
        assert.deepEqual(selectedCellData[5], {
            startDate: new Date(2020, 11, 4, 0, 0),
            endDate: new Date(2020, 11, 5, 0, 0),
            allDay: undefined,
            groupIndex: 0,
            groups: undefined,
        }, 'Correct last cell');
    });
});

module('Resource Cell Template', () => {
    [true, false].forEach((renovateRender) => {
        const moduleDescription = renovateRender
            ? 'Renovated Render'
            : 'Old Render';

        module(moduleDescription, {
            beforeEach: function() {
                fx.off = true;
                this.createInstance = (options = {}) => {
                    return createWrapper({
                        ...options,
                        renovateRender
                    });
                };
            },
            afterEach: function() {
                fx.off = false;
            },
        }, () => {
            test('resourceCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
                assert.expect(3);
                this.createInstance({
                    currentView: 'week',
                    views: ['week'],
                    height: 700,
                    width: 700,
                    dataSource: [],
                    groups: ['ownerId'],
                    resources: [{
                        fieldExpr: 'ownerId',
                        dataSource: [
                            { id: 1, text: 'John', color: '#000' },
                            { id: 2, text: 'Mike', color: '#FFF' },
                        ],
                    }],
                    resourceCellTemplate: function(cellData, cellIndex, cellElement) {
                        if(!cellIndex) {
                            assert.equal(isRenderer(cellElement), !!config().useJQuery, 'element is correct');
                            const $cell = $(cellElement).parent();
                            assert.roughEqual(getOuterWidth($cell), 299, 2.001, 'Resource cell width is OK');
                            assert.equal(getOuterHeight($cell), 30, 'Resource cell height is OK');
                        }
                    }
                });
            });

            test('resourceCellTemplate should take cellElement with correct geometry in timeline (T453520)', function(assert) {
                assert.expect(2);
                this.createInstance({
                    currentView: 'timelineWeek',
                    views: ['timelineWeek'],
                    height: 700,
                    width: 700,
                    dataSource: [],
                    groups: ['ownerId'],
                    resources: [{
                        fieldExpr: 'ownerId',
                        dataSource: [
                            { id: 1, text: 'John', color: '#000' },
                            { id: 2, text: 'Mike', color: '#FFF' },
                        ],
                    }],
                    resourceCellTemplate: function(cellData, cellIndex, cellElement) {
                        const done = assert.async();
                        setTimeout(() => {
                            if(!cellIndex) {
                                const $cell = $(cellElement);
                                assert.equal(getOuterWidth($cell), 100, 'Resource cell width is OK');
                                assert.roughEqual(getOuterHeight($cell), 271, 1.001, 'Resource cell height is OK');
                            }
                            done();
                        });
                    }
                });
            });

            test('resourceCellTemplate should have correct options', function(assert) {
                let templateOptions;

                this.createInstance({
                    currentView: 'week',
                    currentDate: new Date(2016, 8, 5),
                    firstDayOfWeek: 0,
                    groups: ['ownerId'],
                    resources: [
                        {
                            fieldExpr: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'John' },
                                { id: 2, text: 'Mike' }
                            ]
                        }
                    ],
                    resourceCellTemplate: function(itemData, index, $container) {
                        if(index === 0) {
                            templateOptions = itemData;
                        }
                    }
                });

                assert.equal(templateOptions.id, 1, 'id option is OK');
                assert.equal(templateOptions.text, 'John', 'text option is OK');
                assert.deepEqual(templateOptions.data, { text: 'John', id: 1 }, 'data option is OK');
            });

            test('resourceCellTemplate should work correct in timeline view', function(assert) {
                const scheduler = createWrapper({
                    currentView: 'timelineWeek',
                    currentDate: new Date(2016, 8, 5),
                    firstDayOfWeek: 0,
                    groups: ['ownerId'],
                    resources: [
                        {
                            fieldExpr: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'John' },
                                { id: 2, text: 'Mike' }
                            ]
                        }
                    ],
                    resourceCellTemplate: function(itemData, index, container) {
                        if(index === 0) {
                            $(container).addClass('custom-group-cell-class');
                        }
                    }
                });

                const $cell1 = scheduler.workSpace.groups.getGroupHeader(0);
                const $cell2 = scheduler.workSpace.groups.getGroupHeader(1);

                assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
                assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
            });

            test('resourceCellTemplate should work correct in agenda view', function(assert) {
                const scheduler = this.createInstance({
                    views: ['agenda'],
                    currentView: 'agenda',
                    currentDate: new Date(2016, 8, 5),
                    dataSource: [{
                        text: 'a',
                        ownerId: 1,
                        startDate: new Date(2016, 8, 5, 7),
                        endDate: new Date(2016, 8, 5, 8),
                    },
                    {
                        text: 'b',
                        ownerId: 2,
                        startDate: new Date(2016, 8, 5, 10),
                        endDate: new Date(2016, 8, 5, 11),
                    }],
                    firstDayOfWeek: 0,
                    groups: ['ownerId'],
                    resources: [
                        {
                            fieldExpr: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'John' },
                                { id: 2, text: 'Mike' }
                            ]
                        }
                    ],
                    resourceCellTemplate: function(itemData, index, container) {
                        if(index === 0) {
                            $(container).addClass('custom-group-cell-class');
                        }

                        return $('<div />').text(itemData.text);
                    }
                });

                const $cell1 = scheduler.instance.$element().find('.dx-scheduler-group-header-content').eq(0);
                const $cell2 = scheduler.instance.$element().find('.dx-scheduler-group-header-content').eq(1);

                assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
                assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
            });

            test('Agenda has right arguments in resourceCellTemplate arguments', function(assert) {
                let params;

                this.createInstance({
                    views: ['agenda'],
                    currentView: 'agenda',
                    currentDate: new Date(2016, 8, 5),
                    groups: ['ownerId'],
                    dataSource: [{
                        text: 'a',
                        ownerId: 1,
                        startDate: new Date(2016, 8, 5, 7),
                        endDate: new Date(2016, 8, 5, 8),
                    },
                    {
                        text: 'b',
                        ownerId: 2,
                        startDate: new Date(2016, 8, 5, 10),
                        endDate: new Date(2016, 8, 5, 11),
                    }],
                    resources: [
                        {
                            fieldExpr: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'John', color: '#A2a' },
                                { id: 2, text: 'Mike', color: '#E2a' }
                            ]
                        }
                    ],
                    resourceCellTemplate: function(itemData, index, $container) {
                        if(!index) params = itemData.data;
                    }
                });

                assert.deepEqual(params, { id: 1, text: 'John', color: '#A2a' }, 'Cell text is OK');
            });


            test('Scheduler should have specific resourceCellTemplate setting of the view', function(assert) {
                let countCallTemplate1 = 0;
                let countCallTemplate2 = 0;
                const dataSource = [
                    { id: 1, text: 'group1' },
                    { id: 2, text: 'group2' }
                ];

                this.createInstance({
                    views: [{
                        type: 'week',
                        resourceCellTemplate: function() {
                            countCallTemplate2++;
                        }
                    }],
                    groups: ['test'],
                    resources: [
                        {
                            fieldExpr: 'test',
                            dataSource: dataSource
                        }
                    ],
                    resourceCellTemplate: function() {
                        countCallTemplate1++;
                    },
                    currentView: 'week'
                });

                assert.equal(countCallTemplate1, 0, 'count call first template');
                assert.notEqual(countCallTemplate2, 0, 'count call second template');
            });
        });
    });
});

module('Markup', () => {
    test('Rows should have correct width in Month when virtual scrolling is used', function(assert) {
        const scheduler = createWrapper({
            width: 600,
            views: [{
                type: 'month',
                intervalCount: 30,
            }],
            currentView: 'month',
            dataSource: [],
            scrolling: { mode: 'virtual' },
        });

        const firstRow = scheduler.workSpace.getRows(0);
        const cells = scheduler.workSpace.getCells().slice(0, 7);

        const rowWidth = getOuterWidth(firstRow);
        const rowWidthByCells = [...(new Array(7))].reduce((currentWidth, _, index) => {
            return currentWidth + getOuterWidth(cells.eq(index));
        }, 0);

        assert.roughEqual(rowWidth, rowWidthByCells, 1.1, 'Correct row width');
    });
});
