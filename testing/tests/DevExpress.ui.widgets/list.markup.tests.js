import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import devices from 'core/devices';
import List from 'ui/list';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="list"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="templated-list">\
            <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const LIST_CLASS = 'dx-list';
const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_GROUP_CLASS = 'dx-list-group';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';
const LIST_GROUP_BODY_CLASS = 'dx-list-group-body';
const LIST_ITEM_BEFORE_BAG_CLASS = 'dx-list-item-before-bag';

const toSelector = cssClass => {
    return '.' + cssClass;
};

QUnit.module('List markup', {}, () => {
    QUnit.test('rendering empty message for empty list', function(assert) {
        const element = $('#list').dxList();
        assert.equal(element.find('.dx-empty-message').length, 1, 'empty message was rendered');
    });

    QUnit.test('default markup', function(assert) {
        const element = $('#list').dxList({ items: ['0', '1'] });
        assert.ok(element.hasClass(LIST_CLASS));

        const items = element.find(toSelector(LIST_ITEM_CLASS));
        assert.equal(items.length, 2);
        assert.ok(items.eq(0).hasClass(LIST_ITEM_CLASS));
        assert.ok(items.eq(1).hasClass(LIST_ITEM_CLASS));
        assert.equal($.trim(items.text()), '01', 'all items rendered');
    });

    QUnit.test('itemTemplate default', function(assert) {
        const element = $('#list').dxList({
            items: ['a', 'b'],
            itemTemplate(item, index) {
                return index + ': ' + item;
            }
        });

        const item = element.find(toSelector(LIST_ITEM_CLASS));

        assert.equal(item.eq(0).text(), '0: a');
        assert.equal(item.eq(1).text(), '1: b');
    });

    QUnit.test('itemTemplate returning string', function(assert) {
        const element = $('#list').dxList({
            items: ['a', 'b'],
            itemTemplate(item, index) {
                return index + ': ' + item;
            }
        });

        const item = element.find(toSelector(LIST_ITEM_CLASS));

        assert.equal(item.eq(0).text(), '0: a');
        assert.equal(item.eq(1).text(), '1: b');
    });

    QUnit.test('itemTemplate returning jquery', function(assert) {
        const element = $('#list').dxList({
            items: ['a'],
            itemTemplate(item, index) {
                return $('<span class=\'test\' />');
            }
        });

        const item = element.children();
        assert.ok(item.find('span.test').length);
    });

    QUnit.test('rendering empty message for empty grouplist', function(assert) {
        const element = $('#list').dxList({
            grouped: true
        });
        assert.equal(element.find('.dx-empty-message').length, 1, 'empty message was rendered');
    });

    QUnit.test('groupTemplate default', function(assert) {
        const element = $('#list').dxList({
            items: [
                {
                    key: 'group1',
                    items: ['0', '1']
                },
                {
                    key: 'group2',
                    items: ['2']
                }
            ],
            grouped: true
        });

        const groups = element.find(toSelector(LIST_GROUP_CLASS));
        assert.equal(groups.length, 2);

        const groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
        assert.equal(groupHeaders.length, 2);

        assert.equal(groupHeaders.eq(0).text(), 'group1');
        assert.equal(groupHeaders.eq(1).text(), 'group2');

        const items = element.find(toSelector(LIST_ITEM_CLASS));
        assert.equal(items.length, 3);
    });

    QUnit.test('groupTemplate returning string', function(assert) {
        const element = $('#list').dxList({
            items: [
                {
                    key: 'a',
                    items: ['0', '1']
                },
                {
                    key: 'b',
                    items: ['2']
                }
            ],

            grouped: true,

            groupTemplate(group, index, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                return index + ': ' + group.key;
            }
        });

        const groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
        assert.equal(groupHeaders.eq(0).text(), '0: a');
        assert.equal(groupHeaders.eq(1).text(), '1: b');
    });

    QUnit.test('groupTemplate returning jquery', function(assert) {
        const element = $('#list').dxList({
            items: [
                {
                    key: 'a',
                    items: ['0', '1']
                }
            ],

            grouped: true,

            groupTemplate(group, index, element) {
                assert.equal(isRenderer(element), !!config().useJQuery, 'element is correct');
                return $('<span />');
            }
        });

        const groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
        assert.ok(groupHeaders.find('span').length);
    });

    QUnit.test('items of group should be in a group body', function(assert) {
        const $element = $('#list').dxList({
            items: [{ key: 'a', items: ['0'] }],
            grouped: true
        });

        const $group = $element.find('.' + LIST_GROUP_CLASS);
        const $groupBody = $group.children('.' + LIST_GROUP_BODY_CLASS);

        assert.equal($groupBody.length, 1, 'group items wrapper exists');
        assert.equal($groupBody.children('.' + LIST_ITEM_CLASS).length, 1, 'there are items in items wrapper');
    });

    QUnit.test('next button showing', function(assert) {
        $('#list').dxList({
            dataSource: {
                store: [1, 2, 3],
                pageSize: 2
            },
            pageLoadMode: 'nextButton'
        }).dxList('instance');
        const nextButton = $('.dx-list-next-button ', this.element);

        assert.equal(nextButton.length, 1, 'nextButton is showed');
    });
});

QUnit.module('widget sizing render', {}, () => {
    QUnit.test('constructor', function(assert) {
        const $element = $('#list').dxList({ items: [1, 2, 3, 4], width: 400 });
        const instance = $element.dxList('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element[0].style.width, 400 + 'px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxList({ items: [1, 2, 3, 4] });
        const instance = $element.dxList('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, 300 + 'px', 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('nested rendering', {}, () => {
    QUnit.test('plain list with nested list should contain correct items', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');
        const instance = new List($element, {
            items: [1, 2],
            itemTemplate(data, index, container) {
                const $nestedElement = $('<div>').appendTo(container);
                new List($nestedElement, {
                    items: [1, 2]
                });
            }
        });

        assert.equal(instance.itemElements().length, 2, 'correct items count');
    });

    QUnit.test('grouped list with nested list should contain correct items', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');
        const instance = new List($element, {
            grouped: true,
            items: [{ key: 1, items: [1] }, { key: 2, items: [2] }],
            itemTemplate(data, index, container) {
                const $nestedElement = $('<div>').appendTo(container);
                new List($nestedElement, {
                    grouped: true,
                    items: [{ key: 1, items: [1] }, { key: 2, items: [2] }]
                });
            }
        });

        assert.equal(instance.itemElements().length, 2, 'correct items count');
    });
});

let helper;
if(devices.real().deviceType === 'desktop') {
    [true, false].forEach((searchEnabled) => {
        QUnit.module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
            beforeEach: function() {
                helper = new ariaAccessibilityTestHelper({
                    createWidget: ($element, options) => new List($element,
                        $.extend({
                            items: [{ text: 'Item_1' }, { text: 'Item_2' }, { text: 'Item_3' }],
                            searchEnabled: searchEnabled
                        }, options))
                });
                this.clock = sinon.useFakeTimers();
            },
            afterEach: function() {
                this.clock.restore();
                helper.$widget.remove();
            }
        }, () => {
            QUnit.test('Selected: [], selectionMode: "none"', function() {
                helper.createWidget();

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'listbox', tabindex: '0' });
                helper.checkAttributes(searchEnabled ? helper.$widget : helper.$itemContainer, { });
                helper.checkItemsAttributes([], { role: 'option' });
            });

            QUnit.test('Selected: ["Item_2"], change searchEnabled after initialize', function() {
                helper.createWidget({ selectedItemKeys: ['Item_2'], keyExpr: 'text', selectionMode: 'single' });
                helper.widget.option('searchEnabled', !searchEnabled);

                helper.checkAttributes(!searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'listbox', tabindex: '0' });
                helper.checkAttributes(!searchEnabled ? helper.$widget : helper.$itemContainer, {});
                helper.checkItemsAttributes([1], { attributes: ['aria-selected'], role: 'option' });
            });

            QUnit.test('Selected: ["Item_2"], selectionMode: "single"', function() {
                helper.createWidget({ selectedItemKeys: ['Item_2'], keyExpr: 'text', selectionMode: 'single' });

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'listbox', tabindex: '0' });
                helper.checkAttributes(searchEnabled ? helper.$widget : helper.$itemContainer, {});
                helper.checkItemsAttributes([1], { attributes: ['aria-selected'], role: 'option' });
            });

            QUnit.test('Selected: ["Item_2", "Item_3"], selectionMode: "multiple"', function() {
                helper.createWidget({ selectedItemKeys: ['Item_2', 'Item_3'], keyExpr: 'text', selectionMode: 'multiple' });

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'listbox', tabindex: '0' });
                helper.checkAttributes(searchEnabled ? helper.$widget : helper.$itemContainer, { });
                helper.checkItemsAttributes([1, 2], { attributes: ['aria-selected'], role: 'option' });
            });

            QUnit.test('Selected: ["Item_1"] -> set focusedElement -> clean focusedElement', function() {
                helper.createWidget({ selectedItemKeys: ['Item_1'], keyExpr: 'text', selectionMode: 'single' });

                helper.widget.option('focusedElement', helper.getItems().eq(0));
                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'listbox', 'aria-activedescendant': helper.focusedItemId, tabindex: '0' });
                helper.checkItemsAttributes([0], { attributes: ['aria-selected'], focusedItemIndex: 0, role: 'option' });

                helper.widget.option('focusedElement', null);
                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: 'listbox', tabindex: '0' });
                helper.checkItemsAttributes([0], { attributes: ['aria-selected'], role: 'option' });
            });
        });
    });
}

QUnit.module('searching', {}, () => {
    QUnit.test('searchEnabled', function(assert) {
        const $element = $('#list').dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true
        });

        assert.ok($element.hasClass('dx-list-with-search'), 'list with search');
        assert.ok($element.children().first().hasClass('dx-list-search'), 'has search editor');
    });
});

const STATIC_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-static-delete-button-container';
const STATIC_DELETE_BUTTON_CLASS = 'dx-list-static-delete-button';
const TOGGLE_DELETE_SWITCH_CLASS = 'dx-list-toggle-delete-switch';
const TOGGLE_DELETE_SWITCH_ICON_CLASS = 'dx-icon-toggle-delete';
const SELECT_CHECKBOX_CONTAINER_CLASS = 'dx-list-select-checkbox-container';
const SELECT_CHECKBOX_CLASS = 'dx-list-select-checkbox';
const SELECT_RADIO_BUTTON_CONTAINER_CLASS = 'dx-list-select-radiobutton-container';
const SELECT_RADIO_BUTTON_CLASS = 'dx-list-select-radiobutton';
const REORDER_HANDLE_CONTAINER_CLASS = 'dx-list-reorder-handle-container';
const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';

QUnit.module('decorators markup', {}, () => {
    QUnit.test('list item markup, static delete decorator', function(assert) {
        const $list = $($('#list').dxList({
            items: ['0', '1', '2'],
            allowItemDeleting: true,
            itemDeleteMode: 'static'
        }));

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);

        const $button = $item.find(toSelector(STATIC_DELETE_BUTTON_CLASS));

        assert.equal($button.length, 1, 'delete button was rendered');
        assert.ok($button.parent().hasClass(STATIC_DELETE_BUTTON_CONTAINER_CLASS), 'delete button was rendered in correct container');
        assert.equal($list.find(toSelector(STATIC_DELETE_BUTTON_CLASS)).length, 3, 'delete button was rendered for all items');
    });

    QUnit.test('list item markup, toggle delete decorator', function(assert) {
        const $list = $($('#templated-list').dxList({
            items: ['0'],
            allowItemDeleting: true,
            itemDeleteMode: 'toggle'
        }));

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);

        const $deleteToggle = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS)).children(toSelector(TOGGLE_DELETE_SWITCH_CLASS));
        assert.ok($deleteToggle.length, 'toggle generated');
        assert.ok($deleteToggle.find(toSelector(TOGGLE_DELETE_SWITCH_ICON_CLASS)).length, 'toggle icon generated');
    });

    QUnit.test('list item delete icon is visible when showSelectionControls=true (T966717)', function(assert) {
        const $list = $('#templated-list').dxList({
            items: ['0'],
            allowItemDeleting: true,
            showSelectionControls: true,
            selectionMode: 'multiple',
            itemDeleteMode: 'toggle'
        });

        const $item = $list.find(`.${LIST_ITEM_CLASS}`).eq(0);
        const $deleteToggleIcon = $item.find(`.${TOGGLE_DELETE_SWITCH_ICON_CLASS}`).get(0);

        assert.notStrictEqual(window.getComputedStyle($deleteToggleIcon).backgroundImage, 'none', 'background image is defined');
    });

    QUnit.test('list item markup, item select decorator', function(assert) {
        const $list = $($('#templated-list').dxList({
            items: ['0'],
            showSelectionControls: true,
            selectionMode: 'multiple'
        }));

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const $checkboxContainer = $item.children(toSelector(LIST_ITEM_BEFORE_BAG_CLASS));
        const $checkbox = $checkboxContainer.children(toSelector(SELECT_CHECKBOX_CLASS));

        assert.ok($checkboxContainer.hasClass(SELECT_CHECKBOX_CONTAINER_CLASS), 'container has proper class');
        assert.ok($checkbox.hasClass('dx-checkbox'), 'select generated');
    });

    QUnit.test('list item markup, item select decorator with single selection mode', function(assert) {
        const $list = $($('#templated-list').dxList({
            items: ['0'],
            showSelectionControls: true,
            selectionMode: 'single'
        }));

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const $radioButtonContainer = $item.children(toSelector(SELECT_RADIO_BUTTON_CONTAINER_CLASS));
        const $radioButton = $radioButtonContainer.children(toSelector(SELECT_RADIO_BUTTON_CLASS));

        assert.ok($radioButton.hasClass('dx-radiobutton'), 'radio button generated');
    });

    QUnit.test('render selectAll item when showSelectedAll is true, item select decorator with selectAll selection mode', function(assert) {
        const $list = $($('#list').dxList({
            items: [0],
            showSelectionControls: true,
            selectionMode: 'all',
            selectAllText: 'Test'
        }));

        const $multipleContainer = $list.find('.dx-list-select-all');
        assert.equal($multipleContainer.length, 1, 'container for SelectAll rendered');
        assert.equal($multipleContainer.text(), 'Test', 'select all rendered');
        const $checkbox = $multipleContainer.find('.dx-checkbox');
        assert.equal($checkbox.length, 1, 'checkbox rendered');
    });

    QUnit.test('list item markup should be correct, reordering decorator', function(assert) {
        const $list = $($('#templated-list').dxList({
            items: ['0'],
            itemDragging: {
                allowReordering: true
            }
        }));

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.eq(0);
        const $handleContainer = $item.children(toSelector(REORDER_HANDLE_CONTAINER_CLASS));
        const $handle = $handleContainer.children(toSelector(REORDER_HANDLE_CLASS));

        assert.equal($handleContainer.length, 1, 'container generated');
        assert.equal($handle.length, 1, 'handle generated');
    });

    QUnit.test('displayExpr option should work', function(assert) {
        const $list = $('#list').dxList({
            items: [{ name: 'Item 1', id: 1 }],
            displayExpr: 'name'
        });

        const $items = $list.find(toSelector(LIST_ITEM_CLASS));

        assert.strictEqual($items.text(), 'Item 1', 'displayExpr works');
    });
});
