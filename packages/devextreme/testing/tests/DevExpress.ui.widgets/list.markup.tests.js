import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import List from 'ui/list';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';
import localization from 'localization';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="list"></div>\
        <div id="widthRootStyle"></div>\
        <div id="templated-list">\
            <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
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

    QUnit.test('Group should have aria-labelledby attribute equal to caption id', function(assert) {
        const $list = $('#list').dxList({
            items: [
                {
                    key: 'a',
                    items: ['0', '1']
                }
            ],
            grouped: true,
        });

        const $groups = $list.find(`.${LIST_GROUP_CLASS}`);
        const $caption = $groups.eq(0).find(`.${LIST_GROUP_HEADER_CLASS}`);

        assert.strictEqual($groups.length, 1);
        assert.ok($groups.get(0).hasAttribute('aria-labelledby'), 'group has aria-labelledby attribute');
        assert.strictEqual($groups.eq(0).attr('aria-labelledby'), $caption.eq(0).attr('id'), 'aria-labelledby and id of caption are equal');
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
    QUnit.module('Aria accessibility', {
        beforeEach: function() {
            helper = new ariaAccessibilityTestHelper({
                createWidget: ($element, options) => new List($element,
                    $.extend({
                        items: [{ text: 'Item_1' }, { text: 'Item_2' }, { text: 'Item_3' }],
                    }, options))
            });
            const localizedRoleDescription = 'My Custom List';
            localization.loadMessages({ 'en': { 'dxList-ariaRoleDescription': localizedRoleDescription } });

            this.clock = sinon.useFakeTimers();
            this.expectedContainerAttrs = {
                tabindex: '0',
                role: 'application',
            };
            this.expectedItemsContainerAttrs = {
                role: 'listbox',
                'aria-label': 'Items',
            };
            this.expectedListAttrs = {
                role: 'group',
                'aria-roledescription': localizedRoleDescription,
            };
        },
        afterEach: function() {
            this.clock.restore();
            helper.$widget.remove();
        }
    }, () => {
        [true, false].forEach((searchEnabled) => {
            QUnit.test('Selected: [], selectionMode: "none"', function() {
                helper.createWidget({ searchEnabled });

                helper.checkAttributes(helper.$itemContainer, this.expectedContainerAttrs);
                helper.checkAttributes(helper.getListContainer(), this.expectedItemsContainerAttrs);
                helper.checkAttributes(helper.$widget, this.expectedListAttrs);
                helper.checkItemsAttributes([], { role: 'option' });
            });

            QUnit.test('Selected: ["Item_2"], change searchEnabled after initialize', function() {
                helper.createWidget({
                    searchEnabled,
                    selectedItemKeys: ['Item_2'],
                    keyExpr: 'text',
                    selectionMode: 'single'
                });
                helper.widget.option('searchEnabled', !searchEnabled);

                helper.checkAttributes(helper.$itemContainer, this.expectedContainerAttrs);
                helper.checkAttributes(helper.getListContainer(), this.expectedItemsContainerAttrs);
                helper.checkAttributes(helper.$widget, this.expectedListAttrs);
                helper.checkItemsAttributes([1], { attributes: ['aria-selected'], role: 'option' });
            });

            QUnit.test('Selected: ["Item_2"], selectionMode: "single"', function() {
                helper.createWidget({
                    searchEnabled,
                    selectedItemKeys: ['Item_2'],
                    keyExpr: 'text',
                    selectionMode: 'single'
                });

                helper.checkAttributes(helper.$itemContainer, this.expectedContainerAttrs);
                helper.checkAttributes(helper.getListContainer(), this.expectedItemsContainerAttrs);
                helper.checkAttributes(helper.$widget, this.expectedListAttrs);
                helper.checkItemsAttributes([1], { attributes: ['aria-selected'], role: 'option' });
            });

            QUnit.test('Selected: ["Item_2", "Item_3"], selectionMode: "multiple"', function() {
                helper.createWidget({
                    searchEnabled,
                    selectedItemKeys: ['Item_2', 'Item_3'],
                    keyExpr: 'text',
                    selectionMode: 'multiple'
                });

                helper.checkAttributes(helper.$itemContainer, this.expectedContainerAttrs);
                helper.checkAttributes(helper.getListContainer(), this.expectedItemsContainerAttrs);
                helper.checkAttributes(helper.$widget, this.expectedListAttrs);
                helper.checkItemsAttributes([1, 2], { attributes: ['aria-selected'], role: 'option' });
            });

            QUnit.test('Selected: ["Item_1"] -> set focusedElement -> clean focusedElement', function() {
                helper.createWidget({
                    searchEnabled,
                    selectedItemKeys: ['Item_1'],
                    keyExpr: 'text',
                    selectionMode: 'single'
                });

                helper.widget.option('focusedElement', helper.getItems().eq(0));
                helper.checkAttributes(helper.$itemContainer, { ...this.expectedContainerAttrs, 'aria-activedescendant': helper.focusedItemId });
                helper.checkAttributes(helper.getListContainer(), this.expectedItemsContainerAttrs);
                helper.checkItemsAttributes([0], { attributes: ['aria-selected'], focusedItemIndex: 0, role: 'option' });

                helper.widget.option('focusedElement', null);
                helper.checkAttributes(helper.$itemContainer, this.expectedContainerAttrs);
                helper.checkAttributes(helper.getListContainer(), this.expectedItemsContainerAttrs);
                helper.checkItemsAttributes([0], { attributes: ['aria-selected'], role: 'option' });
            });
        });

        ['items', 'dataSource'].forEach(dataSourcePropertyName => {
            QUnit.test(`list focusable element should have aria-label if data source is set with ${dataSourcePropertyName} property`, function(assert) {
                helper.createWidget({ items: [] });

                assert.strictEqual(helper.getListContainer().attr('aria-label'), undefined);

                helper.widget.option(dataSourcePropertyName, [1, 2, 3]);
                assert.strictEqual(helper.getListContainer().attr('aria-label'), 'Items');

                helper.widget.option(dataSourcePropertyName, []);
                assert.strictEqual(helper.getListContainer().attr('aria-label'), undefined);
            });

            QUnit.test(`list should have correct role if data sourse is set with ${dataSourcePropertyName} property`, function(assert) {
                helper.createWidget({ items: [] });

                assert.strictEqual(helper.getListContainer().attr('role'), undefined);

                helper.widget.option(dataSourcePropertyName, [1, 2, 3]);
                assert.strictEqual(helper.getListContainer().attr('role'), 'listbox');

                helper.widget.option(dataSourcePropertyName, []);
                assert.strictEqual(helper.getListContainer().attr('role'), undefined);
            });
        });

        QUnit.test('noDataText should not be passed to aria-label of list\'s focusable element if data source is empty', function(assert) {
            const noDataText = 'Custom no data text';

            helper.createWidget({ noDataText, items: [] });

            assert.strictEqual(helper.getListContainer().attr('aria-label'), undefined);
        });

        QUnit.test('aria-label of empty list should be empty after noDataText option change', function(assert) {
            helper.createWidget({ items: [] });

            const noDataText = 'Custom no data text';
            helper.widget.option('noDataText', noDataText);

            assert.strictEqual(helper.getListContainer().attr('aria-label'), undefined);
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
const SELECT_ALL_CHECKBOX_CLASS = 'dx-list-select-all-checkbox';
const SELECT_ALL_CLASS = 'dx-list-select-all';
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

    QUnit.module('list item aria-label should be equal to item text (T1248422)', {
        beforeEach: function() {
            const init = (options = {}) => {
                this.$element = $('#list').dxList(options);
                this.instance = this.$element.dxList('instance');
            };

            init();

            this.reinit = (options) => {
                this.instance.dispose();

                init(options);
            };

            this.getItem = () => this.$element.find(`.${LIST_ITEM_CLASS}`).eq(0);

            this.checkAriaLabel = (assert, updatedItems) => {
                const { selectionMode, showSelectionControls } = this.instance.option();
                const isSelectionActive = selectionMode !== 'none' && showSelectionControls;

                assert.strictEqual(this.getItem().attr('aria-label'), isSelectionActive ? 'item 1' : undefined, 'aria-label is correct on init');

                this.instance.option({ items: updatedItems });

                assert.strictEqual(this.getItem().attr('aria-label'), isSelectionActive ? 'item 2' : undefined, 'aria-label is correct if items were changed in runtime');
            };
        },
    }, () => {
        [true, false].forEach(showSelectionControls => {
            [ 'multiple', 'single', 'all', 'none' ].forEach(selectionMode => {
                QUnit.test(`showSelectionControls is ${showSelectionControls}, selectionMode is ${selectionMode}, items is string, displayExpr is not specified`, function(assert) {
                    this.reinit({
                        showSelectionControls,
                        selectionMode,
                        items: ['item 1'],
                        displayExpr: null,
                    });

                    this.checkAriaLabel(assert, ['item 2']);
                });

                QUnit.test(`showSelectionControls is ${showSelectionControls}, selectionMode is ${selectionMode}, items is object, displayExpr is not specified`, function(assert) {
                    this.reinit({
                        showSelectionControls,
                        selectionMode,
                        items: [{ text: 'item 1' }],
                        displayExpr: null,
                    });

                    this.checkAriaLabel(assert, [{ text: 'item 2' }]);
                });

                QUnit.test(`showSelectionControls is ${showSelectionControls}, selectionMode is ${selectionMode}, items is object, displayExpr is specified`, function(assert) {
                    this.reinit({
                        showSelectionControls,
                        selectionMode,
                        items: [{ custom: 'item 1' }],
                        displayExpr: 'custom',
                    });

                    this.checkAriaLabel(assert, [{ custom: 'item 2' }]);
                });
            });
        });
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

        const $multipleContainer = $list.find(toSelector(SELECT_ALL_CLASS));
        assert.equal($multipleContainer.length, 1, 'container for SelectAll rendered');
        assert.equal($multipleContainer.text(), 'Test', 'select all rendered');
        const $checkbox = $multipleContainer.find('.dx-checkbox');
        assert.equal($checkbox.length, 1, 'checkbox rendered');
    });

    QUnit.test('selectAll text and aria-label attribute should be equal to custom localized text (T1239880)', function(assert) {
        const localizedSelectAllText = 'custom-select-all';
        localization.loadMessages({ 'en': { 'dxList-selectAll': localizedSelectAllText } });

        const $list = $($('#list').dxList({
            dataSource: [
                { id: 1, text: 'Item 1' },
                { id: 2, text: 'Item 2' },
                { id: 3, text: 'Item 3' },
            ],
            showSelectionControls: true,
            selectionMode: 'all',
        }));

        const $selectAllCheckBox = $list.find(toSelector(SELECT_ALL_CHECKBOX_CLASS));
        const $multipleContainer = $list.find(toSelector(SELECT_ALL_CLASS));

        assert.strictEqual($selectAllCheckBox.attr('aria-label'), localizedSelectAllText, 'selectAll checkbox aria-label should be equal to localized text');

        assert.strictEqual($multipleContainer.text(), 'custom-select-all', 'text should be equal to localized text');
        assert.strictEqual($multipleContainer.attr('aria-label'), `${localizedSelectAllText}, Not checked`, 'unchecked checkbox aria-label should be equal to localized text');
    });

    QUnit.test('item checkbox aria-label attribute should be equal to custom localized text (T1247518)', function(assert) {
        const localizedCheckStateText = 'custom-select-all';
        localization.loadMessages({ 'en': { 'CheckState': localizedCheckStateText } });

        const $list = $($('#list').dxList({
            dataSource: [
                { id: 1, text: 'Item 1' },
                { id: 2, text: 'Item 2' },
                { id: 3, text: 'Item 3' },
            ],
            showSelectionControls: true,
            selectionMode: 'all',
        }));
        const $itemCheckBox = $list.find(`.${SELECT_CHECKBOX_CLASS}`).eq(0);

        assert.strictEqual($itemCheckBox.attr('aria-label'), localizedCheckStateText, 'item checkbox aria-label is equal to localized text');
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
