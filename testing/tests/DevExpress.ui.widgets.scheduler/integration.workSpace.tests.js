import $ from 'jquery';
import themes from 'ui/themes';
import dateLocalization from 'localization/date';
import { SchedulerTestWrapper } from './helpers.js';
import devices from 'core/devices';

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

import 'common.css!';
import 'generic_light.css!';


import eventsEngine from 'events/core/events_engine';
import renderer from 'core/renderer';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'events/drag';
import CustomStore from 'data/custom_store';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import translator from 'animation/translator';

import 'ui/scheduler/ui.scheduler';

import { dateToMilliseconds as toMs } from 'core/utils/date';

QUnit.module('Integration: Work space', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options, { maxAppointmentsPerCell: null })).dxScheduler('instance');
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Scheduler should have a right work space', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'day'
    });
    const $element = this.instance.$element();

    assert.ok($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance'), 'Work space is day on init');

    this.instance.option('currentView', 'week');

    assert.ok($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance'), 'Work space is week after change option ');
});

QUnit.test('Work space should have correct currentDate option', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 0, 28)
    });
    const $element = this.instance.$element();

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('currentDate'), new Date(2015, 0, 28), 'Work space has a right currentDate option');

    this.instance.option('currentDate', new Date(2015, 1, 28));

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('currentDate'), new Date(2015, 1, 28), 'Work space has a right currentDate option');
});

QUnit.test('Work space should have correct min option', function(assert) {
    this.createInstance({
        min: new Date(2015, 0, 28)
    });
    const $element = this.instance.$element();

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('min'), new Date(2015, 0, 28), 'Work space has a right currentDate option');

    this.instance.option('min', new Date(2015, 1, 28));

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('min'), new Date(2015, 1, 28), 'Work space has a right currentDate option');
});

QUnit.test('Work space should have correct max option', function(assert) {
    this.createInstance({
        max: new Date(2015, 0, 28)
    });
    const $element = this.instance.$element();

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('max'), new Date(2015, 0, 28), 'Work space has a right currentDate option');

    this.instance.option('max', new Date(2015, 1, 28));

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('max'), new Date(2015, 1, 28), 'Work space has a right currentDate option');
});

QUnit.test('Work space should have correct firstDayOfWeek option', function(assert) {
    this.createInstance({
        currentView: 'week',
        firstDayOfWeek: 2
    });
    const $element = this.instance.$element();

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('firstDayOfWeek'), 2, 'Work space has a right first day of week');

    this.instance.option('firstDayOfWeek', 1);

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('firstDayOfWeek'), 1, 'Work space has a right first day of week');
});

QUnit.test('Scheduler work space should have a single type class', function(assert) {
    this.createInstance({
        currentView: 'week',
        firstDayOfWeek: 2,
        views: ['day', 'week', 'workWeek', 'month']
    });

    const $element = this.instance.$element();

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

    this.instance.option('currentView', 'day');
    assert.ok(check('dx-scheduler-work-space-day'), 'Work space has a right type class');

    this.instance.option('currentView', 'week');
    assert.ok(check('dx-scheduler-work-space-week'), 'Work space has a right type class');

    this.instance.option('currentView', 'workWeek');
    assert.ok(check('dx-scheduler-work-space-work-week'), 'Work space has a right type class');

    this.instance.option('currentView', 'month');
    assert.ok(check('dx-scheduler-work-space-month'), 'Work space has a right type class');
});

QUnit.test('Pointer down on workspace cell should focus cell', function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 10) });

    const $firstCell = $(this.instance.$element()).find('.dx-scheduler-date-table td').eq(0);
    const $otherCell = $(this.instance.$element()).find('.dx-scheduler-date-table td').eq(1);

    $firstCell.trigger('dxpointerdown');

    assert.ok($firstCell.hasClass('dx-state-focused'), 'first cell was focused after first pointerdown');

    $otherCell.trigger('dxpointerdown');

    assert.ok(!$firstCell.hasClass('dx-state-focused'), 'first cell is not focused');
    assert.ok($otherCell.hasClass('dx-state-focused'), 'other cell is focused');
});

QUnit.test('Double click on workspace cell should call scheduler.showAppointmentPopup method in day view', function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 10) });
    const spy = sinon.spy();
    const showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find('.dx-scheduler-all-day-table-cell').first()).start().click().click();

        assert.ok(spy.calledOnce, 'showAppointmentPopup is called');
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 10, 0, 0),
            endDate: new Date(2015, 1, 11, 0, 0),
            allDay: true
        }, 'showAppointmentPopup has a right arguments');
        assert.ok(spy.calledOn(this.instance), 'showAppointmentPopup has a right context');

        pointerMock(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(3)).start().click().click();
        assert.deepEqual(spy.getCall(1).args[0], {
            startDate: new Date(2015, 1, 10, 1, 30),
            endDate: new Date(2015, 1, 10, 2, 0),
            allDay: false
        }, 'showAppointmentPopup has a right arguments');

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test('Double click on works space cell should call scheduler.showAppointmentPopup method in week view', function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 9), currentView: 'week', firstDayOfWeek: 1 });
    const spy = sinon.spy();
    const showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(22)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 10, 1, 30),
            endDate: new Date(2015, 1, 10, 2, 0),
            allDay: false
        }, 'showAppointmentPopup has a right arguments');

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test('Double click on work space cell should call scheduler.showAppointmentPopup method in month view', function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 9), currentView: 'month', firstDayOfWeek: 1 });
    const spy = sinon.spy();
    const showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(22)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 17),
            endDate: new Date(2015, 1, 18)
        }, 'showAppointmentPopup has a right arguments');

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test('scheduler.showAppointmentPopup method should have resource arg if there is some resource', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: 'week',
        firstDayOfWeek: 1,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ]
    });
    const spy = sinon.spy();
    const showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {
        pointerMock(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(24)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 12, 0, 30),
            endDate: new Date(2015, 1, 12, 1),
            ownerId: 2,
            allDay: false
        }, 'showAppointmentPopup has a right arguments');

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test('scheduler.showAppointmentPopup method should have resource arg if there is some resource and view is month', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: 'month',
        firstDayOfWeek: 1,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ]
    });
    const spy = sinon.spy();
    const showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(22)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 3),
            endDate: new Date(2015, 1, 4),
            ownerId: 2
        }, 'showAppointmentPopup has a right arguments');

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test('WorkSpace should have a correct \'groups\' option', function(assert) {
    this.createInstance({
        groups: ['resource1'],
        resources: [
            {
                displayExpr: 'name',
                valueExpr: 'key',
                field: 'resource1',
                dataSource: [
                    { key: 1, name: 'One' },
                    { key: 2, name: 'Two' }
                ]
            },
            {
                field: 'resource2',
                dataSource: [
                    { id: 1, text: 'Room 1' }
                ]
            }
        ]
    });

    let workSpace = this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

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

    this.instance.option('groups', ['resource2']);

    workSpace = this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');
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

QUnit.test('WorkSpace should have a correct \'startDayHour\' option', function(assert) {
    this.createInstance({
        startDayHour: 1
    });

    const workSpace = this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

    assert.equal(workSpace.option('startDayHour'), 1, 'Start day hour is OK on init');

    this.instance.option('startDayHour', 5);
    assert.equal(workSpace.option('startDayHour'), 5, 'Start day hour is OK if option is changed');
});

QUnit.test('WorkSpace should have a correct \'endDayHour\' option', function(assert) {
    this.createInstance({
        endDayHour: 10
    });

    const workSpace = this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

    assert.equal(workSpace.option('endDayHour'), 10, 'End day hour is OK on init');

    this.instance.option('endDayHour', 12);
    assert.equal(workSpace.option('endDayHour'), 12, 'End day hour is OK if option is changed');
});

QUnit.test('drop and dragenter handlers should be different for date table and allDay table, T245137', function(assert) {
    const log = {};

    log[dragEvents.drop] = {};
    log[dragEvents.enter] = {};

    const onSpy = sinon.spy(eventsEngine, 'on');

    this.createInstance({
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

QUnit.test('event handlers should be reattached after changing allDayExpanded', function(assert) {
    const onSpy = sinon.spy(eventsEngine, 'on').withArgs(sinon.match(function(element) {
        return $(element).hasClass('dx-scheduler-work-space');
    }), sinon.match(function(eventName) {
        const namespace = eventName.split('.')[1];
        eventName = eventName.split('.')[0];

        return eventName === dragEvents.drop && namespace === 'dxSchedulerDateTable';
    }));

    this.createInstance();

    const previousSubscriptionsLength = onSpy.callCount;

    this.instance.getWorkSpace().option('allDayExpanded', true);

    assert.ok(onSpy.callCount > previousSubscriptionsLength, 'Events were reattached');

    eventsEngine.on.restore();
});

QUnit.test('Work space should have right all-day-collapsed class on init', function(assert) {
    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: 'week',
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 8),
        }]
    });
    const $element = this.instance.$element();
    const $workSpace = $element.find('.dx-scheduler-work-space');

    assert.ok($workSpace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work-space has right class');

    this.instance.option('dataSource', [{
        text: 'a',
        startDate: new Date(2015, 1, 9, 7),
        endDate: new Date(2015, 1, 9, 7, 30),
        allDay: true
    }]);

    assert.notOk($workSpace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work-space has not \'all-day-expanded\' class');
});

QUnit.test('Work space should have right showAllDayPanel option value', function(assert) {
    this.createInstance({
        showAllDayPanel: false
    });
    const $element = this.instance.$element();
    const $workSpace = $element.find('.dx-scheduler-work-space');

    assert.deepEqual($workSpace.dxSchedulerWorkSpaceDay('instance').option('showAllDayPanel'), false, 'Work space has a right allDay visibility');

    this.instance.option('showAllDayPanel', true);

    assert.deepEqual($workSpace.dxSchedulerWorkSpaceDay('instance').option('showAllDayPanel'), true, 'Work space has a right allDay visibility');
});

QUnit.test('Work space \'allDayExpanded\' option value when \'showAllDayPanel\' = true', function(assert) {
    this.createInstance({
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

    const $element = this.instance.$element();

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), true, 'Work space has a right allDay visibility');

    this.instance.option('dataSource', [{
        text: 'a',
        startDate: new Date(2015, 1, 9, 7),
        endDate: new Date(2015, 1, 9, 9),
        allDay: false
    }]);

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), false, 'Work space has a right allDay visibility');
});

QUnit.test('Work space \'allDayExpanded\' option value should be correct after changing view', function(assert) {
    this.createInstance({
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

    const $element = this.instance.$element();

    this.instance.option('currentView', 'day');
    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), false, 'Work space has a right allDay visibility');

    this.instance.option('currentView', 'week');
    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), true, 'Work space has a right allDay visibility');
});

QUnit.test('Work space \'allDayExpanded\' option value should be correct after changing currentDate', function(assert) {
    this.createInstance({
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

    const $element = this.instance.$element();

    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), true, 'Work space has a right allDay visibility');

    this.instance.option('currentDate', new Date(2015, 1, 10));
    assert.deepEqual($element.find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), false, 'Work space has a right allDay visibility');
});

QUnit.test('Work space \'allDayExpanded\' option value should be correct after deleting last allDay appointment', function(assert) {
    const appointment = {
        text: 'a',
        startDate: new Date(2015, 1, 10, 7),
        allDay: true
    };

    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: 'week',
        dataSource: [appointment]
    });

    this.instance.deleteAppointment(appointment);

    assert.deepEqual(this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance').option('allDayExpanded'), false, 'Work space has correct allDay visibility');
});

QUnit.test('Work space \'allDayExpanded\' option should depend on client-side filtered appointments', function(assert) {
    const appointment = {
        text: 'All-day',
        startDate: new Date(2015, 2, 4),
        endDate: new Date(2015, 2, 5),
        allDay: true,
        recurrenceRule: 'FREQ=DAILY'
    };

    this.createInstance({
        showAllDayPanel: true,
        currentView: 'day',
        startDayHour: 3,
        endDayHour: 10,
        currentDate: new Date(2015, 2, 3),
        firstDayOfWeek: 1,
        dataSource: [appointment]
    });

    assert.deepEqual(this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance').option('allDayExpanded'), false, 'Work space has correct allDay visibility');
});

QUnit.test('Cell data should be applied when resources are loaded', function(assert) {
    const done = assert.async();
    this.createInstance({
        currentView: 'day',
        groups: ['owner'],
        resources: [
            {
                fieldExpr: 'owner',
                dataSource: new CustomStore({
                    load: function() {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([{ id: 1 }]);
                        }, 300);
                        return d.promise();
                    }
                })
            }
        ],
        dataSource: [],
        onContentReady: function(e) {
            const groups = e.component.$element().find('.dx-scheduler-date-table-cell').data('dxCellData').groups;
            assert.deepEqual(groups, { owner: 1 });
            done();
        }
    });
});

QUnit.test('Duplicated elements should not be rendered when resources are loaded asynchronously (T661335)', function(assert) {
    this.clock = sinon.useFakeTimers();
    this.createInstance({
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

    this.instance.option('groups', ['room']);
    this.instance.repaint();
    this.clock.tick(100);

    const $workspace = this.instance.$element().find('.dx-scheduler-work-space');
    assert.equal($workspace.length, 1, 'Duplicated workSpace wasn\'t rendered');
});

QUnit.test('Cell data should be updated after view changing', function(assert) {
    this.createInstance({
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

    this.instance.option('currentView', 'week');

    const workSpace = this.instance.getWorkSpace();
    assert.deepEqual(workSpace.getCellDataByCoordinates({
        top: 10,
        left: 100,
    }), {
        allDay: false,
        startDate: new Date(2016, 8, 4),
        endDate: new Date(2016, 8, 4, 0, 30)
    }, 'Cell data is OK!');


});

QUnit.test('Appointments in month view should be sorted same as in all-day section', function(assert) {
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
    this.createInstance({
        dataSource: items,
        currentDate: new Date(2016, 1, 11),
        currentView: 'week'
    });

    const allDayAppointments = this.instance.$element().find('.dx-scheduler-appointment');
    let i;

    for(i = 0; i < 3; i++) {
        assert.deepEqual(allDayAppointments.eq(i).data('dxItemData'), items[i], 'Order is right');
    }

    this.instance.option('currentView', 'month');

    const monthAppointments = this.instance.$element().find('.dx-scheduler-appointment');
    for(i = 0; i < 3; i++) {
        assert.deepEqual(monthAppointments.eq(i).data('dxItemData'), items[i], 'Order is right');
    }
});

QUnit.test('Data cell should has right content when used dataCellTemplate option', function(assert) {
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        dataCellTemplate: function(itemData, index, container) {
            $(container).addClass('custom-cell-class');
        }
    });

    const $element = this.instance.$element();

    assert.ok($element.find('.custom-cell-class').length > 0, 'class is ok');
});

QUnit.test('Data cell should has right content when dataCellTemplate option was change', function(assert) {
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        dataCellTemplate: function(itemData, index, container) {
            $(container).addClass('custom-cell-class');
        }
    });

    const $element = this.instance.$element();

    assert.ok($element.find('.custom-cell-class').length > 0, 'class before option changing is ok');

    this.instance.option('dataCellTemplate', function(itemData, index, container) {
        $(container).addClass('new-custom-class');
    });

    assert.ok($element.find('.new-custom-class').length > 0, 'class is ok');
});

QUnit.test('dataCellTemplate should have correct options', function(assert) {
    let templateOptions;

    this.createInstance({
        currentView: 'week',
        startDayHour: 5,
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        dataCellTemplate: function(itemData, index, $container) {
            if(index === 3 && $($container).hasClass('dx-scheduler-date-table-cell')) templateOptions = itemData;
        }
    });

    assert.equal(templateOptions.text, '', 'text options is ok');
    assert.equal(templateOptions.startDate.getTime(), new Date(2016, 8, 7, 5).getTime(), 'startDate option is ok');
    assert.equal(templateOptions.endDate.getTime(), new Date(2016, 8, 7, 5, 30).getTime(), 'endDate option is ok');
    assert.deepEqual(templateOptions.groups, {
        'ownerId': 1
    }, 'Resources option is ok');
});

QUnit.test('dataCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
    assert.expect(2);
    this.createInstance({
        currentView: 'week',
        views: ['week'],
        height: 700,
        width: 700,
        dataSource: [],
        dataCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellData.allDay && !cellIndex) {
                assert.roughEqual($(cellElement).get(0).getBoundingClientRect().width, 85, 1.001, 'Data cell width is OK');
                assert.equal($(cellElement).get(0).getBoundingClientRect().height, 50, 'Data cell height is OK');
            }
        }
    });
});

QUnit.test('dataCellTemplate for all-day panel should take cellElement with correct geometry(T453520)', function(assert) {
    assert.expect(2);
    this.createInstance({
        currentView: 'week',
        views: ['week'],
        height: 700,
        width: 700,
        dataSource: [],
        dataCellTemplate: function(cellData, cellIndex, cellElement) {
            if(cellData.allDay && !cellIndex) {
                assert.roughEqual($(cellElement).outerWidth(), 85, 1.001, 'Data cell width is OK');
                assert.roughEqual($(cellElement).outerHeight(), 24, 1.001, 'Data cell height is OK');
            }
        }
    });
});

QUnit.test('dateCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
    assert.expect(3);
    this.createInstance({
        currentView: 'week',
        views: ['week'],
        height: 700,
        width: 700,
        dataSource: [],
        dateCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                assert.equal(isRenderer(cellElement), !!config().useJQuery, 'element is correct');
                assert.roughEqual($(cellElement).outerWidth(), 85, 1.001, 'Date cell width is OK');
                assert.equal($(cellElement).outerHeight(), 40, 'Date cell height is OK');
            }
        }
    });
});

QUnit.test('timeCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
    assert.expect(3);

    this.createInstance({
        currentView: 'week',
        views: ['week'],
        height: 700,
        width: 700,
        dataSource: [],
        timeCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                assert.equal(isRenderer(cellElement), !!config().useJQuery, 'element is correct');
                assert.equal($(cellElement).get(0).getBoundingClientRect().height, 50, 'Time cell height is OK');
                assert.equal($(cellElement).outerWidth(), 100, 'Time cell width is OK');
            }
        }
    });
});

QUnit.test('resourceCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
    assert.expect(3);
    this.createInstance({
        currentView: 'week',
        views: ['week'],
        height: 700,
        width: 700,
        dataSource: [],
        groups: ['owner'],
        resources: [{
            field: 'owner',
            dataSource: ['a', 'b']
        }],
        resourceCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                assert.equal(isRenderer(cellElement), !!config().useJQuery, 'element is correct');
                const $cell = $(cellElement).parent();
                assert.roughEqual($cell.outerWidth(), 299, 1.001, 'Resource cell width is OK');
                assert.equal($cell.outerHeight(), 30, 'Resource cell height is OK');
            }
        }
    });
});

QUnit.test('resourceCellTemplate should take cellElement with correct geometry in timeline (T453520)', function(assert) {
    assert.expect(2);
    this.createInstance({
        currentView: 'timelineWeek',
        views: ['timelineWeek'],
        height: 700,
        width: 700,
        dataSource: [],
        groups: ['owner'],
        resources: [{
            field: 'owner',
            dataSource: ['a', 'b']
        }],
        resourceCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                const $cell = $(cellElement).parent();
                assert.equal($cell.outerWidth(), 99, 'Resource cell width is OK');
                assert.roughEqual($cell.outerHeight(), 276, 1.001, 'Resource cell height is OK');
            }
        }
    });
});

QUnit.test('timeCellTemplate should have correct options', function(assert) {
    let templateOptions;

    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        timeCellTemplate: function(itemData, index, $container) {
            if(index === 6) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.text, '3:00 AM', 'text options is ok');
});

QUnit.test('timeCellTemplate should contains the date field of data parameter in the Day view', function(assert) {
    const resultDates = [];
    this.createInstance({
        currentView: 'day',
        views: ['day'],
        currentDate: new Date(2016, 8, 5),
        startDayHour: 0,
        endDayHour: 4,
        cellDuration: 60,
        timeCellTemplate: function(itemData) {
            resultDates.push(itemData.date);
        }
    });

    assert.equal(resultDates.length, 4);
    assert.deepEqual(resultDates[0], new Date(2016, 8, 5), 'date parameter for the first time cell');
    assert.deepEqual(resultDates[1], new Date(2016, 8, 5, 1), 'date parameter for the second time cell');
    assert.deepEqual(resultDates[2], new Date(2016, 8, 5, 2), 'date parameter for the third time cell');
    assert.deepEqual(resultDates[3], new Date(2016, 8, 5, 3), 'date parameter for the fourth time cell');
});

QUnit.test('timeCellTemplate should contains the date field of data parameter in Week view', function(assert) {
    const resultDates = [];
    this.createInstance({
        currentView: 'week',
        views: ['week'],
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        startDayHour: 0,
        endDayHour: 4,
        cellDuration: 60,
        timeCellTemplate: function(itemData) {
            resultDates.push(itemData.date);
        }
    });

    assert.equal(resultDates.length, 4);
    assert.deepEqual(resultDates[0], new Date(2016, 8, 4), 'date parameter for the first time cell');
    assert.deepEqual(resultDates[1], new Date(2016, 8, 4, 1), 'date parameter for the second time cell');
    assert.deepEqual(resultDates[2], new Date(2016, 8, 4, 2), 'date parameter for the third time cell');
    assert.deepEqual(resultDates[3], new Date(2016, 8, 4, 3), 'date parameter for the fourth time cell');
});

QUnit.test('timeCellTemplate should contains the date field of data parameter in workWeek view', function(assert) {
    const resultDates = [];
    this.createInstance({
        currentView: 'workWeek',
        views: ['workWeek'],
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        startDayHour: 0,
        endDayHour: 4,
        cellDuration: 60,
        timeCellTemplate: function(itemData) {
            resultDates.push(itemData.date);
        }
    });

    assert.equal(resultDates.length, 4);
    assert.deepEqual(resultDates[0], new Date(2016, 8, 5), 'date parameter for the first time cell');
    assert.deepEqual(resultDates[1], new Date(2016, 8, 5, 1), 'date parameter for the second time cell');
    assert.deepEqual(resultDates[2], new Date(2016, 8, 5, 2), 'date parameter for the third time cell');
    assert.deepEqual(resultDates[3], new Date(2016, 8, 5, 3), 'date parameter for the fourth time cell');
});

QUnit.test('resourceCellTemplate should have correct options', function(assert) {
    let templateOptions;

    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
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

QUnit.test('resourceCellTemplate should work correct in timeline view', function(assert) {
    this.createInstance({
        currentView: 'timelineWeek',
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
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

    const $cell1 = this.scheduler.workSpace.groups.getGroupHeader(0).find('div').eq(0);
    const $cell2 = this.scheduler.workSpace.groups.getGroupHeader(1);

    assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
    assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
});

QUnit.test('resourceCellTemplate should work correct in agenda view', function(assert) {
    this.createInstance({
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
                field: 'ownerId',
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

    const $cell1 = this.instance.$element().find('.dx-scheduler-group-header-content').eq(0);
    const $cell2 = this.instance.$element().find('.dx-scheduler-group-header-content').eq(1);

    assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
    assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
});

QUnit.test('dateCellTemplate should work correctly', function(assert) {
    this.createInstance({
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2016, 8, 5),
        dataSource: [],
        firstDayOfWeek: 0,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        dateCellTemplate: function(itemData, index, container) {
            if(index === 0) {
                $(container).addClass('custom-group-cell-class');
            }
        }
    });

    const $cell1 = this.instance.$element().find('.dx-scheduler-header-panel-cell').eq(0);
    const $cell2 = this.instance.$element().find('.dx-scheduler-header-panel-cell').eq(1);

    assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
    assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
});

QUnit.test('dateCellTemplate should have unique date in data (T732376)', function(assert) {
    this.createInstance({
        views: ['timelineWorkWeek'],
        currentView: 'timelineWorkWeek',
        currentDate: new Date(2016, 8, 5),
        dataSource: [],
        firstDayOfWeek: 0,
        startDayHour: 10,
        endDayHour: 11,
        cellDuration: 60,
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        dateCellTemplate: function(data, index, element) {
            const d = data;
            $('<div>').appendTo(element).dxButton({
                text: 'Test',
                onClick: function(e) {
                    const expectedDate = new Date(2016, 8, 7, 10, 0);

                    assert.equal(d.date.getTime(), expectedDate.getTime());
                }
            });

            return element;
        }
    });

    const $button = this.instance.$element().find('.dx-scheduler-header-panel-cell .dx-button').eq(2);

    $($button).trigger('dxclick');
});

QUnit.test('dateCellTemplate should work correctly in workWeek view', function(assert) {
    const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.createInstance({
        views: ['workWeek'],
        currentView: 'workWeek',
        currentDate: new Date(2016, 8, 5),
        dataSource: [],
        startDayHour: 7,
        endDayHour: 23,
        dateCellTemplate: function(cellData, index, container) {
            $(container).append(
                $('<div />')
                    .addClass('name')
                    .text(dayOfWeekNames[cellData.date.getDay()]),
                $('<div />')
                    .addClass('number')
                    .text(cellData.date.getDate())
            );
        },
    });

    const $headerPanel = this.instance.$element().find('.dx-scheduler-header-panel');

    assert.ok($headerPanel.text(), 'Mon5Tue6Wed7Thu8Fri9');
});

QUnit.test('dateCellTemplate should work correctly in agenda view', function(assert) {
    this.createInstance({
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
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        dateCellTemplate: function(itemData, index, container) {
            if(index === 0) {
                $(container).addClass('custom-group-cell-class');
            }
        }
    });

    const $cell1 = this.instance.$element().find('.dx-scheduler-time-panel-cell').eq(0);
    const $cell2 = this.instance.$element().find('.dx-scheduler-time-panel-cell').eq(1);

    assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
    assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
});

QUnit.test('dateCellTemplate should have correct options', function(assert) {
    let templateOptions;

    this.createInstance({
        currentView: 'month',
        currentDate: new Date(2016, 8, 5),
        dateCellTemplate: function(itemData, index, $container) {
            if(index === 0) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.text, 'Sun', 'text option is ok');
    assert.deepEqual(templateOptions.date.getTime(), new Date(2016, 7, 28).getTime(), 'date option is ok');
});

QUnit.test('dateCellTemplate should have correct options in agenda view', function(assert) {
    let templateOptions;

    this.createInstance({
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
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        dateCellTemplate: function(itemData, index, $container) {
            if(index === 0) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.text, '5 Mon', 'text option is ok');
    assert.equal(templateOptions.date.getTime(), new Date(2016, 8, 5).getTime(), 'date option is ok');
    assert.deepEqual(templateOptions.groups, { 'ownerId': 1 }, 'groups option is ok');

});

QUnit.test('Agenda has right arguments in resourceCellTemplate arguments', function(assert) {
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
                field: 'ownerId',
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

QUnit.test('workSpace recalculation after render cellTemplates', function(assert) {
    this.createInstance({
        currentView: 'month',
        currentDate: new Date(2016, 8, 5),
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        resourceCellTemplate: function(itemData, index, $container) {
            return $('<div>').css({ height: '150px' });
        }
    });

    const schedulerHeaderHeight = parseInt(this.instance.$element().find('.dx-scheduler-header').outerHeight(true), 10);
    const schedulerHeaderPanelHeight = parseInt(this.instance.$element().find('.dx-scheduler-header-panel').outerHeight(true), 10);
    const $allDayTitle = this.instance.$element().find('.dx-scheduler-all-day-title');
    const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');

    assert.equal(parseInt($allDayTitle.css('top'), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, 'All day title element top value');
    assert.equal(parseInt($dateTableScrollable.css('paddingBottom'), 10), schedulerHeaderPanelHeight, 'dateTableScrollable element padding bottom');
    assert.equal(parseInt($dateTableScrollable.css('marginBottom'), 10), -schedulerHeaderPanelHeight, 'dateTableScrollable element margin bottom');
});

QUnit.test('WorkSpace recalculation works fine after render resourceCellTemplate if workspace has allDay appointment', function(assert) {
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2016, 8, 5),
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'John' },
                    { id: 2, text: 'Mike' }
                ]
            }
        ],
        dataSource: [{
            text: 'a',
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
            allDay: true
        }],
        crossScrollingEnabled: true,
        resourceCellTemplate: function(itemData, index, $container) {
            return $('<div>').css({ height: '150px' });
        }
    });

    const schedulerHeaderHeight = parseInt(this.instance.$element().find('.dx-scheduler-header').outerHeight(true), 10);
    const schedulerHeaderPanelHeight = parseInt(this.instance.$element().find('.dx-scheduler-header-panel').outerHeight(true), 10);
    const $allDayTitle = this.instance.$element().find('.dx-scheduler-all-day-title');
    const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');
    const allDayPanelHeight = this.instance._workSpace._$allDayTable.outerHeight();
    const $sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable');
    const $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');

    assert.equal(parseInt($allDayTitle.css('top'), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, 'All day title element top value');
    assert.roughEqual(parseInt($dateTableScrollable.css('paddingBottom'), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, 'dateTableScrollable element padding bottom');
    assert.roughEqual(parseInt($dateTableScrollable.css('marginBottom'), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, 'dateTableScrollable element margin bottom');

    assert.roughEqual(parseInt($sidebarScrollable.css('paddingBottom'), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, 'sidebarScrollable element padding bottom');
    assert.roughEqual(parseInt($sidebarScrollable.css('marginBottom'), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, 'sidebarScrollable element margin bottom');
    assert.roughEqual($headerScrollable.outerHeight(), schedulerHeaderPanelHeight + allDayPanelHeight, 1, 'headerScrollable height is correct');
});

QUnit.test('WorkSpace recalculation works fine after render dateCellTemplate if workspace has allDay appointment', function(assert) {
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2016, 8, 5),
        dataSource: [{
            text: 'a',
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
            allDay: true
        }],
        crossScrollingEnabled: true,
        dateCellTemplate: function(itemData, index, $container) {
            return $('<div>').css({ height: '150px' });
        }
    });

    const schedulerHeaderHeight = parseInt(this.instance.$element().find('.dx-scheduler-header').outerHeight(true), 10);
    const schedulerHeaderPanelHeight = parseInt(this.instance.$element().find('.dx-scheduler-header-panel').outerHeight(true), 10);
    const $allDayTitle = this.instance.$element().find('.dx-scheduler-all-day-title');
    const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');
    const allDayPanelHeight = this.instance._workSpace._$allDayTable.outerHeight();

    assert.equal(parseInt($allDayTitle.css('top'), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, 'All day title element top value');
    assert.roughEqual(parseInt($dateTableScrollable.css('paddingBottom'), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, 'dateTableScrollable element padding bottom');
    assert.roughEqual(parseInt($dateTableScrollable.css('marginBottom'), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, 'dateTableScrollable element margin bottom');
});

QUnit.test('Timepanel text should be calculated correctly if DST makes sense (T442904)', function(assert) {
    // can be reproduced in PST timezone
    this.createInstance({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2016, 10, 6),
        firstDayOfWeek: 0,
        startDayHour: 1,
        timeZone: 'America/Los_Angeles',
        height: 600
    });

    const $cells = this.instance.$element().find('.dx-scheduler-time-panel-cell div');

    assert.equal($cells.eq(0).text(), dateLocalization.format(new Date(2016, 10, 6, 1), 'shorttime'), 'Cell text is OK');
    assert.equal($cells.eq(2).text(), dateLocalization.format(new Date(2016, 10, 6, 2), 'shorttime'), 'Cell text is OK');
});

QUnit.test('DateTimeIndicator should show correct time in current time zone', function(assert) {
    const currentDate = new Date(2018, 1, 4);

    this.createInstance({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        cellDuration: 60,
        showCurrentTimeIndicator: true,
        currentDate: currentDate,
        indicatorTime: new Date(2018, 1, 4, 9, 30),
        height: 600
    });

    const indicatorPositionBefore = this.instance.$element().find('.dx-scheduler-date-time-indicator').position();
    const cellHeight = $(this.instance.$element()).find('.dx-scheduler-date-table td').eq(0).get(0).getBoundingClientRect().height;

    this.instance.option('timeZone', 'Asia/Yekaterinburg');

    const indicatorPositionAfter = this.instance.$element().find('.dx-scheduler-date-time-indicator').position();
    const tzDiff = this.instance.fire('getClientTimezoneOffset', currentDate) / 3600000 + this.instance.fire('getTimezone');

    assert.equal(indicatorPositionAfter.top, indicatorPositionBefore.top + cellHeight * tzDiff, 'indicator has correct position');
});

QUnit.test('Tables should take css class after width calculation(T491453)', function(assert) {
    assert.expect(1);

    let counter = 0;
    const originalWidthFn = renderer.fn.width;

    sinon.stub(renderer.fn, 'width', function(value) {
        if(value === 999 && !counter) {
            const $headerTable = $('#scheduler').find('table').first();
            assert.notOk($headerTable.attr('class'), 'Header table doesn\'t have any css classes yet');
            counter++;
        } else {
            return originalWidthFn.apply(this, arguments);
        }
    });

    try {
        this.createInstance({
            dataSource: [],
            views: ['month'],
            currentView: 'month',
            crossScrollingEnabled: true,
            width: 999
        });
    } finally {
        renderer.fn.width.restore();
    }
});

if(devices.real().deviceType === 'desktop') {
    QUnit.test('ScrollTo of dateTable scrollable shouldn\'t be called when dateTable scrollable scroll in timeLine view', function(assert) {
        this.createInstance({
            currentDate: new Date(2017, 3, 16),
            dataSource: [],
            currentView: 'timelineWeek',
            height: 500
        });

        const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');
        const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
        const headerScrollToSpy = sinon.spy(headerScrollable, 'scrollTo');
        const dateTableScrollToSpy = sinon.spy(dateTableScrollable, 'scrollTo');

        dateTableScrollable.scrollBy(1000);

        assert.ok(headerScrollToSpy.calledOnce, 'header scrollTo was called');
        assert.notOk(dateTableScrollToSpy.calledOnce, 'dateTable scrollTo was not called');
    });

    QUnit.test('ScrollToTime works correctly with timelineDay and timelineWeek view (T749957)', function(assert) {
        const date = new Date(2019, 5, 1, 9, 40);

        this.createInstance({
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

        this.instance.scrollToTime(date.getHours() - 1, 30, date);
        let scroll = this.scheduler.workSpace.getDateTableScrollable().find('.dx-scrollable-scroll')[0];

        assert.notEqual(translator.locate($(scroll)).left, 0, 'Container is scrolled in timelineDay');

        this.instance.option('currentView', 'timelineWeek');

        this.instance.scrollToTime(date.getHours() - 1, 30, date);
        scroll = this.scheduler.workSpace.getDateTableScrollable().find('.dx-scrollable-scroll')[0];

        assert.notEqual(translator.locate($(scroll)).left, 0, 'Container is scrolled in timelineWeek');
    });
}

QUnit.test('OnScroll of header scrollable shouldn\'t be called when dateTable scrollable scroll in timeLine view', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: 'timelineWeek',
        height: 500
    });

    let callCount = 0;

    const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    headerScrollable.option('onScroll', function() {
        callCount++;
    });

    dateTableScrollable.scrollBy(1000);

    assert.equal(callCount, 0, 'header onScroll was not called');
});

QUnit.test('ScrollTo of dateTable & header scrollable should are called when headerScrollable scroll', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: 'timelineWeek',
        height: 500
    });

    const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
    const headerScrollToSpy = sinon.spy(headerScrollable, 'scrollTo');
    const dateTableScrollToSpy = sinon.spy(dateTableScrollable, 'scrollTo');

    headerScrollable.scrollBy(1000);

    assert.ok(dateTableScrollToSpy.calledOnce, 'dateTable scrollTo was called');
    assert.notOk(headerScrollToSpy.calledOnce, 'header scrollTo wasn\'t called');
});

QUnit.test('OnScroll of dateTable scrollable shouldn\'t be called when header scrollable scroll in timeLine view', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: 'timelineWeek',
        height: 500
    });

    let callCount = 0;

    const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    dateTableScrollable.option('onScroll', function() {
        callCount++;
    });

    headerScrollable.scrollBy(1000);

    assert.equal(callCount, 0, 'dateTable onScroll was not called');
});

QUnit.test('ScrollTo of sidebar scrollable shouldn\'t be called when sidebar scrollable scroll and crossScrollingEnabled is turn on', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        crossScrollingEnabled: true,
        currentView: 'week',
        height: 500
    });

    const sideBarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
    const sideBarScrollToSpy = sinon.spy(sideBarScrollable, 'scrollTo');
    const dateTableScrollToSpy = sinon.spy(dateTableScrollable, 'scrollTo');

    sideBarScrollable.scrollBy(1000);

    assert.notOk(sideBarScrollToSpy.calledOnce, 'sidebar scrollTo was not called');
    assert.ok(dateTableScrollToSpy.calledOnce, 'dateTable scrollTo was called');
});

QUnit.test('OnScroll of sidebar scrollable shouldn\'t be called when dateTable scrollable scroll and crossScrollingEnabled is turn on', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        crossScrollingEnabled: true,
        currentView: 'week',
        height: 500
    });

    let callCount = 0;

    const sideBarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    sideBarScrollable.option('onScroll', function() {
        callCount++;
    });

    dateTableScrollable.scrollBy(1000);

    assert.equal(callCount, 0, 'sidebar onScroll was not called');
});

QUnit.test('intervalCount should be passed to workSpace', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        views: [{
            type: 'day',
            name: 'Test Day',
            intervalCount: 2
        }],
        currentView: 'day',
        height: 500
    });

    const workSpace = this.instance.getWorkSpace();

    assert.equal(workSpace.option('intervalCount'), 2, 'option intervalCount was passed');
});

QUnit.test('Group header should contain group header content with right height, groupOrientation = vertical', function(assert) {
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
    const $headerContent = this.scheduler.workSpace.groups.getGroupHeader(0).outerHeight();
    const cellHeight = this.scheduler.workSpace.getCell(1).outerHeight();

    assert.roughEqual($headerContent, 7 * cellHeight, 1, 'Group header content has right height');
});

QUnit.test('WorkSpace should be refreshed after groups changed', function(assert) {
    this.createInstance({
        groups: ['resource1'],
        resources: [
            {
                displayExpr: 'name',
                valueExpr: 'key',
                field: 'resource1',
                dataSource: [
                    { key: 1, name: 'One' },
                    { key: 2, name: 'Two' }
                ]
            },
            {
                field: 'resource2',
                dataSource: [
                    { id: 1, text: 'Room 1' }
                ]
            }
        ]
    });

    const refreshStub = sinon.stub(this.instance, '_refreshWorkSpace');

    try {
        this.instance.option('groups', ['resource2']);

        assert.ok(refreshStub.calledOnce, 'Workspace was refreshed');

    } finally {
        refreshStub.restore();
    }
});

QUnit.test('SelectedCellData option should have rigth data of focused cell', function(assert) {
    this.createInstance({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        showAllDayPanel: true,
        currentDate: new Date(2018, 3, 11),
        height: 600
    });

    const $cells = this.instance.$element().find('.dx-scheduler-date-table-cell');

    $($cells.eq(0)).trigger('dxpointerdown');

    assert.deepEqual(this.instance.option('selectedCellData'), [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }], 'option has right value');
});

QUnit.test('SelectedCellData option should be applied correctly in ungrouped workspace', function(assert) {
    this.createInstance({
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
        }]
    });

    assert.ok(true, 'WorkSpace works correctly');
});

QUnit.test('SelectedCellData option should make cell in focused state', function(assert) {
    this.createInstance({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        showAllDayPanel: true,
        selectedCellData: [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }],
        currentDate: new Date(2018, 3, 11),
        height: 600
    });

    const $cells = this.instance.$element().find('.dx-scheduler-date-table-cell');

    assert.ok($($cells.eq(0)).hasClass('dx-state-focused', 'correct cell is focused'));
});

QUnit.test('Focused cells cash should be correct (T640466)', function(assert) {
    this.createInstance({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        showAllDayPanel: true,
        selectedCellData: [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }],
        currentDate: new Date(2018, 3, 11),
        height: 600
    });
    const $cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
    const workSpace = this.instance.getWorkSpace();

    assert.deepEqual(workSpace._focusedCells[0], $cells.eq(0).get(0), 'Cashed cells is correct');
});

QUnit.test('Scheduler timeline workweek should contain two spans in header panel cell in Material theme', function(assert) {
    const origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    this.createInstance({
        views: [ 'week' ],
        currentDate: new Date(2015, 9, 29),
        firstDayOfWeek: 1,
        startDayHour: 4,
        endDayHour: 5,
        currentView: 'week'
    });

    const $rows = this.instance.$element().find('.dx-scheduler-header-row');
    const $firstRowCells = $rows.first().find('th');
    const startDate = 26;

    const formatWeekdayAndDay = function(date) {
        return dateLocalization.getDayNames('abbreviated')[date.getDay()] + ' ' + dateLocalization.format(date, 'day');
    };

    for(let i = 0; i < 5; i++) {
        const $cell = $firstRowCells.eq(i);
        assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
        assert.equal($cell.find('span').length, 2, 'Cell contains two spans in material theme');
        assert.ok($cell.find('span').first().hasClass('dx-scheduler-header-panel-cell-date'), 'first span has correct class');
        assert.ok($cell.find('span').last().hasClass('dx-scheduler-header-panel-cell-date'), 'second span has correct class');
    }
    themes.isMaterial = origIsMaterial;
});

QUnit.test('Vertical scrollable should work after switching currentDate if allDayPanel and crossScrollingEnabled are turned on', function(assert) {
    this.createInstance({
        dataSource: [],
        views: ['day'],
        currentView: 'day',
        showAllDayPanel: true,
        crossScrollingEnabled: true,
        currentDate: new Date(2018, 5, 14),
        height: 600
    });

    this.instance.option('currentDate', new Date(2018, 5, 15));
    const $scroll = this.instance.$element().find('.dx-scrollbar-vertical').eq(1);

    assert.notEqual($scroll.css('display'), 'none', 'ok');
});

QUnit.test('Current time indicator calculates position correctly with workWeek view (T750252)', function(assert) {
    this.createInstance({
        dataSource: [],
        views: [
            { name: '2 Work Weeks', type: 'workWeek', intervalCount: 2, startDate: new Date(Date.now() - 5 * toMs('day')) },
        ],
        currentView: 'workWeek',
        currentDate: new Date(),
        height: 580
    });


    const $dateTimeIndicator = this.scheduler.workSpace.getCurrentTimeIndicator()[0];
    const position = { top: $dateTimeIndicator.style.top, left: $dateTimeIndicator.style.left };

    assert.notEqual(position, { left: 0, top: 0 }, 'Current time indicator positioned correctly');
});

QUnit.test('Month view; dates are rendered correctly with grouping by date & empty resources in groups (T759160)', function(assert) {
    this.createInstance({
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

    const hasNaNCellData = this.scheduler.workSpace.getCells().filter((index, cell) => {
        return isNaN(parseInt(cell.innerText));
    }).length;

    assert.notOk(hasNaNCellData, 'Container has valid data');
});

QUnit.test('Recurrent appointment with tail on next week has most top coordinate (T805446)', function(assert) {
    this.createInstance({
        views: ['week', { type: 'day', intervalCount: 2 }],
        currentView: 'week',
        crossScrollingEnabled: true,
        dataSource: [{
            text: 'Recurrent',
            startDate: '2019-05-13T19:59:00',
            endDate: '2019-05-14T04:00:00',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU'
        }],
        startDayHour: 0,
        endDayHour: 24,
        firstDayOfWeek: 1,
        cellDuration: 60,
        currentDate: new Date(2019, 7, 19)
    });

    const appointment = this.scheduler.appointments.getAppointment();

    const coords = translator.locate(appointment);

    assert.ok(coords.top === 0, 'Appointment tail has most top coordinate');
});

QUnit.test('Workspace view has correct viewEndDate with empty groups and groupByDate = true (T815379)', function(assert) {
    this.createInstance({
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

    assert.deepEqual(this.instance.getEndViewDate(), new Date(2018, 4, 26, 15, 59), 'Appointment tail has most top coordinate');
});
