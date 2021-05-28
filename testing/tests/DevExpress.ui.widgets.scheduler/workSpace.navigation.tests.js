import config from 'core/config';
import { noop } from 'core/utils/common';
import { isRenderer } from 'core/utils/type';
import 'generic_light.css!';
import $ from 'jquery';

import { stubInvokeMethod } from '../../helpers/scheduler/workspaceTestHelper.js';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_month';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_work_week';
import { createInstances } from 'ui/scheduler/instanceFactory';

import keyboardMock from '../../helpers/keyboardMock.js';
import memoryLeaksHelper from '../../helpers/memoryLeaksHelper.js';
import pointerMock from '../../helpers/pointerMock.js';

const CELL_CLASS = 'dx-scheduler-date-table-cell';
const ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell';

const HOVER_CLASS = 'dx-state-hover';

const WORKSPACE_DAY = { class: 'dxSchedulerWorkSpaceDay', name: 'SchedulerWorkSpaceDay' };
const WORKSPACE_WEEK = { class: 'dxSchedulerWorkSpaceWeek', name: 'SchedulerWorkSpaceWeek' };
const WORKSPACE_MONTH = { class: 'dxSchedulerWorkSpaceMonth', name: 'SchedulerWorkSpaceMonth' };

QUnit.dump.maxDepth = 10;

const {
    test,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('Workspace navigation', () => {
    module('Keyboard', () => {
        ['standard', 'virtual'].forEach((scrollingMode) => {
            module(`${scrollingMode} scrolling`, {
                beforeEach: function() {
                    this.createInstance = (options, workSpaceName) => {
                        createInstances({
                            scheduler: {
                                isVirtualScrolling: () => false
                            }
                        });

                        return $('#scheduler-work-space')[workSpaceName]({
                            currentDate: new Date(2021, 0, 10),
                            scrolling: { mode: scrollingMode, orientation: 'vertical' },
                            renovateRender: scrollingMode === 'virtual',
                            ...options,
                        });
                    };
                },
            }, () => {
                test('Month workspace navigation by arrows', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    $element.dxSchedulerWorkSpaceMonth('instance');

                    $($element).trigger('focusin');
                    const cells = $element.find('.' + CELL_CLASS);
                    assert.equal(cells.find('dx-state-focused').length, 0, 'cells is not focused');

                    keyboard.keyDown('down');
                    assert.ok(cells.eq(7).hasClass('dx-state-focused'), 'new cell is focused');
                    assert.equal(cells.eq(7).attr('aria-label'), 'Add appointment', 'focused cell label is right');

                    keyboard.keyDown('up');
                    assert.ok(!cells.eq(7).hasClass('dx-state-focused'), 'previous cell is not focused');
                    assert.equal(cells.eq(7).attr('aria-label'), undefined, 'previous cell  label is not exist');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'new cell is focused');
                    assert.equal(cells.eq(0).attr('aria-label'), 'Add appointment', 'focused cell label is right');

                    keyboard.keyDown('right');
                    assert.ok(!cells.eq(0).hasClass('dx-state-focused'), 'previous cell is not focused');
                    assert.ok(cells.eq(1).hasClass('dx-state-focused'), 'new cell is focused');

                    keyboard.keyDown('left');
                    assert.ok(!cells.eq(1).hasClass('dx-state-focused'), 'previous cell is not focused');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'new cell is focused');
                });


                test('Month workspace navigation by arrows, RTL mode', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        rtlEnabled: true
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    $element.dxSchedulerWorkSpaceMonth('instance');

                    $($element).trigger('focusin');
                    const cells = $element.find('.' + CELL_CLASS);

                    keyboard.keyDown('left');
                    assert.ok(!cells.eq(0).hasClass('dx-state-focused'), 'previous cell is not focused');
                    assert.ok(cells.eq(1).hasClass('dx-state-focused'), 'new cell is focused');

                    keyboard.keyDown('right');
                    assert.ok(!cells.eq(1).hasClass('dx-state-focused'), 'previous cell is not focused');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'new cell is focused');
                });

                test('Workspace should not lose focused cell after arrow key press', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    $element.dxSchedulerWorkSpaceMonth('instance');

                    const cells = $element.find('.' + CELL_CLASS);
                    $($element).trigger('focusin');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'cell is focused');

                    keyboard.keyDown('up');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'cell is still focused');
                });


                test('Workspace should scroll to focused cell during navigation', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true
                    }, 'dxSchedulerWorkSpaceWeek');
                    const keyboard = keyboardMock($element);

                    $element.dxSchedulerWorkSpaceWeek('instance');

                    const scrollable = $element.find('.dx-scrollable').dxScrollable('instance');
                    const scrollToElement = sinon.spy(scrollable, 'scrollToElement');

                    const cells = $element.find('.' + CELL_CLASS);

                    $($element).trigger('focusin');
                    keyboard.keyDown('down');
                    assert.ok(scrollToElement.getCall(0).args[0].is(cells.eq(7)), 'scrollToElement is called with right args');

                    keyboard.keyDown('up');
                    assert.ok(scrollToElement.getCall(1).args[0].is(cells.eq(0)), 'scrollToElement is called with right args');

                    scrollable.scrollToElement.restore();
                });

                test('Workspace should handle enter/space key', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');
                    const updateSpy = sinon.spy(noop);

                    instance.invoke = updateSpy;

                    $($element.find('.' + CELL_CLASS).eq(0)).trigger('focusin');

                    keyboard.keyDown('enter');
                    assert.notOk(updateSpy.called, 'enter is not handled');

                    $($element).trigger('focusin');
                    keyboard.keyDown('enter');
                    assert.equal(updateSpy.getCall(0).args[0], 'showAddAppointmentPopup', 'Correct method of observer is called');

                    assert.deepEqual(updateSpy.getCall(0).args[1], {
                        startDate: new Date(2015, 2, 30),
                        endDate: new Date(2015, 2, 31)
                    }, 'Arguments are OK');

                    keyboard.keyDown('right');
                    keyboard.keyDown('space');
                    assert.equal(updateSpy.getCall(1).args[0], 'showAddAppointmentPopup', 'Correct method of observer is called');
                    assert.deepEqual(updateSpy.getCall(1).args[1], {
                        startDate: new Date(2015, 2, 31),
                        endDate: new Date(2015, 3, 1)
                    }, 'Arguments are OK');
                });

                test('Workspace should pass cellData with select through enter/space key', function(assert) {
                    const updateSpy = sinon.spy(noop);
                    const $element = this.createInstance({
                        dataSource: [{
                            text: 'Helen',
                            startDate: new Date(2015, 3, 2, 9, 30),
                            endDate: new Date(2015, 3, 2, 11, 30)
                        }],
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        onCellClick: updateSpy,
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    $($element).trigger('focusin');
                    keyboard.keyDown('enter');
                    const cellData = updateSpy.getCall(0).args[0].cellData;
                    assert.notOk($.isEmptyObject(cellData), 'cellData is not empty');
                    assert.deepEqual(cellData.startDate, new Date(2015, 2, 30), 'cellData startDate is passing right');
                    assert.deepEqual(cellData.endDate, new Date(2015, 2, 31), 'cellData endDate is passing right');
                });

                test('Workspace should handle enter/space key correctly if e.cancel=true', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        editing: true,
                        onCellClick: function(e) {
                            e.cancel = true;
                        },
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');
                    const updateSpy = sinon.spy(noop);

                    instance.notifyObserver = updateSpy;

                    $($element.find('.' + CELL_CLASS).eq(0)).trigger('focusin');
                    keyboard.keyDown('enter');
                    $($element).trigger('focusin');
                    keyboard.keyDown('enter');

                    assert.notOk(updateSpy.called, 'Observer method was not called if e.cancel = true');
                });

                test('Workspace should allow select several cells with shift & arrow', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    $($element).trigger('focusin');
                    keyboard.keyDown('right', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 2).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 9, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 9).filter('.dx-state-focused').length, 9, 'right cells are focused');

                    keyboard.keyDown('right');
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.ok(cells.eq(9).hasClass('dx-state-focused'), 'right cell is focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 10).filter('.dx-state-focused').length, 8, 'right cells are focused');

                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 9, 'right quantity of focused cells');
                    assert.equal(cells.slice(1, 10).filter('.dx-state-focused').length, 9, ' right cells are focused');
                });

                test('Event subscriptions should be detached on dispose', function(assert) {
                    const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();

                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(3)).start().click();
                    keyboard.keyDown('left', { shiftKey: true });
                    keyboard.keyDown('right', { shiftKey: true });

                    $element.dxSchedulerWorkSpaceMonth('instance').dispose();

                    assert.deepEqual(memoryLeaksHelper.getAllEventSubscriptions(), originalEventSubscriptions, 'Subscribes after dispose are OK');
                });

                test('Workspace should allow select/unselect cells with shift & right/left arrow', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(10)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(9, 12).filter('.dx-state-focused').length, 2, 'right cells are focused');
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(9, 11).filter('.dx-state-focused').length, 1, 'right cells are focused');

                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(8, 11).filter('.dx-state-focused').length, 2, 'right cells are focused');
                    keyboard.keyDown('left', { shiftKey: true });
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 4, 'right quantity of focused cells');
                    assert.equal(cells.slice(7, 11).filter('.dx-state-focused').length, 4, 'right cells are focused');
                    keyboard.keyDown('left', { shiftKey: true });
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 6, 'right quantity of focused cells');
                    assert.equal(cells.slice(4, 11).filter('.dx-state-focused').length, 6, 'right cells are focused');
                });

                test('Workspace should allow select/unselect cells with shift & left/right arrow', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(3)).start().click();
                    keyboard.keyDown('left', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 4).filter('.dx-state-focused').length, 2, 'right cells are focused');
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 4).filter('.dx-state-focused').length, 1, 'right cells are focused');

                    keyboard.keyDown('right', { shiftKey: true });
                    keyboard.keyDown('right', { shiftKey: true });
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 4, 'right quantity of focused cells');
                    keyboard.keyDown('right', { shiftKey: true });
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 6, 'right quantity of focused cells');
                });

                test('Workspace should allow unselect cells with shift & up/down arrow', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(7)).start().click();
                    keyboard.keyDown('down', { shiftKey: true });
                    keyboard.keyDown('down', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 15, 'right quantity of focused cells');
                    assert.equal(cells.slice(7, 23).filter('.dx-state-focused').length, 15, 'right cells are focused');
                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.equal(cells.slice(7, 16).filter('.dx-state-focused').length, 8, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(7, 9).filter('.dx-state-focused').length, 1, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 8).filter('.dx-state-focused').length, 8, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 8).filter('.dx-state-focused').length, 8, 'right cells are focused');

                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(7, 9).filter('.dx-state-focused').length, 1, 'right cells are focused');
                });

                test('Focus shouldn\'t disappear when select cells with shift & down/right arrow', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(28)).start().click();
                    keyboard.keyDown('down', { shiftKey: true });
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.equal(cells.slice(28, 42).filter('.dx-state-focused').length, 8, 'right cells are focused');

                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.equal(cells.slice(28, 42).filter('.dx-state-focused').length, 8, 'right cells are focused');

                    pointerMock(cells.eq(40)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(40, 42).filter('.dx-state-focused').length, 2, 'right cells are focused');
                });

                test('Workspace Week should allow select/unselect cells with shift & arrows', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        startDayHour: 0,
                        endDayHour: 2,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceWeek');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(15)).start().click();

                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(15, 23).filter('.dx-state-focused').length, 2, 'right cells are focused');
                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(15, 23).filter('.dx-state-focused').length, 1, 'right cells are focused');
                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(8, 16).filter('.dx-state-focused').length, 2, 'right cells are focused');
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 6, 'right quantity of focused cells');
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 4, 'right quantity of focused cells');
                });


                test('Workspace Week should allow select/unselect cells with shift & arrows, RTL mode', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        rtlEnabled: true,
                        firstDayOfWeek: 1,
                        startDayHour: 0,
                        endDayHour: 2,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceWeek');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(14)).start().click();
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 5, 'right quantity of focused cells');
                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 4, 'right quantity of focused cells');
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 5, 'right quantity of focused cells');
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 6, 'right quantity of focused cells');
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                });

                test('Workspace should handle enter/space key for several selected cells', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');
                    const updateSpy = sinon.spy(noop);

                    instance.invoke = updateSpy;

                    $($element.find('.' + CELL_CLASS).eq(0)).trigger('focusin');

                    $($element).trigger('focusin');
                    keyboard.keyDown('down', { shiftKey: true });
                    keyboard.keyDown('enter');
                    assert.equal(updateSpy.getCall(0).args[0], 'showAddAppointmentPopup', 'Correct method of observer is called');

                    assert.deepEqual(updateSpy.getCall(0).args[1], {
                        startDate: new Date(2015, 2, 30),
                        endDate: new Date(2015, 3, 7)
                    }, 'Arguments are OK');

                    keyboard.keyDown('right', { shiftKey: true });
                    keyboard.keyDown('space');
                    assert.equal(updateSpy.getCall(1).args[0], 'showAddAppointmentPopup', 'Correct method of observer is called');
                    assert.deepEqual(updateSpy.getCall(1).args[1], {
                        startDate: new Date(2015, 2, 30),
                        endDate: new Date(2015, 3, 8)
                    }, 'Arguments are OK');
                });

                test('Workspace shouldn\'t unselect selected cells with no shift & arrows', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400
                    }, 'dxSchedulerWorkSpaceMonth');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    $($element).trigger('focusin');
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');

                    keyboard.keyDown('left');
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                });

                test('Workspace with groups should allow select cells within one group', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400
                    }, 'dxSchedulerWorkSpaceMonth');
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');
                    const keyboard = keyboardMock($element);

                    stubInvokeMethod(instance),
                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(6)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.filter('.dx-state-focused').last().index(), 0, 'right quantity of focused cells');
                    $($element).trigger('focusout');

                    pointerMock(cells.eq(13)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.filter('.dx-state-focused').last().index(), 7, 'right quantity of focused cells');
                    $($element).trigger('focusout');

                    pointerMock(cells.eq(7)).start().click();
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.filter('.dx-state-focused').last().index(), 7, 'right quantity of focused cells');
                });

                test('Workspace with groups should allow select cells within one group, RTL mode', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        rtlEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400
                    }, 'dxSchedulerWorkSpaceMonth');
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');
                    const keyboard = keyboardMock($element);

                    stubInvokeMethod(instance),
                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(7)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.filter('.dx-state-focused').last().index(), 7, 'right quantity of focused cells');
                    $($element).trigger('focusout');

                    pointerMock(cells.eq(14)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.filter('.dx-state-focused').first().index(), 6, 'right quantity of focused cells');
                    $($element).trigger('focusout');

                    pointerMock(cells.eq(6)).start().click();
                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.filter('.dx-state-focused').last().index(), 0, 'right quantity of focused cells');
                });

                test('Workspace should select/unselect cells in allDay panel with shift & arrows', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        showAllDayPanel: true,
                        firstDayOfWeek: 1,
                        startDayHour: 3,
                        endDayHour: 10,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceWeek');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + ALL_DAY_TABLE_CELL_CLASS);

                    pointerMock(cells.eq(2)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 4).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 3).filter('.dx-state-focused').length, 1, 'right cells are focused');

                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(1, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(1, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(1, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');
                });


                test('Workspace Day should allow select/unselect cells with shift & arrows', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        startDayHour: 3,
                        endDayHour: 10,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceDay');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(2)).start().click();
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 4).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 4).filter('.dx-state-focused').length, 1, 'right cells are focused');
                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(1, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');
                });

                test('Workspace Day with groups should allow select/unselect', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        startDayHour: 3,
                        endDayHour: 10,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1)
                    }, 'dxSchedulerWorkSpaceDay');
                    const instance = $element.dxSchedulerWorkSpaceDay('instance');
                    const keyboard = keyboardMock($element);

                    stubInvokeMethod(instance),
                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(2)).start().click();
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 5).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                    assert.equal(cells.slice(2, 4).filter('.dx-state-focused').length, 1, 'right cells are focused');

                    keyboard.keyDown('up', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('right', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');

                    keyboard.keyDown('left', { shiftKey: true });
                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.equal(cells.slice(0, 3).filter('.dx-state-focused').length, 2, 'right cells are focused');
                });

                test('Current focused cell should have \'dx-scheduler-focused-cell\' css class', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400
                    }, 'dxSchedulerWorkSpaceMonth');

                    const keyboard = keyboardMock($element);
                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(2)).start().click();
                    assert.ok(cells.eq(2).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                    pointerMock(cells.eq(0)).start().click();
                    assert.ok(cells.eq(0).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                    assert.notOk(cells.eq(2).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                    keyboard.keyDown('right', { shiftKey: true });
                    assert.ok(cells.eq(1).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                    assert.notOk(cells.eq(0).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                    keyboard.keyDown('down', { shiftKey: true });
                    assert.ok(cells.eq(8).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                    assert.notOk(cells.eq(1).hasClass('dx-scheduler-focused-cell'), 'right quantity of focused cells');
                });

                test('Focus should work right after focusout', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400
                    }, 'dxSchedulerWorkSpaceMonth');

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(10)).start().click();
                    assert.ok(cells.eq(10).hasClass('dx-scheduler-focused-cell'), 'right focused cell');
                    $($element).trigger('focusout');
                    $($element).trigger('focusin');
                    assert.ok(cells.eq(10).hasClass('dx-scheduler-focused-cell'), 'right focused cell');
                });

                test('It should not be possible to select cells via keyboard if the allowMultipleCellSelection option is false', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400,
                        allowMultipleCellSelection: false
                    }, 'dxSchedulerWorkSpaceMonth');

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(2)).start().click();
                    keyboardMock($element).keyDown('down', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                });

                test('It should not be possible to select cells via mouse if the allowMultipleCellSelection option is false', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400,
                        allowMultipleCellSelection: false
                    }, 'dxSchedulerWorkSpaceMonth');

                    const cells = $element.find('.' + CELL_CLASS);
                    const cell = cells.eq(23).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(2)).start().click();
                    $($table).trigger($.Event('dxpointermove', { target: cell, toElement: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 1, 'right quantity of focused cells');
                });

                test('It should not be possible to select cells via mouse if scrollable \'scrollByContent\' is true', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        currentDate: new Date(2015, 3, 1),
                        height: 400,
                        allowMultipleCellSelection: true,
                        onContentReady: function(e) {
                            const scrollable = e.component._dateTableScrollable;
                            scrollable.option('scrollByContent', true);
                        },
                    }, 'dxSchedulerWorkSpaceMonth');
                    const workspace = $element.dxSchedulerWorkSpaceMonth('instance');

                    const stub = sinon.stub(workspace, 'notifyObserver');

                    const cells = $element.find('.' + CELL_CLASS);
                    const cell = cells.eq(23).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(2)).start().click();
                    $($table).trigger($.Event('dxpointermove', { target: cell, toElement: cell, which: 1 }));

                    assert.notOk(stub.calledOnce, 'Cells weren\'t selected');
                });

                test('Multiselection with left arrow should work in workspace day', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        intervalCount: 3,
                        startDayHour: 0,
                        endDayHour: 2,
                    }, 'dxSchedulerWorkSpaceDay');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(5)).start().click();
                    keyboard.keyDown('left', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 5, 'right quantity of focused cells');
                    assert.ok(cells.eq(4).hasClass('dx-state-focused'), 'the first focused cell is correct');
                    assert.ok(cells.eq(10).hasClass('dx-state-focused'), 'the bottommost cell is focused');
                    assert.ok(cells.eq(5).hasClass('dx-state-focused'), 'the last focused cell is correct');
                });

                test('Multiselection with right arrow should work in workspace day', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        intervalCount: 3,
                        startDayHour: 0,
                        endDayHour: 2,
                    }, 'dxSchedulerWorkSpaceDay');
                    const keyboard = keyboardMock($element);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(3)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });

                    assert.equal(cells.filter('.dx-state-focused').length, 5, 'right quantity of focused cells');
                    assert.ok(cells.eq(3).hasClass('dx-state-focused'), 'this first focused cell is correct');
                    assert.ok(cells.eq(9).hasClass('dx-state-focused'), 'the bottommost cell is focused');
                    assert.ok(cells.eq(4).hasClass('dx-state-focused'), 'this last focused cell is correct');
                });

                module('Keyboard Multiselection with GroupByDate', () => {
                    [{
                        startCell: 3, endCell: 1, intermediateCells: [13],
                        focusedCellsCount: 5, rtlEnabled: false, key: 'left', workSpace: WORKSPACE_DAY,
                    }, {
                        startCell: 7, endCell: 5, intermediateCells: [89],
                        focusedCellsCount: 5, rtlEnabled: false, key: 'left', workSpace: WORKSPACE_WEEK,
                    }, {
                        startCell: 18, endCell: 16, intermediateCells: [],
                        focusedCellsCount: 2, rtlEnabled: false, key: 'left', workSpace: WORKSPACE_MONTH,
                    }, {
                        startCell: 1, endCell: 3, intermediateCells: [13],
                        focusedCellsCount: 5, rtlEnabled: true, key: 'left', workSpace: WORKSPACE_DAY,
                    }, {
                        startCell: 5, endCell: 7, intermediateCells: [89],
                        focusedCellsCount: 5, rtlEnabled: true, key: 'left', workSpace: WORKSPACE_WEEK,
                    }, {
                        startCell: 16, endCell: 18, intermediateCells: [],
                        focusedCellsCount: 2, rtlEnabled: true, key: 'left', workSpace: WORKSPACE_MONTH,
                    }, {
                        startCell: 1, endCell: 3, intermediateCells: [13],
                        focusedCellsCount: 5, rtlEnabled: false, key: 'right', workSpace: WORKSPACE_DAY,
                    }, {
                        startCell: 5, endCell: 7, intermediateCells: [89],
                        focusedCellsCount: 5, rtlEnabled: false, key: 'right', workSpace: WORKSPACE_WEEK,
                    }, {
                        startCell: 16, endCell: 18, intermediateCells: [],
                        focusedCellsCount: 2, rtlEnabled: false, key: 'right', workSpace: WORKSPACE_MONTH,
                    }, {
                        startCell: 3, endCell: 1, intermediateCells: [13],
                        focusedCellsCount: 5, rtlEnabled: true, key: 'right', workSpace: WORKSPACE_DAY,
                    }, {
                        startCell: 7, endCell: 5, intermediateCells: [89],
                        focusedCellsCount: 5, rtlEnabled: true, key: 'right', workSpace: WORKSPACE_WEEK,
                    }, {
                        startCell: 18, endCell: 16, intermediateCells: [],
                        focusedCellsCount: 2, rtlEnabled: true, key: 'right', workSpace: WORKSPACE_MONTH,
                    }].forEach(({
                        startCell, endCell, intermediateCells, focusedCellsCount,
                        rtlEnabled, key, workSpace,
                    }) => {
                        test(`Multiselection with ${key} arrow should work correctly with groupByDate
                            in ${workSpace.name} when rtlEnabled is equal to ${rtlEnabled}`, function(assert) {
                            const $element = this.createInstance({
                                focusStateEnabled: true,
                                intervalCount: 2,
                                groupOrientation: 'horizontal',
                                groupByDate: true,
                                startDayHour: 0,
                                endDayHour: 2,
                                rtlEnabled,
                            }, workSpace.class);

                            const instance = $element[workSpace.class]('instance');
                            stubInvokeMethod(instance);
                            instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                            const keyboard = keyboardMock($element);
                            const cells = $element.find('.' + CELL_CLASS);

                            pointerMock(cells.eq(startCell)).start().click();
                            keyboard.keyDown(key, { shiftKey: true });

                            assert.equal(cells.filter('.dx-state-focused').length, focusedCellsCount, 'right quantity of focused cells');
                            assert.ok(cells.eq(startCell).hasClass('dx-state-focused'), 'this first focused cell is correct');
                            assert.ok(cells.eq(endCell).hasClass('dx-state-focused'), 'this last focused cell is correct');
                            intermediateCells.forEach((cell) => {
                                assert.ok(cells.eq(cell).hasClass('dx-state-focused'), 'intermediate cell is focused');
                            });
                        });
                    });

                    [
                        { startCell: 4, endCell: 4, focusedCellsCount: 1, rtlEnabled: false, key: 'left', workSpace: WORKSPACE_DAY },
                        { startCell: 28, endCell: 28, focusedCellsCount: 1, rtlEnabled: false, key: 'left', workSpace: WORKSPACE_WEEK },
                        { startCell: 28, endCell: 26, focusedCellsCount: 2, rtlEnabled: false, key: 'left', workSpace: WORKSPACE_MONTH },
                        { startCell: 7, endCell: 7, focusedCellsCount: 1, rtlEnabled: true, key: 'left', workSpace: WORKSPACE_DAY },
                        { startCell: 55, endCell: 55, focusedCellsCount: 1, rtlEnabled: true, key: 'left', workSpace: WORKSPACE_WEEK },
                        { startCell: 55, endCell: 57, focusedCellsCount: 2, rtlEnabled: true, key: 'left', workSpace: WORKSPACE_MONTH },
                        { startCell: 3, endCell: 3, focusedCellsCount: 1, rtlEnabled: false, key: 'right', workSpace: WORKSPACE_DAY },
                        { startCell: 26, endCell: 26, focusedCellsCount: 1, rtlEnabled: false, key: 'right', workSpace: WORKSPACE_WEEK },
                        { startCell: 27, endCell: 29, focusedCellsCount: 2, rtlEnabled: false, key: 'right', workSpace: WORKSPACE_MONTH },
                        { startCell: 4, endCell: 4, focusedCellsCount: 1, rtlEnabled: true, key: 'right', workSpace: WORKSPACE_DAY },
                        { startCell: 29, endCell: 29, focusedCellsCount: 1, rtlEnabled: true, key: 'right', workSpace: WORKSPACE_WEEK },
                        { startCell: 28, endCell: 26, focusedCellsCount: 2, rtlEnabled: true, key: 'right', workSpace: WORKSPACE_MONTH },
                    ].forEach(({
                        startCell, endCell, focusedCellsCount, rtlEnabled, key, workSpace,
                    }) => {
                        test(`Multiselection with ${key} arrow should work correctly with groupByDate
                            in ${workSpace.name} when the next cell is in another row and rtlEnabled is ${rtlEnabled}`, function(assert) {
                            const $element = this.createInstance({
                                focusStateEnabled: true,
                                intervalCount: 2,
                                groupOrientation: 'horizontal',
                                groupByDate: true,
                                startDayHour: 0,
                                endDayHour: 2,
                                rtlEnabled,
                            }, workSpace.class);

                            const instance = $element[workSpace.class]('instance');
                            stubInvokeMethod(instance);
                            instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

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
            });
        });

    });

    module('Mouse', () => {
        ['standard', 'virtual'].forEach((scrollingMode) => {
            module(`${scrollingMode} scrolling`, {
                beforeEach: function() {
                    this.createInstance = (options, workSpaceName) => {
                        return $('#scheduler-work-space')[workSpaceName]({
                            scrolling: { mode: scrollingMode, orientation: 'vertical' },
                            renovateRender: scrollingMode === 'virtual',
                            currentDate: new Date(2021, 0, 10),
                            ...options,
                        });
                    };
                },
            }, () => {
                test('Pointer move propagation should be stopped', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        startDayHour: 3,
                        endDayHour: 7,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1),
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        }
                    }, 'dxSchedulerWorkSpaceWeek');

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(15)).start().click();

                    $element.on('dxpointermove', 'td', function(e) {
                        assert.ok(e.isDefaultPrevented(), 'default is prevented');
                        assert.ok(e.isPropagationStopped(), 'propagation is stopped');
                    });

                    $element.trigger($.Event('dxpointerdown', { target: cells.eq(15).get(0), which: 1, pointerType: 'mouse' }));
                    $element.trigger($.Event('dxpointermove', { target: cells.eq(16).get(0), which: 1 }));
                });

                test('Workspace should add/remove specific class while mouse selection', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        startDayHour: 3,
                        endDayHour: 7,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1),
                        onContentReady: function(e) {
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        }
                    }, 'dxSchedulerWorkSpaceWeek');

                    const cells = $element.find('.' + CELL_CLASS);
                    const cell = cells.eq(23).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(15).get(0), which: 1, pointerType: 'mouse' }));

                    assert.ok($element.hasClass('dx-scheduler-work-space-mouse-selection'), 'right first focused cell');

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));
                    $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));

                    assert.notOk($element.hasClass('dx-scheduler-work-space-mouse-selection'), 'right first focused cell');
                });

                test('Workspace Week should allow select/unselect cells with mouse', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        startDayHour: 3,
                        endDayHour: 7,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1),
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        },
                    }, 'dxSchedulerWorkSpaceWeek');

                    const cells = $element.find('.' + CELL_CLASS);
                    let cell = cells.eq(23).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(15)).start().click();

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(15).get(0), which: 1, pointerType: 'mouse' }));

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 10, 'right quantity of focused cells');
                    assert.ok(cells.eq(15).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(23).hasClass('dx-state-focused'), 'right last focused cell');

                    cell = cells.eq(22).get(0);

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 2, 'right quantity of focused cells');
                    assert.ok(cells.eq(15).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(22).hasClass('dx-state-focused'), 'right last focused cell');

                    cell = cells.eq(21).get(0);

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 8, 'right quantity of focused cells');
                    assert.ok(cells.eq(21).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(15).hasClass('dx-state-focused'), 'right last focused cell');

                    $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
                });

                test('Multiple selected cells should have focused class in vertical grouped Workspace Week', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        currentDate: new Date(2018, 4, 21),
                        groupOrientation: 'vertical',
                        endDayHour: 2,
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        }
                    }, 'dxSchedulerWorkSpaceWeek');
                    const instance = $element.dxSchedulerWorkSpaceWeek('instance');

                    stubInvokeMethod(instance);

                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);
                    let cell = cells.eq(14).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(0)).start().click();

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(0).get(0), which: 1, pointerType: 'mouse' }));

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 3, 'right quantity of focused cells');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(14).hasClass('dx-state-focused'), 'right last focused cell');

                    $($element).trigger('focusout');
                    cell = cells.eq(42).get(0);

                    pointerMock(cells.eq(28)).start().click();

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(28).get(0), which: 1, pointerType: 'mouse' }));

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 3, 'right quantity of focused cells');
                    assert.ok(cells.eq(28).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(42).hasClass('dx-state-focused'), 'right last focused cell');
                });

                test('Workspace with groups should allow select cells within one group via mouse', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        firstDayOfWeek: 1,
                        startDayHour: 3,
                        endDayHour: 7,
                        hoursInterval: 0.5,
                        currentDate: new Date(2015, 3, 1),
                        height: 400,
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        },
                    }, 'dxSchedulerWorkSpaceMonth');
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');

                    stubInvokeMethod(instance),
                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(15)).start().click();

                    let cell = cells.eq(20).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(15).get(0), which: 1, pointerType: 'mouse' }));

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    const $focusedCells = cells.filter('.dx-state-focused');
                    assert.equal($focusedCells.length, 6, 'right quantity of focused cells');

                    cell = cells.eq(22).get(0);

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 6, 'right quantity of focused cells');

                    $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
                });

                test('Workspace should handle pointerdown by only left mouse key', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true
                    }, 'dxSchedulerWorkSpaceMonth');

                    $element.dxSchedulerWorkSpaceMonth('instance');

                    const cells = $element.find('.' + CELL_CLASS);

                    cells.eq(0).trigger($.Event('dxpointerdown', { which: 1, pointerType: 'mouse' }));
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'cell is focused');

                    cells.eq(1).trigger($.Event('dxpointerdown', { which: 2, pointerType: 'mouse' }));
                    assert.notOk(cells.eq(1).hasClass('dx-state-focused'), 'focused cell is not changed');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'focused cell is not changed');
                });

                test('Workspace should prevent default for all mouse keys except left', function(assert) {
                    assert.expect(2);

                    const $element = this.createInstance({
                        focusStateEnabled: true
                    }, 'dxSchedulerWorkSpaceMonth');

                    $element.dxSchedulerWorkSpaceMonth('instance');
                    try {
                        const cells = $element.find('.' + CELL_CLASS);
                        $($element).on('dxpointerdown.WorkspaceTests', function(e) {
                            if(e.which > 1) {
                                assert.ok(e.isDefaultPrevented(), 'default prevented');
                            } else {
                                assert.notOk(e.isDefaultPrevented(), 'default is not prevented');
                            }
                        });

                        cells.eq(0).trigger($.Event('dxpointerdown', { which: 1, pointerType: 'mouse' }));
                        cells.eq(1).trigger($.Event('dxpointerdown', { which: 2, pointerType: 'mouse' }));
                    } finally {
                        $($element).off('dxpointerdown.WorkspaceTests');
                    }
                });

                test('onCellClick should fires when cell is clicked', function(assert) {
                    assert.expect(3);

                    const $element = this.createInstance({
                        currentDate: new Date(2015, 9, 1),
                        focusStateEnabled: true,
                        onCellClick: function(e) {
                            assert.equal(isRenderer(e.cellElement), !!config().useJQuery, 'cell is clicked');
                            assert.deepEqual($(e.cellElement)[0], $cell[0], 'cell is clicked');
                            assert.deepEqual(
                                e.cellData,
                                { startDate: new Date(2015, 8, 27), endDate: new Date(2015, 8, 28), groupIndex: 0 },
                                'correct cell data',
                            );
                        }
                    }, 'dxSchedulerWorkSpaceMonth');

                    const $cell = $element.find('.' + CELL_CLASS).eq(0);
                    $($cell).trigger('dxclick');
                });

                test('onCellClick should fires when defines after option change', function(assert) {
                    assert.expect(1);

                    const $element = this.createInstance({
                        focusStateEnabled: true
                    }, 'dxSchedulerWorkSpaceMonth');
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');

                    instance.option('onCellClick', function() {
                        assert.ok(true, 'click is handled after option change');
                    });
                    const $cell = $element.find('.' + CELL_CLASS).eq(0);
                    $($cell).trigger('dxclick');
                });

                test('Popup should be shown when onCellClick', function(assert) {
                    assert.expect(1);


                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        onCellClick: function(e) {
                            e.cancel = true;
                        }
                    }, 'dxSchedulerWorkSpaceMonth');
                    const instance = $element.dxSchedulerWorkSpaceMonth('instance');

                    const stub = sinon.stub(instance, 'notifyObserver').withArgs('showAddAppointmentPopup');

                    const $cell = $element.find('.' + CELL_CLASS).eq(1);

                    pointerMock($cell).start().click().click();

                    assert.notOk(stub.called, 'showAddAppointmentPopup doesn\'t shown');
                });

                test('onCellContextMenu should be fired after trigger context menu event', function(assert) {
                    assert.expect(4);

                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        currentDate: new Date(2018, 2, 1),
                        onCellContextMenu: function(e) {
                            assert.ok(true, 'event is handled');
                            assert.equal(isRenderer(e.cellElement), !!config().useJQuery, 'cell is correct');
                            assert.deepEqual($(e.cellElement)[0], $cell[0], 'cell is correct');
                            assert.deepEqual(
                                e.cellData,
                                { startDate: new Date(2018, 1, 26), endDate: new Date(2018, 1, 27), groupIndex: 0, },
                                'cell is correct',
                            );
                        }
                    }, 'dxSchedulerWorkSpaceMonth');

                    const $cell = $element.find('.' + CELL_CLASS).eq(1);
                    $($cell).trigger('dxcontextmenu');
                });

                test('Cells should be focused after onCellContextMenu event firing', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        currentDate: new Date(2018, 2, 1),
                        startDayHour: 0,
                        endDayHour: 2,
                    }, 'dxSchedulerWorkSpaceWeek');
                    const keyboard = keyboardMock($element);
                    const cells = $element.find('.' + CELL_CLASS);

                    pointerMock(cells.eq(7)).start().click();
                    keyboard.keyDown('right', { shiftKey: true });
                    $(cells.eq(8)).trigger('dxcontextmenu');
                    $($element).trigger('focusout');

                    assert.equal(cells.filter('.dx-state-focused').length, 5, 'right cells are focused');
                });

                test('Workspace Day should corrrectly select cells inside one horizontal group', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        currentDate: new Date(2015, 3, 1),
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        },
                        intervalCount: 3,
                        groupOrientation: 'horizontal',
                        startDayHour: 0,
                        endDayHour: 4,
                    }, 'dxSchedulerWorkSpaceDay');

                    const instance = $element.dxSchedulerWorkSpaceDay('instance');

                    stubInvokeMethod(instance);
                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);
                    let cell = cells.eq(13).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(0)).start().click();

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(0).get(0), which: 1, pointerType: 'mouse' }));
                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 11, 'right quantity of focused cells');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(42).hasClass('dx-state-focused'), 'cell in the lower left angle is focused');
                    assert.ok(cells.eq(13).hasClass('dx-state-focused'), 'right last focused cell');

                    cell = cells.eq(12).get(0);

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 3, 'cells in other days have not been focused');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(12).hasClass('dx-state-focused'), 'right last focused cell');

                    $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
                });

                test('Workspace Day should not select cells that belong to another group', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        currentDate: new Date(2015, 3, 1),
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component.initDragBehavior();
                            e.component._attachTablesEvents();
                        },
                        intervalCount: 3,
                        groupOrientation: 'horizontal',
                    }, 'dxSchedulerWorkSpaceDay');

                    const instance = $element.dxSchedulerWorkSpaceDay('instance');

                    stubInvokeMethod(instance);
                    instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                    const cells = $element.find('.' + CELL_CLASS);
                    let cell = cells.eq(12).get(0);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(0)).start().click();

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(0).get(0), which: 1, pointerType: 'mouse' }));
                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 3, 'cells in other days have not been focused');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'right first focused cell');
                    assert.ok(cells.eq(12).hasClass('dx-state-focused'), 'right last focused cell');

                    cell = cells.eq(5).get(0);

                    $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                    assert.equal(
                        cells.filter('.dx-state-focused').length, 3,
                        'new cells have not been focused because the mouse pointer is in another group',
                    );
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'the first focused cell did not change');
                    assert.ok(cells.eq(12).hasClass('dx-state-focused'), 'the last focused did not change');

                    $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
                });

                module('Mouse Multiselection with Vertical Grouping', () => {
                    [{
                        startCell: 2,
                        endCell: 1,
                        intermediateCells: [6],
                        focusedCellsCount: 4,
                        cellFromAnotherGroup: 10,
                        workSpace: WORKSPACE_DAY,
                        intervalCount: 2,
                    }, {
                        startCell: 14,
                        endCell: 16,
                        intermediateCells: [42, 43],
                        focusedCellsCount: 9,
                        cellFromAnotherGroup: 64,
                        workSpace: WORKSPACE_WEEK,
                        intervalCount: 2,
                    }, {
                        startCell: 15,
                        endCell: 34,
                        intermediateCells: [27],
                        focusedCellsCount: 20,
                        cellFromAnotherGroup: 44,
                        workSpace: WORKSPACE_MONTH,
                        intervalCount: 1,
                    }].forEach(({
                        startCell, endCell, intermediateCells, intervalCount,
                        focusedCellsCount, cellFromAnotherGroup, workSpace,
                    }) => {
                        test(`Mouse Multiselection should work correctly with ${workSpace.name} when it is grouped vertically`, function(assert) {
                            const $element = this.createInstance({
                                focusStateEnabled: true,
                                onContentReady: function(e) {
                                    const scrollable = e.component.getScrollable();
                                    scrollable.option('scrollByContent', false);
                                    e.component.initDragBehavior();
                                    e.component._attachTablesEvents();
                                },
                                intervalCount,
                                groupOrientation: 'vertical',
                                startDayHour: 0,
                                endDayHour: 2,
                                height: 500,
                            }, workSpace.class);

                            const instance = $element[workSpace.class]('instance');

                            stubInvokeMethod(instance);
                            instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

                            const cells = $element.find('.' + CELL_CLASS);
                            const $table = $element.find('.dx-scheduler-date-table');

                            pointerMock(cells.eq(startCell)).start().click();
                            let cell = cells.eq(endCell).get(0);

                            $($table).trigger($.Event('dxpointerdown', { target: cells.eq(startCell).get(0), which: 1, pointerType: 'mouse' }));
                            $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                            assert.equal(cells.filter('.dx-state-focused').length, focusedCellsCount, 'the amount of focused cells is correct');
                            assert.ok(cells.eq(startCell).hasClass('dx-state-focused'), 'the start cell is focused');
                            assert.ok(cells.eq(endCell).hasClass('dx-state-focused'), 'the end cell is focused');
                            intermediateCells.forEach((cell) => {
                                assert.ok(cells.eq(cell).hasClass('dx-state-focused'), 'intermediate cell is focused');
                            });

                            cell = cells.eq(cellFromAnotherGroup).get(0);
                            $($table).trigger($.Event('dxpointermove', { target: cell, which: 1 }));

                            assert.equal(cells.filter('.dx-state-focused').length, focusedCellsCount, 'the amount of focused cells has not changed');
                            assert.ok(cells.eq(startCell).hasClass('dx-state-focused'), 'the start cell is still focused');
                            assert.ok(cells.eq(endCell).hasClass('dx-state-focused'), 'the end cell is still focused');
                            intermediateCells.forEach((cell) => {
                                assert.ok(cells.eq(cell).hasClass('dx-state-focused'), 'intermediate cell is still focused');
                            });
                            assert.notOk(cells.eq(cellFromAnotherGroup).hasClass('dx-state-focused'), 'cell from another group is not focused');

                            $($table).trigger($.Event('dxpointerup', { target: cell, which: 1 }));
                        });
                    });
                });


                test('Mouse Multiselection should work correctly when appointments'
                    + 'are grouped vertically by more than one resource and allDayPanel is enabled', function(assert) {
                    const $element = this.createInstance({
                        focusStateEnabled: true,
                        onContentReady: function(e) {
                            const scrollable = e.component.getScrollable();
                            scrollable.option('scrollByContent', false);
                            e.component._attachTablesEvents();
                        },
                        groupOrientation: 'vertical',
                        startDayHour: 0,
                        endDayHour: 2,
                        showAllDayPanel: true,
                    }, 'dxSchedulerWorkSpaceWeek');

                    const instance = $element.dxSchedulerWorkSpaceWeek('instance');

                    stubInvokeMethod(instance);
                    instance.option('groups', [
                        { name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] },
                        { name: 'b', items: [{ id: 10, text: 'b.1' }, { id: 20, text: 'b.2' }] },
                    ]);

                    const cells = $element.find('.' + CELL_CLASS);
                    const $table = $element.find('.dx-scheduler-date-table');

                    pointerMock(cells.eq(0)).start().click();

                    $($table).trigger($.Event('dxpointerdown', { target: cells.eq(0).get(0), which: 1, pointerType: 'mouse' }));
                    $($table).trigger($.Event('dxpointermove', { target: cells.eq(1).get(0), which: 1 }));

                    assert.equal(cells.filter('.dx-state-focused').length, 5, 'the amount of focused cells is correct');
                    assert.ok(cells.eq(0).hasClass('dx-state-focused'), 'the start cell is focused');
                    assert.ok(cells.eq(1).hasClass('dx-state-focused'), 'the end cell is focused');
                    assert.ok(cells.eq(21).hasClass('dx-state-focused'), 'the last cell of the first column in the first group is focused');
                    assert.notOk(cells.eq(28).hasClass('dx-state-focused'), 'a cell in the next group is not focused');
                });

                [WORKSPACE_DAY, WORKSPACE_WEEK, WORKSPACE_MONTH].forEach((workSpace) => {
                    test(`Cell hover should work correctly in ${workSpace.name}`, function(assert) {
                        const $element = this.createInstance({}, workSpace.class);

                        const cells = $element.find(`.${CELL_CLASS}`);

                        $element.trigger($.Event('dxpointerenter', { target: cells.eq(2).get(0), which: 1 }));

                        assert.ok(cells.eq(2).hasClass(HOVER_CLASS), 'onHover event works');
                    });
                });

                [WORKSPACE_DAY, WORKSPACE_WEEK].forEach((workSpace) => {
                    test(`Cell hover should work correctly in ${workSpace.name} in all-day panel cells`, function(assert) {
                        const $element = this.createInstance({}, workSpace.class);

                        const cells = $element.find(`.${ALL_DAY_TABLE_CELL_CLASS}`);

                        $element.trigger($.Event('dxpointerenter', { target: cells.eq(0).get(0), which: 1 }));

                        assert.ok(cells.eq(0).hasClass(HOVER_CLASS), 'onHover event works in all-day panel cells');
                    });
                });
            });
        });
    });
});
