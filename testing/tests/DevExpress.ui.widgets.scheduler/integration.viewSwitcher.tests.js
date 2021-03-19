const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require('generic_light.css!');

const noop = require('core/utils/common').noop;
const DataSource = require('data/data_source/data_source').DataSource;

require('ui/scheduler/ui.scheduler');

QUnit.module('Integration: View switcher', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
    }
});

QUnit.test('View switcher should contain default 2 items if scheduler option \'views\' is empty', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: false
    });
    const $element = $(this.instance.$element());

    assert.equal($element.find('.dx-scheduler-header .dx-scheduler-view-switcher').dxTabs('instance').option('items').length, 2, 'If \'views\' option is empty views switcher contains default 2 items');
});

QUnit.test('View switcher should contain default items if scheduler option \'views\' is empty, useDropDownViewSwitcher = true', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: true
    });
    const $element = $(this.instance.$element());

    assert.equal($element.find('.dx-scheduler-header .dx-scheduler-view-switcher').dxDropDownMenu('instance').option('items').length, 2, 'If \'views\' option is empty views switcher contains default 2 items');
});

QUnit.test('View switcher items count should be equal to option \'views\' length', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: false
    });
    this.instance.option('views', ['day', 'week']);
    const $element = $(this.instance.$element());

    assert.equal($element.find('.dx-scheduler-header .dx-scheduler-view-switcher').dxTabs('instance').option('items').length, 2, 'View switcher has a right count of items');
});

QUnit.test('View switcher items count should not be equal to option \'views\' length, useDropDownViewSwitcher = true', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: true,
        views: ['day', 'week']
    });
    const $element = $(this.instance.$element());

    assert.equal($element.find('.dx-scheduler-header .dx-scheduler-view-switcher').dxDropDownMenu('instance').option('items').length, 2, 'View switcher has a right count of items');
});

QUnit.test('If view switcher has a single item it should be selected', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: false
    });
    this.instance.option('views', ['day']);
    const $element = $(this.instance.$element());

    assert.equal($element.find('.dx-scheduler-header .dx-scheduler-view-switcher .dx-tab-selected').length, 1, 'View switcher has a single selected item');
});

QUnit.test('View switcher should select a correct item', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: false
    });
    this.instance.option('views', ['day', 'week']);
    this.instance.option('currentView', 'week');

    const $element = $(this.instance.$element());
    const $secondItem = $element.find('.dx-scheduler-header .dx-scheduler-view-switcher .dx-tab').eq(1);

    assert.ok($secondItem.hasClass('dx-tab-selected'), 'View switcher selects a right item');
});

QUnit.test('View switcher should update scheduler and header currentView correctly', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: false
    });
    this.instance.option('views', ['day', 'week']);
    this.instance.option('currentView', 'day');

    const $element = $(this.instance.$element());
    const $secondItem = $element.find('.dx-scheduler-header .dx-scheduler-view-switcher .dx-tab').eq(1);
    $secondItem.trigger('dxclick');

    assert.equal(this.instance.option('currentView'), 'week', 'Scheduler has a correct current view');
    assert.equal($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('currentView'), 'week', 'Scheduler header has a correct current view');
});

QUnit.test('View switcher should update scheduler and header currentView correctly, useDropDownViewSwitcher: true', function(assert) {
    this.createInstance({
        useDropDownViewSwitcher: true,
        views: ['day', 'week'],
        currentView: 'day'
    });

    const $element = $(this.instance.$element());
    const $switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher');
    const switcher = $switcher.dxDropDownMenu('instance');

    switcher.open();

    const $secondItem = $(switcher._popup.$content()).find('.dx-item').eq(1);

    assert.deepEqual(switcher.option('items'), ['day', 'week'], 'Switcher items is correct on init');

    switcher.open();
    $secondItem.trigger('dxclick');

    assert.equal(this.instance.option('currentView'), 'week', 'Scheduler has a correct current view');
    assert.deepEqual(switcher.option('items'), ['day', 'week'], 'Switcher items is correct');
    assert.equal($element.find('.dx-scheduler-header').dxSchedulerHeader('instance').option('currentView'), 'week', 'Scheduler header has a correct current view');
});

QUnit.test('View switcher should be initialized with correct items and selectedItem options, useDropDownViewSwitcher = false', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week',
        useDropDownViewSwitcher: false
    });
    const $element = $(this.instance.$element());
    assert.deepEqual($element.find('.dx-scheduler-view-switcher').dxTabs('instance').option('items'), ['day', 'week'], 'View switcher has a correct items');
    assert.equal($element.find('.dx-scheduler-view-switcher').dxTabs('instance').option('selectedItem'), 'week', 'View switcher has a selectedItem');
});

QUnit.test('View switcher should be initialized with correct items options, useDropDownViewSwitcher = true', function(assert) {
    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week',
        useDropDownViewSwitcher: true
    });
    const $element = $(this.instance.$element());
    assert.deepEqual($element.find('.dx-scheduler-view-switcher').dxDropDownMenu('instance').option('items'), ['day', 'week'], 'View switcher has a correct items');
});

QUnit.test('dataSource should be filtered if \'currentView\' option is changed', function(assert) {
    const dataSource = new DataSource({
        store: [{
            startDate: new Date(2015, 3, 1),
            endDate: new Date(2015, 3, 1, 0, 30),
            text: 'Item 1',
            ownerId: 1
        },
        {
            startDate: new Date(2015, 3, 1),
            text: 'Item 2',
            ownerId: 3
        },
        {
            startDate: new Date(2015, 4, 1),
            text: 'Item 3',
            ownerId: 1
        }
        ]
    });

    this.createInstance({
        views: ['day', 'week'],
        currentView: 'week',
        currentDate: new Date(2015, 3, 1),
        dataSource: dataSource,
        groups: ['ownerId'],
        remoteFiltering: true,
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    {
                        text: 'Jack',
                        id: 1,
                        color: 'red'
                    }
                ]
            }
        ]
    });

    this.instance.option('currentView', 'day');

    assert.deepEqual(dataSource.items(), [{
        startDate: new Date(2015, 3, 1),
        text: 'Item 1',
        ownerId: 1,
        endDate: new Date(2015, 3, 1, 0, 30)
    }], 'Data is filtered');
});

QUnit.test('Appointment should be rerendered only once if \'currentView\' option is changed', function(assert) {
    const options = {
        views: ['month', 'week'],
        currentView: 'week',
        currentDate: new Date(2015, 3, 1),
        dataSource: new DataSource({
            store: [{
                startDate: new Date(2015, 3, 1),
                endDate: new Date(2015, 3, 1, 0, 30),
                text: 'Item 1'
            }]
        }),
        onAppointmentRendered: noop
    };

    const renderedStub = sinon.stub(options, 'onAppointmentRendered');

    this.createInstance(options);

    this.instance.option('currentView', 'month');

    assert.equal(renderedStub.callCount, 2, 'Appointment is rerendered only once');
});
