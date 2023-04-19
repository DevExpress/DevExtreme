/* global DATA, data2, internals, initTree, makeSlowDataSource */

import $ from 'jquery';
import { noop } from 'core/utils/common';
import fx from 'animation/fx';
import devices from 'core/devices';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { isRenderer } from 'core/utils/type';
import { isDesktopDevice } from '../../../helpers/fileManagerHelpers.js';
import config from 'core/config';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test('node is focused after focusing on element', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $firstNode = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    const instance = $treeView.dxTreeView('instance');

    $treeView.focusin();

    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($firstNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');
}),


QUnit.test('down arrow move focus to the next element', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(1);
    const $firstNode = $treeView.find('.' + internals.NODE_CLASS).eq(1);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(2);

    const instance = $treeView.dxTreeView('instance');

    $firstItem.trigger('dxpointerdown');

    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($firstNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');

    keyboard.keyDown('down');

    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'next item was focused after \'down\' was pressed');
}),

QUnit.test('down arrow move focus to the next element for virtual mode & slow DS', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        virtualModeEnabled: true,
        dataSource: makeSlowDataSource($.extend(true, [], data2)),
        dataStructure: 'plain'
    });

    this.clock.tick(300);

    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(1);
    const $firstNode = $treeView.find('.' + internals.NODE_CLASS).eq(1);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(2);

    $firstItem.trigger('dxpointerdown');

    assert.ok($firstNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');

    keyboard.keyDown('down');

    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'next item was focused after \'down\' was pressed');
}),

QUnit.test('focus should change from selectAll item to first item on down key pressed', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' } ]
    });

    $treeView.focusin();
    keyboardMock($treeView).keyDown('down');

    const $firstItem = $(`.${internals.NODE_CLASS}`).eq(0);
    assert.ok($firstItem.hasClass(FOCUSED_STATE_CLASS));
}),

QUnit.test('focus should change from first item to selectAll item on up key pressed', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' } ]
    });

    $treeView.focusin();
    const $firstItem = $(`.${internals.NODE_CLASS}`).eq(0);
    $firstItem.trigger('dxpointerdown');
    keyboardMock($treeView).keyDown('up');

    const $selectAllItem = $(`.${internals.SELECT_ALL_ITEM_CLASS}`);
    assert.ok($selectAllItem.hasClass(FOCUSED_STATE_CLASS));
}),

QUnit.test('focus should change from selectAll item to last item on up key pressed', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' }, { id: '2' } ]
    });

    $treeView.focusin();
    keyboardMock($treeView).keyDown('up');

    const $lastNode = $(`.${internals.NODE_CLASS}`).eq(1);
    assert.ok($lastNode.hasClass(FOCUSED_STATE_CLASS));
}),

QUnit.test('focus should change from last item to selectAll item on down key pressed', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' }, { id: '2' } ]
    });

    $treeView.focusin();
    const $lastNode = $(`.${internals.NODE_CLASS}`).eq(1);
    $lastNode.trigger('dxpointerdown');
    keyboardMock($treeView).keyDown('down');

    const $selectAllItem = $(`.${internals.SELECT_ALL_ITEM_CLASS}`);
    assert.ok($selectAllItem.hasClass(FOCUSED_STATE_CLASS));
}),

QUnit.test('selectAll item should be checked when navigating up from first item with shift key', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' } ]
    });

    $treeView.focusin();
    const $firstNode = $(`.${internals.NODE_CLASS}`).eq(0);
    $firstNode.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'ArrowUp', shiftKey: true }));

    const $selectAllItem = $(`.${internals.SELECT_ALL_ITEM_CLASS}`);
    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), true);
}),

QUnit.test('first checkbox item should be checked when navigating down with shift key from selectAll item', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' } ]
    });

    $treeView.focusin();
    $treeView.trigger($.Event('keydown', { key: 'ArrowDown', shiftKey: true }));

    const $firstNode = $(`.${internals.NODE_CLASS}`).eq(0);
    assert.strictEqual($firstNode.find('.dx-checkbox').dxCheckBox('instance').option('value'), true);
}),

QUnit.test('focus should be changed from item to selectAll when navigating with home key', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' }, { id: '2' } ]
    });

    $treeView.focusin();
    const $lastNode = $(`.${internals.NODE_CLASS}`).eq(1);
    $lastNode.trigger('dxpointerdown');
    keyboardMock($treeView).keyDown('Home');

    const $selectAllItem = $(`.${internals.SELECT_ALL_ITEM_CLASS}`);
    assert.ok($selectAllItem.hasClass(FOCUSED_STATE_CLASS));
}),

QUnit.test('focus should be changed from selectAll item to last item when navigating with end key', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' }, { id: '2' } ]
    });

    $treeView.focusin();
    keyboardMock($treeView).keyDown('End');

    const $lastNode = $(`.${internals.NODE_CLASS}`).eq(1);
    assert.ok($lastNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');
}),

QUnit.test('all items should be checked when navigating from selectAll item with shift+end', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' }, { id: '2' } ]
    });

    $treeView.focusin();
    const $selectAllItem = $(`.${internals.SELECT_ALL_ITEM_CLASS}`);
    $selectAllItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'End', shiftKey: true }));

    const $firstNode = $(`.${internals.NODE_CLASS}`).eq(0);
    const $lastNode = $(`.${internals.NODE_CLASS}`).eq(1);
    assert.strictEqual($firstNode.find('.dx-checkbox').dxCheckBox('instance').option('value'), true);
    assert.strictEqual($lastNode.find('.dx-checkbox').dxCheckBox('instance').option('value'), true);
}),

QUnit.test('selectAll item should not be checked when navigating with shift+home', function(assert) {
    if(!isDesktopDevice()) {
        assert.ok(true, 'only on desktops');
        return;
    }

    const $treeView = initTree({
        showCheckBoxesMode: 'selectAll',
        items: [ { id: '1' }, { id: '2' } ]
    });

    $treeView.focusin();
    const $firstNode = $(`.${internals.NODE_CLASS}`).eq(0);
    $firstNode.trigger('dxpointerdown');

    $treeView.trigger($.Event('keydown', { key: 'Home', shiftKey: true }));

    const $selectAllItem = $(`.${internals.SELECT_ALL_ITEM_CLASS}`);
    assert.strictEqual($selectAllItem.dxCheckBox('instance').option('value'), false);
}),

QUnit.test('\'home\' key pressing move focus to the first element', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(2);
    const $firstNode = $treeView.find('.' + internals.NODE_CLASS).eq(2);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    const instance = $treeView.dxTreeView('instance');

    $firstItem.trigger('dxpointerdown');

    assert.ok($firstNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');

    keyboard.keyDown('home');

    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'first item was focused after \'home\' was pressed');
}),

QUnit.test('\'shift+home\' key pressing extends selection up to the top-most node', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(2);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(1);
    const $topNode = $treeView.find('.' + internals.NODE_CLASS).eq(0);
    const $topNodeCheckBox = $topNode.find('.dx-checkbox').eq(0);
    const $secondNodeCheckBox = $secondNode.find('.dx-checkbox').eq(0);

    $firstItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'Home', shiftKey: true }));

    assert.strictEqual($topNodeCheckBox.dxCheckBox('instance').option('value'), true, 'top node was selected');
    assert.strictEqual($secondNodeCheckBox.dxCheckBox('instance').option('value'), true, 'node was selected');
}),

QUnit.test('\'shift+home\' key pressing without checkBoxes', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(2);

    $firstItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'Home', shiftKey: true }));

    assert.equal($treeView.dxTreeView('instance').option('selectedIndex'), -1);
}),

QUnit.test('\'end\' key pressing move focus to the last element', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $firstNode = $treeView.find('.' + internals.NODE_CLASS).eq(0);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(2);

    const instance = $treeView.dxTreeView('instance');

    $firstItem.trigger('dxpointerdown');

    assert.ok($firstNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');

    keyboard.keyDown('end');

    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'last item was focused after \'end\' was pressed');
}),

QUnit.test('\'shift+end\' key pressing extends selection up to the last node', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(1);
    const $lastNode = $treeView.find('.' + internals.NODE_CLASS).eq(2);
    const $lastNodeCheckBox = $lastNode.find('.dx-checkbox').eq(0);
    const $secondNodeCheckBox = $secondNode.find('.dx-checkbox').eq(0);

    $firstItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'End', shiftKey: true }));

    assert.strictEqual($lastNodeCheckBox.dxCheckBox('instance').option('value'), true, 'last node was selected');
    assert.strictEqual($secondNodeCheckBox.dxCheckBox('instance').option('value'), true, 'node was selected');
}),

QUnit.test('\'shift+end\' key pressing without checkBoxes', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $firstItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'End', shiftKey: true }));

    assert.equal($treeView.dxTreeView('instance').option('selectedIndex'), -1);
}),

QUnit.test('up arrow move focus to the previous element', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(1);
    const $firstNode = $treeView.find('.' + internals.NODE_CLASS).eq(1);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    $firstItem.trigger('dxpointerdown');

    assert.ok($firstNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused ');

    keyboard.keyDown('up');

    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'previous item was focused after \'up\' was pressed');
}),

QUnit.test('down arrow move focus on item with the same level', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].items[1].expanded = true;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: data
    });
    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(4);


    $treeView.find('.dx-treeview-toggle-item-visibility-opened').trigger('dxclick');

    $firstItem.trigger('dxpointerdown');
    keyboard.keyDown('down');
    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'next item with the same level was focused after \'down\' was pressed');
}),

QUnit.test('\'shiftDown\' key test', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $checkBox = $treeView.find('.' + internals.NODE_CLASS).eq(1).find('.dx-checkbox').eq(0);

    $item.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'ArrowDown', shiftKey: true }));

    assert.equal($checkBox.dxCheckBox('instance').option('value'), true);
}),

QUnit.test('\'shiftDown\' key test without checkBoxes', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $item.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'ArrowDown', shiftKey: true }));

    assert.equal($treeView.dxTreeView('instance').option('selectedIndex'), -1);
}),

QUnit.test('up arrow move focus on item with same level', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].items[1].expanded = true;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: data
    });
    const keyboard = keyboardMock($treeView);
    const $firstItem = $treeView.find('.' + internals.ITEM_CLASS).eq(4);
    const $secondNode = $treeView.find('.' + internals.NODE_CLASS).eq(0);

    $treeView.find('.dx-treeview-toggle-item-visibility-opened').trigger('dxclick');

    $firstItem.trigger('dxpointerdown');
    keyboard.keyDown('up');

    assert.ok($secondNode.hasClass(FOCUSED_STATE_CLASS), 'previous item was focused after \'up\' was pressed');
}),

QUnit.test('\'shiftUp\' key test', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(1);
    const $checkBox = $treeView.find('.' + internals.NODE_CLASS).eq(0).find('.dx-checkbox').eq(0);

    $item.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'ArrowUp', shiftKey: true }));

    assert.equal($checkBox.dxCheckBox('instance').option('value'), true);
}),

QUnit.test('\'shiftUp\' key test without checkBoxes', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(1);

    $item.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: 'ArrowUp', shiftKey: true }));

    assert.equal($treeView.dxTreeView('instance').option('selectedIndex'), -1);
}),

QUnit.test('left/right arrow collapse/expand node-container', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].expanded = false;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: data
    });
    const keyboard = keyboardMock($treeView);
    const $parentItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $iconItem = $parentItem.parent().find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    const instance = $treeView.dxTreeView('instance');

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');
    keyboard.keyDown('right');
    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($treeView.find('.' + internals.NODE_CLASS).eq(1).is(':visible'), 'child item not hidden');
    assert.ok($iconItem.hasClass('dx-treeview-toggle-item-visibility-opened'), 'icon item indicate opened state');

    keyboard.keyDown('left');
    assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.ok($treeView.find('.' + internals.NODE_CLASS).eq(1).is(':hidden'), 'child item is hidden');
    assert.ok(!$iconItem.hasClass('dx-treeview-toggle-item-visibility-opened'), 'icon item indicate closed state');
}),

QUnit.test('item-icon indicate closed state after retry to collapse node', function(assert) {
    const data = $.extend(true, [], DATA[1]);

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: data
    });
    const keyboard = keyboardMock($treeView);
    const $parentItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $iconItem = $parentItem.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');

    keyboard.keyDown('left');
    assert.ok(!$iconItem.hasClass('dx-treeview-toggle-item-visibility-opened'), 'icon item indicate closed state');
}),

QUnit.test('left arrow focus parent node-container', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].expanded = true;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: data
    });
    const keyboard = keyboardMock($treeView);
    const $parentNode = $treeView.find('.dx-treeview-node').eq(0);
    const $parentItem = $treeView.find('.dx-treeview-item').eq(0);
    const $childItem = $treeView.find('.dx-treeview-item').eq(2);
    const $iconItem = $parentNode.find('.' + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');
    keyboard.keyDown('right');

    assert.ok($childItem.is(':visible'), 'child item not hidden');
    assert.ok($iconItem.hasClass('dx-treeview-toggle-item-visibility-opened'), 'icon item indicate opened state');

    $childItem.trigger('dxpointerdown');
    keyboard.keyDown('left');
    assert.ok($parentNode.hasClass(FOCUSED_STATE_CLASS), 'parent item take focus');
}),

QUnit.test('right arrow focus child node, if parent\'s container is expanded', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].expanded = false;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: data
    });
    const keyboard = keyboardMock($treeView);
    const $parentItem = $treeView.find('.dx-treeview-item').eq(0);

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');
    keyboard.keyDown('right');
    keyboard.keyDown('right');

    const $childNode = $treeView.find('.dx-treeview-node').eq(1);

    assert.ok($childNode.hasClass(FOCUSED_STATE_CLASS), 'child item take focus');
}),

QUnit.test('\'asterisk\' key test', function(assert) {
    const data = [
        {
            key: 1, text: 'Item 1', items: [
                {
                    key: 12, text: 'Nested item 1', items: [
                        { key: 121, text: 'Nested item 121' },
                        { key: 122, text: 'Nested item 122' }
                    ]
                },
                {
                    key: 13, text: 'Nested item 2', items: [
                        { key: 131, text: 'Nested item 131' },
                        { key: 132, text: 'Nested item 132' }
                    ]
                }
            ]
        },
        { key: 2, text: 'Item 2' }
    ];

    let expandFired = 0;

    const $treeView = initTree({
        focusStateEnabled: true,
        expandAllEnabled: true,
        height: 500,
        items: data,
        keyExpr: 'key',
        onItemExpanded: function() {
            expandFired++;
        }
    });
    const $parentItem = $treeView.find('.dx-treeview-item').eq(0);

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: '*' }));

    const $childNode = $treeView.find('.dx-treeview-node').eq(5);

    assert.ok($childNode.is(':visible'), 'deep leaf is visible');
    assert.equal(expandFired, 3, 'onItemExpanded was fired desired number of times');

    const $parentNode = $treeView.find('.dx-treeview-node').eq(0);
    assert.ok($parentNode.hasClass(FOCUSED_STATE_CLASS));
}),

QUnit.test('\'minus\' key test', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].expanded = true;
    data[0].items[1].items[0].expanded = true;

    let collapseFired = 0;

    const $treeView = initTree({
        focusStateEnabled: true,
        expandAllEnabled: true,
        height: 500,
        items: data,
        keyExpr: 'key',
        onItemCollapsed: function() {
            collapseFired++;
        }
    });
    const $parentItem = $treeView.find('.dx-treeview-item').eq(0);

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');
    $treeView.trigger($.Event('keydown', { key: '-' }));

    assert.strictEqual(collapseFired, 2, 'onItemCollapsed was fired desired number of times');
}),

QUnit.test('right arrow should update \'expanded\' field of item and node', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: $.extend(true, [], DATA[1])
    });
    const treeView = $treeView.dxTreeView('instance');
    const keyboard = keyboardMock($treeView);
    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $rootItem.trigger('dxpointerdown');

    keyboard.keyDown('right');

    const items = treeView.option('items');
    const nodes = treeView.getNodes();

    assert.ok(items[0].expanded);
    assert.ok(nodes[0].expanded);
});

QUnit.test('left arrow should update \'expanded\' field of item and node', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].expanded = true;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: data
    });
    const treeView = $treeView.dxTreeView('instance');
    const keyboard = keyboardMock($treeView);
    const $rootItem = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $rootItem.trigger('dxpointerdown');

    keyboard.keyDown('left');

    const items = treeView.option('items');
    const nodes = treeView.getNodes();

    assert.ok(!items[0].expanded);
    assert.ok(!nodes[0].expanded);
});

QUnit.test('right arrow should raise \'onItemExpanded\' event', function(assert) {
    const data = $.extend(true, [], DATA[1]);
    data[0].expanded = false;

    const handler = sinon.spy(noop);
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: data,
        onItemExpanded: handler
    });
    const keyboard = keyboardMock($treeView);

    $treeView.find('.' + internals.ITEM_CLASS).eq(0).trigger('dxpointerdown');
    keyboard.keyDown('right');
    const args = handler.getCall(0).args[0];

    assert.ok(handler.calledOnce);
    assert.ok(args.itemData.expanded);
    assert.ok(args.node.expanded);
    assert.equal(args.itemData.text, 'Item 1');
    assert.equal(args.node.text, 'Item 1');
});

QUnit.test('left arrow should raise \'onItemCollapsed\' event', function(assert) {
    const handler = sinon.spy(noop);
    const data = $.extend(true, [], DATA[1]);

    data[0].expanded = true;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: data,
        onItemCollapsed: handler
    });
    const keyboard = keyboardMock($treeView);

    $treeView.find('.' + internals.ITEM_CLASS).eq(0).trigger('dxpointerdown');
    keyboard.keyDown('left');
    const args = handler.getCall(0).args[0];

    assert.ok(handler.calledOnce);
    assert.ok(!args.itemData.expanded);
    assert.ok(!args.node.expanded);
    assert.equal(args.itemData.text, 'Item 1');
    assert.equal(args.node.text, 'Item 1');
});

QUnit.test('focus remains on parent node if it\'s root after left arrow pressing', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        items: $.extend(true, [], DATA[1])
    });
    const keyboard = keyboardMock($treeView);
    const $parentNode = $treeView.find('.dx-treeview-node').eq(0);
    const $parentItem = $treeView.find('.dx-treeview-item').eq(0);

    $treeView.focusin();
    $parentItem.trigger('dxpointerdown');
    keyboard.keyDown('left');

    assert.ok($parentNode.hasClass(FOCUSED_STATE_CLASS), 'parent item take focus');
});

QUnit.test('\'enter\' key pressing fire onItemClick', function(assert) {
    let clickFired = 0;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: $.extend(true, [], DATA[0]),
        onItemClick: function() {
            clickFired++;
        }
    });
    const keyboard = keyboardMock($treeView);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $item.trigger('dxpointerdown');
    keyboard.keyDown('enter');

    assert.equal(clickFired, 1);
});

QUnit.test('item should be expanded by enter when expandEvent is click', function(assert) {
    const items = [{ text: 'Item 1', items: [{ text: 'Item 11' }] }];
    const $treeView = initTree({
        focusStateEnabled: true,
        items: items,
        expandEvent: 'click'
    });
    const $item = $treeView.find('.dx-treeview-item').eq(0);
    const keyboard = keyboardMock($treeView);

    $item.trigger('dxpointerdown');
    keyboard.keyDown('enter');

    assert.ok(items[0].expanded, 'item should be expanded');
});


QUnit.test('\'enter\' key pressing select/unselect nodes if checkboxes are visible', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        keyExpr: 'key',
        items: $.extend(true, [], DATA[0])
    });
    const keyboard = keyboardMock($treeView);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
    const $checkBox = $node.find('.dx-checkbox').eq(0);

    $item.trigger('dxpointerdown');

    keyboard.keyDown('enter');
    assert.equal($checkBox.dxCheckBox('instance').option('value'), true);
});

QUnit.test('\'enter\' key pressing fire onItemSelectionChanged if checkboxes are visible', function(assert) {
    let selectFired = 0;

    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0]),
        onItemSelectionChanged: function() {
            selectFired++;
        }
    });
    const keyboard = keyboardMock($treeView);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $item.trigger('dxpointerdown');

    keyboard.keyDown('enter');
    assert.equal(selectFired, 1);
});

QUnit.test('\'space\' key pressing fire onItemClick', function(assert) {
    let clickFired = 0;

    const $treeView = initTree({
        focusStateEnabled: true,
        height: 500,
        keyExpr: 'key',
        items: $.extend(true, [], DATA[0]),
        onItemClick: function() {
            clickFired++;
        }
    });
    const keyboard = keyboardMock($treeView);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $item.trigger('dxpointerdown');
    keyboard.keyDown('space');

    assert.equal(clickFired, 1);
});

QUnit.test('\'space\' key pressing select/unselect nodes if checkboxes are visible', function(assert) {
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0])
    });
    const keyboard = keyboardMock($treeView);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
    const $checkBox = $node.find('.dx-checkbox').eq(0);

    $item.trigger('dxpointerdown');

    keyboard.keyDown('space');
    assert.equal($checkBox.dxCheckBox('instance').option('value'), true);
});

QUnit.test('\'space\' key pressing fire onItemSelectionChanged if checkboxes are visible', function(assert) {
    let selectFired = 0;

    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: $.extend(true, [], DATA[0]),
        onItemSelectionChanged: function() {
            selectFired++;
        }
    });
    const keyboard = keyboardMock($treeView);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);

    $item.trigger('dxpointerdown');

    keyboard.keyDown('space');
    assert.equal(selectFired, 1);
});

QUnit.test('T179601', function(assert) {
    const handle = function(args) {
        assert.strictEqual(args.node.selected, actualSelectedState);
        assert.strictEqual(args.node.items[0].selected, actualSelectedState);
    };
    const $treeView = initTree({
        focusStateEnabled: true,
        showCheckBoxesMode: 'normal',
        height: 500,
        items: [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Item 2' }] }, { id: 3, text: 'item 3' }],
        onItemSelectionChanged: handle
    });
    const keyboard = keyboardMock($treeView);
    const $node = $treeView.find('.' + internals.NODE_CLASS).eq(0);
    const $item = $treeView.find('.' + internals.ITEM_CLASS).eq(0);
    const $checkBox = $node.find('.dx-checkbox').eq(0);

    $item.trigger('dxpointerdown');

    let actualSelectedState = true;
    keyboard.keyDown('space');
    assert.equal($checkBox.dxCheckBox('instance').option('value'), true);

    actualSelectedState = false;
    keyboard.keyDown('space');
});

QUnit.test('treeview should not lose focus when parent item is disabled (T303800)', function(assert) {

    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'if device is not desktop we do not test the case');
        return;
    }

    const items = [{ id: 1, text: 'Item 1', items: [{ id: 2, text: 'Item 2', disabled: true, expanded: true, items: [{ id: 21, text: 'Item 21' }] }] }, { id: 3, text: 'item 3' }];
    const $treeView = initTree({
        focusStateEnabled: true,
        items: items
    });
    const keyboard = keyboardMock($treeView);
    let $focusedNode = $treeView.find('.dx-treeview-node[data-item-id=\'21\']');

    $focusedNode.find('.dx-treeview-item').trigger('dxpointerdown');
    assert.ok($focusedNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused');

    keyboard.keyDown('left');
    $focusedNode = $treeView.find('.dx-treeview-node[data-item-id=\'1\']');
    assert.ok($focusedNode.hasClass(FOCUSED_STATE_CLASS), 'first item was focused');

    keyboard.keyDown('right');
    $focusedNode = $treeView.find('.dx-treeview-node[data-item-id=\'21\']');
    assert.ok($focusedNode.hasClass(FOCUSED_STATE_CLASS), 'item was focused');
});

QUnit.testInActiveWindow('First list item should be focused on the \'tab\' key press when the search editor is focused', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
        return;
    }

    const $treeView = initTree({
        items: $.extend(true, [], DATA[1]),
        keyExpr: 'key',
        searchEnabled: true
    });
    const $searchEditor = $treeView.children('.dx-treeview-search');

    $searchEditor.find('input').focus();
    this.clock.tick(10);

    $searchEditor.on('keydown', function(e) {
        if(e.key === 'Tab') {
            $treeView.find('[tabIndex]:not(:focus)').first().focus();
        }
    });

    $searchEditor.trigger($.Event('keydown', { key: 'Tab' }));
    this.clock.tick(10);

    assert.ok($treeView.find('.' + internals.NODE_CLASS).first().hasClass(FOCUSED_STATE_CLASS), 'first node is focused');
    assert.ok($treeView.hasClass(FOCUSED_STATE_CLASS), 'treeview is focused');
    assert.ok($treeView.find('.dx-scrollable-content').hasClass(FOCUSED_STATE_CLASS), 'scrollable is focused');
});
