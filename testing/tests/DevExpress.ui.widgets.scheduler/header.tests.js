const $ = require('jquery');
const SchedulerHeader = require('ui/scheduler/ui.scheduler.header');
const Tabs = require('ui/tabs');
const DropDownMenu = require('ui/drop_down_menu');
const devices = require('core/devices');

require('ui/scheduler/ui.scheduler');

require('common.css!');
require('generic_light.css!');


const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';

QUnit.testStart(function() {
    const markup = '\
        <div id="scheduler-header"></div>\
        <div id="scheduler"></div>\
    ';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Header', {
    beforeEach: function() {
        this.instance = $('#scheduler-header').dxSchedulerHeader().dxSchedulerHeader('instance');
    }
});

QUnit.test('Scheduler header should be initialized', function(assert) {
    assert.ok(this.instance instanceof SchedulerHeader, 'dxSchedulerHeader was initialized');
});

QUnit.test('Scheduler header should have a right css class', function(assert) {
    const $element = this.instance.$element();

    assert.ok($element.hasClass('dx-scheduler-header'), 'dxSchedulerHeader has \'dx-scheduler-header\' css class');
});

QUnit.test('Header should contain dxTabs view switcher on default', function(assert) {
    const $element = this.instance.$element();
    const $switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher');
    const $switcherLabel = $element.find('.dx-scheduler-view-switcher-label');

    assert.equal($switcher.length, 1, 'View switcher was rendered');
    assert.equal($switcherLabel.length, 0, 'View switcher label was not rendered');
    assert.ok(this.instance._viewSwitcher instanceof Tabs, 'View switcher is dxTabs');
});

QUnit.test('Header should contain dxDropDownMenu view switcher if useDropDownViewSwitcher = true', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        useDropDownViewSwitcher: true
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const $switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher');
    const $switcherLabel = $element.find('.dx-scheduler-view-switcher-label');

    assert.equal($switcher.length, 1, 'View switcher was rendered');
    assert.equal($switcherLabel.length, 1, 'View switcher label was rendered');
    assert.ok(instance._viewSwitcher instanceof DropDownMenu, 'View switcher is dxDropDownMenu');
});

QUnit.test('Header should contain a navigator', function(assert) {
    const $element = this.instance.$element();

    assert.equal($element.find('.dx-scheduler-navigator').length, 1);
});

QUnit.test('option(\'width\', 740)', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This behavior is designed for desktop only');
        return;
    }

    const $element = $('#scheduler').dxScheduler({
        views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
        width: 740
    });

    assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 2);
});

QUnit.test('option(\'width\', 770)', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This behavior is designed for desktop only');
        return;
    }

    const $element = $('#scheduler').dxScheduler({
        views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
        width: 770
    });

    assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 0);
});

QUnit.module('Header Options', {
    beforeEach: function() {
        this.instance = $('#scheduler-header').dxSchedulerHeader({
            min: new Date(2015, 1, 2),
            max: new Date(2015, 1, 4)
        }).dxSchedulerHeader('instance');
    }
});

QUnit.test('View Switcher should be rerendering after useDropDownViewSwitcher option changing', function(assert) {
    this.instance.option('useDropDownViewSwitcher', true);

    const $element = this.instance.$element();
    const $switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher');

    assert.equal($switcher.length, 1, 'View switcher was rendered');
    assert.ok(this.instance._viewSwitcher instanceof DropDownMenu, 'View switcher is dxDropDownMenu');
    assert.equal($element.find('.dx-tabs').length, 0, 'Tabs were detached');
});

QUnit.test('View Switcher label should be removed after useDropDownViewSwitcher option changing', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        useDropDownViewSwitcher: true,
    }).dxSchedulerHeader('instance');

    this.instance.option('useDropDownViewSwitcher', false);

    const $element = instance.$element();
    const $switcherLabel = $element.find('.dx-scheduler-view-switcher-label');

    assert.equal($switcherLabel.length, 0, 'View switcher label was removed');
});

QUnit.test('Min & Max options should be passed to navigator', function(assert) {
    const $element = this.instance.$element();
    const navigator = $element.find('.dx-scheduler-navigator').dxSchedulerNavigator('instance');

    assert.deepEqual(navigator.option('min'), new Date(2015, 1, 2), 'min is passed');
    assert.deepEqual(navigator.option('max'), new Date(2015, 1, 4), 'max is passed');

    this.instance.option('min', new Date(2015, 1, 1));
    assert.deepEqual(navigator.option('min'), new Date(2015, 1, 1), 'min is passed after option changed');

    this.instance.option('max', new Date(2015, 1, 5));
    assert.deepEqual(navigator.option('max'), new Date(2015, 1, 5), 'max is passed after option changed');
});

QUnit.test('Views option should be passed to viewSwitcher', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', 'day']
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher').dxTabs('instance');

    assert.deepEqual(switcher.option('items'), ['month', 'day'], 'views were passed');

    instance.option('views', ['week']);

    assert.deepEqual(switcher.option('items'), ['week'], 'views were passed after option changed');
});

QUnit.test('Views option with objects should be passed to viewSwitcher', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', {
            type: 'day',
            name: 'Test Day'
        }]
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher').dxTabs('instance');

    assert.deepEqual(switcher.option('items'), ['month', {
        type: 'day',
        name: 'Test Day'
    }], 'views were passed');
});

QUnit.test('View switcher should be rendered correctly when views contains objects', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: [{
            type: 'month'
        }, {
            type: 'day',
            name: 'TestDay'
        }]
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const $switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher');

    assert.equal($switcher.text(), 'MonthTestDay', 'ViewSwitcher was rendered correctly');
});

QUnit.test('View switcher label should be rendered correctly when views contains objects', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: [{
            type: 'month'
        }, {
            type: 'day',
            name: 'TestDay'
        }],
        currentView: {
            type: 'month'
        },
        useDropDownViewSwitcher: true
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const $switcherLabel = $element.find('.dx-scheduler-view-switcher-label');

    assert.equal($switcherLabel.text(), 'Month', 'ViewSwitcher label was rendered correctly');

    instance.option('currentView', {
        type: 'day',
        name: 'TestDay'
    });

    assert.equal($switcherLabel.text(), 'TestDay', 'ViewSwitcher label was rendered correctly');
});

QUnit.test('currentView option should be passed correctly to the navigator', function(assert) {
    const views = [
        {
            type: 'month'
        }, {
            type: 'day',
            name: 'TestDay'
        }];

    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: views,
        currentView: views[0],
        useDropDownViewSwitcher: false
    }).dxSchedulerHeader('instance');

    instance.option('currentView', views[1]);

    const $element = instance.$element();
    const navigator = $element.find('.dx-scheduler-navigator').dxSchedulerNavigator('instance');
    const switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher').dxTabs('instance');

    assert.equal(navigator.option('step'), 'day', 'currentView is passed correctly');
    assert.deepEqual(switcher.option('selectedItem'), { type: 'day', name: 'TestDay' }, 'currentView is passed correctly');
});

QUnit.test('Views option should be passed to viewSwitcher, useDropDownViewSwitcher = true', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', 'day'],
        useDropDownViewSwitcher: true,
        currentView: 'month'
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher').dxDropDownMenu('instance');

    assert.deepEqual(switcher.option('items'), ['month', 'day'], 'views were passed');

    instance.option('views', ['month', 'week']);

    assert.deepEqual(switcher.option('items'), ['month', 'week'], 'views were passed after option changed');
});

QUnit.test('Views option with objects should be passed to viewSwitcher, useDropDownViewSwitcher = true', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', {
            type: 'day',
            name: 'TestDay'
        }],
        useDropDownViewSwitcher: true,
        currentView: 'month'
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher').dxDropDownMenu('instance');

    assert.deepEqual(switcher.option('items'), ['month', {
        type: 'day',
        name: 'TestDay'
    }], 'views were passed');
});

QUnit.test('View switcher should be rendered correctly when views contains objects, useDropDownViewSwitcher = true', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        useDropDownViewSwitcher: true,
        views: ['month', {
            type: 'day',
            name: 'TestDay'
        }]
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher').dxDropDownMenu('instance');

    switcher.open();
    assert.equal(switcher._popup.$content().find('.dx-item').eq(1).text(), 'TestDay', 'ViewSwitcher was rendered correctly');
});

QUnit.test('currentView option should be saved then views changed', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', 'day'],
        currentView: 'day'
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const switcher = $element.find('.dx-scheduler-view-switcher').dxTabs('instance');

    instance.option('views', ['month', 'week', 'day']);

    assert.deepEqual(switcher.option('selectedItem'), 'day', 'view is saved');
});

QUnit.test('\'currentViewUpdated\' observer should be notified after selection of dxTabs item', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', 'day'],
        useDropDownViewSwitcher: false,
        currentView: 'month'
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const $switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher');
    const switcher = $switcher.dxTabs('instance');

    const stub = sinon.stub(this.instance, 'notifyObserver').withArgs('currentViewUpdated');

    switcher.option('selectedItem', 'day');

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.equal(args[1], 'day', 'Arguments are OK');
});

QUnit.test('\'currentViewUpdated\' observer should be notified after selection of dxTabs item, views with objects', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', {
            type: 'day',
            name: 'TestDay'
        }],
        useDropDownViewSwitcher: false,
        currentView: 'month'
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const $switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher');

    const stub = sinon.stub(this.instance, 'notifyObserver').withArgs('currentViewUpdated');
    const $item = $switcher.find('.dx-item').eq(1);

    $($item).trigger('dxclick');
    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.equal(args[1], 'TestDay', 'Arguments are OK');
});

QUnit.test('\'currentViewUpdated\' observer should be notified after click on dxDropDownMenu item', function(assert) {
    const instance = $('#scheduler-header').dxSchedulerHeader({
        views: ['month', 'day'],
        useDropDownViewSwitcher: true,
        currentView: 'month'
    }).dxSchedulerHeader('instance');

    const $element = instance.$element();
    const $switcher = $element.find('.dx-dropdownmenu.dx-scheduler-view-switcher');
    const switcher = $switcher.dxDropDownMenu('instance');

    switcher.open();

    const stub = sinon.stub(this.instance, 'notifyObserver').withArgs('currentViewUpdated');
    const $item = switcher._popup.$content().find('.dx-item').eq(1);

    $($item).trigger('dxclick');

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.equal(args[1], 'day', 'Arguments are OK');
});

QUnit.module('Header Keyboard Navigation', {
    beforeEach: function() {
        this.instance = $('#scheduler-header').dxSchedulerHeader({
            focusStateEnabled: true,
            tabIndex: 1
        }).dxSchedulerHeader('instance');
    }
});

QUnit.test('Header should not have tabIndex', function(assert) {
    const $element = this.instance.$element();

    assert.equal($element.attr('tabindex'), null, 'tabIndex is correct');
});

QUnit.test('Focus options should be passed to switcher', function(assert) {
    const $element = this.instance.$element();
    const switcher = $element.find('.dx-tabs.dx-scheduler-view-switcher').dxTabs('instance');

    assert.equal(switcher.option('focusStateEnabled'), true, 'focusStateEnabled is passed');

    assert.equal(switcher.option('tabIndex'), 1, 'tabIndex is passed');

    this.instance.option('tabIndex', 2);
    assert.equal(switcher.option('tabIndex'), 2, 'tabIndex is correctly passed after optionChanged');

    this.instance.option('focusStateEnabled', false);
    assert.equal(switcher.option('focusStateEnabled'), false, 'focusStateEnabled is correctly passed after optionChanged');
});

QUnit.test('Focus options should be passed to navigator', function(assert) {
    const $element = this.instance.$element();
    const navigator = $element.find('.dx-scheduler-navigator').dxSchedulerNavigator('instance');

    assert.equal(navigator.option('focusStateEnabled'), true, 'focusStateEnabled is passed');

    assert.equal(navigator.option('tabIndex'), 1, 'tabIndex is passed');

    this.instance.option('tabIndex', 2);
    assert.equal(navigator.option('tabIndex'), 2, 'tabIndex is correctly passed after optionChanged');

    this.instance.option('focusStateEnabled', false);
    assert.equal(navigator.option('focusStateEnabled'), false, 'focusStateEnabled is correctly passed after optionChanged');
});
