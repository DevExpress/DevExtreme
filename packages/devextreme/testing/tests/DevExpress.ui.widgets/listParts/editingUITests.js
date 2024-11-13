import $ from 'jquery';
import fx from 'common/core/animation/fx';
import errors from 'ui/widget/ui.errors';
import translator from 'common/core/animation/translator';
import holdEvent from 'common/core/events/hold';
import { noop } from 'core/utils/common';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import pointerMock from '../../../helpers/pointerMock.js';
import contextMenuEvent from 'common/core/events/contextmenu';
import keyboardMock from '../../../helpers/keyboardMock.js';
import { registry, register } from '__internal/ui/list/m_list.edit.decorator_registry';
import SwitchableEditDecorator from '__internal/ui/list/m_list.edit.decorator.switchable';
import SwitchableButtonEditDecorator from '__internal/ui/list/m_list.edit.decorator.switchable.button';
import themes from 'ui/themes';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { reorderingPointerMock, toSelector } from './utils.js';

import 'ui/action_sheet';
import 'ui/list';
import { implementationsMap } from 'core/utils/size';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_ICON_CONTAINER_CLASS = 'dx-list-item-icon-container';
const LIST_ITEM_ICON_CLASS = 'dx-list-item-icon';
const LIST_ITEM_CONTENT_CLASS = 'dx-list-item-content';
const LIST_ITEM_BEFORE_BAG_CLASS = 'dx-list-item-before-bag';
const LIST_SELECT_ALL_CHECKBOX_CLASS = 'dx-list-select-all-checkbox';
const LIST_SELECT_ALL_CLASS = 'dx-list-select-all';
const SELECT_RADIO_BUTTON_CLASS = 'dx-list-select-radiobutton';

const SWITCHABLE_DELETE_READY_CLASS = 'dx-list-switchable-delete-ready';
const SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS = 'dx-list-switchable-menu-shield-positioning';
const SWITCHABLE_DELETE_TOP_SHIELD_CLASS = 'dx-list-switchable-delete-top-shield';
const SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS = 'dx-list-switchable-delete-bottom-shield';
const SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS = 'dx-list-switchable-menu-item-shield-positioning';
const SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS = 'dx-list-switchable-delete-item-content-shield';

QUnit.module('switchable menu decorator', {
    beforeEach: function() {
        const testDecorator = SwitchableEditDecorator.inherit({

            modifyElement: function(config) {
                this.callBase.apply(this, arguments);

                const $itemElement = $(config.$itemElement);

                $itemElement.on('dxpreparetodelete', $.proxy((e) => {
                    this._toggleDeleteReady($itemElement);
                }, this));
            },

            _animateForgetDeleteReady: () => {
                return $.when().promise();
            },

            _animatePrepareDeleteReady: () => {
                return $.when().promise();
            }

        });

        register('menu', 'test', testDecorator);
    },
    afterEach: function() {
        delete registry.menu.test;
    }
});

QUnit.test('positioning should be enabled while item prepared to delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxpreparetodelete');
    assert.strictEqual($list.hasClass(SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS), true, 'shield positioning class added');
    assert.strictEqual($item.hasClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS), true, 'positioning class added');
    $item.trigger('dxpreparetodelete');
    assert.strictEqual($list.hasClass(SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS), false, 'shield positioning class removed');
    assert.strictEqual($item.hasClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS), false, 'positioning class removed');
});

QUnit.test('active state should be enabled while item prepared to delete', function(assert) {
    const clock = sinon.useFakeTimers();

    try {
        const $list = $('#templated-list').dxList({
            items: ['0'],
            allowItemDeleting: true,
            itemDeleteMode: 'test'
        });

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const pointer = pointerMock($item);

        $item.trigger('dxpreparetodelete');
        pointer.start('touch').down();
        clock.tick(1000);
        assert.ok(!$item.hasClass('dx-state-active'), 'item is not activated');

        $item.trigger('dxpreparetodelete');
        pointer.start('touch').down();
        clock.tick(1000);
        assert.ok($item.hasClass('dx-state-active'), 'item is activated');
    } finally {
        clock.restore();
    }
});

QUnit.test('click should remove delete ready class', function(assert) {
    const clickHandledStub = sinon.stub();
    const $list = $('#templated-list').dxList({
        items: ['0', '1'],
        onItemClick: clickHandledStub,
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxpreparetodelete');
    assert.strictEqual($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), true, 'delete ready class added for testing');
    $item.trigger('dxclick');
    assert.strictEqual($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), false, 'delete ready class removed');
    assert.strictEqual(clickHandledStub.callCount, 0, 'click action is not triggered');
});

QUnit.test('click on item should not remove delete ready class if widget is disabled', function(assert) {
    const clickHandledStub = sinon.stub();
    const $list = $('#templated-list').dxList({
        items: ['0'],
        disabled: true,
        onItemClick: clickHandledStub,
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    $('#templated-list').dxList('instance');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxpreparetodelete');
    $item.trigger('dxclick');
    assert.strictEqual($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), true, 'delete ready class not removed');
    assert.strictEqual(clickHandledStub.callCount, 0, 'click action is not triggered');
});

QUnit.test('shields should be generated', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2', '3'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $topShield = $list.find(toSelector(SWITCHABLE_DELETE_TOP_SHIELD_CLASS));
    const $bottomShield = $list.find(toSelector(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS));

    assert.ok($topShield.length, 'top shield generated');
    assert.ok($bottomShield.length, 'bottom shield generated');
    assert.ok($topShield.is(':hidden'), 'top shield disabled');
    assert.ok($bottomShield.is(':hidden'), 'bottom shield disabled');
});

QUnit.test('prepare delete should add shields before and after element', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2', '3'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(1);
    const $topShield = $list.find(toSelector(SWITCHABLE_DELETE_TOP_SHIELD_CLASS));
    const $bottomShield = $list.find(toSelector(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS));

    $item.trigger('dxpreparetodelete');
    assert.ok($topShield.is(':visible'), 'top shield enabled');
    assert.ok($bottomShield.is(':visible'), 'bottom shield enabled');
    assert.ok(Math.abs($topShield.height() - ($item.offset().top - $list.offset().top)) < 1, 'top shield dimensions correct');
    assert.ok(Math.abs($bottomShield.height() - ($list.outerHeight() - $item.outerHeight() - ($item.offset().top - $list.offset().top))) < 1, 'bottom shield dimensions correct');
});

QUnit.test('pointerdown on shields should cancel delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2', '3'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(1);
    const $topShield = $list.find(toSelector(SWITCHABLE_DELETE_TOP_SHIELD_CLASS));
    const $bottomShield = $list.find(toSelector(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS));

    $item.trigger('dxpreparetodelete');
    pointerMock($topShield).start().down();
    assert.strictEqual($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), false, 'delete canceled');

    $item.trigger('dxpreparetodelete');
    pointerMock($bottomShield).start().down();
    assert.strictEqual($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), false, 'delete canceled');
});

QUnit.test('prepare delete should add shield above item content', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test',
        itemTemplate: () => {
            return $('<div>').append($('<div>').addClass(LIST_ITEM_CONTENT_CLASS));
        }
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const itemContentShield = () => { return $list.find(toSelector(LIST_ITEM_CONTENT_CLASS)).find(toSelector(SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS)); };

    assert.ok(!itemContentShield().length, 'shield not added');
    $item.trigger('dxpreparetodelete');
    assert.ok(itemContentShield().length, 'shield added');
    $item.trigger('dxpreparetodelete');
    assert.ok(!itemContentShield().length, 'shield removed');
});

QUnit.test('prepare delete should disable scrolling', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test',
        useNativeScrolling: false
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxpreparetodelete');
    let event = $.Event({ type: 'dxscrollstart' });
    $list.find('.dx-scrollable-wrapper').trigger(event);
    assert.strictEqual(event.cancel, true, 'scroll disabled');
    $item.trigger('dxpreparetodelete');
    event = $.Event({ type: 'dxscrollstart' });
    $list.find('.dx-scrollable-container').trigger(event);
    assert.strictEqual(event.cancel, undefined, 'scroll enabled');
});

QUnit.test('forget delete should not enable scrolling that already was disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const scrollView = $list.dxScrollView('instance');

    scrollView.option('disabled', true);
    $item.trigger('dxpreparetodelete');
    assert.strictEqual(scrollView.option('disabled'), true, 'scroll disabled');
    $item.trigger('dxpreparetodelete');
    assert.strictEqual(scrollView.option('disabled'), true, 'scroll disabled reset');
});


const SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-switchable-delete-button-container';
const SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS = 'dx-list-switchable-delete-button-wrapper';
const SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS = 'dx-list-switchable-delete-button-inner-wrapper';
const SWITCHABLE_DELETE_BUTTON_CLASS = 'dx-list-switchable-delete-button';

QUnit.module('switchable button delete decorator', {
    beforeEach: function() {
        fx.off = true;

        const testDecorator = SwitchableButtonEditDecorator.inherit({

            modifyElement: function(config) {
                this.callBase.apply(this, arguments);

                const $itemElement = $(config.$itemElement);

                $itemElement.on('dxpreparetodelete', $.proxy((e) => {
                    this._toggleDeleteReady($itemElement);
                }, this));
            }

        });
        register('menu', 'test', testDecorator);
    },
    afterEach: function() {
        fx.off = false;

        delete registry.menu.test;
    }
});

QUnit.test('list item markup', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    assert.strictEqual($item.children(toSelector(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS)).length, 0, 'delete button won\'t rendered');
});

QUnit.test('button should be added only when item is ready to delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxpreparetodelete');
    const $deleteButton = $item
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS))
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS))
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS))
        .children(toSelector(SWITCHABLE_DELETE_BUTTON_CLASS));
    assert.ok($deleteButton.hasClass('dx-button'), 'button generated');

    $item.trigger('dxpreparetodelete');
    assert.strictEqual($deleteButton.parents().length, 3, 'button removed');
});

QUnit.test('delete button click should delete list item', function(assert) {
    assert.expect(1);

    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'test'
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxpreparetodelete');
    list.deleteItem = ($itemElement) => {
        assert.strictEqual($itemElement.get(0), $item.get(0), 'item is deleted');
        return $.Deferred().resolve().promise();
    };

    const $deleteButton = $item.find(toSelector(SWITCHABLE_DELETE_BUTTON_CLASS));
    $deleteButton.trigger('dxclick');
});

const TOGGLE_DELETE_SWITCH_CLASS = 'dx-list-toggle-delete-switch';

QUnit.test('switchable delete button should has button content on the second deleting', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        allowItemDeleting: true,
        itemDeleteMode: 'toggle'
    });

    let $item = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    let $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));

    $deleteToggle.trigger('dxclick');

    let $deleteButton = $item.find(toSelector(SWITCHABLE_DELETE_BUTTON_CLASS));

    $deleteButton.trigger('dxclick');
    $item = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));
    $deleteToggle.trigger('dxclick');
    $deleteButton = $item.find(toSelector(SWITCHABLE_DELETE_BUTTON_CLASS));

    assert.strictEqual($deleteButton.children('.dx-button-content').length, 1, 'button container has content');
});

QUnit.module('toggle delete decorator');

QUnit.test('toggling delete toggle button should switch delete ready class', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'toggle'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));

    $deleteToggle.trigger('dxclick');
    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), 'delete ready class added if toggle pressed');
});

QUnit.test('animation should stop after first click, toggle', function(assert) {
    const fxStopSpy = sinon.spy(fx, 'stop');
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'toggle'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));

    $deleteToggle.trigger('dxclick');
    const $buttonContainer = $item.find(toSelector(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS));

    assert.strictEqual(fxStopSpy.callCount, 3);
    assert.strictEqual(fxStopSpy.getCall(1).args[0][0], $buttonContainer[0], 'stop is called on button container');
    assert.strictEqual(fxStopSpy.getCall(1).args[1], false, 'without jump to end');
    fx.stop.restore();
});

const STATIC_DELETE_BUTTON_CLASS = 'dx-list-static-delete-button';

QUnit.module('static delete decorator');

QUnit.test('delete button click should delete list item', function(assert) {
    assert.expect(1);

    const $list = $('#list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'static'
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    list.deleteItem = ($itemElement) => {
        assert.strictEqual($itemElement.get(0), $item.get(0), 'item is deleted');
        return $.Deferred().resolve().promise();
    };

    const $deleteButton = $item.find(toSelector(STATIC_DELETE_BUTTON_CLASS));
    $deleteButton.trigger('dxclick');
});

QUnit.test('click on delete button should not raise item click event when item deleting is deferred', function(assert) {
    const clickHandledStub = sinon.stub();
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'static',
        onItemDeleting: () => {
            return $.Deferred().promise();
        },
        onItemClick: clickHandledStub
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $deleteButton = $item.find(toSelector(STATIC_DELETE_BUTTON_CLASS));

    $deleteButton.trigger('dxclick');
    assert.strictEqual(clickHandledStub.callCount, 0, 'click action is not triggered');
});

QUnit.module('slideButton delete decorator');

QUnit.test('item swiping should add delete ready class', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideButton'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    pointerMock($item).start().swipeEnd(1);

    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), 'delete ready class added if item swiped');
});

QUnit.test('item swiping should not add delete ready class if widget is disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        disabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'slideButton'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const startEvent = pointerMock($item).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, 'swipe canceled in disabled widget');
});

QUnit.test('animation should stop after first click, slideButton', function(assert) {
    const fxStopSpy = sinon.spy(fx, 'stop');
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideButton'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    pointerMock($item).start().swipeEnd(1);
    const $buttonContainer = $item.find(toSelector(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS));

    assert.strictEqual(fxStopSpy.callCount, 3);
    assert.strictEqual(fxStopSpy.getCall(1).args[0][0], $buttonContainer[0], 'stop is called on button container');
    assert.strictEqual(fxStopSpy.getCall(1).args[1], false, 'without jump to end');
    fx.stop.restore();
});


const SLIDE_MENU_WRAPPER_CLASS = 'dx-list-slide-menu-wrapper';
const SLIDE_MENU_CONTENT_CLASS = 'dx-list-slide-menu-content';
const SLIDE_MENU_BUTTONS_CONTAINER_CLASS = 'dx-list-slide-menu-buttons-container';
const SLIDE_MENU_BUTTONS_CLASS = 'dx-list-slide-menu-buttons';
const SLIDE_MENU_BUTTON_CLASS = 'dx-list-slide-menu-button';
const SLIDE_MENU_BUTTON_MENU_CLASS = 'dx-list-slide-menu-button-menu';
const SLIDE_MENU_CLASS = 'dx-list-slide-menu';
const position = ($element) => {
    return translator.locate($element).left;
};

QUnit.module('slideItem delete decorator', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('list item markup', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    assert.ok($item.hasClass(SLIDE_MENU_WRAPPER_CLASS), 'class added to list item');
    const $itemContent = $item.children(toSelector(SLIDE_MENU_CONTENT_CLASS));
    assert.strictEqual($itemContent.length, 1, 'content generated');
    assert.strictEqual($itemContent.text(), 'Item Template', 'content moved in inner div');

    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };
    assert.strictEqual(deleteButtonContent().length, 0, 'button is not generated');
});

QUnit.test('icon should not be rendered when custom item template is used', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [{ icon: 'box', text: 'Item 1' }],
        itemTemplate: (data) => {
            return $('<div>').text('$: ' + data.text);
        }
    });

    assert.strictEqual($list.find('.' + LIST_ITEM_ICON_CONTAINER_CLASS).length, 0, 'item content has not been rendered');
});

QUnit.test('it should be possible to define custom icon class with colon symbol (T1212049)', function(assert) {
    const $list = $('#list').dxList({
        items: [{ icon: 'some:class', text: 'Item 1' }],
    });

    const $itemIcon = $list.find(`.${LIST_ITEM_ICON_CLASS}`);

    assert.ok($itemIcon.hasClass('some:class'));
});

QUnit.test('swipe should prepare item for delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(-0.01);

    const $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));
    const $deleteButtonContainer = $item.find(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS));
    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    assert.ok(position($itemContent) < 0, 'item moved');

    const containerPositionDifference = $item.width() - position($deleteButtonContainer);

    assert.ok(containerPositionDifference > 0 && containerPositionDifference < $deleteButton.outerWidth(), 'button container moved');
    assert.ok(position($deleteButton) < 0 && position($deleteButton) > -$deleteButton.outerWidth(), 'button moved');
    pointer.swipeEnd(-1, -0.5);
    assert.roughEqual(position($itemContent), -$deleteButton.outerWidth(), 0.251, 'item animated');
    assert.roughEqual(position($deleteButtonContainer), $item.width() - $deleteButton.outerWidth(), 0.251, 'button container animated');
    assert.strictEqual(position($deleteButton), 0, 'button animated');
    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), 'item ready for delete');

    fx.off = false;
    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.strictEqual(position($itemContent), 0, 'item animated back');
    assert.strictEqual(position($deleteButtonContainer), $item.width(), 'button container animated back');
    assert.roughEqual(position($deleteButton), -$deleteButton.outerWidth(), 0.251, 'button animated back');
});

QUnit.test('swipe should not prepare item for delete if widget is disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        disabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const startEvent = pointerMock($item).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, 'swipe canceled');
});

QUnit.test('swipe should be canceled if swipe in opposite direction', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const startEvent = pointerMock($item).start().swipeStart().swipe(0.1).lastEvent();

    assert.ok(startEvent.cancel, 'swipe canceled');
});

QUnit.test('swipe should not be canceled if swipe in opposite direction and item is ready to delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    const startEvent = pointerMock($item).start().swipeStart().swipe(0.1).lastEvent();
    assert.ok(!startEvent.cancel, 'swipe canceled');
});

QUnit.test('swipe should not move item righter', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));

    pointerMock($item).start().swipeStart().swipe(0.5);
    assert.strictEqual(position($itemContent), 0, 'item not moved');
});

QUnit.test('swipe loop should not be canceled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const startEvent = pointerMock($item).start().swipeStart().swipe(-0.5).swipe(0.5).lastEvent();

    assert.ok(!startEvent.cancel, 'item returned back');
});

QUnit.test('click should undo readiness to delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));
    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    $itemContent.trigger('dxclick');
    assert.strictEqual(position($itemContent), 0, 'item moved back');
    assert.ok(!$item.hasClass(SWITCHABLE_DELETE_READY_CLASS), 'item not ready for delete');
    assert.strictEqual($deleteButton.parents().length, 0, 'button removed');
});

QUnit.test('click on button should remove item', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    list.deleteItem = ($itemElement) => {
        assert.strictEqual($itemElement.get(0), $item.get(0), 'item is deleted');
        return $.Deferred().resolve().promise();
    };

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));
    $deleteButton.trigger('dxclick');
});

QUnit.test('click on button should not cause item click event if confirmation present', function(assert) {
    const clickHandledStub = sinon.stub();
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem',
        onItemDeleting: () => {
            return $.Deferred().promise();
        },
        onItemClick: clickHandledStub
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));
    $deleteButton.trigger('dxclick');

    assert.strictEqual(clickHandledStub.callCount, 0, 'item click action not fired');
});

QUnit.test('click on button should not remove item if widget disabled', function(assert) {
    assert.expect(0);

    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem',
        onItemDeleted: (e) => {
            assert.ok(false, 'delete action executed');
        }
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    list.option('disabled', true);
    $deleteButton.trigger('dxclick');
});

QUnit.test('button should have no text for the Material theme', function(assert) {
    const origIsMaterialBased = themes.isMaterialBased;
    themes.isMaterialBased = () => { return true; };

    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);

    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));

    assert.strictEqual($deleteButton.text(), '', 'button has no text for Material theme');

    themes.isMaterialBased = origIsMaterialBased;
});

QUnit.test('button should have no text for the Generic theme', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    pointerMock($item).start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);

    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTON_CLASS));

    assert.ok($deleteButton.text().length > 0, 'button has a text for Generic theme');
});

const INKRIPPLE_WAVE_SHOWING_CLASS = 'dx-inkripple-showing';
const INKRIPPLE_MATERIAL_SHOW_TIMEOUT = 100;

QUnit.test('button should have no inkRipple after fast swipe for Material theme', function(assert) {
    const origIsMaterial = themes.isMaterial;
    const origCurrent = themes.current;
    const clock = sinon.useFakeTimers();

    themes.isMaterial = () => { return true; };
    themes.current = () => { return 'material'; };

    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $item = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    const pointer = pointerMock($item);
    let args;
    let inkRippleShowingWave;
    const testArgs = [{
        afterTouchTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT,
        afterSwipeTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT,
        result: 0,
        message: 'button has no inkRipple after short touch before swipe for Material theme',
    }, {
        afterTouchTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT * 1.2,
        afterSwipeTimeout: INKRIPPLE_MATERIAL_SHOW_TIMEOUT * 0.8,
        result: 1,
        message: 'button has inkRipple after long touch before swipe for Material theme',
    }];

    for(let i = 0; i < testArgs.length; i++) {
        args = testArgs[i];

        pointer.start('touch').down();
        clock.tick(args.afterTouchTimeout);
        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        clock.tick(args.afterSwipeTimeout);
        inkRippleShowingWave = $item.find(toSelector(INKRIPPLE_WAVE_SHOWING_CLASS));
        assert.strictEqual(inkRippleShowingWave.length, args.result, args.message);
        pointer.start('touch').up();
        clock.tick(400);
    }

    clock.restore();
    themes.isMaterial = origIsMaterial;
    themes.current = origCurrent;
});

QUnit.test('inkRipple feedback should not be broken if swipe in opposite direction', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem',
        useInkRipple: true
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const clock = sinon.useFakeTimers();
    const pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(0.01);
    clock.tick(50);
    pointer.start('touch').up();
    clock.tick(50);
    pointer.start('touch').down();
    clock.tick(100);
    const inkRippleShowingWave = $item.find(toSelector(INKRIPPLE_WAVE_SHOWING_CLASS));

    assert.strictEqual(inkRippleShowingWave.length, 1, 'inkripple feedback works right after swipe in opposite direction');

    pointer.start('touch').up();
    clock.restore();
});

QUnit.test('swipe should prepare item for delete in RTL mode', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        rtlEnabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(0.01);

    const $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));
    const $deleteButtonContainer = $item.find(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS));
    const $deleteButton = $item.find(toSelector(SLIDE_MENU_BUTTONS_CLASS));

    assert.ok(position($itemContent) > 0, 'item moved');
    const containerPositionDifference = position($deleteButtonContainer);
    assert.ok(containerPositionDifference < 0 && containerPositionDifference > -$deleteButton.outerWidth(), 'button container moved');
    assert.ok(position($deleteButton) > 0 && position($deleteButton) < $deleteButton.outerWidth(), 'button moved');

    pointer.swipeEnd(1, 0.5);
    assert.roughEqual(position($itemContent), $deleteButton.outerWidth(), 0.251, 'item animated');
    assert.strictEqual(position($deleteButtonContainer), 0, 'button container animated');
    assert.strictEqual(position($deleteButton), 0, 'button animated');
    assert.ok($item.hasClass(SWITCHABLE_DELETE_READY_CLASS), 'item ready for delete');

    fx.off = false;
    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.strictEqual(position($itemContent), 0, 'item animated back');
    assert.roughEqual(position($deleteButtonContainer), -$deleteButton.outerWidth(), 0.251, 'button container animated back');
    assert.roughEqual(position($deleteButton), $deleteButton.outerWidth(), 0.251, 'button animated back');
});

QUnit.test('swipe should not move item lefter in RTL mode', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        rtlEnabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'slideItem'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $itemContent = $item.find(toSelector(SLIDE_MENU_CONTENT_CLASS));

    pointerMock($item).start().swipeStart().swipe(-0.5);
    assert.strictEqual(position($itemContent), 0, 'item not moved');
});

QUnit.test('multiple swipes should not break deletion', function(assert) {
    const origFxOff = fx.off;
    const clock = sinon.useFakeTimers();

    try {
        fx.off = false;

        const $list = $('#templated-list').dxList({
            items: ['0'],
            allowItemDeleting: true,
            itemDeleteMode: 'slideItem'
        });
        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const pointer = pointerMock($item).start();

        pointer.swipeStart().swipe(-0.5).swipeEnd(-1);
        clock.tick(300);
        pointer.swipeStart().swipe(0.5).swipeEnd(1);
        clock.tick(200);
        pointer.swipeStart().swipe(-0.5);
        assert.ok($item.hasClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS), 'positioning is turned on');
        pointer.swipeEnd(-1);
        clock.tick(300);

        const $deleteButtonContainer = $item.find(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS));
        assert.ok($deleteButtonContainer.length, 'delete button present');
    } finally {
        fx.off = origFxOff;
        clock.restore();
    }
});

QUnit.test('optimizations', function(assert) {
    const getOrigOuterWidth = implementationsMap.getOuterWidth;
    const setOrigOuterWidth = implementationsMap.setOuterWidth;
    const outerWidthStub = sinon.stub();

    try {
        const $list = $('#templated-list').dxList({
            items: ['0'],
            allowItemDeleting: true,
            itemDeleteMode: 'slideItem'
        });

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const pointer = pointerMock($item);

        implementationsMap.getOuterWidth = function() {
            outerWidthStub();
            return getOrigOuterWidth.apply(this, arguments);
        };
        implementationsMap.setOuterWidth = function() {
            outerWidthStub();
            return setOrigOuterWidth.apply(this, arguments);
        };

        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
        pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    } finally {
        assert.strictEqual(outerWidthStub.callCount, 2, 'outerWidth should be calculated only once for item and button');
        implementationsMap.getOuterWidth = getOrigOuterWidth;
        implementationsMap.setOuterWidth = setOrigOuterWidth;
    }
});


QUnit.module('slide menu decorator', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('list item markup', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        menuMode: 'slide',
        menuItems: [{ text: 'menu' }, { text: 'menu' }]
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);
    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    assert.strictEqual(deleteButtonContent().length, 1, 'menu button was generated');
    assert.ok(deleteButtonContent().hasClass(SLIDE_MENU_BUTTON_MENU_CLASS), 'menu button has correct class');
    assert.strictEqual(deleteButtonContent().text(), 'More', 'menu button text is correct');
});

QUnit.test('list item markup with one button', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        menuMode: 'slide',
        menuItems: [{ text: 'menu' }]
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);
    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    assert.strictEqual(deleteButtonContent().length, 1, 'menu button was generated');
    assert.ok(deleteButtonContent().hasClass(SLIDE_MENU_BUTTON_MENU_CLASS), 'menu button has correct class');
    assert.strictEqual(deleteButtonContent().text(), 'menu', 'menu button text is correct');
});

QUnit.test('click on menu item should open menu', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        menuMode: 'slide',
        menuItems: [{ text: 'menu' }, { text: 'menu' }]
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);
    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger('dxclick');

    const $menu = $list.find(toSelector(SLIDE_MENU_CLASS));
    const menu = $menu.dxActionSheet('instance');
    const $menuItems = $(menu.itemElements());

    assert.strictEqual($menuItems.length, 2, 'menu items was rendered');
    assert.strictEqual(menu.option('visible'), true, 'menu is shown');
    assert.strictEqual($menuItems.text(), 'menumenu', 'menu text is correct');
});

QUnit.test('click on menu toggle should not turn off ready to delete', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        menuMode: 'slide',
        menuItems: [{ text: 'menu' }, { text: 'menu' }]
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);
    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger('dxclick');

    assert.strictEqual(deleteButtonContent().length, 1, 'ready to delete mode is enabled');
});

QUnit.test('menu item action should be fired after item click', function(assert) {
    assert.expect(2);

    const $list = $('#templated-list').dxList({
        items: ['0'],
        menuMode: 'slide',
        menuItems: [
            {
                text: 'menu',
                action: (e) => {
                    assert.strictEqual($(e.itemElement).get(0), $item.get(0));
                }
            },
            {
                text: 'menu'
            }
        ]
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);
    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger('dxclick');

    const $menu = $list.find(toSelector(SLIDE_MENU_CLASS));
    const menu = $menu.dxActionSheet('instance');
    const $menuItems = $(menu.itemElements());

    $menuItems.eq(0).trigger('dxclick');
    assert.strictEqual(deleteButtonContent().length, 0, 'ready to delete mode is disabled');
});

QUnit.test('menu item action should be fired after item click', function(assert) {
    assert.expect(3);

    const $list = $('#templated-list').dxList({
        items: ['0'],
        menuMode: 'slide',
        menuItems: [
            {
                text: 'menu',
                action: (e) => {
                    assert.strictEqual(isRenderer(e.itemElement), !!config().useJQuery, 'itemElement is correct');
                    assert.strictEqual($(e.itemElement).get(0), $item.get(0));
                }
            }
        ]
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = pointerMock($item);
    const deleteButtonContent = () => {
        return $item
            .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
            .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
    };

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
    deleteButtonContent().trigger('dxclick');
    assert.strictEqual(deleteButtonContent().length, 0, 'ready to delete mode is disabled');
});

QUnit.test('click on menu toggle should cause item click event', function(assert) {
    const origFxOff = fx.off;
    const clickHandledStub = sinon.stub();

    try {
        const $list = $('#templated-list').dxList({
            items: ['0'],
            menuMode: 'slide',
            menuItems: [
                {
                    text: 'menu',
                    action: () => {}
                }
            ],
            onItemClick: clickHandledStub
        });
        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const pointer = pointerMock($item);
        const deleteButtonContent = () => {
            return $item
                .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
        };

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
        fx.off = false;
        deleteButtonContent().trigger('dxclick');
        assert.strictEqual(clickHandledStub.callCount, 0, 'click on item not fired');
    } finally {
        fx.off = origFxOff;
    }
});

QUnit.test('click on menu toggle should cause item click event if at least 2 menu items present', function(assert) {
    const origFxOff = fx.off;
    const clickHandledStub = sinon.stub();

    try {
        const $list = $('#templated-list').dxList({
            items: ['0'],
            menuMode: 'slide',
            menuItems: [
                {
                    text: 'menu'
                },
                {
                    text: 'menu'
                }
            ],
            onItemClick: clickHandledStub
        });
        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const pointer = pointerMock($item);
        const deleteButtonContent = () => {
            return $item
                .children(toSelector(SLIDE_MENU_BUTTONS_CONTAINER_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTONS_CLASS))
                .children(toSelector(SLIDE_MENU_BUTTON_CLASS));
        };

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1, -0.5);
        fx.off = false;
        deleteButtonContent().trigger('dxclick');
        assert.strictEqual(clickHandledStub.callCount, 0, 'click on item not fired');
    } finally {
        fx.off = origFxOff;
    }
});

QUnit.module('swipe delete decorator', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('delete item by swipe gesture', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'swipe'
    });
    const list = $list.dxList('instance');
    const $item = $(list.itemElements()).eq(0);
    const pointer = pointerMock($item);

    list.deleteItem = ($itemElement) => {
        assert.strictEqual($itemElement.get(0), $item.get(0), 'item is deleted');
        return $.Deferred().resolve().promise();
    };

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
});

QUnit.test('item should be at normal position if confirmation not passed', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'swipe'
    });
    const list = $list.dxList('instance');
    const $item = $(list.itemElements()).eq(0);
    const pointer = pointerMock($item);

    list.deleteItem = ($itemElement) => {
        return $.Deferred().reject();
    };
    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);

    assert.strictEqual(position($item), 0, 'position returned');
});

QUnit.test('swipe should not delete item if widget is disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        disabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'swipe'
    });
    const list = $list.dxList('instance');
    const $item = $(list.itemElements()).eq(0);
    const startEvent = pointerMock($item).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, 'swipe canceled');
});

const CONTEXTMENU_CLASS = 'dx-list-context-menu';
const CONTEXTMENU_MENUCONTENT_CLASS = 'dx-list-context-menucontent';
const CONTEXTMENU_MENUITEM = LIST_ITEM_CLASS;

QUnit.module('context delete decorator', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('overlay content markup', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context'
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $deleteMenuItem = $(menu.content()).find(toSelector(CONTEXTMENU_MENUITEM));

    assert.ok($deleteMenuItem.length, 'delete menu item generated');
    assert.strictEqual($deleteMenuItem.text(), 'Delete', 'delete menu item text set');
});

QUnit.test('item should be deleted from menu', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        editEnabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'context'
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $deleteMenuItem = $(menu.content()).find(toSelector(CONTEXTMENU_MENUITEM));

    list.deleteItem = ($itemElement) => {
        assert.ok(true, 'item is deleted');
        return $.Deferred().resolve().promise();
    };
    $deleteMenuItem.trigger('dxclick');
});

QUnit.module('context menu decorator', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('menu content markup', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        menuMode: 'context',
        menuItems: [{ text: 'menu' }]
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $menuContent = $(menu.content());
    const $contextMenuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    assert.ok($menuContent.hasClass(CONTEXTMENU_MENUCONTENT_CLASS), 'menu content class set');
    assert.strictEqual($contextMenuItem.length, 1, 'context menu item generated');
    assert.strictEqual($contextMenuItem.text(), 'menu', 'context menu item text set');
});

QUnit.test('delete button should be rendered in menu if delete enabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        menuMode: 'context',
        menuItems: [{ text: 'menu' }]
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $menuContent = $(menu.content());
    const $contextMenuItems = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    assert.strictEqual($contextMenuItems.length, 2, 'context menu item and delete item menu generated');
    assert.strictEqual($contextMenuItems.eq(1).text(), 'Delete', 'delete item text set');
});

QUnit.test('item hold should open overlay', function(assert) {
    assert.expect(1);

    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context'
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');

    $item.trigger(contextMenuEvent.name);
    assert.ok(menu.option('visible'), 'overlay shown');
});

QUnit.test('item hold should not open overlay if editing disabled', function(assert) {
    assert.expect(1);

    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context'
    });
    const list = $list.dxList('instance');

    list.option('allowItemDeleting', false);

    const $menu = list.$element().find(toSelector(CONTEXTMENU_CLASS));
    assert.ok(!$menu.length, 'overlay won\'t created');
});

QUnit.test('item hold should not open overlay if widget is disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        disabled: true,
        allowItemDeleting: true,
        itemDeleteMode: 'context'
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $menu = list.$element().find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');

    $item.trigger(contextMenuEvent.name);
    assert.ok(!menu.option('visible'), 'overlay shown');
});

QUnit.test('menu item click action should be fired with correct arguments', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        menuMode: 'context',
        menuItems: [
            {
                text: 'menu',
                action: (e) => {
                    assert.strictEqual($(e.itemElement).get(0), $item.get(0), 'itemElement is correct');
                }
            }
        ]
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $menuContent = $(menu.content());
    const $menuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    $item.trigger(contextMenuEvent.name);
    $menuItem.trigger('dxclick');
});

QUnit.test('delete menu item click should remove item and hide overlay', function(assert) {
    assert.expect(3);

    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context',
        onItemHold: () => {
            assert.ok(false, 'item hold action fired');
        }
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    list.deleteItem = (itemElement) => {
        assert.ok(true, 'delete action executed');
        assert.ok($(itemElement).hasClass(LIST_ITEM_CLASS));
    };

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $menu = list.$element().find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $menuContent = $(menu.content());
    const $deleteMenuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    $item.trigger(contextMenuEvent.name);
    $deleteMenuItem.trigger('dxclick');
    assert.ok(!menu.option('visible'), 'overlay shown');
});

QUnit.test('menu should be closed after click', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        menuMode: 'context',
        menuItems: [{ text: 'menu' }]
    });
    const list = $list.dxList('instance');

    $(list.itemElements()).eq(0).trigger('dxcontextmenu');

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $menu = $list.find(toSelector(CONTEXTMENU_CLASS));
    const menu = $menu.dxOverlay('instance');
    const $menuContent = $(menu.content());
    const $menuItem = $menuContent.find(toSelector(CONTEXTMENU_MENUITEM));

    $item.trigger(contextMenuEvent.name);
    $menuItem.trigger('dxclick');

    assert.ok(!menu.option('visible'), 'menu hidden');
});

QUnit.test('onItemHold should not be fired if context menu was opened by hold', function(assert) {
    assert.expect(0);

    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context',
        onItemHold: () => {
            assert.ok(false);
        }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger({
        type: holdEvent.name,
        pointerType: 'touch'
    });
});

QUnit.test('onItemHold should not be fired if context menu was not opened by hold', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context',
        onItemHold: () => {
            assert.ok(true);
        }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger({
        type: holdEvent.name,
        pointerType: 'mouse'
    });
});

QUnit.test('rtlEnabled option should be passed to overlay', function(assert) {
    assert.expect(1);

    const $list = $('#list').dxList({
        items: [0, 1, 2],
        allowItemDeleting: true,
        itemDeleteMode: 'context',
        rtlEnabled: true
    });
    const menu = $list.find(toSelector(CONTEXTMENU_CLASS)).dxOverlay('instance');

    assert.ok(menu.option('rtlEnabled'), 'rtl option is true');
});


QUnit.module('item select decorator', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        this.clock.restore();
    },
});

const SELECT_DECORATOR_ENABLED_CLASS = 'dx-list-select-decorator-enabled';
const SELECT_CHECKBOX_CLASS = 'dx-list-select-checkbox';

QUnit.test('selection control has focusStateEnabled = false and hoverStateEnabled = false', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $checkboxContainer = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS));
    const checkbox = $checkboxContainer.children(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox('instance');

    assert.ok(!checkbox.option('focusStateEnabled'), 'focused state is turned off for the control');
    assert.ok(!checkbox.option('hoverStateEnabled'), 'hover state is turned off for the control');
});

QUnit.test('checkbox click should trigger select callback only once with correct itemData', function(assert) {
    assert.expect(1);

    const item = '0';
    const $list = $('#templated-list').dxList({
        items: [item],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    list.selectItem = () => {
        assert.ok(true, 'item selected');
    };

    const $checkbox = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0).find(toSelector(SELECT_CHECKBOX_CLASS));

    $checkbox.trigger('dxclick');
});

QUnit.test('checkbox click should trigger unselect callback only once with correct itemData', function(assert) {
    assert.expect(1);

    const item = '0';
    const $list = $('#templated-list').dxList({
        items: [item],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    list.unselectItem = () => {
        assert.ok(true, 'item unselected');
    };

    const $checkbox = $list.find(toSelector(LIST_ITEM_CLASS)).eq(0).find(toSelector(SELECT_CHECKBOX_CLASS));

    $checkbox.trigger('dxclick');
    $checkbox.trigger('dxclick');
});

QUnit.test('rendering if selecting is disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'none'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $checkbox = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_CHECKBOX_CLASS));

    assert.strictEqual($checkbox.hasClass('dx-checkbox'), false, 'select not generated');
});

QUnit.test('checkbox should be refreshed with correct state', function(assert) {
    assert.expect(1);

    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');
    const checkbox = () => {
        return $list.find(toSelector(LIST_ITEM_CLASS)).eq(0).find(toSelector(SELECT_CHECKBOX_CLASS));
    };

    checkbox().trigger('dxclick');
    list._refresh();

    assert.strictEqual(checkbox().dxCheckBox('instance').option('value'), true, 'checkbox regenerated successfully');
});

QUnit.test('checkbox should be refreshed when selectItem is called on it', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');
    const item = () => {
        return $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    };
    const checkbox = () => {
        return item().find(toSelector(SELECT_CHECKBOX_CLASS));
    };

    list.selectItem(item());

    assert.strictEqual(checkbox().dxCheckBox('instance').option('value'), true, 'checkbox regenerated successfully');
});

QUnit.test('checkbox should be refreshed when unselectItem is called on it', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');
    const item = () => {
        return $list.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    };
    const checkbox = () => {
        return item().find(toSelector(SELECT_CHECKBOX_CLASS));
    };

    checkbox().trigger('dxclick');
    list.unselectItem(item());

    assert.strictEqual(checkbox().dxCheckBox('instance').option('value'), false, 'checkbox regenerated successfully');
});

QUnit.test('selection enabled class should be added when needed', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $list.dxList('instance');

    assert.ok($list.hasClass(SELECT_DECORATOR_ENABLED_CLASS), 'class added');
    list.option('showSelectionControls', false);
    assert.ok(!$list.hasClass(SELECT_DECORATOR_ENABLED_CLASS), 'class removed');
});

QUnit.test('item click changes checkbox state', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxclick');

    const checkbox = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox('instance');

    assert.strictEqual(checkbox.option('value'), true, 'state changed');
});

QUnit.test('item click should trigger select/unselect callback only once', function(assert) {
    const item = '0';
    const selectActionStub = sinon.stub();
    const unselectActionStub = sinon.stub();
    const $list = $('#templated-list').dxList({
        items: [item],
        showSelectionControls: true,
        selectionMode: 'multiple',
        onSelectionChanged: (args) => {
            if(args.addedItems.length) {
                selectActionStub();
            }
            if(args.removedItems.length) {
                unselectActionStub();
            }
        }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxclick');
    $item.trigger('dxclick');

    assert.strictEqual(selectActionStub.callCount, 1, 'selection triggered');
    assert.strictEqual(unselectActionStub.callCount, 1, 'unselected triggered');
});

QUnit.test('click on checkbox should trigger events only once', function(assert) {
    const item = '0';
    const selectActionStub = sinon.stub();
    const unselectActionStub = sinon.stub();
    const $list = $('#templated-list').dxList({
        items: [item],
        showSelectionControls: true,
        selectionMode: 'multiple',
        onSelectionChanged: (args) => {
            if(args.addedItems.length) {
                selectActionStub();
            }
            if(args.addedItems.length) {
                unselectActionStub();
            }
        }
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $checkbox = $item.find(toSelector(SELECT_CHECKBOX_CLASS));

    $checkbox.trigger('dxclick');
    $checkbox.trigger('dxclick');

    assert.strictEqual(selectActionStub.callCount, 1, 'selected triggered');
    assert.strictEqual(unselectActionStub.callCount, 1, 'unselected triggered');
});

QUnit.test('click on item should not change selected state if widget is disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        disabled: true,
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const list = $('#templated-list').dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxclick');

    assert.strictEqual(list.option('selectedItems').length, 0, 'item is not selected');
});

QUnit.test('click on delete toggle should not change selected state', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        allowItemDeleting: true,
        itemDeleteMode: 'toggle',
        showSelectionControls: true,
        selectionMode: 'multiple'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const checkbox = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox('instance');

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger('dxpointerup');
    this.clock.tick(10);
    assert.strictEqual(checkbox.option('value'), false, 'click action is not pass to item');

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger('dxpointerup');
    this.clock.tick(10);
    assert.strictEqual(checkbox.option('value'), false, 'click action is not pass to item');
});

QUnit.test('click on item ready to delete with toggle mode should not change selected state', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1'],
        allowItemDeleting: true,
        itemDeleteMode: 'toggle',
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $item1 = $items.eq(1);
    const checkbox = $item.find(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox('instance');

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger('dxpointerup');
    this.clock.tick(10);
    $item.find($item).trigger('dxclick');
    assert.strictEqual(checkbox.option('value'), false, 'click action is not pass to item');

    $item.find(toSelector(TOGGLE_DELETE_SWITCH_CLASS)).trigger('dxpointerup');
    this.clock.tick(10);
    $item.find($item1).trigger('dxclick');
    assert.strictEqual(checkbox.option('value'), false, 'click action is not pass to item');
});

QUnit.test('click on item ready to delete with slideButton mode should not change selected state', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1'],
        allowItemDeleting: true,
        itemDeleteMode: 'slideButton',
        showSelectionControls: true,
        selectionMode: 'multiple'
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const $item1 = $items.eq(1);
    const checkbox = $item.find(toSelector(SELECT_CHECKBOX_CLASS)).dxCheckBox('instance');
    const pointer = pointerMock($item);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    $item.find($item).trigger('click');
    assert.strictEqual(checkbox.option('value'), false, 'click action is not pass to item');

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    $item.find($item1).trigger('dxclick');
    assert.strictEqual(checkbox.option('value'), false, 'click action is not pass to item');
});

QUnit.test('item click event should be fired if selectionControls is enabled', function(assert) {
    const itemClickHandler = sinon.spy();
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'all',
        onItemClick: itemClickHandler
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxclick');

    assert.strictEqual(itemClickHandler.callCount, 1, 'handler was called once');
});

QUnit.test('grouped list with dataSource and store key specified should select items correctly', function(assert) {
    const $list = $('#templated-list').dxList({
        dataSource: new DataSource({
            store: new ArrayStore({
                data: [
                    { id: 0, text: 'Item 1', cId: 1 },
                    { id: 1, text: 'Item 2', cId: 1 },
                    { id: 2, text: 'Item 3', cId: 2 },
                    { id: 3, text: 'Item 4', cId: 2 }
                ],
                key: 'id'
            }),
            group: 'cId'
        }),
        selectionMode: 'multiple',
        grouped: true,
        showSelectionControls: true
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxclick');

    assert.ok($item.hasClass('dx-list-item-selected'), 'item is selected');
});


QUnit.module('selectAll for all pages');

QUnit.test('next loaded page should be selected when selectAll is enabled', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all',
        pageLoadMode: 'nextButton',
        selectAllMode: 'allPages'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CLASS} .dx-checkbox`);
    const $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $selectAll.trigger('dxclick');
    $moreButton.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), true, 'selectAll checkbox is in selected state');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 6, 'all items are selected');
    assert.strictEqual($list.find('.dx-list-item-selected').length, 4, 'all items has selected class');
});

QUnit.test('selectAll should have active state', function(assert) {
    const clock = sinon.useFakeTimers();
    const $list = $('#list').dxList({
        dataSource: new DataSource({
            store: [1, 2, 3, 4, 5, 6],
        }),
        showSelectionControls: true,
        selectionMode: 'all',
        selectAllMode: 'allPages'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CLASS}`);
    const pointer = pointerMock($selectAll);

    pointer.start('touch').down();
    clock.tick(100);
    assert.ok($selectAll.hasClass('dx-state-active'), 'selectAll has active state');
    clock.restore();
});

QUnit.test('selectAll should not select items if they are not in current filter', function(assert) {
    const ds = new DataSource({
        store: [
            { id: 0, text: 'Item 1' },
            { id: 1, text: 'Item 2' },
            { id: 2, text: 'Item 3' }
        ],
        key: 'id',
        selectAllMode: 'allPages',
        filter: ['id', 1]
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all',
        selectAllMode: 'allPages'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);

    $selectAll.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), true, 'selectAll sheckbox is in selected state');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 1, 'just filtered items should be selected');
    assert.strictEqual($list.find('.dx-list-item-selected').length, 1, 'selected items should have selected class');
});

QUnit.test('selectAll checkbox should change it\'s state to undefined when one item was deselected', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all',
        pageLoadMode: 'nextButton',
        selectAllMode: 'allPages'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    const $checkBox = $list.find('.dx-checkbox').eq(1);
    const $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $selectAll.trigger('dxclick');
    $moreButton.trigger('dxclick');
    $checkBox.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), undefined, 'selectAll checkbox is in undefined state');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 5, 'all of selected items are in the option');
    assert.strictEqual($list.find('.dx-list-item-selected').length, 3, 'all selected items has selected class');
});

QUnit.test('selectAll should change state after page loading when all items was selected in the previous page', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all',
        pageLoadMode: 'nextButton',
        selectAllMode: 'allPages'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    const $checkBox = $list.find('.dx-checkbox:gt(0)');
    const $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $checkBox.trigger('dxclick');
    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), undefined, 'selectAll checkbox is in undefined state');

    $moreButton.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), undefined, 'selectAll checkbox is in undefined state');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 2, 'all of selected items are in the option');
    assert.strictEqual($list.find('.dx-list-item-selected').length, 2, 'all selected items has selected class');
});

QUnit.test('selectAll should change state after page loading if selectAllMode was changed', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all',
        pageLoadMode: 'nextButton',
        selectAllMode: 'page'
    });

    $list.dxList('option', 'selectAllMode', 'allPages');

    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    const $checkBox = $list.find('.dx-checkbox').eq(1);
    const $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $selectAll.trigger('dxclick');
    $moreButton.trigger('dxclick');
    $checkBox.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), undefined, 'selectAll checkbox is in undefined state');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 5, 'all of selected items are in the option');
    assert.strictEqual($list.find('.dx-list-item-selected').length, 3, 'all selected items has selected class');
});

QUnit.test('items should starts from first page after selectAllMode was changed', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 2,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        selectionMode: 'all',
        pageLoadMode: 'nextButton',
        selectAllMode: 'page'
    });
    const $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $moreButton.trigger('dxclick');
    $list.dxList('option', 'selectAllMode', 'allPages');

    assert.deepEqual($list.dxList('option', 'items'), [1, 2], 'items starts from the first page');
});

QUnit.test('more button is shown if selectAllMode was changed after load allpage', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4, 5, 6],
        pageSize: 4,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all',
        pageLoadMode: 'nextButton',
        selectAllMode: 'page'
    });
    let $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $moreButton.trigger('dxclick');
    $list.dxList('option', 'selectAllMode', 'allPages');
    $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    assert.ok($moreButton.length, 'morebutton is shown');
});

QUnit.test('selectAll and unselectAll should log warning if selectAllMode is allPages and data is grouped', function(assert) {
    const ds = new DataSource({
        store: [{ key: '1', items: ['1_1', '1_2'] }, { key: '2', items: ['2_1', '2_2'] }],
        pageSize: 2,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        grouped: true,
        showSelectionControls: true,
        selectionMode: 'all',
        selectAllMode: 'allPages'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);

    sinon.spy(errors, 'log');

    // act
    $selectAll.trigger('dxclick');

    // assert
    assert.strictEqual(errors.log.callCount, 1);
    assert.strictEqual(errors.log.lastCall.args[0], 'W1010', 'Warning about selectAllMode allPages and grouped data');
    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), false, 'selectAll checkbox value is not changed');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 0, 'items are not selected');


    // act
    $selectAll.trigger('dxclick');

    // assert
    assert.strictEqual(errors.log.callCount, 2);
    assert.strictEqual(errors.log.lastCall.args[0], 'W1010', 'Warning about selectAllMode allPages and grouped data');
    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), false, 'selectAll checkbox value is not changed');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 0, 'items are not selected');

    errors.log.restore();
});

QUnit.module('item select decorator with all selection mode');

QUnit.test('render selectAll item when showSelectedAll is true', function(assert) {
    const $list = $('#list').dxList({
        items: [],
        showSelectionControls: true,
        selectionMode: 'all',
        selectAllText: 'Test'
    });
    const $multipleContainer = $list.find(`.${LIST_SELECT_ALL_CLASS}`);

    assert.ok($multipleContainer.is(':hidden'), 'container for SelectAll is hidden');
});

QUnit.test('selectAll updated on init', function(assert) {
    const items = [0, 1];
    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);

    assert.strictEqual($checkbox.dxCheckBox('option', 'value'), false, 'selectAll updated after init');
});

QUnit.test('selectAll should be removed when editEnabled switched off', function(assert) {
    const $list = $('#list').dxList({
        items: [0, 1],
        showSelectionControls: false,
        selectionMode: 'all'
    });

    assert.strictEqual($list.find(`.${LIST_SELECT_ALL_CLASS}`).length, 0, 'selectAll not rendered');

    $list.dxList('option', 'showSelectionControls', true);
    assert.strictEqual($list.find(`.${LIST_SELECT_ALL_CLASS}`).length, 1, 'selectAll rendered');

    $list.dxList('option', 'showSelectionControls', false);
    assert.strictEqual($list.find(`.${LIST_SELECT_ALL_CLASS}`).length, 0, 'selectAll not rendered');
});

QUnit.test('selectAll selects all items', function(assert) {
    const items = [0, 1];

    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all'
    });

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    $checkbox.trigger('dxclick');

    assert.deepEqual($list.dxList('option', 'selectedItems'), items, 'all items selected');
});

QUnit.test('selectAll triggers callback when selects all items', function(assert) {
    const items = [0, 1];
    const selectAllSpy = sinon.spy();

    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all',
        onSelectAllValueChanged: selectAllSpy
    });

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    $checkbox.trigger('dxclick');

    assert.strictEqual(selectAllSpy.callCount, 1);
    assert.strictEqual(selectAllSpy.firstCall.args[0].value, true, 'all items selected');
});

QUnit.test('selectAll triggers changed callback when selects all items', function(assert) {
    const items = [0, 1];
    const selectAllSpy = sinon.spy();

    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all',
        onSelectAllValueChanged: noop
    });
    const list = $list.dxList('instance');

    list.option('onSelectAllValueChanged', selectAllSpy);
    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    $checkbox.trigger('dxclick');

    assert.strictEqual(selectAllSpy.callCount, 1);
});

QUnit.test('selectAll triggers selectAllValueChanged event when selects all items', function(assert) {
    const items = [0, 1];
    const selectAllSpy = sinon.spy();

    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const list = $list.dxList('instance');

    list.on('selectAllValueChanged', selectAllSpy);
    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    $checkbox.trigger('dxclick');

    assert.strictEqual(selectAllSpy.callCount, 1);
});

QUnit.test('selectAll unselect all items when all items selected', function(assert) {
    const items = [0, 1];
    const $list = $('#list').dxList({
        items: items,
        selectedItems: items.slice(),
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);

    $checkbox.trigger('dxclick');
    assert.strictEqual($list.dxList('option', 'selectedItems').length, 0, 'all items unselected');
});

QUnit.test('selectAll triggers callback when unselect all items when all items selected', function(assert) {
    const items = [0, 1];
    const $list = $('#list').dxList({
        items: items,
        selectedItems: items.slice(),
        showSelectionControls: true,
        selectionMode: 'all',
        onSelectAllValueChanged: (args) => {
            assert.strictEqual(args.value, false, 'all items selected');
        }
    });
    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);

    $checkbox.trigger('dxclick');
});

QUnit.test('selectAll selects all items when click on item', function(assert) {
    const items = [0, 1];
    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CLASS}`);

    $selectAll.trigger('dxclick');

    assert.deepEqual($list.dxList('option', 'selectedItems'), items, 'all items selected');
});

QUnit.test('selectAll selects all items when click on checkBox and selectionType is item', function(assert) {
    const items = [0, 1];
    const $list = $('#list').dxList({
        items: items,
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);

    $checkbox.trigger('dxclick');

    assert.deepEqual($list.dxList('option', 'selectedItems'), items, 'all items selected');
});

QUnit.test('selectAll checkbox is selected when all items selected', function(assert) {
    const $list = $('#list').dxList({
        items: [0, 1],
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $items = $list.find('.dx-list-item');

    $items.trigger('dxclick');

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    assert.strictEqual($checkbox.dxCheckBox('option', 'value'), true, 'selectAll checkbox selected');
});

QUnit.test('selectAll checkbox is selected when all items selected (ds w/o totalCount)', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4],
        pageSize: 4,
        paginate: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $items = $list.find('.dx-list-item');

    $items.trigger('dxclick');

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    assert.strictEqual($checkbox.dxCheckBox('option', 'value'), true, 'selectAll checkbox selected');
});

QUnit.test('selectAll checkbox is selected when all items selected (ds with totalCount)', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3, 4],
        pageSize: 4,
        paginate: true,
        requireTotalCount: true
    });
    const $list = $('#list').dxList({
        dataSource: ds,
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $items = $list.find('.dx-list-item');

    $items.trigger('dxclick');

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    assert.strictEqual($checkbox.dxCheckBox('option', 'value'), true, 'selectAll checkbox checked');
});

QUnit.test('selectAll checkbox has indeterminate state when not all items selected', function(assert) {
    const $list = $('#list').dxList({
        items: [0, 1],
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $items = $list.find('.dx-list-item');

    $items.trigger('dxclick'); // NOTE: select all
    $items.eq(0).trigger('dxclick'); // NOTE: unselect first

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    assert.strictEqual($checkbox.dxCheckBox('option', 'value'), undefined, 'selectAll checkbox has indeterminate state');
});

QUnit.test('selectAll checkbox is unselected when all items unselected', function(assert) {
    const $list = $('#list').dxList({
        items: [0, 1],
        showSelectionControls: true,
        selectionMode: 'all'
    });
    const $items = $list.find('.dx-list-item');

    $items.trigger('dxclick'); // NOTE: select all
    $items.trigger('dxclick'); // NOTE: unselect all

    const $checkbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    assert.strictEqual($checkbox.dxCheckBox('option', 'value'), false, 'selectAll checkbox is unselected');
});

QUnit.test('selectAll checkbox should be updated after load next page', function(assert) {
    const $list = $('#list').dxList({
        dataSource: new DataSource({
            store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            paginate: true,
            pageSize: 3
        }),
        pageLoadMode: 'nextButton',
        showSelectionControls: true,
        selectionMode: 'all'
    });

    const $selectAll = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`);
    $selectAll.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), true, 'selectAll checkbox is selected');

    const $moreButton = $list.find('.dx-list-next-button > .dx-button').eq(0);

    $moreButton.trigger('dxclick');

    assert.strictEqual($selectAll.dxCheckBox('option', 'value'), undefined, 'selectAll checkbox is selected');
});

QUnit.test('onContentReady event should be called after update the state Select All checkbox', function(assert) {
    const clock = sinon.useFakeTimers();
    const $list = $('#list').dxList({
        dataSource: {
            load: () => {
                const d = $.Deferred();

                setTimeout(() => {
                    d.resolve([0, 1]);
                }, 100);

                return d.promise();
            }
        },
        showSelectionControls: true,
        selectionMode: 'all',
        onContentReady: (e) => {
            $(e.element).find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`).dxCheckBox('instance').option('value', undefined);
        }
    });

    clock.tick(100);

    assert.ok($list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`).hasClass('dx-checkbox-indeterminate'), 'checkbox in an indeterminate state');

    clock.restore();
});

QUnit.module('onSelectionChanging', {
    beforeEach: function() {
        this.dataSource = new DataSource({
            store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            paginate: true,
            pageSize: 3
        });
    }
}, () => {
    QUnit.test('checkBox state should not be updated if selection is cancelled', function(assert) {
        const $list = $('#list').dxList({
            dataSource: this.dataSource,
            showSelectionControls: true,
            onSelectionChanging: (args) => {
                args.cancel = true;
            },
            selectionMode: 'multiple'
        });

        const $firstCheckbox = $list.find(`.${SELECT_CHECKBOX_CLASS}`).eq(0);
        $firstCheckbox.trigger('dxclick');

        assert.strictEqual($firstCheckbox.dxCheckBox('option', 'value'), false, 'checkbox is not checked');
    });

    QUnit.test('selectAll checkBox state should not be updated if selection is cancelled', function(assert) {
        const $list = $('#list').dxList({
            dataSource: this.dataSource,
            showSelectionControls: true,
            onSelectionChanging: (args) => {
                args.cancel = true;
            },
            selectionMode: 'all',
        });

        const $selectAllCheckbox = $list.find(`.${LIST_SELECT_ALL_CHECKBOX_CLASS}`).eq(0);
        $selectAllCheckbox.trigger('dxclick');

        assert.strictEqual($selectAllCheckbox.dxCheckBox('option', 'value'), false, 'selectAll checkbox is not checked');
        $selectAllCheckbox.trigger('dxclick');
        assert.strictEqual($selectAllCheckbox.dxCheckBox('option', 'value'), false, 'selectAll checkbox is not checked');
    });

    QUnit.test('radioButton state should not be updated if selection is cancelled', function(assert) {
        const $list = $('#list').dxList({
            dataSource: this.dataSource,
            showSelectionControls: true,
            onSelectionChanging: (args) => {
                args.cancel = true;
            },
            selectionMode: 'single'
        });

        const $firstRadioButton = $list.find(`.${SELECT_RADIO_BUTTON_CLASS}`).eq(0);
        $firstRadioButton.trigger('dxclick');

        assert.strictEqual($firstRadioButton.dxRadioButton('option', 'value'), false, 'radioButton is not checked');
    });
});


QUnit.module('item select decorator with single selection mode');

QUnit.test('item click changes radio button state only to true in single selection mode', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        showSelectionControls: true,
        selectionMode: 'single'
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);

    $item.trigger('dxclick');
    $item.trigger('dxclick');

    const radioButton = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(SELECT_RADIO_BUTTON_CLASS)).dxRadioButton('instance');

    assert.strictEqual(radioButton.option('value'), true, 'item selected');
});

QUnit.test('keyboard navigation should work with without selectAll checkbox', function(assert) {
    const $list = $('#templated-list').dxList({
        focusStateEnabled: true,
        items: ['0', '1'],
        showSelectionControls: true,
        selectionMode: 'single'
    });
    const instance = $list.dxList('instance');
    const keyboard = keyboardMock($list.find('[tabindex=0]'));

    keyboard
        .press('down')
        .press('enter');

    assert.deepEqual(instance.option('selectedItems'), ['1'], 'selection is correct');
});


QUnit.module('reordering decorator', {
    beforeEach: function() {
        fx.off = true;

        $('#qunit-fixture').addClass('qunit-fixture-visible');

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;

        $('#qunit-fixture').removeClass('qunit-fixture-visible');

        this.clock.restore();
    }
});

const REORDERING_ITEM_CLASS = 'dx-sortable-source-hidden';
const REORDERING_ITEM_GHOST_CLASS = 'dx-list-item-ghost-reordering';

const topTranslation = ($item) => {
    return translator.locate($item).top;
};

QUnit.test('sortable options', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true }
    });

    const sortable = $list.find('.dx-sortable').dxSortable('instance');

    assert.equal(sortable.option('dragDirection'), 'vertical', 'dragDirection');
    assert.equal(sortable.option('filter'), '> .dx-list-items > .dx-list-item', 'filter');
    assert.equal(sortable.option('handle'), '.dx-list-reorder-handle', 'handle');
    assert.equal(sortable.option('component'), $list.dxList('instance'), 'component');
});

QUnit.test('sortable options for grouped List', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [{
            key: 'Group 1',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        }],
        grouped: true,
        itemDragging: { allowReordering: true }
    });

    const sortable = $list.find('.dx-sortable').dxSortable('instance');


    assert.equal(sortable.option('dragDirection'), 'vertical', 'dragDirection');
    assert.equal(sortable.option('filter'), '> .dx-list-items > .dx-list-group > .dx-list-group-body > .dx-list-item', 'filter');
    assert.equal(sortable.option('handle'), '.dx-list-reorder-handle', 'handle');
    assert.equal(sortable.option('component'), $list.dxList('instance'), 'component');
});

QUnit.test('sortable filter is correct after "grouped" option changed', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true }
    });
    const instance = $list.dxList('instance');

    instance.option({
        items: [{
            key: 'Group 1',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        }],
        grouped: true
    });

    let sortable = $list.find('.dx-sortable').dxSortable('instance');
    const groupedFilter = '> .dx-list-items > .dx-list-group > .dx-list-group-body > .dx-list-item';
    const simpleFilter = '> .dx-list-items > .dx-list-item';

    assert.strictEqual(sortable.option('filter'), groupedFilter, 'correct grouped filter');

    instance.option({
        items: ['0'],
        grouped: false
    });
    sortable = $list.find('.dx-sortable').dxSortable('instance');

    assert.strictEqual(sortable.option('filter'), simpleFilter, 'correct simple filter');
});

QUnit.test('no sortable without allowReordering', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0']
    });

    assert.strictEqual($list.find('.dx-sortable').length, 0, 'no sortable');
});

QUnit.test('sortable should be created with itemDragging.allowItemReordering option', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: {
            allowReordering: true
        }
    });

    const sortable = $list.find('.dx-sortable').dxSortable('instance');

    assert.ok(sortable, 'sortable is created');
    assert.strictEqual(sortable.option('allowReordering'), true, 'allowReordering is true');
});

QUnit.test('sortable should be created with option itemDragging.allowDropInsideItem', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowDropInsideItem: true }
    });

    const sortable = $list.find('.dx-sortable').dxSortable('instance');

    assert.ok(sortable, 'sortable is created');
    assert.strictEqual(sortable.option('allowDropInsideItem'), true, 'allowDropInsideItem is true');
    assert.strictEqual(sortable.option('allowReordering'), false, 'allowReordering is true');
});

QUnit.test('passing itemDragging options to sortable if group is defined', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: {
            group: 'myGroup'
        }
    });

    const sortable = $list.find('.dx-sortable').dxSortable('instance');

    assert.equal(sortable.option('group'), 'myGroup', 'group parameter is passed');
    assert.strictEqual(sortable.option('allowReordering'), false, 'allowReordering is false by default');
    assert.equal(sortable.option('dragDirection'), 'both', 'dragDirection is both if group is defined');
});

QUnit.test('reordering class should be present on item during drag', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);
    this.clock.tick(10);
    assert.ok($item.hasClass(REORDERING_ITEM_CLASS), 'class was added');
    pointer.dragEnd();
    assert.ok(!$item.hasClass(REORDERING_ITEM_CLASS), 'class was removed');
});

QUnit.test('reordering should not be possible if item disabled', function(assert) {
    const $list = $('#templated-list').dxList({
        items: [{ text: '0', disabled: true }],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);
    assert.ok(!$item.hasClass(REORDERING_ITEM_CLASS), 'class was not added');
});

QUnit.test('list item should be duplicated on drag start', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);

    this.clock.tick(10);
    let $ghostItem = $list.find(toSelector(REORDERING_ITEM_GHOST_CLASS));
    assert.strictEqual($ghostItem.text(), $item.text(), 'correct item was duplicated');
    assert.strictEqual($ghostItem.offset().top, $item.offset().top + 10, 'correct ghost position');
    assert.ok(!$ghostItem.hasClass(REORDERING_ITEM_CLASS), 'reordering class is not present');

    pointer.dragEnd();
    $ghostItem = $list.find(toSelector(REORDERING_ITEM_GHOST_CLASS));
    assert.strictEqual($items.length, 1, 'duplicate item was removed');
});

// T859557
QUnit.test('list item duplicate should inherit direction (rtl)', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true },
        rtlEnabled: true
    });

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);

    this.clock.tick(10);
    let $ghostItem = $list.find(toSelector(REORDERING_ITEM_GHOST_CLASS));
    assert.strictEqual($ghostItem.text(), $item.text(), 'correct item was duplicated');
    assert.strictEqual($ghostItem.offset().top, $item.offset().top + 10, 'correct ghost position');
    assert.ok(!$ghostItem.hasClass(REORDERING_ITEM_CLASS), 'reordering class is not present');

    assert.equal($ghostItem.css('direction'), 'rtl', 'direction is rtl');
    assert.ok($ghostItem.parent().hasClass('dx-rtl'), 'ghost\'s parent has dx-rtl class');

    pointer.dragEnd();
    $ghostItem = $list.find(toSelector(REORDERING_ITEM_GHOST_CLASS));
    assert.strictEqual($items.length, 1, 'duplicate item was removed');
});

QUnit.test('cached items doesn\'t contains a ghost item after reordering', function(assert) {
    const $list = $('#list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const list = $list.dxList('instance');
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const pointer = reorderingPointerMock($items.first(), this.clock);

    pointer.dragStart(0.5).drag(0.6);
    this.clock.tick(10);
    pointer.dragEnd();

    const cachedItems = list._itemElements();

    assert.strictEqual(cachedItems.length, 3, 'Cached items contains 3 items');
    assert.notOk(cachedItems.hasClass(REORDERING_ITEM_GHOST_CLASS), 'Cached items isn\'t contain a ghost item');
});

QUnit.test('ghost item should be moved by drag', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(10);

    this.clock.tick(10);
    const $ghostItem = $list.find(toSelector(REORDERING_ITEM_GHOST_CLASS));
    const startPosition = topTranslation($ghostItem.parent());

    pointer.drag(20);
    assert.strictEqual(topTranslation($ghostItem.parent()), startPosition + 20, 'ghost item was moved');

    pointer.dragEnd();
});

QUnit.test('item position should be reset after drag', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item = $items.eq(0);
    const pointer = reorderingPointerMock($item, this.clock, true);

    pointer.dragStart().drag(0, 10);
    assert.strictEqual(topTranslation($item), 0, 'position reset');
});

QUnit.test('next item should be moved', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item0 = $items.eq(0);
    const $item1 = $items.eq(1);
    const $item2 = $items.eq(2);
    const pointer = reorderingPointerMock($item1, this.clock);
    const item0Position = $item0.position();
    const item1Position = $item1.position();
    const item2Position = $item2.position();

    pointer.dragStart(0.5).drag(0.5);
    assert.deepEqual($item0.position(), item0Position, 'first item was not moved');
    assert.deepEqual($item2.position(), item2Position, 'third item was not moved');

    pointer.drag(0.5);
    assert.deepEqual($item0.position(), item0Position, 'first item was not moved');
    assert.deepEqual($item2.position(), item1Position, 'third item was moved to position of second item');
});

QUnit.test('prev item should be moved', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item0 = $items.eq(0);
    const $item1 = $items.eq(1);
    const $item2 = $items.eq(2);
    const pointer = reorderingPointerMock($item1, this.clock);
    const item0Position = $item0.position();
    const item1Position = $item1.position();
    const item2Position = $item2.position();

    pointer.dragStart(0.5).drag(-0.6);
    assert.deepEqual($item0.position(), item0Position, 'first item was not moved');
    assert.deepEqual($item2.position(), item2Position, 'third item was not moved');

    pointer.drag(-0.5);
    assert.deepEqual($item0.position(), item1Position, 'first item was moved to position of second item');
    assert.deepEqual($item2.position(), item2Position, 'third item was not moved');
});

QUnit.test('next item should be moved back if item moved to start position', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item0 = $items.eq(0);
    const $item1 = $items.eq(1);
    const $item2 = $items.eq(2);
    const pointer = reorderingPointerMock($item1, this.clock);
    const item0Position = $item0.position();
    const item2Position = $item2.position();

    pointer.dragStart(0.5).drag(0.6).drag(-0.2);
    assert.deepEqual($item0.position(), item0Position, 'first item was not moved');
    assert.deepEqual($item2.position(), item2Position, 'third item was moved to position of first item');
});

QUnit.test('prev item should be moved back if item moved to start position', function(assert) {
    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item0 = $items.eq(0);
    const $item1 = $items.eq(1);
    const $item2 = $items.eq(2);
    const pointer = reorderingPointerMock($item1, this.clock);
    const item0Position = $item0.position();
    const item2Position = $item2.position();

    pointer.dragStart(0.5).drag(-0.6).drag(0.2);
    assert.deepEqual($item0.position(), item0Position, 'first item was not moved');
    assert.deepEqual($item2.position(), item2Position, 'third item was moved to position of first item');
});

QUnit.test('item should be moved with animation', function(assert) {
    fx.off = false;

    const $list = $('#templated-list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item1 = $items.eq(1);
    const pointer = reorderingPointerMock($item1, this.clock);

    pointer.dragStart(0.5).drag(1);
    assert.strictEqual($items.get(2).style.transitionDuration, '300ms', 'animation present');
});

QUnit.test('drop item should reorder list items with correct indexes', function(assert) {
    const $list = $('#list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const list = $list.dxList('instance');

    list.reorderItem = (itemElement, toItemElement) => {
        assert.strictEqual(itemElement.text(), $item1.text());
        assert.strictEqual(toItemElement.text(), $item2.text());
    };

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item1 = $items.eq(1);
    const $item2 = $items.eq(2);
    const pointer = reorderingPointerMock($item1, this.clock);

    pointer.dragStart(0.5).drag(1);
    this.clock.tick(10);
    pointer.dragEnd();
});

QUnit.test('reordering should correctly handle items contains List widget', function(assert) {
    const $list = $('#list').dxList({
        items: [
            '0',
            '1',
            {
                template: (data, index, container) => $('<div>').appendTo(container).dxList({ items: ['2-1', '2-2'] })
            },
            '3',
            '4',
            '5'
        ],
        itemDragging: { allowReordering: true }
    });
    const list = $list.dxList('instance');

    list.reorderItem = (itemElement, toItemElement) => {
        assert.strictEqual(itemElement.text(), $item1.text());
        assert.strictEqual(toItemElement.text(), $item2.text());
    };

    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item1 = $items.eq(1);
    const $item2 = $items.eq(2);
    const pointer = reorderingPointerMock($item1, this.clock);

    pointer.dragStart(0.5).drag(2);
    this.clock.tick(10);
    pointer.dragEnd();
});

QUnit.test('items should reset positions after dragend', function(assert) {
    const $list = $('#list').dxList({
        items: ['0', '1', '2'],
        itemDragging: { allowReordering: true }
    });
    const $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item1 = $items.eq(1);
    const pointer = reorderingPointerMock($item1, this.clock);

    pointer.dragStart(0.5).drag(0.6).dragEnd();

    $.each($items, (index, item) => {
        const $item = $(item);

        assert.deepEqual(topTranslation($item), 0, 'position reset');
    });
});

// T856292
QUnit.test('Drag and drop item to the top of the list should not work when allowReordering is false', function(assert) {
    const $list = $('#list').dxList({
        items: ['0', '1', '2'],
        itemDragging: {
            allowReordering: false,
            group: 'shared'
        }
    });

    let $items = $list.find(toSelector(LIST_ITEM_CLASS));
    const $item3 = $items.eq(2);
    const pointer = reorderingPointerMock($item3, this.clock);

    pointer.dragStart(0.5).drag(-1).drag(-1.5).dragEnd();

    $items = $list.find(toSelector(LIST_ITEM_CLASS));
    $.each($items, (index, item) => {
        const $item = $(item);

        assert.equal($item.text(), index, 'item text');
    });
});

QUnit.test('sortable should be updated after rendering on scroll bottom', function(assert) {
    const onItemRenderedSpy = sinon.spy();
    const $list = $('#list').dxList({
        pageLoadMode: 'scrollBottom',
        dataSource: {
            store: [1, 2, 3, 4],
            pageSize: 2
        },
        itemDragging: {
            allowReordering: true
        },
        onItemRendered: onItemRenderedSpy
    });

    assert.deepEqual(onItemRenderedSpy.callCount, 2, 'rendered item count');

    const sortable = $list.find('.dx-sortable').dxSortable('instance');
    const updateSpy = sinon.spy(sortable, 'update');

    $list.dxScrollView('option', 'onReachBottom')();

    assert.strictEqual(updateSpy.callCount, 1, 'sortable.update is called once');
    assert.ok(updateSpy.lastCall.calledAfter(onItemRenderedSpy.lastCall), 'update is called after items change');
    assert.deepEqual(onItemRenderedSpy.callCount, 4, 'rendered item count');
});
