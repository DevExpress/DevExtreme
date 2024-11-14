import { getOuterWidth, getOuterHeight } from 'core/utils/size';
import dateUtils from 'core/utils/date';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { triggerHidingEvent, triggerShownEvent } from 'common/core/events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';
import '__internal/scheduler/workspaces/m_timeline';
import '__internal/scheduler/workspaces/m_timeline_day';
import '__internal/scheduler/workspaces/m_timeline_month';
import '__internal/scheduler/workspaces/m_timeline_week';
import '__internal/scheduler/workspaces/m_timeline_work_week';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-timeline"></div></div>\
                                <div id="scheduler-timeline-rtl"></div>');
});

const CELL_CLASS = 'dx-scheduler-date-table-cell';
const HOVER_CLASS = 'dx-state-hover';

const TIMELINE_DAY = { class: 'dxSchedulerTimelineDay', name: 'SchedulerTimelineDay' };
const TIMELINE_WEEK = { class: 'dxSchedulerTimelineWeek', name: 'SchedulerTimelineWeek' };
const TIMELINE_MONTH = { class: 'dxSchedulerTimelineMonth', name: 'SchedulerTimelineMonth' };

QUnit.module('Timeline Base', {

    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({}).dxSchedulerTimelineDay('instance');
    }
});

QUnit.test('Header scrollable should update position if date scrollable position is changed to right', function(assert) {
    const done = assert.async();
    const $element = this.instance.$element();
    const headerScrollable = $element.find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    dateTableScrollable.scrollTo({ left: 100 });

    setTimeout(() => {
        assert.equal(headerScrollable.scrollLeft(), 100, 'Scroll position is OK');
        done();
    }, 100);
});

QUnit.test('Header scrollable should have right scrolloByContent (T708008)', function(assert) {
    const $element = this.instance.$element();
    const headerScrollable = $element.find('.dx-scheduler-header-scrollable').dxScrollable('instance');

    assert.strictEqual(headerScrollable.option('scrollByContent'), true, 'scrolloByContent is OK');
});


QUnit.test('Header scrollable shouldn\'t update position if date scrollable position is changed to bottom', function(assert) {
    const $element = this.instance.$element();
    const headerScrollable = $element.find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    dateTableScrollable.scrollTo({ top: 100 });

    assert.equal(headerScrollable.scrollLeft(), 0, 'Scroll position is OK');
});

QUnit.test('Date table should have a correct width if cell is less than 75px', function(assert) {
    this.instance.option('crossScrollingEnabled', true);

    const $element = this.instance.$element();
    const $cells = $element.find('.dx-scheduler-date-table-cell');

    $cells.css('width', 30);

    triggerHidingEvent($element);
    triggerShownEvent($element);

    const dateTableWidth = getOuterWidth($element.find('.dx-scheduler-date-table'));
    assert.equal(dateTableWidth, 1440, 'Width is OK');
});

[true, false].forEach((renovateRender) => {
    QUnit.test(`Sidebar scrollable should update position if date scrollable position is changed when renovateRender is ${renovateRender}`, function(assert) {
        const done = assert.async();

        this.instance.option({
            crossScrollingEnabled: true,
            width: 400,
            height: 150,
            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }, { id: 4, text: 'd' }] }],
            renovateRender,
        });

        const $element = this.instance.$element();
        const groupPanelScrollable = $element.find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
        const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        triggerHidingEvent($element);
        triggerShownEvent($element);

        dateTableScrollable.scrollTo({ top: 102 });

        setTimeout(() => {
            assert.equal(groupPanelScrollable.scrollTop(), 102, 'Scroll position is OK');
            done();
        }, 100);
    });

    QUnit.test(`Date table scrollable should update position if sidebar position is changed when renovateRender is ${renovateRender}`, function(assert) {
        this.instance.option({
            crossScrollingEnabled: true,
            width: 400,
            height: 150,
            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }, { id: 4, text: 'd' }] }],
            renovateRender,
        });

        const $element = this.instance.$element();
        const groupPanelScrollable = $element.find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
        const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        triggerHidingEvent($element);
        triggerShownEvent($element);

        groupPanelScrollable.scrollTo({ top: 102 });

        assert.equal(dateTableScrollable.scrollTop(), 102, 'Scroll position is OK');
    });
});

QUnit.test('Date table scrollable should update position if header scrollable position is changed', function(assert) {
    const $element = this.instance.$element();
    const headerScrollable = $element.find('.dx-scheduler-header-scrollable').dxScrollable('instance');
    const dateTableScrollable = $element.find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

    triggerHidingEvent($element);
    triggerShownEvent($element);

    headerScrollable.scrollTo({ left: 100 });

    assert.equal(dateTableScrollable.scrollLeft(), 100, 'Scroll position is OK');
});

QUnit.test('Sidebar should be hidden in simple mode', function(assert) {
    const $element = this.instance.$element();

    const $sidebar = $element.find('.dx-scheduler-sidebar-scrollable');

    assert.equal($sidebar.css('display'), 'none', 'Sidebar is invisible');
});

QUnit.test('Sidebar should be visible in grouped mode', function(assert) {
    const $element = this.instance.$element();

    this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
    const $sidebar = $element.find('.dx-scheduler-sidebar-scrollable');

    assert.equal($sidebar.css('display'), 'block', 'Sidebar is visible');
});

QUnit.test('Group table cells should have correct height', function(assert) {
    const $element = this.instance.$element();

    this.instance.option('groups', [
        { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
        { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
    ]);

    const $groupTable = $element.find('.dx-scheduler-sidebar-scrollable .dx-scheduler-group-table');
    const $groupRows = $groupTable.find('.dx-scheduler-group-row');
    const $groupHeader = $groupRows.eq(1).find('.dx-scheduler-group-header').eq(0);
    const dateTableCellHeight = $element.find('.dx-scheduler-date-table-cell').get(0).getBoundingClientRect().height;
    const groupHeaderHeight = $groupHeader.get(0).getBoundingClientRect().height;

    assert.roughEqual(dateTableCellHeight, groupHeaderHeight, 1.1, 'Cell height is OK');
});

QUnit.skip('the "getCoordinatesByDate" method should return right coordinates for grouped timeline', function(assert) {
    const instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
        'currentDate': new Date(2015, 9, 28),
        groupOrientation: 'vertical',
    }).dxSchedulerTimelineDay('instance');

    instance.option('groups', [
        { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
        { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
    ]);

    const coordinates = instance.positionHelper.getCoordinatesByDate(new Date(2015, 9, 28, 1), 1);
    const expectedPosition = instance.$element()
        .find('.dx-scheduler-date-table-row').eq(1)
        .find('.dx-scheduler-date-table-cell').eq(2)
        .position();

    assert.equal(coordinates.left, expectedPosition.left, 'Coordinates are OK');
    assert.equal(coordinates.top, expectedPosition.top, 'Coordinates are OK');
});


QUnit.test('the \'getCellIndexByCoordinates\' method should return right coordinates', function(assert) {
    const cellWidth = getOuterWidth(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const cellIndex = this.instance.getCellIndexByCoordinates({ left: cellWidth * 15, top: 1 });

    assert.equal(cellIndex, 15, 'Cell index is OK');
});

QUnit.test('the \'getCellIndexByCoordinates\' method should return right coordinates for fractional value', function(assert) {
    this.instance.option('groups', [
        { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
        { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
    ]);

    const cellWidth = getOuterWidth(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const cellHeight = getOuterHeight(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));

    let cellIndex = this.instance.getCellIndexByCoordinates({ left: cellWidth * 15 + 0.656, top: cellHeight * 2 - 0.656 });

    assert.equal(cellIndex, 63, 'Cell index is OK');

    cellIndex = this.instance.getCellIndexByCoordinates({ left: cellWidth + 0.656, top: cellHeight - 0.656 });

    assert.equal(cellIndex, 1, 'Cell index is OK');

    cellIndex = this.instance.getCellIndexByCoordinates({ left: cellWidth + 0.656, top: cellHeight + 0.656 });

    assert.equal(cellIndex, 49, 'Cell index is OK');
});

QUnit.test('Timeline should not have time panel offset', function(assert) {
    const offset = this.instance.getTimePanelWidth();

    assert.strictEqual(offset, 0, 'Offset is 0');
});

QUnit.test('Tables should be rerendered if dimension was changed and horizontal scrolling is enabled', function(assert) {
    this.instance.option('crossScrollingEnabled', true);
    const stub = sinon.stub(this.instance, '_setTableSizes');

    resizeCallbacks.fire();

    assert.ok(stub.calledOnce, 'Tables were updated');
});

QUnit.test('dateUtils.getTimezonesDifference should be called when calculating interval between dates', function(assert) {
    const stub = sinon.stub(dateUtils, 'getTimezonesDifference');
    const minDate = new Date('Thu Mar 10 2016 00:00:00 GMT-0500');
    const maxDate = new Date('Mon Mar 15 2016 00:00:00 GMT-0400');

    this.instance._getIntervalBetween(minDate, maxDate, true);

    assert.ok(stub.calledOnce, 'getTimezonesDifference was called');

    dateUtils.getTimezonesDifference.restore();
});

QUnit.test('Ensure cell min height is equal to cell height(T389468)', function(assert) {
    const stub = sinon.stub(this.instance, 'getCellHeight').returns(10);

    this.instance.option({
        groups: [
            { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }
        ],
        height: 400
    });

    try {
        this.instance.option('currentDate', new Date(2010, 10, 10));
        const height = getOuterHeight(this.instance.$element().find('.dx-scheduler-group-header').eq(0));
        const expectedHeight = getOuterHeight(this.instance.$element().find('.dx-scheduler-date-table-cell').first()) - 1;

        assert.roughEqual(height, expectedHeight, 2.001, 'Group cell height is OK');

    } finally {
        stub.restore();
    }
});

QUnit.module('Timeline Day', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({}).dxSchedulerTimelineDay('instance');
    }
});

[true, false].forEach((renovateRender) => {
    QUnit.skip(`the 'getCoordinatesByDate' method should return right coordinates when renovateRender is ${true}`, function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 10, 15),
            startDayHour: 9,
            hoursInterval: 1,
            renovateRender,
        });

        const coordinates = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 10, 15, 10, 30), 0, false);
        const $expectedCell = this.instance.$element()
            .find('.dx-scheduler-date-table-cell').eq(1);
        const expectedPositionLeft = $expectedCell.position().left + 0.5 * getOuterWidth($expectedCell);

        assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, 'left coordinate is OK');
    });

    QUnit.skip(`the 'getCoordinatesByDate' method should return right coordinates for rtl mode when renovateRender is ${true}`, function(assert) {
        this.instance.option({
            rtlEnabled: true,
            width: 100,
            currentDate: new Date(2015, 10, 15),
            startDayHour: 9,
            hoursInterval: 1,
            renovateRender,
        });

        const coordinates = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 10, 15, 10, 30), 0, false);
        const $expectedCell = this.instance.$element()
            .find('.dx-scheduler-date-table-cell').eq(1);

        const expectedPositionLeft = $expectedCell.position().left + getOuterWidth($expectedCell) - 0.5 * getOuterWidth($expectedCell);

        assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, 'left coordinate is OK');
    });
});

QUnit.module('Timeline Day, groupOrientation = horizontal', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
            groupOrientation: 'horizontal',
            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]
        }).dxSchedulerTimelineDay('instance');
    }
});

QUnit.test('Sidebar should not be visible in grouped mode, groupOrientation = horizontal', function(assert) {
    const $element = this.instance.$element();

    const $sidebar = $element.find('.dx-scheduler-sidebar-scrollable');

    assert.equal($sidebar.css('display'), 'none', 'Sidebar is visible');
});

QUnit.test('Group table cells should have correct height, groupOrientation = horizontal', function(assert) {
    const $element = this.instance.$element();

    const $groupRows = $element.find('.dx-scheduler-header-panel .dx-scheduler-group-row');
    const $groupHeader = $groupRows.eq(0).find('.dx-scheduler-group-header').eq(0);
    const groupHeaderHeight = $groupHeader.get(0).getBoundingClientRect().height;

    assert.roughEqual(50, groupHeaderHeight, 1.1, 'Cell height is OK');
});

QUnit.skip('the \'getCoordinatesByDate\' method should return right coordinates for grouped timeline, groupOrientation = horizontal', function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 21),
        firstDayOfWeek: 1,
        startDayHour: 5,
        endDayHour: 8,
        hoursInterval: 1
    });

    const coordinates = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 9, 21, 6), 1);
    const expectedPosition = this.instance.$element()
        .find('.dx-scheduler-date-table-row').eq(0)
        .find('.dx-scheduler-date-table-cell').eq(4)
        .position();

    assert.equal(coordinates.left, expectedPosition.left, 'Coordinates are OK');
    assert.equal(coordinates.top, expectedPosition.top, 'Coordinates are OK');

});

QUnit.module('Timeline Week', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek({}).dxSchedulerTimelineWeek('instance');
    }
});

QUnit.test('Scheduler timeline week header cells should have right width', function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 29)
    });
    const $element = this.instance.$element();
    const $firstRow = $element.find('.dx-scheduler-header-row').first();
    const $lastRow = $element.find('.dx-scheduler-header-row').last();
    const $firstHeaderCell = $firstRow.find('.dx-scheduler-header-panel-cell').eq(0);
    const $lastHeaderCell = $lastRow.find('.dx-scheduler-header-panel-cell').eq(0);

    assert.roughEqual(getOuterWidth($firstHeaderCell), 48 * getOuterWidth($lastHeaderCell), 1.5, 'First row cell has correct width');
});

QUnit.test('Scheduler timeline week header cells should have right width if crossScrollingEnabled = true', function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 29),
        crossScrollingEnabled: true
    });

    resizeCallbacks.fire();

    const $element = this.instance.$element();
    const $firstRow = $element.find('.dx-scheduler-header-row').first();
    const $lastRow = $element.find('.dx-scheduler-header-row').last();
    const $firstHeaderCell = $firstRow.find('.dx-scheduler-header-panel-cell').eq(0);
    const $lastHeaderCell = $lastRow.find('.dx-scheduler-header-panel-cell').eq(0);
    const $dateTableCell = $element.find('.dx-scheduler-date-table-cell').eq(0);

    assert.roughEqual(getOuterWidth($firstHeaderCell), 48 * $lastHeaderCell.get(0).getBoundingClientRect().width, 1.5, 'First row cell has correct width');
    assert.roughEqual(getOuterWidth($lastHeaderCell), $dateTableCell.get(0).getBoundingClientRect().width, 1.5, 'Last row cell has correct width');
});

QUnit.test('Scheduler timeline week cells should have right height if crossScrollingEnabled = true', function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 29),
        crossScrollingEnabled: true,
        groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' } ] }]
    });

    resizeCallbacks.fire();

    const $element = this.instance.$element();
    const $firstRowCell = $element.find('.dx-scheduler-date-table-cell').first();
    const $lastRowCell = $element.find('.dx-scheduler-date-table-cell').eq(336);

    assert.roughEqual(getOuterHeight($firstRowCell), getOuterHeight($lastRowCell), 1.5, 'Cells has correct height');
});

QUnit.skip('The part of long appointment should have right coordinates on current week (T342192) №3', function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 1, 23),
        firstDayOfWeek: 1,
        startDayHour: 1,
        endDayHour: 10,
        hoursInterval: 0.5
    });
    const coordinates = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 1, 4, 30), 0, false);
    const $expectedCell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(115);

    const expectedPositionLeft = $expectedCell.position().left;

    assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, 'left coordinate is OK');

});

QUnit.skip('Timeline should find cell coordinates by date depend on start/end day hour & hoursInterval', function(assert) {
    const $element = this.instance.$element();

    this.instance.option({
        currentDate: new Date(2015, 2, 1),
        firstDayOfWeek: 0,
        startDayHour: 5,
        endDayHour: 10,
        hoursInterval: 0.75
    });

    const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 2, 8, 0));

    assert.equal(coords.top, $element.find('.dx-scheduler-date-table-cell').eq(11).position().top, 'Cell coordinates are right');
    assert.equal(coords.left, $element.find('.dx-scheduler-date-table-cell').eq(11).position().left, 'Cell coordinates are right');
});

QUnit.module('Timeline Month', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth({
            currentDate: new Date(2015, 9, 16),
            showCurrentTimeIndicator: false,
            shadeUntilCurrentTime: false,
        }).dxSchedulerTimelineMonth('instance');
    }
});

QUnit.test('timeline should have correct group table width (T718364)', function(assert) {
    this.instance.option('crossScrollingEnabled', true);
    this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }, { id: 4, text: 'd' }] }]);

    assert.equal(this.instance.getGroupTableWidth(), 100, 'Group table width is OK');
});

QUnit.skip('Scheduler timeline month getPositionShift should return null shift', function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 21)
    });

    assert.deepEqual(this.instance.getPositionShift(), { top: 0, left: 0, cellPosition: 0 }, 'First view date is OK');
});

QUnit.test('Scrollables should be updated after currentDate changing', function(assert) {
    this.instance.option({
        currentDate: new Date(2017, 1, 15)
    });

    const scrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
    const updateSpy = sinon.spy(scrollable, 'update');

    try {
        this.instance.option('currentDate', new Date(2017, 2, 15));

        assert.ok(updateSpy.calledOnce, 'update was called');
    } finally {
        scrollable.update.restore();
    }
});

QUnit.test('getEndViewDate should return correct value', function(assert) {
    this.instance.option({
        firstDayOfWeek: 0,
        startDayHour: 9,
        endDayHour: 18,
        currentDate: new Date(2018, 3, 20)
    });

    assert.deepEqual(this.instance.getEndViewDate(), new Date(2018, 3, 30, 17, 59), 'End view date is OK');
});

QUnit.module('Timeline Keyboard Navigation', () => {
    ['standard', 'virtual'].forEach((scrollingMode) => {
        const moduleDescription = scrollingMode === 'virtual'
            ? 'Virtual Scrolling'
            : 'Standard Scrolling';

        QUnit.module(moduleDescription, {
            beforeEach: function() {
                this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth({
                    currentDate: new Date(2015, 9, 16),
                    focusStateEnabled: true,
                    onContentReady: function(e) {
                        const scrollable = e.component.getScrollable();
                        scrollable.option('scrollByContent', false);
                        e.component.initDragBehavior();
                        e.component._attachTablesEvents();
                    },
                    renovateRender: true,
                    scrolling: { mode: scrollingMode, orientation: 'vertical' },
                }).dxSchedulerTimelineMonth('instance');
            }
        }, () => {
            QUnit.test('Timeline should select/unselect cells with shift & arrows', function(assert) {
                this.instance.option({
                    focusStateEnabled: true,
                    width: 1000,
                    height: 800,
                    currentDate: new Date(2015, 3, 1),
                    groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }] }]
                });

                const $element = this.instance.$element();
                const $cells = this.instance.$element().find('.' + CELL_CLASS);
                const keyboard = keyboardMock($element);

                pointerMock($cells.eq(2)).start().click();
                keyboard.keyDown('down', { shiftKey: true });
                assert.equal($cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                assert.equal($cells.slice(1, 3).filter('.dx-state-focused').length, 1, 'right cells are focused');

                keyboard.keyDown('right', { shiftKey: true });
                assert.equal($cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                assert.equal($cells.slice(1, 4).filter('.dx-state-focused').length, 2, 'right cells are focused');

                keyboard.keyDown('left', { shiftKey: true });
                assert.equal($cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                assert.equal($cells.slice(1, 3).filter('.dx-state-focused').length, 1, 'right cells are focused');

                keyboard.keyDown('left', { shiftKey: true });
                assert.equal($cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                assert.equal($cells.slice(1, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');
            });

            QUnit.test('Timeline should select/unselect cells with mouse', function(assert) {
                this.instance.option({
                    width: 1000,
                    height: 800,
                    currentDate: new Date(2015, 3, 1),
                    groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]
                });

                const $element = this.instance.$element();
                const cells = $element.find('.' + CELL_CLASS);
                const $table = $element.find('.dx-scheduler-date-table');
                pointerMock(cells.eq(3)).start().click();

                let cell = cells.eq(15).get(0);

                $($table).trigger($.Event('dxpointerdown', { target: cells.eq(3).get(0), which: 1, pointerType: 'mouse' }));
                $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                assert.equal(cells.filter('.dx-state-focused').length, 13, 'the amount of focused cells is correct');
                assert.ok(cells.eq(3).hasClass('dx-state-focused'), 'the start cell is focused');
                assert.ok(cells.eq(15).hasClass('dx-state-focused'), 'the end cell is focused');

                cell = cells.eq(35).get(0);

                $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                assert.equal(cells.filter('.dx-state-focused').length, 13, 'the amount of focused cells has not changed');
                assert.ok(cells.eq(3).hasClass('dx-state-focused'), 'the start cell is still focused');
                assert.ok(cells.eq(15).hasClass('dx-state-focused'), 'the end cell is still focused');
                assert.notOk(cells.eq(35).hasClass('dx-state-focused'), 'cell from another group is not focused');

                $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
            });

            QUnit.module('Keyboard Multiselection with GroupByDate', () => {
                [
                    { startCell: 3, endCell: 1, focusedCellsCount: 2, rtlEnabled: false, key: 'left' },
                    { startCell: 1, endCell: 3, focusedCellsCount: 2, rtlEnabled: true, key: 'left' },
                    { startCell: 1, endCell: 3, focusedCellsCount: 2, rtlEnabled: false, key: 'right' },
                    { startCell: 3, endCell: 1, focusedCellsCount: 2, rtlEnabled: true, key: 'right' },
                ].forEach((config) => {
                    QUnit.test(`Multiselection with ${config.key} arrow should work correctly with groupByDate
                        in Timeleine when rtlEnabled is equal to ${config.rtlEnabled}`, function(assert) {
                        const {
                            startCell, endCell, focusedCellsCount, rtlEnabled, key,
                        } = config;

                        this.instance.option({
                            focusStateEnabled: true,
                            groupOrientation: 'horizontal',
                            groupByDate: true,
                            rtlEnabled,
                            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
                        });

                        const $element = this.instance.$element();
                        const keyboard = keyboardMock($element);
                        const cells = $element.find('.' + CELL_CLASS);

                        pointerMock(cells.eq(startCell)).start().click();
                        keyboard.keyDown(key, { shiftKey: true });

                        assert.equal(cells.filter('.dx-state-focused').length, focusedCellsCount, 'right quantity of focused cells');
                        assert.ok(cells.eq(startCell).hasClass('dx-state-focused'), 'this first focused cell is correct');
                        assert.ok(cells.eq(endCell).hasClass('dx-state-focused'), 'this last focused cell is correct');
                    });
                });
            });

            QUnit.module('Mouse Multiselection with Vertical Grouping and Grouping by Date', () => {
                [{
                    startCell: 3,
                    endCell: 7,
                    focusedCellsCount: 5,
                    cellFromAnotherGroup: 40,
                    groupOrientation: 'vertical',
                    groupByDate: false,
                    description: 'Mouse Multiselection should work correctly with timeline when it is grouped vertically'
                }, {
                    startCell: 3,
                    endCell: 7,
                    focusedCellsCount: 3,
                    cellFromAnotherGroup: 8,
                    groupOrientation: 'horizontal',
                    groupByDate: true,
                    description: 'Mouse Multiselection should work correctly with timeline when it is grouped by date',
                }].forEach(({
                    startCell, endCell, focusedCellsCount, cellFromAnotherGroup,
                    groupOrientation, groupByDate, description,
                }) => {
                    QUnit.test(description, function(assert) {
                        this.instance.option({
                            focusStateEnabled: true,
                            groupOrientation,
                            groupByDate,
                            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
                            allowMultipleCellSelection: true,
                            scrolling: { mode: scrollingMode, orientation: 'vertical' },
                            renovateRender: true,
                        });

                        const $element = this.instance.$element();

                        const cells = $element.find('.' + CELL_CLASS);
                        const $table = $element.find('.dx-scheduler-date-table');
                        pointerMock(cells.eq(startCell)).start().click();

                        let cell = cells.eq(endCell).get(0);

                        $($table).trigger($.Event('dxpointerdown', { target: cells.eq(startCell).get(0), which: 1, pointerType: 'mouse' }));
                        $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                        assert.equal(cells.filter('.dx-state-focused').length, focusedCellsCount, 'the amount of focused cells is correct');
                        assert.ok(cells.eq(startCell).hasClass('dx-state-focused'), 'the start cell is focused');
                        assert.ok(cells.eq(endCell).hasClass('dx-state-focused'), 'the end cell is focused');

                        cell = cells.eq(cellFromAnotherGroup).get(0);

                        $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                        assert.equal(cells.filter('.dx-state-focused').length, focusedCellsCount, 'the amount of focused cells has not changed');
                        assert.ok(cells.eq(startCell).hasClass('dx-state-focused'), 'the start cell is still focused');
                        assert.ok(cells.eq(endCell).hasClass('dx-state-focused'), 'the end cell is still focused');
                        assert.notOk(cells.eq(cellFromAnotherGroup).hasClass('dx-state-focused'), 'cell from another group is not focused');

                        $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
                    });
                });
            });
        });
    });
});

QUnit.module('Mouse Interaction', () => {
    [TIMELINE_DAY, TIMELINE_WEEK, TIMELINE_MONTH].forEach((workSpace) => {
        QUnit.test(`Cell hover should work correctly in ${workSpace.name}`, function(assert) {
            const $element = $('#scheduler-timeline')[workSpace.class]({});

            const cells = $element.find(`.${CELL_CLASS}`);

            $element.trigger($.Event('dxpointerenter', { target: cells.eq(2).get(0), which: 1 }));

            assert.ok(cells.eq(2).hasClass(HOVER_CLASS), 'onHover event works');
        });
    });
});

QUnit.module('TimelineWorkWeek with intervalCount', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWorkWeek({
            currentDate: new Date(2015, 9, 16),
        }).dxSchedulerTimelineWorkWeek('instance');
    }
});

QUnit.skip('\'getCoordinatesByDate\' should return right coordinates with view option intervalCount', function(assert) {
    this.instance.option({
        intervalCount: 2,
        currentDate: new Date(2017, 5, 25),
        startDayHour: 8,
        endDayHour: 20
    });

    const $element = this.instance.$element();

    const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2017, 6, 6, 12, 0), 0, false);
    const targetCellPosition = $element.find('.dx-scheduler-date-table tbody td').eq(200).position();

    assert.equal(coords.top, targetCellPosition.top, 'Cell coordinates are right');
    assert.equal(coords.left, targetCellPosition.left, 'Cell coordinates are right');
});

QUnit.skip('\'getCoordinatesByDateInGroup\' method should return only work week days (t853629)', function(assert) {
    this.instance.option({
        intervalCount: 2,
        currentDate: new Date(2018, 4, 21),
    });

    assert.ok(!this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 26))[0]);
    assert.ok(!this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 27))[0]);
    assert.ok(this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 23))[0]);
    assert.ok(this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 28))[0]);
});

QUnit.module('TimelineWeek with grouping by date', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek({
            currentDate: new Date(2018, 2, 1),
            groupByDate: true,
            startDayHour: 9,
            endDayHour: 12,
            groupOrientation: 'horizontal',
            showCurrentTimeIndicator: false,
        }).dxSchedulerTimelineWeek('instance');

        this.instance.option('groups', [{
            name: 'one',
            items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);
    }
});

QUnit.test('Get date range', function(assert) {
    assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 1, 25, 9, 0), new Date(2018, 2, 3, 11, 59)], 'Range is OK');

    this.instance.option('intervalCount', 3);

    assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 1, 25, 9, 0), new Date(2018, 2, 17, 11, 59)], 'Range is OK');
});

QUnit.test('Group header should be rendered correct, groupByDate = true', function(assert) {
    const $headerPanel = this.instance.$element().find('.dx-scheduler-header-scrollable .dx-scheduler-header-panel');
    const $groupRow = $headerPanel.find('.dx-scheduler-group-row');
    const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');
    const dateTableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').get(0).getBoundingClientRect().width;
    const groupHeaderWidth = $groupHeaderCells.get(0).getBoundingClientRect().width;

    assert.equal($groupHeaderCells.length, 84, 'Group header cells count is OK');
    assert.roughEqual(dateTableCellWidth, groupHeaderWidth, 1.1, 'Group header cell has correct size');
});

QUnit.test('Group header should be rendered correct, groupByDate = true and crossScrollingEnabled = true', function(assert) {
    this.instance.option('crossScrollingEnabled', true);

    resizeCallbacks.fire();

    const $headerPanel = this.instance.$element().find('.dx-scheduler-header-scrollable .dx-scheduler-header-panel');
    const $groupRow = $headerPanel.find('.dx-scheduler-group-row');
    const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');
    const $headerRow = $headerPanel.find('.dx-scheduler-header-row').eq(1);
    const $headerCells = $headerRow.find('.dx-scheduler-header-panel-cell');

    const dateTableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').get(0).getBoundingClientRect().width;
    const groupHeaderWidth = $groupHeaderCells.get(0).getBoundingClientRect().width;
    const headerCellWidth = $headerCells.get(0).getBoundingClientRect().width;

    assert.equal($groupHeaderCells.length, 84, 'Group header cells count is OK');
    assert.roughEqual(groupHeaderWidth, dateTableCellWidth, 1.1, 'Group header cell has correct size');
    assert.roughEqual(headerCellWidth, dateTableCellWidth * 2, 1.1, 'Header cell has correct size');
});

QUnit.test('Date table cells shoud have right cellData, groupByDate = true', function(assert) {
    this.instance.option('renovateRender', false);

    const $cells = this.instance.$element().find('.dx-scheduler-date-table-cell');

    assert.deepEqual($cells.eq(0).data('dxCellData'), {
        startDate: new Date(2018, 1, 25, 9, 0),
        endDate: new Date(2018, 1, 25, 9, 30),
        allDay: false,
        groups: {
            one: 1
        },
        groupIndex: 0,
    });

    assert.deepEqual($cells.eq(1).data('dxCellData'), {
        startDate: new Date(2018, 1, 25, 9, 0),
        endDate: new Date(2018, 1, 25, 9, 30),
        allDay: false,
        groups: {
            one: 2
        },
        groupIndex: 1,
    });

    assert.deepEqual($cells.eq(50).data('dxCellData'), {
        startDate: new Date(2018, 2, 1, 9, 30),
        endDate: new Date(2018, 2, 1, 10),
        allDay: false,
        groups: {
            one: 1
        },
        groupIndex: 0,
    });

    assert.deepEqual($cells.eq(51).data('dxCellData'), {
        startDate: new Date(2018, 2, 1, 9, 30),
        endDate: new Date(2018, 2, 1, 10),
        allDay: false,
        groups: {
            one: 2
        },
        groupIndex: 1,
    });

    assert.deepEqual($cells.eq(82).data('dxCellData'), {
        startDate: new Date(2018, 2, 3, 11, 30),
        endDate: new Date(2018, 2, 3, 12),
        allDay: false,
        groups: {
            one: 1
        },
        groupIndex: 0,
    });

    assert.deepEqual($cells.eq(83).data('dxCellData'), {
        startDate: new Date(2018, 2, 3, 11, 30),
        endDate: new Date(2018, 2, 3, 12),
        allDay: false,
        groups: {
            one: 2
        },
        groupIndex: 1,
    });
});

QUnit.test('Group table cells should have right cellData, groupByDate = true', function(assert) {
    const $groupRow = this.instance.$element().find('.dx-scheduler-group-row');
    const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');

    assert.equal($groupHeaderCells.eq(0).text(), 'a', 'Group header content height is OK');
    assert.equal($groupHeaderCells.eq(1).text(), 'b', 'Group header content height is OK');
    assert.equal($groupHeaderCells.eq(82).text(), 'a', 'Group header content height is OK');
    assert.equal($groupHeaderCells.eq(83).text(), 'b', 'Group header content height is OK');
});

[true, false].forEach((renovateRender) => {
    QUnit.skip(`Timeline should find cell coordinates by date, groupByDate = true when renovateRender is ${renovateRender}`, function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 4),
            renovateRender,
        });

        let coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 9, 0), 0, false);
        const $element = this.instance.$element();

        assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(36).position().top, 'Top cell coordinates are right');
        assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(36).position().left, 'Left cell coordinates are right');
        assert.equal(coords.hMax, 16800, 'hMax is right');

        coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 9, 0), 1, false);

        assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(49).position().top, 'Top cell coordinates are right');
        assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(49).position().left, 'Left cell coordinates are right');
        assert.equal(coords.hMax, 16800, 'hMax is right');
    });
});

QUnit.module('TimelineDay with grouping by date', {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
            currentDate: new Date(2018, 2, 1),
            groupByDate: true,
            startDayHour: 9,
            endDayHour: 12,
            groupOrientation: 'horizontal',
            showCurrentTimeIndicator: false,
            groups: [{
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }],
        }).dxSchedulerTimelineDay('instance');
    }
}, () => {
    QUnit.test('Get date range', function(assert) {
        assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 2, 1, 9), new Date(2018, 2, 1, 11, 59)], 'Range is OK');

        this.instance.option('intervalCount', 3);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 2, 1, 9), new Date(2018, 2, 3, 11, 59)], 'Range is OK');
    });

    QUnit.test('Group header should be rendered correct, groupByDate = true', function(assert) {
        const $headerPanel = this.instance.$element().find('.dx-scheduler-header-scrollable .dx-scheduler-header-panel');
        const $groupRow = $headerPanel.find('.dx-scheduler-group-row');
        const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');
        const dateTableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').get(0).getBoundingClientRect().width;
        const groupHeaderWidth = $groupHeaderCells.get(0).getBoundingClientRect().width;

        assert.equal($groupHeaderCells.length, 12, 'Group header cells count is OK');
        assert.roughEqual(dateTableCellWidth, groupHeaderWidth, 1.1, 'Group header cell has correct size');
    });

    QUnit.test('Group header should be rendered correct, groupByDate = true and crossScrollingEnabled = true', function(assert) {
        this.instance.option('crossScrollingEnabled', true);

        resizeCallbacks.fire();

        const $headerPanel = this.instance.$element().find('.dx-scheduler-header-scrollable .dx-scheduler-header-panel');
        const $groupRow = $headerPanel.find('.dx-scheduler-group-row');
        const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');
        const $headerRow = $headerPanel.find('.dx-scheduler-header-row').eq(0);
        const $headerCells = $headerRow.find('.dx-scheduler-header-panel-cell');

        const dateTableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').get(0).getBoundingClientRect().width;
        const groupHeaderWidth = $groupHeaderCells.get(0).getBoundingClientRect().width;
        const headerCellWidth = $headerCells.get(0).getBoundingClientRect().width;

        assert.equal($groupHeaderCells.length, 12, 'Group header cells count is OK');
        assert.roughEqual(groupHeaderWidth, dateTableCellWidth, 1.1, 'Group header cell has correct size');
        assert.roughEqual(headerCellWidth, dateTableCellWidth * 2, 1.1, 'Header cell has correct size');
    });
});

QUnit.module('Renovated Render', {
    before() {
        this.qUnitMaxDepth = QUnit.dump.maxDepth;
        QUnit.dump.maxDepth = 10;
    },
    beforeEach() {
        this.clock = sinon.useFakeTimers();
        this.createInstance = (options = {}, workSpace = 'dxSchedulerTimelineDay') => {
            this.instance = $('#scheduler-timeline')[workSpace]({
                renovateRender: true,
                currentDate: new Date(2020, 11, 21),
                startDayHour: 0,
                endDayHour: 1,
                ...options,
            })[workSpace]('instance');
        };
    },
    afterEach() {
        this.clock.restore();
    },
    after() {
        QUnit.dump.maxDepth = this.qUnitMaxDepth;
    }
}, () => {
    QUnit.module('Generate View Data', () => {
        const cellsBase = [{
            startDate: new Date(2020, 11, 21, 0, 0),
            endDate: new Date(2020, 11, 21, 0, 30),
            allDay: false,
            groupIndex: 0,
            index: 0,
            isFirstGroupCell: true,
            isLastGroupCell: true,
            key: 0,
        }, {
            startDate: new Date(2020, 11, 21, 0, 30),
            endDate: new Date(2020, 11, 21, 1, 0),
            groupIndex: 0,
            index: 1,
            allDay: false,
            isFirstGroupCell: true,
            isLastGroupCell: true,
            key: 1,
        }];

        QUnit.test('should work in basic case', function(assert) {
            this.createInstance();

            this.instance.viewDataProvider.update(this.instance.generateRenderOptions());

            const { viewData, viewDataMap } = this.instance.viewDataProvider;

            const expectedViewData = {
                groupedData: [{
                    dateTable: [{
                        cells: cellsBase,
                        key: 0,
                    }],
                    groupIndex: 0,
                    key: '0',
                    isGroupedAllDayPanel: false
                }],
                bottomVirtualRowHeight: undefined,
                isGroupedAllDayPanel: false,
                topVirtualRowHeight: undefined,
                leftVirtualCellWidth: undefined,
                rightVirtualCellWidth: undefined,
                bottomVirtualRowCount: 0,
                topVirtualRowCount: 0,
                leftVirtualCellCount: 0,
                rightVirtualCellCount: 0,
            };
            const expectedViewDataMap = {
                allDayPanelMap: [],
                dateTableMap: [
                    [{
                        cellData: cellsBase[0],
                        position: { columnIndex: 0, rowIndex: 0 }
                    }, {
                        cellData: cellsBase[1],
                        position: { columnIndex: 1, rowIndex: 0 }
                    }]
                ]
            };

            assert.deepEqual(viewData, expectedViewData, 'correct view data');
            assert.deepEqual(viewDataMap, expectedViewDataMap, 'correct view data map');
        });

        QUnit.test('should work with horizontal grouping', function(assert) {
            this.createInstance({
                groupOrientation: 'horizontal',
            });
            this.instance.option('groups', [
                {
                    name: 'res',
                    items: [
                        { id: 1, text: 'one' }, { id: 2, text: 'two' }
                    ]
                }
            ]);

            this.instance.viewDataProvider.update(this.instance.generateRenderOptions());

            const { viewData, viewDataMap } = this.instance.viewDataProvider;

            const expectedViewData = {
                groupedData: [{
                    dateTable: [{
                        cells: [{
                            ...cellsBase[0],
                            groups: { res: 1 },
                            isLastGroupCell: false,
                        }, {
                            ...cellsBase[1],
                            groups: { res: 1 },
                            isFirstGroupCell: false,
                        }, {
                            ...cellsBase[0],
                            groups: { res: 2 },
                            groupIndex: 1,
                            isLastGroupCell: false,
                            key: 2,
                        }, {
                            ...cellsBase[1],
                            groups: { res: 2 },
                            groupIndex: 1,
                            isFirstGroupCell: false,
                            key: 3,
                        }],
                        key: 0,
                    }],
                    groupIndex: 0,
                    key: '0',
                    isGroupedAllDayPanel: false,
                }],
                bottomVirtualRowHeight: undefined,
                isGroupedAllDayPanel: false,
                topVirtualRowHeight: undefined,
                leftVirtualCellWidth: undefined,
                rightVirtualCellWidth: undefined,
                bottomVirtualRowCount: 0,
                topVirtualRowCount: 0,
                leftVirtualCellCount: 0,
                rightVirtualCellCount: 0,
            };
            const expectedDateTable = expectedViewData.groupedData[0].dateTable[0].cells;

            const expectedViewDataMap = {
                allDayPanelMap: [],
                dateTableMap: [[{
                    cellData: expectedDateTable[0],
                    position: { columnIndex: 0, rowIndex: 0 }
                }, {
                    cellData: expectedDateTable[1],
                    position: { columnIndex: 1, rowIndex: 0 }
                }, {
                    cellData: expectedDateTable[2],
                    position: { columnIndex: 2, rowIndex: 0 }
                }, {
                    cellData: expectedDateTable[3],
                    position: { columnIndex: 3, rowIndex: 0 }
                }]]
            };

            assert.deepEqual(viewData, expectedViewData, 'correct view data');
            assert.deepEqual(viewDataMap, expectedViewDataMap, 'correct viewDataMap');
        });

        QUnit.test('should work with vertical grouping', function(assert) {
            this.createInstance();
            this.instance.option('groups', [
                {
                    name: 'res',
                    items: [
                        { id: 1, text: 'one' }, { id: 2, text: 'two' }
                    ]
                }
            ]);
            this.instance.option('groupOrientation', 'vertical');

            this.instance.viewDataProvider.update(this.instance.generateRenderOptions());

            const { viewData, viewDataMap } = this.instance.viewDataProvider;

            const expectedViewData = {
                groupedData: [{
                    dateTable: [{
                        cells: [{
                            ...cellsBase[0],
                            groups: { res: 1 },
                        }, {
                            ...cellsBase[1],
                            groups: { res: 1 },
                        }],
                        key: 0,
                    }],
                    groupIndex: 0,
                    key: '0',
                    isGroupedAllDayPanel: false,
                }, {
                    dateTable: [{
                        cells: [{
                            ...cellsBase[0],
                            groups: { res: 2 },
                            groupIndex: 1,
                            key: 2,
                        }, {
                            ...cellsBase[1],
                            groups: { res: 2 },
                            groupIndex: 1,
                            key: 3,
                        }],
                        key: 2,
                    }],
                    groupIndex: 1,
                    key: '1',
                    isGroupedAllDayPanel: false,
                }],
                bottomVirtualRowHeight: undefined,
                isGroupedAllDayPanel: false,
                topVirtualRowHeight: undefined,
                leftVirtualCellWidth: undefined,
                rightVirtualCellWidth: undefined,
                bottomVirtualRowCount: 0,
                topVirtualRowCount: 0,
                leftVirtualCellCount: 0,
                rightVirtualCellCount: 0,
            };

            const expectedViewDataMap = {
                allDayPanelMap: [],
                dateTableMap: [
                    [{
                        cellData: expectedViewData.groupedData[0].dateTable[0].cells[0],
                        position: { rowIndex: 0, columnIndex: 0 }
                    }, {
                        cellData: expectedViewData.groupedData[0].dateTable[0].cells[1],
                        position: { rowIndex: 0, columnIndex: 1 }
                    }], [{
                        cellData: expectedViewData.groupedData[1].dateTable[0].cells[0],
                        position: { rowIndex: 1, columnIndex: 0 }
                    }, {
                        cellData: expectedViewData.groupedData[1].dateTable[0].cells[1],
                        position: { rowIndex: 1, columnIndex: 1 }
                    }]
                ]
            };

            assert.deepEqual(viewData, expectedViewData, 'correct viewData');
            assert.deepEqual(viewDataMap, expectedViewDataMap, 'correct viewDataMap');
        });

        QUnit.test('should work correctly with timelineWeek', function(assert) {
            this.createInstance({}, TIMELINE_WEEK.class);

            this.instance.viewDataProvider.update(this.instance.generateRenderOptions());

            const { viewData } = this.instance.viewDataProvider;

            const firstCell = {
                ...cellsBase[0],
                startDate: new Date(2020, 11, 20, 0, 0),
                endDate: new Date(2020, 11, 20, 0, 30),
            };
            const lastCell = {
                ...cellsBase[0],
                startDate: new Date(2020, 11, 26, 0, 30),
                endDate: new Date(2020, 11, 26, 1, 0),
                key: 13,
                index: 13,
            };

            const dateTable = viewData.groupedData[0].dateTable[0].cells;

            assert.equal(dateTable.length, 14, 'Correct number of cells');
            assert.deepEqual(dateTable[0], firstCell, 'Correct first cell');
            assert.deepEqual(dateTable[13], lastCell, 'Correct last cell');
        });

        QUnit.test('should work correctly with timelineMonth', function(assert) {
            this.createInstance({}, TIMELINE_MONTH.class);

            this.instance.viewDataProvider.update(this.instance.generateRenderOptions());

            const { viewData } = this.instance.viewDataProvider;

            const firstCell = {
                ...cellsBase[0],
                startDate: new Date(2020, 11, 1, 0, 0),
                endDate: new Date(2020, 11, 1, 1, 0),
            };
            const lastCell = {
                ...cellsBase[0],
                startDate: new Date(2020, 11, 31, 0, 0),
                endDate: new Date(2020, 11, 31, 1, 0),
                key: 30,
                index: 30,
            };

            const dateTable = viewData.groupedData[0].dateTable[0].cells;

            assert.equal(dateTable.length, 31, 'Correct number of cells');
            assert.deepEqual(dateTable[0], firstCell, 'Correct first cell');
            assert.deepEqual(dateTable[30], lastCell, 'Correct last cell');
        });
    });

    [TIMELINE_DAY, TIMELINE_WEEK, TIMELINE_MONTH].forEach(({ class: viewClass, name }) => {
        QUnit.test(`rtlEnabled should be aplied correctly in ${name}`, function(assert) {
            this.createInstance({}, viewClass);

            this.instance.option('rtlEnabled', true);
            const $element = this.instance.$element();
            const cells = $element.find(`.${CELL_CLASS}`);

            assert.ok(cells.length > 0, 'Cells have been rendered');
        });
    });
});
