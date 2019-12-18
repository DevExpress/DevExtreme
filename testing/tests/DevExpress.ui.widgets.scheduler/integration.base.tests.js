var $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require('common.css!');
require('generic_light.css!');


var noop = require('core/utils/common').noop,
    errors = require('ui/widget/ui.errors'),
    DataSource = require('data/data_source/data_source').DataSource,
    config = require('core/config');

require('ui/scheduler/ui.scheduler');

QUnit.module('Integration: Base', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
        this.compareDates = function(actual, expected, assert) {
            assert.ok(actual instanceof Date, 'WorkSpace current date is instance of Date');
            assert.equal(actual.getFullYear(), expected.year, 'Year is OK');
            assert.equal(actual.getMonth(), expected.month, 'Month is OK');
            assert.equal(actual.getDate(), expected.date, 'Date is OK');
        };
    }
});

QUnit.test('Scheduler should have a header', function(assert) {
    this.createInstance();
    assert.equal(this.instance.$element().find('.dx-scheduler-header').length, 1, 'Scheduler has the header');
});

QUnit.test('Header should be initialized with correct views and currentView options', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week'
    });
    var $element = this.instance.$element();
    assert.deepEqual($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('views'), ['day', 'week'], 'Scheduler header has a correct views option');
    assert.equal($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('currentView'), 'week', 'Scheduler header has a correct current view');
});

QUnit.test('Height of \'dx-scheduler-group-row\' should be equal with height of \'dx-scheduler-date-table-row\'', function(assert) {
    var priorities = [
        {
            text: 'High priority',
            id: 1,
            color: '#cc5c53'
        }, {
            text: 'Low priority',
            id: 2,
            color: '#ff9747'
        }];
    var owners = [
        {
            text: 'Samantha Bright',
            id: 1,
            color: '#727bd2'
        }, {
            text: 'John Heart',
            id: 2,
            color: '#32c9ed'
        }, {
            text: 'Todd Hoffman',
            id: 3,
            color: '#2a7ee4'
        }, {
            text: 'Sandra Johnson',
            id: 4,
            color: '#7b49d3'
        }];

    var data = [
        {
            text: 'Website Re-Design Plan',
            ownerId: 4, roomId: 1, priorityId: 2,
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }, {
            text: 'Book Flights to San Fran for Sales Trip',
            ownerId: 2, roomId: 2, priorityId: 1,
            startDate: new Date(2017, 4, 22, 12, 0),
            endDate: new Date(2017, 4, 22, 13, 0),
            allDay: true
        }, {
            text: 'Install New Router in Dev Room',
            ownerId: 1, roomId: 1, priorityId: 2,
            startDate: new Date(2017, 4, 22, 14, 30),
            endDate: new Date(2017, 4, 22, 15, 30)
        }, {
            text: 'Approve Personal Computer Upgrade Plan',
            ownerId: 3, roomId: 2, priorityId: 2,
            startDate: new Date(2017, 4, 23, 10, 0),
            endDate: new Date(2017, 4, 23, 11, 0)
        }, {
            text: 'Final Budget Review',
            ownerId: 1, roomId: 1, priorityId: 1,
            startDate: new Date(2017, 4, 23, 12, 0),
            endDate: new Date(2017, 4, 23, 13, 35)
        }];

    this.createInstance({
        dataSource: data,
        views: ['timelineWeek'],
        currentView: 'timelineWeek',
        currentDate: new Date(2017, 4, 22),
        groups: ['ownerId', 'priorityId'],
        resources: [{
            fieldExpr: 'priorityId',
            dataSource: priorities,
            label: 'Priority'
        }, {
            fieldExpr: 'ownerId',
            dataSource: owners,
            label: 'Owner'
        }],
        height: 600
    });

    var $element = this.instance.$element();
    var groupRow = $element.find('.dx-scheduler-group-row').eq(0),
        dataTableRow = $element.find('.dx-scheduler-date-table-row').eq(0);

    assert.equal(groupRow.outerHeight(), dataTableRow.outerHeight(), 'Row heights is equal');
});

QUnit.test('Header should be initialized with correct \'width\' option', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week',
        width: 700
    });
    var $element = this.instance.$element(),
        header = $element.find('.dx-scheduler-header').dxSchedulerHeader('instance');

    assert.equal(header.option('width'), 700, 'Header has a right width');

    this.instance.option('width', 800);

    assert.equal(header.option('width'), 800, 'Header has a right width');

});

QUnit.test('Header should be initialized with correct useDropDownViewSwitcher option', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: true
    });
    var $element = this.instance.$element();
    assert.strictEqual($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('useDropDownViewSwitcher'), true, 'Scheduler header has a correct useDropDownViewSwitcher option');

    this.instance.option('useDropDownViewSwitcher', false);

    assert.strictEqual($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('useDropDownViewSwitcher'), false, 'Scheduler header has a correct useDropDownViewSwitcher option');
});

QUnit.test('Scheduler should have a work space', function(assert) {
    this.createInstance();
    assert.equal(this.instance.$element().find('.dx-scheduler-work-space').length, 1, 'Scheduler has the work space');
});

QUnit.test('Scheduler should have a tasks', function(assert) {
    this.createInstance();
    assert.equal(this.instance.$element().find('.dx-scheduler-scrollable-appointments').length, 1, 'Scheduler has tasks');
});

QUnit.test('Scheduler should handle events from units', function(assert) {
    this.createInstance();
    var checkSchedulerUnit = function(selector, unitName) {
        var unit = this.instance.$element().find(selector)[unitName]('instance');

        var spy = sinon.spy(noop);

        this.instance.subscribe('testFunction', spy);

        var observer = unit.option('observer');

        assert.equal(observer, this.instance, 'observer is instance of scheduler');

        unit.notifyObserver('testFunction', { a: 1 });

        assert.ok(spy.calledOnce, 'testFunction called once');
        assert.deepEqual(spy.getCall(0).args[0], { a: 1 }, 'testFunction has right args');
        assert.ok(spy.calledOn(this.instance), 'testFunction has a right context');
    };

    checkSchedulerUnit.call(this, '.dx-scheduler-header', 'dxSchedulerHeader');
    checkSchedulerUnit.call(this, '.dx-scheduler-work-space', 'dxSchedulerWorkSpaceDay');
    checkSchedulerUnit.call(this, '.dx-scheduler-scrollable-appointments', 'dxSchedulerAppointments');
});

QUnit.test('Scheduler should throw an error if event is not added to subscribes', function(assert) {
    this.createInstance();
    var unit = this.instance.$element().find('.dx-scheduler-header').dxSchedulerHeader('instance');

    assert.throws(
        function() {
            unit.notifyObserver('someFn', { a: 1 });
        },
        function(e) {
            return /E1031/.test(e.message);
        },
        'Exception messages should be correct'
    );
});

QUnit.test('Scheduler should be able to invoke unit methods', function(assert) {
    this.createInstance();

    this.instance.subscribe('testFn', function(a, b) {

        assert.equal(a, 1, 'the first arg is OK');
        assert.equal(b, 2, 'the second arg is OK');

        return a + b;
    });

    var result = this.instance.getWorkSpace().invoke('testFn', 1, 2);

    assert.equal(result, 3, 'result is OK');
});

QUnit.test('Filter options should be passed to the load method', function(assert) {
    var resources = [
        { field: 'r1', dataSource: [{ id: 1, text: 'a' }] },
        { field: 'r2', dataSource: [{ id: 1, text: 'b' }] }
    ];
    this.createInstance({
        currentDate: new Date(2015, 5, 29),
        firstDayOfWeek: 1,
        currentView: 'week',
        resources: resources,
        dataSource: new DataSource({
            load: function(options) {
                var schedulerOptions = options.dxScheduler;
                assert.deepEqual(schedulerOptions.startDate, new Date(2015, 5, 29), 'Start date is OK');
                assert.deepEqual(schedulerOptions.endDate, new Date(2015, 6, 5, 23, 59), 'End date is OK');
                assert.deepEqual(schedulerOptions.resources, resources, 'Resources are OK');
            }
        })
    });
});

QUnit.test('scheduler should work with disabled: true', function(assert) {
    assert.expect(0);

    this.createInstance({
        disabled: true
    });
});

QUnit.test('The \'min\' option should be converted to Date obj before send to work space and header', function(assert) {
    var date = new Date(1422738000000);
    this.createInstance({
        min: date.getTime()
    });

    var workSpace = this.instance.getWorkSpace(),
        header = this.instance.getHeader();

    this.compareDates(workSpace.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);

    date = new Date(1425243600000);
    this.instance.option('min', date.getTime());
    this.compareDates(workSpace.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
});

QUnit.test('The \'max\' option should be converted to Date obj before send to work space and header', function(assert) {
    var date = new Date(1422738000000);
    this.createInstance({
        max: date.getTime()
    });

    var workSpace = this.instance.getWorkSpace(),
        header = this.instance.getHeader();

    this.compareDates(workSpace.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);

    date = new Date(1425243600000);
    this.instance.option('max', date.getTime());
    this.compareDates(workSpace.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
});

QUnit.test('Scheduler should not throw an error when the details form is opened for the first time', function(assert) {
    var errorLogStub = sinon.stub(errors, 'log');

    try {
        errorLogStub.withArgs('W1002').returns(true)
            .throws('Non W1002 Exception');

        this.createInstance();
        this.instance.showAppointmentPopup({ startDate: new Date() });

        assert.ok(true, 'exception was not thrown');
    } finally {
        errorLogStub.restore();
    }
});

QUnit.test('The \'scrollingEnabled\' option of an appointment form should be \'true\'', function(assert) {
    this.createInstance();
    this.instance.showAppointmentPopup({ startDate: new Date() });

    assert.strictEqual(this.instance.getAppointmentDetailsForm().option('scrollingEnabled'), true, 'the scrollingEnabled option is OK');
});

QUnit.module('Integration: Date options with ISO8601', {
    beforeEach: function() {
        this.defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
    },
    afterEach: function() {
        config().forceIsoDateParsing = this.defaultForceIsoDateParsing;
    }
});

QUnit.test('currentDate option should be parsed with ISO8601 dates before sending to workspace and header', function(assert) {
    this.createInstance({
        views: ['day'],
        currentView: 'day',
        currentDate: '20170208'
    });

    var workSpace = this.instance.getWorkSpace(),
        header = this.instance.getHeader();

    assert.deepEqual(workSpace.option('currentDate'), new Date(2017, 1, 8), 'currentDate is OK');
    assert.deepEqual(header.option('currentDate'), new Date(2017, 1, 8), 'currentDate is OK');

    this.instance.option('currentDate', '20170209');

    assert.deepEqual(workSpace.option('currentDate'), new Date(2017, 1, 9), 'currentDate is OK after option change');
    assert.deepEqual(header.option('currentDate'), new Date(2017, 1, 9), 'currentDate is OK  after option change');
});

QUnit.test('max option should be parsed with ISO8601 dates before sending to workspace and header', function(assert) {
    this.createInstance({
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2017, 1, 8),
        max: '20170209'
    });

    var workSpace = this.instance.getWorkSpace(),
        header = this.instance.getHeader();

    assert.deepEqual(workSpace.option('max'), new Date(2017, 1, 9), 'max is OK');
    assert.deepEqual(header.option('max'), new Date(2017, 1, 9), 'max is OK');

    this.instance.option('max', '20170210');

    assert.deepEqual(workSpace.option('max'), new Date(2017, 1, 10), 'max is OK after option change');
    assert.deepEqual(header.option('max'), new Date(2017, 1, 10), 'max is OK  after option change');
});

QUnit.test('min option should be parsed with ISO8601 dates before sending to workspace and header', function(assert) {
    this.createInstance({
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2017, 1, 8),
        min: '20170207'
    });

    var workSpace = this.instance.getWorkSpace(),
        header = this.instance.getHeader();

    assert.deepEqual(workSpace.option('min'), new Date(2017, 1, 7), 'min is OK');
    assert.deepEqual(header.option('min'), new Date(2017, 1, 7), 'min is OK');

    this.instance.option('min', '20170206');

    assert.deepEqual(workSpace.option('min'), new Date(2017, 1, 6), 'min is OK after option change');
    assert.deepEqual(header.option('min'), new Date(2017, 1, 6), 'min is OK  after option change');
});
