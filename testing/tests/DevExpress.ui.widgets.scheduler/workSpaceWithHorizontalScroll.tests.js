import 'common.css!';
import devices from 'core/devices';
import { triggerHidingEvent, triggerResizeEvent, triggerShownEvent } from 'events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';
import 'ui/scheduler/ui.scheduler';
import SchedulerResourcesManager from 'ui/scheduler/ui.scheduler.resource_manager';
import 'ui/scheduler/ui.scheduler';
QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-work-space"></div>');
});

QUnit.module('Vertical Workspace with horizontal scrollbar', {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            crossScrollingEnabled: true,
            width: 100
        }).dxSchedulerWorkSpaceWeek('instance');
    }
});

QUnit.test('Header scrollable should contain header panel, all-day container and all-day panel', function(assert) {
    triggerResizeEvent(this.instance.$element());
    const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const scrollableContent = headerScrollable.$content();

    assert.equal(scrollableContent.find('.dx-scheduler-header-panel').length, 1, 'Header panel exists');
    assert.equal(scrollableContent.find('.dx-scheduler-all-day-appointments').length, 1, 'All-day container exists');
    assert.equal(scrollableContent.find('.dx-scheduler-all-day-panel').length, 1, 'All-day panel exists');
});

QUnit.test('Date table scrollable should contain date table', function(assert) {
    triggerResizeEvent(this.instance.$element());
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
    const scrollableContent = dateTableScrollable.$content();

    assert.equal(scrollableContent.find('.dx-scheduler-date-table').length, 1, 'Date table exists');
});

QUnit.test('Date table scrollable should have right config', function(assert) {
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
    const device = devices.current();
    let expectedShowScrollbarOption = 'onHover';

    if(device.phone || device.tablet) {
        expectedShowScrollbarOption = 'onScroll';
    }

    assert.equal(dateTableScrollable.option('direction'), 'both', 'Direction is OK');
    assert.equal(dateTableScrollable.option('showScrollbar'), expectedShowScrollbarOption, 'showScrollbar is OK');
    assert.strictEqual(dateTableScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
    assert.strictEqual(dateTableScrollable.option('updateManually'), true, 'updateManually is OK');
});

QUnit.test('Header scrollable should update position if date scrollable position is changed', function(assert) {
    const done = assert.async();
    const $element = this.instance.$element();
    const $cells = $element.find('.dx-scheduler-date-table-cell');

    $cells.get(0).style.width = '100px';

    this.instance.option('width', 500);

    const headerScrollable = $element.find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    dateTableScrollable.scrollTo({ left: 100 });

    setTimeout(() => {
        assert.equal(headerScrollable.scrollLeft(), 100, 'Scroll position is OK');
        done();
    });
});

QUnit.test('Time panel scrollable should update position if date scrollable position is changed', function(assert) {
    const done = assert.async();
    const $element = this.instance.$element();
    const timePanelScrollable = $element.find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    dateTableScrollable.scrollTo({ top: 100 });

    setTimeout(() => {
        assert.equal(timePanelScrollable.scrollTop(), 100, 'Scroll position is OK');
        done();
    });
});

QUnit.test('Date table scrollable should update position if time panel position is changed', function(assert) {
    const $element = this.instance.$element();
    const timePanelScrollable = $element.find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    timePanelScrollable.scrollTo({ top: 100 });

    assert.equal(dateTableScrollable.scrollTop(), 100, 'Scroll position is OK');
});

QUnit.test('Date table scrollable should update position if header scrollable position is changed', function(assert) {
    const $element = this.instance.$element();
    const $cells = $element.find('.dx-scheduler-date-table-cell');

    $cells.get(0).style.width = '100px';

    this.instance.option('width', 500);

    const headerScrollable = $element.find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    headerScrollable.scrollTo({ left: 100 });

    assert.equal(dateTableScrollable.scrollLeft(), 100, 'Scroll position is OK');
});

QUnit.test('the \'getCellIndexByCoordinates\' method should return a right result', function(assert) {
    this.instance.option('width', 500);

    const $element = this.instance.$element();

    triggerHidingEvent($element);
    triggerShownEvent($element);

    const index = this.instance.getCellIndexByCoordinates({ left: 85, top: 55 });

    assert.equal(index, 8, 'Index is OK');
});

QUnit.test('Header panel, all-day panel, date table should have a correct width', function(assert) {
    this.instance.option('width', 400);

    const $element = this.instance.$element();
    triggerHidingEvent($element);
    triggerShownEvent($element);

    const headerPanelWidth = $element.find('.dx-scheduler-header-panel').outerWidth();
    const allDayTableWidth = $element.find('.dx-scheduler-all-day-table').outerWidth();
    const dateTableWidth = $element.find('.dx-scheduler-date-table').outerWidth();

    assert.equal(headerPanelWidth, 525, 'Width is OK');
    assert.equal(allDayTableWidth, 525, 'Width is OK');
    assert.equal(dateTableWidth, 525, 'Width is OK');
});

QUnit.test('Header panel, all-day panel, date table should have a correct width if cell is larger than 75px', function(assert) {
    const $element = this.instance.$element();
    const $cells = $element.find('.dx-scheduler-date-table-cell');

    $cells.get(0).style.width = '300px';

    triggerHidingEvent($element);
    triggerShownEvent($element);

    const headerPanelWidth = $element.find('.dx-scheduler-header-panel').outerWidth();
    const allDayTableWidth = $element.find('.dx-scheduler-all-day-table').outerWidth();
    const dateTableWidth = $element.find('.dx-scheduler-date-table').outerWidth();

    assert.equal(headerPanelWidth, 2100, 'Width is OK');
    assert.equal(allDayTableWidth, 2100, 'Width is OK');
    assert.equal(dateTableWidth, 2100, 'Width is OK');
});

QUnit.test('Header panel, all-day panel, date table should always take all work space width', function(assert) {
    const $element = this.instance.$element();

    this.instance.option('width', 1000);
    this.instance.option('width', 600);
    triggerHidingEvent($element);
    triggerShownEvent($element);

    const headerPanelWidth = $element.find('.dx-scheduler-header-panel').outerWidth();
    const allDayTableWidth = $element.find('.dx-scheduler-all-day-table').outerWidth();
    const dateTableWidth = $element.find('.dx-scheduler-date-table').outerWidth();

    assert.roughEqual(headerPanelWidth, 896, 5, 'Width of the header panel is OK');
    assert.roughEqual(allDayTableWidth, 896, 5, 'Width of the allDay table is OK');
    assert.roughEqual(dateTableWidth, 896, 5, 'Width of the date table is OK');
});

QUnit.test('Workspace tables width should not be less than element width', function(assert) {
    const $element = this.instance.$element();
    $element.css('width', 1000);

    sinon.stub(this.instance, '_getWorkSpaceWidth').returns(50);

    triggerHidingEvent($element);
    triggerShownEvent($element);

    const headerPanelWidth = $element.find('.dx-scheduler-header-panel').outerWidth();
    const allDayTableWidth = $element.find('.dx-scheduler-all-day-table').outerWidth();
    const dateTableWidth = $element.find('.dx-scheduler-date-table').outerWidth();
    const expectedWidth = 1000 - this.instance.getTimePanelWidth();

    assert.equal(headerPanelWidth, expectedWidth, 'Width is OK');
    assert.equal(allDayTableWidth, expectedWidth, 'Width is OK');
    assert.equal(dateTableWidth, expectedWidth, 'Width is OK');
});


const stubInvokeMethod = function(instance, options) {
    options = options || {};
    sinon.stub(instance, 'invoke', function() {
        const subscribe = arguments[0];
        if(subscribe === 'createResourcesTree') {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === 'getResourceTreeLeaves') {
            const resources = instance.resources || [{ field: 'one', dataSource: [{ id: 1 }, { id: 2 }] }];
            return new SchedulerResourcesManager(resources).getResourceTreeLeaves(arguments[1], arguments[2]);
        }
        if(subscribe === 'getTimezone') {
            return options.tz || 3;
        }
        if(subscribe === 'getTimezoneOffset') {
            return -180 * 60000;
        }
        if(subscribe === 'convertDateByTimezone') {
            let date = new Date(arguments[1]);

            const tz = options.tz;

            if(tz) {
                const tzOffset = new Date().getTimezoneOffset() * 60000;
                const dateInUTC = date.getTime() + tzOffset;

                date = new Date(dateInUTC + (tz * 3600000));
            }

            return date;
        }
    });
};

QUnit.module('Vertical Workspace with horizontal scrollbar, groupOrientation = vertical', {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            groupOrientation: 'vertical',
            crossScrollingEnabled: true,
            startDayHour: 8,
            showAllDayPanel: true,
            endDayHour: 20
        }).dxSchedulerWorkSpaceWeek('instance');
        stubInvokeMethod(this.instance);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);
    }
});

QUnit.test('Header scrollable should contain header panel, groupOrientation = vertical', function(assert) {
    triggerResizeEvent(this.instance.$element());
    const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const scrollableContent = headerScrollable.$content();

    assert.equal(scrollableContent.find('.dx-scheduler-header-panel').length, 1, 'Header panel exists');
});

QUnit.test('Date table scrollable should contain date table, all-day container and all-day tables, groupOrientation = vertical', function(assert) {
    triggerResizeEvent(this.instance.$element());
    const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
    const scrollableContent = dateTableScrollable.$content();

    assert.equal(scrollableContent.find('.dx-scheduler-date-table').length, 1, 'Date table exists');
    assert.equal(scrollableContent.find('.dx-scheduler-all-day-appointments').length, 1, 'All-day container exists');
    assert.equal(scrollableContent.find('.dx-scheduler-date-table').length, 1, 'All-day panel exists');
});

QUnit.test('SideBar scrollable should contain timePanel and groupTable, groupOrientation = vertical', function(assert) {
    triggerResizeEvent(this.instance.$element());
    const sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
    const scrollableContent = sidebarScrollable.$content();

    assert.equal(scrollableContent.find('.dx-scheduler-time-panel').length, 1, 'Time panel exists');
    assert.equal(scrollableContent.find('.dx-scheduler-work-space-vertical-group-table').length, 1, 'Group table exists');
});

QUnit.test('the \'getCellIndexByCoordinates\' method should return a right result, groupOrientation = vertical', function(assert) {
    const $element = this.instance.$element();

    triggerHidingEvent($element);
    triggerShownEvent($element);

    const index = this.instance.getCellIndexByCoordinates({ left: 85, top: 55 });

    assert.equal(index, 7, 'Index is OK');
});

QUnit.test('Header panel and date table should have a correct width, groupOrientation = vertical', function(assert) {
    const $element = this.instance.$element();
    triggerHidingEvent($element);
    triggerShownEvent($element);

    const headerPanelWidth = $element.find('.dx-scheduler-header-panel').outerWidth(true);
    const dateTableWidth = $element.find('.dx-scheduler-date-table').outerWidth(true);

    assert.roughEqual(headerPanelWidth, 797, 1.01, 'Width is OK');
    assert.roughEqual(dateTableWidth, 797, 1.01, 'Width is OK');
});

