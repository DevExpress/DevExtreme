const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require('generic_light.css!');

const noop = require('core/utils/common').noop;
const errors = require('ui/widget/ui.errors');
const config = require('core/config');

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
    const header = this.instance.$element().find('.dx-scheduler-header').dxSchedulerHeader('instance');
    assert.deepEqual(header.option('views'), ['day', 'week'], 'Scheduler header has a correct views option');
    assert.equal(header.option('currentView'), 'week', 'Scheduler header has a correct current view');
});

QUnit.test('Height of \'dx-scheduler-group-row\' should be equal with height of \'dx-scheduler-date-table-row\'', function(assert) {
    const priorities = [
        {
            text: 'High priority',
            id: 1,
            color: '#cc5c53'
        }, {
            text: 'Low priority',
            id: 2,
            color: '#ff9747'
        }];
    const owners = [
        {
            text: 'Samantha Bright',
            id: 1,
            color: '#727bd2'
        }, {
            text: 'John Heart',
            id: 2,
            color: '#32c9ed'
        }];

    const data = [
        {
            text: 'Website Re-Design Plan',
            ownerId: 1, roomId: 1, priorityId: 2,
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }, {
            text: 'Book Flights to San Fran for Sales Trip',
            ownerId: 2, roomId: 2, priorityId: 1,
            startDate: new Date(2017, 4, 22, 12, 0),
            endDate: new Date(2017, 4, 22, 13, 0),
            allDay: true
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

    const $element = this.instance.$element();
    const groupRow = $element.find('.dx-scheduler-group-flex-container .dx-scheduler-group-row:last-child .dx-scheduler-group-header').eq(0);
    const dataTableRow = $element.find('.dx-scheduler-date-table-row').eq(0);

    assert.roughEqual(groupRow.outerHeight(), dataTableRow.outerHeight(), 0.3, 'Row heights are equal');
});

QUnit.test('Header should be initialized with correct \'width\' option', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week',
        width: 700
    });
    const header = this.instance.$element().find('.dx-scheduler-header').dxSchedulerHeader('instance');

    assert.equal(header.option('width'), 700, 'Header has a right width');
});

QUnit.test('Header should be updated with correct \'width\' option', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week',
        width: 700
    });
    this.instance.option('width', 800);
    const header = this.instance.$element().find('.dx-scheduler-header').dxSchedulerHeader('instance');

    assert.equal(header.option('width'), 800, 'Header has a right width');
});

QUnit.test('Header should be initialized with correct useDropDownViewSwitcher option', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: true
    });
    const $element = this.instance.$element();
    assert.strictEqual($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('useDropDownViewSwitcher'), true, 'Scheduler header has a correct useDropDownViewSwitcher option');
});

QUnit.test('Header should be updated with correct useDropDownViewSwitcher option', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: true
    });
    this.instance.option('useDropDownViewSwitcher', false);
    const $element = this.instance.$element();
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
    const checkSchedulerUnit = function(selector, unitName) {
        const unit = this.instance.$element().find(selector)[unitName]('instance');

        const spy = sinon.spy(noop);

        this.instance.subscribe('testFunction', spy);

        const observer = unit.option('observer');

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
    const unit = this.instance.$element().find('.dx-scheduler-header').dxSchedulerHeader('instance');

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

    const result = this.instance.getWorkSpace().invoke('testFn', 1, 2);

    assert.equal(result, 3, 'result is OK');
});

QUnit.test('scheduler should work with disabled: true', function(assert) {
    assert.expect(0);

    this.createInstance({
        disabled: true
    });
});

QUnit.test('The \'min\' option should be converted to Date obj before send to work space and header', function(assert) {
    let date = new Date(1422738000000);
    this.createInstance({
        min: date.getTime()
    });

    const workSpace = this.instance.getWorkSpace();
    const header = this.instance.getHeader();

    this.compareDates(workSpace.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);

    date = new Date(1425243600000);
    this.instance.option('min', date.getTime());
    this.compareDates(workSpace.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('min'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
});

QUnit.test('The \'max\' option should be converted to Date obj before send to work space and header', function(assert) {
    let date = new Date(1422738000000);
    this.createInstance({
        max: date.getTime()
    });

    const workSpace = this.instance.getWorkSpace();
    const header = this.instance.getHeader();

    this.compareDates(workSpace.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);

    date = new Date(1425243600000);
    this.instance.option('max', date.getTime());
    this.compareDates(workSpace.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
    this.compareDates(header.option('max'), { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }, assert);
});

QUnit.test('Scheduler should not throw an error when the details form is opened for the first time', function(assert) {
    const errorLogStub = sinon.stub(errors, 'log');

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

    const workSpace = this.instance.getWorkSpace();
    const header = this.instance.getHeader();

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

    const workSpace = this.instance.getWorkSpace();
    const header = this.instance.getHeader();

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

    const workSpace = this.instance.getWorkSpace();
    const header = this.instance.getHeader();

    assert.deepEqual(workSpace.option('min'), new Date(2017, 1, 7), 'min is OK');
    assert.deepEqual(header.option('min'), new Date(2017, 1, 7), 'min is OK');

    this.instance.option('min', '20170206');

    assert.deepEqual(workSpace.option('min'), new Date(2017, 1, 6), 'min is OK after option change');
    assert.deepEqual(header.option('min'), new Date(2017, 1, 6), 'min is OK  after option change');
});
