import $ from 'jquery';
import { noop } from 'core/utils/common';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import registerComponent from 'core/component_registrator';
import { DataSource } from 'common/data/data_source/data_source';
import Store from 'data/abstract_store';
import ArrayStore from 'common/data/array_store';
import { setTemplateEngine } from 'core/templates/template_engine_registry';
import support from '__internal/core/utils/m_support';
import holdEvent from 'common/core/events/hold';
import CollectionWidget from 'ui/collection/ui.collection_widget.edit';
import List from 'ui/list';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

const ITEM_CLASS = 'dx-item';
const ITEM_CONTENT_CLASS = `${ITEM_CLASS}-content`;
const DEFAULT_EMPTY_TEXT = 'No data to display';
const EMPTY_MESSAGE_CLASS = 'dx-empty-message';
const COLLECTION_CLASS = 'dx-collection';
const FOCUSED_ITEM_CLASS = 'dx-state-focused';
const ACTIVE_ITEM_CLASS = 'dx-state-active';
const ITEM_CUSTOM_CLASS = 'item';

const { module, test, testInActiveWindow } = QUnit;

class TestComponent extends CollectionWidget {
    constructor(element, options) {
        super(element, options);
        this.NAME = 'TestComponent';
        this._activeStateUnit = '.item';
    }

    _itemClass() { return ITEM_CUSTOM_CLASS; }
    _itemDataKey() { return '123'; }
    _itemContainer() { return this.$element(); }
    _allowDynamicItemsAppend() { return true; }

    _createActionByOption(optionName, config) {
        this.__actionConfigs = !this.__actionConfigs ? {} : this.__actionConfigs;
        this.__actionConfigs[optionName] = config;
        return super._createActionByOption(...arguments);
    }
}

QUnit.testStart(() => {
    const markup = `
        <div id="cmp"></div>

        <div id="cmp-with-template">
            <div data-options="dxTemplate : { name: 'testTemplate' } ">
                First Template
            </div>
        </div>

        <div id="cmp-with-zero-template">
            <div data-options="dxTemplate: { name: '0' }">zero</div>
        </div>

        <script type="text/html" id="externalTemplate">
            Test
        </script>

        <script type="text/html" id="externalTemplateNoRootElement">
            Outer text <div>Test</div>
        </script>

        <div id="container-with-jq-template">
            <div data-options="dxTemplate : { name: 'firstTemplate' } ">
                First Template
            </div>
            <div data-options="dxTemplate : { name: 'secondTemplate' } ">
                Second Template
            </div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});

import './collectionWidgetParts/editingTests.js';
import './collectionWidgetParts/liveUpdateTests.js';

module('render', {
    beforeEach: function() {
        this.element = $('#cmp');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
    }
}, () => {

    test('markup init', function(assert) {
        const element = this.element;
        new TestComponent(element, {});

        assert.ok(element.hasClass(COLLECTION_CLASS), 'collection widget has dx-collection class');
    });

    test('item content should be wrapped', function(assert) {
        const element = this.element;
        const component = new TestComponent(element, { items: [1] });

        const $item = component.itemElements().eq(0);
        const $itemContent = $item.children();

        assert.ok($item.hasClass(ITEM_CLASS), 'item has correct class');
        assert.ok($item.hasClass('item'), 'item has correct specific class');
        assert.equal($itemContent.length, 1, 'item content only one');
        assert.ok($itemContent.hasClass(ITEM_CONTENT_CLASS), 'item content has correct class');
        assert.ok($itemContent.hasClass('item-content'), 'content has correct specific class');
        assert.equal($itemContent.contents().text(), '1', 'item content placed inside content');
    });

    test('custom render func, returns jquery. Items: [{ prop: 0 }, { prop: 1 }, { prop: 2 }]', function(assert) {
        const element = this.element;
        const $container = $('#cmp');
        new TestComponent($container, {
            items: [{
                testProp: 0
            }, {
                testProp: 1
            }, {
                testProp: 2
            }],
            itemTemplate(item, index, itemElement) {
                assert.ok($(itemElement).hasClass(ITEM_CONTENT_CLASS), 'content class added');
                return $('<span />').html('Text is: ' + String(item.testProp) + ';');
            }
        });

        assert.equal(element.find('.item').length, 3);
        assert.equal($.trim(element.text()), 'Text is: 0;Text is: 1;Text is: 2;');
    });

    test('custom render func, returns jquery. Items: [{ prop: 3 }, { prop: 4 }, { prop: 5 }]', function(assert) {
        const element = this.element;
        const $container = $('#cmp');

        new TestComponent($container, {
            items: [{
                testProp: 3
            }, {
                testProp: 4
            }, {
                testProp: 5
            }],
            itemTemplate(item, index, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElemenet is correct');
                $(itemElement).append($('<span />').html('Text is: ' + String(item.testProp) + ';'));
            }
        });

        assert.equal(element.find('.item').length, 3);
        assert.equal($.trim(element.text()), 'Text is: 3;Text is: 4;Text is: 5;');
    });

    test('custom render func, returns dom node', function(assert) {
        const element = this.element;
        const $container = $('#cmp');

        new TestComponent($container, {
            integrationOptions: {
                templates: {
                    'item': {
                        render(args) {
                            const $element = $('<span>')
                                .addClass('dx-template-wrapper')
                                .text('Text is: ' + String(args.model.testProp) + ';');

                            return $element.get(0);
                        }
                    }
                }
            },
            items: [{
                testProp: 3
            }, {
                testProp: 4
            }, {
                testProp: 5
            }]
        });

        assert.equal(element.find('.item').length, 3);
        assert.equal($.trim(element.text()), 'Text is: 3;Text is: 4;Text is: 5;');
    });

    test('custom render func, returns string', function(assert) {
        const element = this.element;
        const $container = $('#cmp');

        new TestComponent($container, {
            items: [{
                testProp: '0'
            }, {
                testProp: '1'
            }, {
                testProp: ''
            }],
            itemTemplate(item, index, itemElement) {
                return 'Text is: ' + String(item.testProp) + ';';
            }
        });

        assert.equal(element.find('.item').length, 3);
        assert.equal($.trim(element.text()), 'Text is: 0;Text is: 1;Text is: ;');
    });

    test('custom render func, returns numbers', function(assert) {
        const element = this.element;
        const $container = $('#cmp');

        new TestComponent($container, {
            items: [0, 1],
            itemRender(item, index, itemElement) {
                return item;
            }
        });

        assert.equal(element.find('.item').length, 2);
        assert.equal($.trim(element.text()), '01');
    });

    test('itemTemplateProperty option', function(assert) {
        const $element = $('#cmp-with-template');

        const instance = new TestComponent(
            $element, {
                itemTemplateProperty: 'itemTemplate',
                items: [{ itemTemplate: 'testTemplate' }]
            });

        const $item = instance.itemElements().eq(0);
        assert.equal($.trim($item.text()), 'First Template', 'item has correct template');
    });

    test('useItemTextAsTitle as primitive', function(assert) {
        const $element = $('#cmp-with-template');
        const instance = new TestComponent(
            $element, {
                useItemTextAsTitle: true,
                items: [1]
            });

        const $item = instance.itemElements().eq(0);
        assert.strictEqual($item.attr('title'), '1', 'title is correct');

        instance.option('useItemTextAsTitle', false);
        assert.strictEqual(instance.itemElements().eq(0).attr('title'), undefined, 'title was removed');
    });

    test('useItemTextAsTitle as object', function(assert) {
        const $element = $('#cmp-with-template');
        const instance = new TestComponent(
            $element, {
                useItemTextAsTitle: true,
                items: [{ name: 'Test', id: 1 }],
                displayExpr: 'name'
            });

        const $item = instance.itemElements().eq(0);
        assert.strictEqual($item.attr('title'), 'Test', 'title is correct');
    });

    test('item takes new template', function(assert) {
        const $container1 = $('#cmp-with-template');
        const componentWithTemplate = new TestComponent($container1, { itemTemplate: 'testTemplate' });
        const $container2 = $('#cmp');
        const component = new TestComponent($container2, { itemTemplate: componentWithTemplate._getTemplateByOption('itemTemplate') });
        assert.equal(component._getTemplateByOption('itemTemplate'), componentWithTemplate._getTemplateByOption('itemTemplate'));
    });

    test('anonymous item template', function(assert) {
        const $element = $('<div>').append($('<div>').addClass('test'));

        new TestComponent($element, {
            items: [1, 2]
        });

        assert.equal($element.find('.test').length, 2);
    });

    test('\'itemTemplate\' as DOM node', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate: $('<div>Test</div>').get(0)
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), 'Test');
        assert.equal($.trim($element.children().eq(1).text()), 'Test');
    });

    test('\'itemTemplate\' as jQuery element', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate: $('<div>Test</div>')
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), 'Test');
        assert.equal($.trim($element.children().eq(1).text()), 'Test');
    });

    test('\'itemTemplate\' as jQuery element with custom template engine', function(assert) {
        setTemplateEngine({
            compile: noop,
            render() {
                return $('<div>custom engine</div>');
            }
        });

        try {
            const $element = $('#cmp');

            new TestComponent($element, {
                items: [1, 2],
                itemTemplate: $('<div>')
            });

            assert.equal($element.children().length, 2);
            assert.equal($.trim($element.children().eq(0).text()), 'custom engine');
            assert.equal($.trim($element.children().eq(1).text()), 'custom engine');
        } finally {
            setTemplateEngine('default');
        }
    });

    test('\'itemTemplate\' as function returning template name', function(assert) {
        const $element = $('#cmp-with-template');

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate() {
                return 'testTemplate';
            }
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), 'First Template');
        assert.equal($.trim($element.children().eq(1).text()), 'First Template');
    });

    test('\'itemTemplate\' as function returning template name that is not string', function(assert) {
        const $element = $('#cmp-with-zero-template');

        new TestComponent($element, {
            items: [0],
            itemTemplate() {
                return 0;
            }
        });

        assert.equal($.trim($element.find('.' + ITEM_CONTENT_CLASS).eq(0).text()), 'zero');
    });

    test('\'itemTemplate\' as function returning string', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [0],
            itemTemplate() {
                return '0';
            }
        });

        assert.equal($.trim($element.find('.' + ITEM_CONTENT_CLASS).eq(0).text()), '0');
    });

    test('\'itemTemplate\' as function returning template DOM node', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate() {
                return $('<div>Test</div>').get(0);
            }
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), 'Test');
        assert.equal($.trim($element.children().eq(1).text()), 'Test');
    });

    test('\'itemTemplate\' as function returning template jQuery element', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1],
            itemTemplate() {
                return $('<div>Test</div>');
            }
        });

        assert.equal($.trim($element.find('.' + ITEM_CONTENT_CLASS).children().text()), 'Test');
    });

    test('\'itemTemplate\' as script element', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1],
            itemTemplate: $('#externalTemplate')
        });

        assert.equal($.trim($element.find('.' + ITEM_CONTENT_CLASS).html()), 'Test');
    });

    test('\'itemTemplate\' as script element (no root element)', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1, 2],
            itemTemplate: $('#externalTemplateNoRootElement')
        });

        assert.equal($element.children().length, 2);
        assert.equal($.trim($element.children().eq(0).text()), 'Outer text Test');
        assert.equal($.trim($element.children().eq(1).text()), 'Outer text Test');
    });

    test('\'itemTemplate\' as script element (no root element) with string renderer in template engine (T161432)', function(assert) {
        setTemplateEngine({
            compile(element) {
                return element.html();
            },
            render(template, data) {
                return template;
            }
        });

        try {
            const $element = $('#cmp');

            new TestComponent($element, {
                items: [1, 2],
                itemTemplate: $('#externalTemplateNoRootElement')
            });

            assert.equal($element.children().length, 2);
            assert.equal($.trim($element.children().eq(0).text()), 'Outer text Test');
            assert.equal($.trim($element.children().eq(1).text()), 'Outer text Test');
        } finally {
            setTemplateEngine('default');
        }
    });

    test('itemTemplate should get correct index for second page', function(assert) {
        const itemTemplateMethod = sinon.spy();
        const $element = $('#cmp');

        const ds = new DataSource({
            store: new ArrayStore({
                key: 'id',
                data: [{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }]
            }),
            pageSize: 1
        });

        const component = new TestComponent($element, {
            dataSource: ds,
            itemTemplate: itemTemplateMethod
        });

        component._loadNextPage();

        assert.equal(itemTemplateMethod.getCall(1).args[1], 1, 'index is correct');
    });

    test('data item indices should be recalculated after item delete', function(assert) {
        const component = new TestComponent($('#cmp'), {
            items: ['Item 1', 'Item 2', 'Item 3']
        });

        component.deleteItem(component.itemElements().eq(0));

        const $itemElements = component.itemElements();

        assert.equal($itemElements.eq(0).data('dxItemIndex'), 0, 'second item became first');
        assert.equal($itemElements.eq(0).data('123'), 'Item 2', 'first item text is correct');

        assert.equal($itemElements.eq(1).data('dxItemIndex'), 1, 'third item became second');
        assert.equal($itemElements.eq(1).data('123'), 'Item 3', 'second item text is correct');
    });

    test('No data text message - no items and source', function(assert) {
        const $container = $('#cmp');

        const component = new TestComponent($container, {});
        assert.equal(component.$element().find('.' + EMPTY_MESSAGE_CLASS).length, 1);
    });

    test('No data text message - empty items', function(assert) {
        const list = new List(this.element);

        list.option('items', null);
        assert.equal(this.element.find('.' + EMPTY_MESSAGE_CLASS).length, 1);

        list.option('items', []);
        assert.equal(this.element.find('.' + EMPTY_MESSAGE_CLASS).length, 1);

        list.option('items', [1]);
        assert.equal(this.element.find('.' + EMPTY_MESSAGE_CLASS).length, 0);
    });

    test('No data text message - empty dataSource', function(assert) {
        executeAsyncMock.setup();
        const $container = $('#cmp');

        new TestComponent($container, {
            dataSource: {
                store: new ArrayStore([])
            }
        });

        assert.equal(this.element.find('.' + EMPTY_MESSAGE_CLASS).length, 1);

        this.element.empty().dxList({
            dataSource: {
                store: new ArrayStore([1])
            }
        });

        assert.equal(this.element.find('.' + EMPTY_MESSAGE_CLASS).length, 0);
    });

    test('No data text message - value', function(assert) {
        const $container = $('#cmp');

        new TestComponent($container);
        assert.equal(this.element.find('.' + EMPTY_MESSAGE_CLASS).text(), DEFAULT_EMPTY_TEXT);
    });

    test('No data text message - custom value', function(assert) {
        let noDataText = 'noDataText';
        const $container = $('#cmp');

        const component = new TestComponent($container, {
            noDataText
        });

        assert.equal(component.$element().find('.' + EMPTY_MESSAGE_CLASS).text(), noDataText);

        noDataText = noDataText + '123';
        component.option({ noDataText });
        assert.equal(component.$element().find('.' + EMPTY_MESSAGE_CLASS).text(), noDataText);
    });

    test('No data text message - custom value with link, encodeNoDataText: false', function(assert) {
        let noDataText = '<a href="javascript:alert(1)">link</a>';
        const $container = $('#cmp');

        const component = new TestComponent($container, {
            noDataText,
            encodeNoDataText: false,
        });

        assert.strictEqual(component.$element().find('.' + EMPTY_MESSAGE_CLASS).html(), noDataText);

        noDataText = noDataText + 'no data';
        component.option({ noDataText });
        assert.strictEqual(component.$element().find('.' + EMPTY_MESSAGE_CLASS).html(), noDataText);
    });

    test('No data text message - custom value with link, encodeNoDataText: true', function(assert) {
        let noDataText = '<a href="javascript:alert(1)">link</a>';
        const encodedNoDataText = '&lt;a href="javascript:alert(1)"&gt;link&lt;/a&gt;';
        const $container = $('#cmp');

        const component = new TestComponent($container, {
            noDataText,
            encodeNoDataText: true,
        });

        assert.strictEqual(component.$element().find('.' + EMPTY_MESSAGE_CLASS).html(), encodedNoDataText);

        noDataText = noDataText + 'no data';
        component.option({ noDataText });
        assert.strictEqual(component.$element().find('.' + EMPTY_MESSAGE_CLASS).html(), encodedNoDataText + 'no data');
    });

    test('message element is not rendered if no data text is null, \'\', false', function(assert) {
        const $container = $('#cmp');

        const component = new TestComponent($container, {
            noDataText: null
        });

        assert.equal(component.$element().find('.' + EMPTY_MESSAGE_CLASS).length, 0);

        component.option({ noDataText: false });
        assert.equal(component.$element().find('.' + EMPTY_MESSAGE_CLASS).length, 0);

        component.option({ noDataText: '' });
        assert.equal(component.$element().find('.' + EMPTY_MESSAGE_CLASS).length, 0);
    });

    test('No data message may contain HTML markup', function(assert) {
        const $container = $('#cmp');

        const component = new TestComponent($container, {
            noDataText: '<div class="custom">No data custom</div>'
        });

        const $noDataContainer = component.$element().find('.' + EMPTY_MESSAGE_CLASS);

        assert.equal($noDataContainer.find('.custom').length, 1, 'custom HTML markup is present');
    });

    test('B235442 - \'No data to display\' blinks while items loading ', function(assert) {
        const store = new ArrayStore([0, 1, 3, 4]);
        const source = new DataSource(store);
        const el = this.element;

        new TestComponent(el, {
            dataSource: source
        });

        assert.equal(el.find('.' + EMPTY_MESSAGE_CLASS).length, 0);
    });

    test('B235884 - \'No data\' no show ', function(assert) {
        const deferred = $.Deferred();
        const el = this.element;

        const component = new TestComponent(el, {
            dataSource: {
                load() {
                    return deferred.promise();
                }
            }
        });

        assert.equal(el.find('.' + EMPTY_MESSAGE_CLASS).length, 0, '\'No data\' absent, loading now');
        assert.ok(component._dataSource.isLoading());

        deferred.resolve([]);
        assert.ok(!component._dataSource.isLoading());

        assert.equal(el.find('.' + EMPTY_MESSAGE_CLASS).length, 1, '\'No data\' shown');
    });

    test('render items with multiple templates, jquery scenario', function(assert) {
        const $element = $('#container-with-jq-template');
        const testSet = ['First Template', 'Second Template', 'eraser', 'abc', 'pencil', 'First Template'];

        new TestComponent($element, {
            items: [
                {
                    text: 'book',
                    template: 'firstTemplate'
                },
                {
                    text: 'pen',
                    template: 'secondTemplate'
                },
                {
                    text: 'eraser' // no template - use default
                },
                {
                    text: 'note', // not defined template - render template name
                    template: 'abc'
                },
                {
                    text: 'pencil', // null-defined template - use default
                    template: null
                },
                {
                    text: 'liner',
                    template: 'firstTemplate'
                }
            ]
        });

        const $items = $element.find('.item');
        assert.equal($items.length, testSet.length, 'quantity of a test set items and rendered items are equal');

        $items.each(function(index) {
            assert.equal($.trim($(this).text()), testSet[index]);
        });
    });

    test('onContentReady should be fired after if dataSource isn\'t empty', function(assert) {
        let count = 0;
        const $container = $('#cmp');

        new TestComponent($container, {
            onContentReady() {
                count++;
            },
            dataSource: [1]
        });

        assert.equal(count, 1, 'onContentReady fired after dataSource load');
    });

    test('onContentReady should be fired after if dataSource is empty', function(assert) {
        let count = 0;
        const $container = $('#cmp');

        new TestComponent($container, {
            onContentReady() {
                count++;
            },
            dataSource: []
        });

        assert.equal(count, 1, 'onContentReady fired after dataSource load');
    });

    test('onContentReady should be fired after if items isn\'t empty', function(assert) {
        let count = 0;
        const $container = $('#cmp');

        new TestComponent($container, {
            onContentReady() {
                count++;
            },
            items: [1]
        });

        assert.equal(count, 1, 'onContentReady fired');
    });

    test('onContentReady should be fired after if items is empty', function(assert) {
        let count = 0;
        const $container = $('#cmp');

        new TestComponent($container, {
            onContentReady() {
                count++;
            },
            items: []
        });

        assert.equal(count, 1, 'onContentReady fired');
    });

    test('item.visible property changing should not re-render whole item (T259051)', function(assert) {
        const $container = $('#cmp');

        const instance = new TestComponent($container, {
            items: [{ text: '1' }]
        });

        const $item = instance.$element().find('.item');

        instance.option('items[0].visible', true);
        assert.ok($item.is(instance.$element().find('.item')));
    });

    test('item.disabled property changing should not re-render whole item', function(assert) {
        const $container = $('#cmp');

        const instance = new TestComponent($container, {
            items: [{ text: '1' }]
        });

        const $item = instance.$element().find('.item');

        instance.option('items[0].disabled', true);
        assert.ok($item.is(instance.$element().find('.item')));
    });

    test('_getSummaryItemsSize function returns right width', function(assert) {
        const $container = $('#cmp');

        const instance = new TestComponent($container, {
            items: [
                { template: $('<div class="test-width">').css('width', '20px').css('padding-left', '7px') },
                { template: $('<div class="test-width">').css('width', '10px').css('margin-left', '5px') },
            ]
        });

        assert.equal(instance._getSummaryItemsSize('width', $('#cmp .test-width')), 37, 'done');
        assert.equal(instance._getSummaryItemsSize('width', $('#cmp .test-width'), true), 42, 'done');
    });

    test('_getSummaryItemsSize function returns right height', function(assert) {
        const $container = $('#cmp');

        const instance = new TestComponent($container, {
            items: [
                { template: $('<div class="test-height">').css('height', '20px').css('padding-top', '7px') },
                { template: $('<div class="test-height">').css('height', '10px').css('margin-top', '5px') },
            ]
        });

        assert.equal(instance._getSummaryItemsSize('height', $('#cmp .test-height')), 37, 'done');
        assert.equal(instance._getSummaryItemsSize('height', $('#cmp .test-height'), true), 42, 'done');
    });
});

module('events', {
    beforeEach: function() {
        registerComponent('TestComponent', TestComponent);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        $.fn['TestComponent'] = null;
        this.clock.restore();
    }
}, () => {
    test('onItemClick should be fired when item is clicked', function(assert) {
        let actionFired;
        let actionData;

        const $element = $('#cmp');

        new TestComponent($element, {
            items: ['0', '1', '2'],
            onItemClick(args) {
                actionFired = true;
                actionData = args;
            }
        });

        const $item = $element.find('.item').eq(1);

        $item.trigger('dxclick');
        assert.ok(actionFired, 'action fired');
        assert.equal(isRenderer(actionData.itemElement), !!config().useJQuery, 'correct element passed');
        assert.strictEqual($(actionData.itemElement)[0], $item[0], 'correct element passed');
        assert.strictEqual(actionData.itemData, '1', 'correct element passed');
        assert.strictEqual(actionData.itemIndex, 1, 'correct element itemIndex passed');
    });

    test('onItemClick should have correct item index when placed near another collection', function(assert) {
        let actionData;

        const $element = $('#cmp');

        new TestComponent($element, {
            items: ['0', '1', '2'],
            onItemClick(args) {
                actionData = args;
            }
        });

        const $item = $element.find('.item').eq(1);

        new TestComponent($('<div>').insertBefore($element), {
            items: ['0', '1', '2']
        });

        $item.trigger('dxclick');
        assert.strictEqual(actionData.itemIndex, 1, 'correct element itemIndex passed');
    });

    test('item should not have active-state class after click, if it is disabled', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            activeStateEnabled: true,
            items: [{ text: '0', disabled: true }, '1', '2'],
        });

        const $item = $element.find('.item').eq(0);
        const pointer = pointerMock($item);

        pointer.start().down();
        this.clock.tick(30);
        assert.ok(!$item.hasClass(ACTIVE_ITEM_CLASS), 'active state was not toggled for disabled item');
    });

    test('item should not have focus-state class after focusin by mousedown event, if it is disabled', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [{ text: '0', disabled: true }, '1', '2'],
        });

        const $item = $element.find('.item').eq(0);

        $item.trigger('dxpointerdown');
        this.clock.tick();

        assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), 'focus state was not toggled for disabled item');
    });

    test('Action should be fired when item is held', function(assert) {
        let actionFired;
        let actionData;

        const $element = $('#cmp');

        new TestComponent($element, {
            items: ['0'],
            onItemHold(args) {
                actionFired = true;
                actionData = args;
            }
        });

        const $item = $element.find('.item');

        $item.trigger(holdEvent.name);
        assert.ok(actionFired, 'action fired');
        assert.strictEqual($item[0], $(actionData.itemElement)[0], 'correct element passed');
        assert.strictEqual(actionData.itemData, '0', 'correct element passed');
    });

    test('onItemHold should be fired when action changed dynamically', function(assert) {
        let actionFired;

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: ['0']
        });

        const $item = $element.find('.item');

        instance.option('onItemHold', args => {
            actionFired = true;
        });
        $item.trigger(holdEvent.name);
        assert.ok(actionFired, 'action fired');
    });

    test('itemHold event should be fired', function(assert) {
        let actionFired;

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: ['0']
        });

        const $item = $element.find('.item');

        instance.on('itemHold', args => {
            actionFired = true;
        });
        $item.trigger(holdEvent.name);
        assert.ok(actionFired, 'action fired');
    });

    test('itemHoldTimeout should be passed to hold event', function(assert) {
        let actionFired;
        const $element = $('#cmp');

        new TestComponent($element, {
            items: ['0'],
            itemHoldTimeout: 100,
            onItemHold(args) {
                actionFired = true;
            }
        });

        const $item = $element.find('.item');
        const pointer = pointerMock($item);

        pointer.start().down().wait(100);
        this.clock.tick(100);
        pointer.up();
        assert.ok(actionFired, 'action fired');
    });

    test('onItemContextMenu should be fired when item is held or right clicked', function(assert) {
        let actionFired;
        let actionData;

        const $element = $('#cmp');

        new TestComponent($element, {
            items: ['0'],
            onItemContextMenu(args) {
                actionFired = true;
                actionData = args;
            }
        });

        const $item = $element.find('.item');

        $item.trigger('dxcontextmenu');
        assert.ok(actionFired, 'action fired');
        assert.strictEqual($item[0], $(actionData.itemElement)[0], 'correct element passed');
        assert.strictEqual(actionData.itemData, '0', 'correct element passed');
    });

    test('itemContextMenu event should be fired when item is held or right clicked', function(assert) {
        let actionFired;
        let actionData;
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: ['0']
        });

        instance.on('itemContextMenu', args => {
            actionFired = true;
            actionData = args;
        });
        const $item = $element.find('.item');

        $item.trigger('dxcontextmenu');
        assert.ok(actionFired, 'action fired');
        assert.strictEqual($item[0], $(actionData.itemElement)[0], 'correct element passed');
        assert.strictEqual(actionData.itemData, '0', 'correct element passed');
    });

    test('onItemContextMenu should be fired when action changed dynamically', function(assert) {
        let actionFired;

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: ['0']
        });

        const $item = $element.find('.item');

        instance.option('onItemContextMenu', args => {
            actionFired = true;
        });
        $item.trigger(holdEvent.name);

        if(support.touch) {
            assert.ok(actionFired, 'action fired');
        } else {
            assert.ok(!actionFired, 'action was not fired');
        }
    });

    test('hold should not be handled if onItemHold or onItemContextMenu is not specified', function(assert) {
        let actionFired;

        const $element = $('#cmp');

        new TestComponent($element, {
            items: ['0'],
            onItemClick(args) {
                actionFired = true;
            }
        });

        const $item = $element.find('.item');
        const pointer = pointerMock($item);

        pointer.start().down().wait(2000);
        this.clock.tick(2000);
        pointer.up();
        assert.ok(actionFired, 'action fired');
    });

    test('click on selected item does not fire option change if selectionRequired option is true', function(assert) {
        let actionFired = false;

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: ['0', '1'],
            selectedIndex: 0,
            selectionRequired: true,
            selectionMode: 'single'
        });

        const $item = $element.find('.item').first();

        instance.option('onOptionChanged',
            args => {
                if(args.name !== 'onOptionChanged') {
                    actionFired = true;
                }
            });

        $item.trigger('dxclick');
        assert.ok(!actionFired, 'option does not change');
    });

    test('\'onItemRendered\' event should be fired with correct arguments', function(assert) {
        const items = ['item 0'];
        let eventTriggered;
        let eventData;
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items,
            onItemRendered(e) {
                eventTriggered = true;
                eventData = e;
            }
        });

        const $item = $element.find('.item')[0];

        assert.ok(eventTriggered, 'action fired');
        assert.strictEqual($(eventData.itemElement)[0], $item, 'itemElement is correct');
        assert.strictEqual(eventData.itemData, items[0], 'itemData is correct');
        assert.equal(eventData.itemIndex, 0, 'itemIndex is correct');

        assert.equal(instance.__actionConfigs.onItemRendered.category, 'rendering', 'action category is \'rendering\'');
    });

    test('onClick option in item', function(assert) {
        let itemClicked = 0;
        const item = {
            text: 'test',
            onClick(e) {
                itemClicked++;
                args = e;
            }
        };
        let args;
        const $component = $('#cmp');
        const component = new TestComponent($component, {
            items: [item]
        });

        const $item = $component.find('.item');
        $item.trigger('dxclick');

        assert.equal(itemClicked, 1, 'click fired');
        assert.equal(args.component, component, 'component provided');
        assert.equal(args.itemData, item, 'item data provided');
        assert.equal(args.itemIndex, 0, 'item index provided');
        assert.ok(args.event, 'jQuery event provided');
        assert.ok(args.itemElement, 'item element provided');
    });

    QUnit.test('dxpointerdown event should call changing focused item', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [1, 2],
        });

        const $secondItem = $element.find(`.${ITEM_CUSTOM_CLASS}`).eq(1);

        $secondItem.trigger('dxpointerdown');
        this.clock.tick(10);
        assert.strictEqual($secondItem.hasClass(FOCUSED_ITEM_CLASS), true);
    });
});

module('option change', () => {
    test('changing onItemRendered should not fire refresh', function(assert) {
        const instance = new TestComponent($('#cmp'), { items: [1, 2, 3] });
        let itemsReRendered = false;

        instance.option('onItemRendered', function(assert) {
            itemsReRendered = true;
        });
        assert.ok(!itemsReRendered, 'items does not refreshed');
    });

    test('user defined selectedItem with null value should be more important than default selected index', function(assert) {
        const TestCollection = CollectionWidget.inherit({
            NAME: 'TestCollection',
            _getDefaultOptions() {
                return $.extend(this.callBase(), {
                    selectedIndex: 0
                });
            }
        });

        const instance = new TestCollection($('#cmp'), {
            items: [1, 2, 3],
            selectionMode: 'multiple',
            selectedItem: null
        });

        assert.equal(instance.option('selectedIndex'), -1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItemKeys'), [], 'selectedItemKeys are correct');
        assert.equal($('#cmp').find('.dx-item-selected').length, 0, 'there is no selected item');
    });
});

module('items via markup', {
    beforeEach: function() {
        registerComponent('dxTestComponent', TestComponent);
    },
    afterEach: function() {
        delete $.fn['dxTestComponent'];
    }
}, () => {
    test('item property changing should not re-render whole widget', function(assert) {
        const contentReadySpy = sinon.spy();
        const $container = $('#cmp');

        const component = new TestComponent($container, {
            items: [{ visible: false }],
            onContentReady: contentReadySpy
        });

        component.option('items[0].visible', true);
        assert.equal(contentReadySpy.callCount, 1);
    });

    test('dxItem should not be modified', function(assert) {
        const $element = $('#cmp');
        const dxItemString = 'dxItem: {}';

        const $innerItem = $('<div>').attr('data-options', dxItemString).text('test');
        $innerItem.appendTo($element);
        const component = new TestComponent($element, {});

        assert.equal(component.option('items').length, 1, 'item was added');
        assert.equal($innerItem.attr('data-options'), dxItemString, 'item was not changed');
    });

    test('dxItem with custom parser', function(assert) {
        const originalParser = config().optionsParser;
        config({ optionsParser: JSON.parse });
        const $element = $('#cmp');
        const dxItemString = '{ "dxItem": {} }';

        const $innerItem = $('<div>').attr('data-options', dxItemString).text('test');
        $innerItem.appendTo($element);
        let component;
        try {
            component = new TestComponent($element, {});
        } finally {
            config({ optionsParser: originalParser });
        }

        assert.equal(component.option('items').length, 1, 'item was added');
        assert.equal($innerItem.attr('data-options'), dxItemString, 'item was not changed');
    });
});

module('keyboard navigation', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test('loopItemFocus option test', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            focusStateEnabled: true,
            loopItemFocus: true,
            items: [0, 1, 2, 3, 4]
        });

        const $items = $element.find('.item');
        const $lastItem = $items.last();
        const $firstItem = $items.first();
        const keyboard = keyboardMock($element);

        $element.focusin();
        keyboard.keyDown('left');
        assert.ok($lastItem.hasClass(FOCUSED_ITEM_CLASS), 'press left arrow on first item change focused item on last (focus is looping)');

        instance.option('loopItemFocus', false);
        keyboard.keyDown('right');
        assert.ok(!$firstItem.hasClass(FOCUSED_ITEM_CLASS), 'focus is not looping when option loopItemFocus set to false');
    });

    test('onItemClick fires on enter and space', function(assert) {
        assert.expect(2);

        let itemClicked = 0;
        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0'],
            onItemClick(args) {
                itemClicked++;
            }
        });

        const $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        $item.trigger('dxpointerdown');
        this.clock.tick();
        keyboard.keyDown('enter');
        assert.equal(itemClicked, 1, 'press enter on item call item click action');

        keyboard.keyDown('space');
        assert.equal(itemClicked, 2, 'press space on item call item click action');
    }),

    test('enter press should replace event target and currentTarget properties with item native element', function(assert) {
        const handler = sinon.stub();
        const $element = $('#cmp');
        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0'],
            onItemClick: handler
        });

        const $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        keyboard.press('enter');
        const event = handler.getCall(0).args[0].event;
        assert.strictEqual(event.target, $item.get(0), 'event target is correct');
        assert.strictEqual(event.currentTarget, $item.get(0), 'event target is correct');
    }),

    test('default page scroll should be prevented for space key', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0'],
            onItemClick(args) {
                assert.ok(args.event.isDefaultPrevented(), 'default scroll is prevented');
            }
        });

        $element.find('.item').eq(0).trigger('dxpointerdown');
        this.clock.tick();

        keyboardMock($element).keyDown('space');
    }),

    test('focused item changed after press right/left arrows', function(assert) {
        assert.expect(3);

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        let $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        keyboard.keyDown('right');

        $item = $item.next();
        assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press right arrow on item change focused item on next');

        keyboard.keyDown('left');
        $item = $item.prev();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press left arrow on item change focused item on prev');
    }),

    test('focused item changed after press right/left arrows for rtl', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            rtlEnabled: true,
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        let $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        $item.trigger('dxpointerdown');
        this.clock.tick();

        keyboard.keyDown('left');
        $item = $item.next();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press left arrow on item change focused item on prev');

        keyboard.keyDown('right');
        $item = $item.prev();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press right arrow on item change focused item on next');
    }),

    test('focused item changed after press up/down arrows', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });

        let $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        $item.trigger('dxpointerdown');
        this.clock.tick();

        keyboard.keyDown('down');
        $item = $item.next();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press down arrow on item change focused item on next');

        keyboard.keyDown('up');
        $item = $item.prev();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press up arrow on item change focused item on prev');
    }),

    test('focused item changed on next not hidden item after press left/right', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            selectedIndex: 3
        });

        const $items = $element.find('.item');
        let $item = $items.eq(3);
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        $element.find('.item').eq(3).trigger('dxpointerdown');
        this.clock.tick();

        $items.eq(2).toggle(false);
        keyboard.keyDown('left');
        $item = $items.eq(1);
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'next not hidden item has focused class after press left when next item is hidden');

        keyboard.keyDown('right');
        $item = $items.eq(3);
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'next not hidden item has focused class after press right when next item is hidden');
    });

    test('focused item cycle', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2]
        });

        let $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        $item.trigger('dxpointerdown');
        this.clock.tick();

        keyboard.keyDown('up');
        $item = $element.find('.item').last();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press up arrow on first item change focused item on last');

        keyboard.keyDown('down');
        $item = $element.find('.item').first();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press down arrow on last item change focused item on first');
    }),

    test('focused item changed after press pageUp/Down', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });

        let $item = $element.find('.item').eq(0);
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        $item.trigger('dxpointerdown');
        this.clock.tick();

        keyboard.keyDown('pagedown');
        $item = $item.next();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press pageDown on item change focused item on next');

        keyboard.keyDown('pageup');
        $item = $item.prev();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press pageUp on item change focused item on prev');
    }),

    test('focused item changed after press home/end', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });

        const $items = $element.find('.item');
        let $item = $items.eq(0);
        const keyboard = keyboardMock($element);

        $element.focusin();
        $item.trigger('dxpointerdown');
        this.clock.tick();
        keyboard.keyDown('end');
        $item = $items.last();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press end on item change focused item on next');

        keyboard.keyDown('home');
        $item = $items.first();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'press home on item change focused item on prev');
    }),

    test('focused item changed on last but one after press home/end if last is hidden', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });

        const $items = $element.find('.item');
        let $item = $items.eq(0);
        const keyboard = keyboardMock($element);

        $element.focusin();
        $items.last().toggle(false);
        $item.trigger('dxpointerdown');
        this.clock.tick();
        keyboard.keyDown('end');
        $item = $items.last().prev();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'last by one item has focused class after press end when last item is hidden');

        $items.first().toggle(false);
        keyboard.keyDown('home');
        $item = $items.first().next();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'second item has focused class after press home when first item is hidden');
    });

    test('focus attribute', function(assert) {
        assert.expect(4);

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });

        const $items = $element.find('.item');
        let $item = $items.first();
        const keyboard = keyboardMock($element);
        const focusedItemId = instance.getFocusedItemId();

        $element.focusin();
        assert.strictEqual($element.attr('aria-activedescendant'), String(focusedItemId), 'element has attribute aria-activedescendant, whose value active');

        $item.trigger('dxpointerdown');
        this.clock.tick();
        assert.ok($item.attr('id').match(focusedItemId), 'first item has id active');

        keyboard.keyDown('down');
        assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), 'first item does not has id active after press down arrow key');
        $item = $items.next();
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'second item has id active after press down arrow key');
    });

    test('selectOnFocus test', function(assert) {
        assert.expect(9);

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true,
            selectOnFocus: true,
            loopItemFocus: true,
            selectedIndex: 0,
            selectionMode: 'single'
        });

        const $items = $element.find('.item');
        const $item = $items.first();
        const keyboard = keyboardMock($element);

        $item.trigger('dxpointerdown');

        this.clock.tick();
        keyboard.keyDown('right');
        assert.equal(instance.option('selectedIndex'), 1, 'next item has been selected after press right arrow');

        keyboard.keyDown('left');
        assert.equal(instance.option('selectedIndex'), 0, 'prev item has been selected after press left arrow');

        keyboard.keyDown('end');
        assert.equal(instance.option('selectedIndex'), 2, 'last item has been selected after press end');

        keyboard.keyDown('home');
        assert.equal(instance.option('selectedIndex'), 0, 'first item has been selected after press home');

        keyboard.keyDown('pagedown');
        assert.equal(instance.option('selectedIndex'), 1, 'next item has been selected after press pagedown');

        keyboard.keyDown('pageup');
        assert.equal(instance.option('selectedIndex'), 0, 'prev item has been selected after press pageup');

        keyboard.keyDown('down');
        assert.equal(instance.option('selectedIndex'), 1, 'next item has been selected after press down arrow');

        keyboard.keyDown('up');
        assert.equal(instance.option('selectedIndex'), 0, 'prev item has been selected after press up arrow');

        keyboard.keyDown('up');
        assert.equal(instance.option('selectedIndex'), 2, 'loopItemFocus is working');
    });

    test('focused item should be changed asynchronous (T400886)', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true
        });

        const $items = $element.find('.item');
        const $item = $items.first();

        $item.trigger('dxpointerdown');
        assert.equal(instance.option('focusedElement'), null, 'focus isn\'t set');

        this.clock.tick();
        assert.equal($(instance.option('focusedElement')).get(0), $item.get(0), 'focus set after timeout');
    });

    testInActiveWindow('focused item should be changed synchronous with widget focus (T427152)', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true
        });

        const $items = $element.find('.item');
        const $item = $items.eq(1);

        $item.trigger('dxpointerdown');
        instance.focus();
        assert.equal($(instance.option('focusedElement')).get(0), $item.get(0), 'focus isn\'t set');
    });

    test('focused item should not be changed if pointerdown prevented (T400886)', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [0, 1, 2],
            focusStateEnabled: true
        });

        const $items = $element.find('.item');
        const $item = $items.first();

        const event = $.Event('dxpointerdown');
        $item.trigger(event);
        event.preventDefault();
        this.clock.tick();
        assert.equal(instance.option('focusedElement'), null, 'focus isn\'t set');
    });

    test('selectOnFocus test for widget with disabled items', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [0, { disabled: true, text: 1 }, 2],
            focusStateEnabled: true,
            selectOnFocus: true,
            loopItemFocus: true,
            selectedIndex: 0,
            selectionMode: 'single'
        });

        const $items = $element.find('.item');
        let $item = $items.first();
        const keyboard = keyboardMock($element);

        $element.focusin();
        $item.trigger('dxpointerdown');

        this.clock.tick();

        keyboard.keyDown('right');
        assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is correct');

        $item = $($items.get(1));
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'correct item has an focused-state');
    });

    test('Item should not lose focus class when you use arrows with \'selectOnFocus\' option', function(assert) {
        const $element = $('#cmp');

        new TestComponent($element, {
            items: [1, 2, 3, 4],
            focusStateEnabled: true,
            selectOnFocus: true,
            loopItemFocus: false,
            selectionMode: 'single'
        });

        const $items = $element.find('.item');
        const $firstItem = $items.first();
        const $lastItem = $items.last();
        const keyboard = keyboardMock($element);

        $element.focusin();
        $firstItem.trigger('dxpointerdown');
        this.clock.tick();
        keyboard.keyDown('left');
        assert.ok($firstItem.hasClass(FOCUSED_ITEM_CLASS), 'First item must stay focused when we press \'left\' button on the keyboard');

        $lastItem.trigger('dxpointerdown');
        this.clock.tick();
        keyboard.keyDown('right');
        assert.ok($lastItem.hasClass(FOCUSED_ITEM_CLASS), 'Last item must stay focused when we press \'right\' button on the keyboard');
    });

    [false, true].forEach((ctrlKey) => {
        [false, true].forEach((metaKey) => {
            ['up', 'down', 'left', 'right', 'pageup', 'pagedown', 'home', 'end'].forEach((key) => {
                const commandKeyPressed = ctrlKey || metaKey;
                test(`focused item is ${commandKeyPressed ? 'not' : ''} changed after pressing ${key} key with command key (metaKey: ${metaKey}, ctrlKey: ${ctrlKey})`, function(assert) {
                    const $element = $('#cmp');
                    const isSameItemFocused = commandKeyPressed;
                    new TestComponent($element, {
                        focusStateEnabled: true,
                        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        selectedIndex: 3
                    });

                    const $items = $element.find('.item');
                    const $item = $items.eq(3);
                    const keyboard = keyboardMock($element);

                    $element.trigger('focusin');
                    $element.find('.item').eq(3).trigger('dxpointerdown');
                    this.clock.tick();

                    keyboard.keyDown(key, { ctrlKey, metaKey });
                    assert.strictEqual($item.hasClass(FOCUSED_ITEM_CLASS), isSameItemFocused, `${isSameItemFocused ? 'same' : 'another'} item focused`);
                    assert.strictEqual(keyboard.event.isDefaultPrevented(), !isSameItemFocused, `event is ${isSameItemFocused ? 'not' : ''} prevented`);
                    assert.strictEqual(keyboard.event.isPropagationStopped(), !isSameItemFocused, `propogation is ${isSameItemFocused ? 'not' : ''} stopped`);
                });
            });
        });
    });
});

module('focus policy', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test('dx-state-focused is not set for item when focusStateEnabled is false by dxpoinerdown', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: false,
            items: ['0', '1']
        });

        const $item = $element.find('.item').eq(0);

        $item.trigger('dxpointerdown');
        this.clock.tick();
        assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), 'focus set to first item');
    });

    test('dx-state-focused is not set for item when it is not closest focused target by dxpoinerdown', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1'],
            itemTemplate() {
                return $('<input>');
            }
        });

        const $item = $element.find('.item').eq(0);

        $item.trigger($.Event('dxpointerdown', { target: $item.find('input').get(0) }));
        this.clock.tick();
        assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), 'focus set to first item');
    });

    test('focusedElement is set for item when nested element selected by dxpoinerdown', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1'],
            itemTemplate() {
                return $('<span>');
            }
        });

        const $item = $element.find('.item').eq(0);

        $item.trigger($.Event('dxpointerdown', { target: $item.find('span').get(0) }));
        this.clock.tick();
        assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal($(instance.option('focusedElement')).get(0), $item.get(0), 'focus set to first item');
    });

    test('dx-state-focused is not set for item when it is not closest focused target by focusin', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1'],
            itemTemplate() {
                return $('<input>');
            }
        });

        const $item = $element.find('.item').eq(0);

        $element.trigger($.Event('focusin', { target: $item.find('input').get(0) }));
        assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), 'focus set to first item');
    });

    test('option focusOnSelectedItem: false', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1'],
            selectionMode: 'single',
            selectedIndex: 1,
            focusOnSelectedItem: false
        });

        $element.trigger('focusin');
        assert.ok($element.find('.item').eq(0).hasClass(FOCUSED_ITEM_CLASS), 'focus set to first item');
    });

    test('option focusOnSelectedItem: true', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1'],
            selectionMode: 'single',
            selectedIndex: 1,
            focusOnSelectedItem: true
        });

        $element.trigger('focusin');
        assert.ok($element.find('.item').eq(1).hasClass(FOCUSED_ITEM_CLASS), 'focus set to selected item');
    });

    test('item is focused after setting focusedElement option', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1']
        });

        const $item = $element.find('.item').eq(1);

        $element.focusin();

        assert.ok(!$item.hasClass(FOCUSED_ITEM_CLASS), 'item is not focused');

        instance.option('focusedElement', $item);

        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'item is focused after setting focusedItem option');
    });

    test('first item  should be focused after setting focusedElement option to empty array', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1'],
            focusedElement: []
        });

        const $item = $element.find('.item').eq(0);

        $element.focusin();

        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'item is focused');
    });

    test('item is focused after focusing on element', function(assert) {
        assert.expect(2);

        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            focusStateEnabled: true,
            items: ['0', '1']
        });

        const $item = $element.find('.item').eq(0);

        $element.focusin();

        assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.ok($item.hasClass(FOCUSED_ITEM_CLASS), 'item is focused');
    });
});

module('isReady', () => {
    test('collection widget is ready when dataSource is loaded', function(assert) {
        let isReadyBeforeLoaded;
        const deferred = $.Deferred();

        const $component = $('#cmp');
        const component = new TestComponent($component);

        component.option('dataSource', {
            load() {
                isReadyBeforeLoaded = component.isReady();
                return deferred.promise();
            }
        });

        deferred.resolve([]);

        assert.strictEqual(isReadyBeforeLoaded, false, 'widget is not ready during dataSource loading');
        assert.equal(component.isReady(), true, 'widget is ready when dataSource is loaded');
    });
});

const TestWidget = CollectionWidget.inherit({
    NAME: 'TestWidget',

    _renderItem(...args) {
        this.callBase(...args);
    },

    _itemClass() {
        return 'div';
    },

    _itemDataKey() {
        return '3AE08BA7-F7BC-464B-8B43-53C1F7307920';
    }
});

let loadCount = 0;
const TestStore = Store.inherit({
    _loadImpl() {
        loadCount++;
        return $.Deferred().resolve([1, 2, 3]);
    }
});

module('Data layer integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test('data widget doesn\'t load already loaded datasource', function(assert) {
        assert.expect(3);

        const store = new TestStore();
        const source = new DataSource(store);
        let itemCount = 0;
        const $container = $('#cmp');

        source.load().done(() => {
            assert.equal(loadCount, 1);
            new TestWidget($container, {
                dataSource: source,
                onItemRendered() {
                    itemCount++;
                }
            });
            // NOTE: TestStore works synchronously so we don't have to wait it loads
            assert.equal(loadCount, 1);
            assert.equal(itemCount, 3);
        });

        this.clock.tick(1);
    });

    test('data widget should handle dataSource loading error', function(assert) {
        const deferred = $.Deferred();
        let contentReadyFired = 0;
        const $container = $('#cmp');

        new TestWidget($container, {
            dataSource: {
                load() {
                    return deferred.promise();
                }
            },
            onContentReady() {
                contentReadyFired++;
            }
        });
        contentReadyFired = 0;
        deferred.reject();

        assert.equal(contentReadyFired, 1, 'onContentReady fired once on loading fail');
    });

    test('collection correctly handle loadResult object', function(assert) {
        const mapStub = sinon.stub();
        const $container = $('#cmp');
        const instance = new TestWidget($container, {
            dataSource: {
                load({ filter }) {
                    const items = filter ? [{ id: 3, text: 'test3' }] : [{ id: 1, text: 'test1' }, { id: 2, text: 'test2' }];
                    return $.Deferred().resolve({ data: items }).promise();
                },
                key: 'id',
                map: mapStub
            },
            selectionMode: 'single'
        });

        instance.option('selectedItemKeys', [3]);

        const filteredItems = mapStub.lastCall.args[2];
        assert.ok(mapStub.callCount > 1, 'the \'map\' function was called not only during the initial loading');
        assert.ok(Array.isArray(filteredItems), 'receive array');
        assert.deepEqual(filteredItems, [{ id: 3, text: 'test3' }], 'correct data');
    });

    test('getDataSource. dataSource is not defined', function(assert) {
        const $element = $('#cmp');

        const instance = new TestWidget($element, {
            items: []
        });

        assert.strictEqual(instance.getDataSource(), null);
    });

    test('getDataSource, dataSource is defined', function(assert) {
        const $element = $('#cmp');

        const instance = new TestWidget($element, {
            dataSource: [{ field1: '1' }]
        });

        assert.ok(instance.getDataSource() instanceof DataSource);
    });
});

let helper;
QUnit.module('Aria accessibility', {
    beforeEach: function() {
        this.items = [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }];
        helper = new ariaAccessibilityTestHelper({
            createWidget: ($element, options) => new TestWidget($element,
                $.extend({
                    focusStateEnabled: true
                }, options))
        });
    },
    afterEach: function() {
        helper.$widget.remove();
    }
}, () => {
    test('Attributes on initialize', function() {
        helper.createWidget({ items: [] });

        helper.checkAttributes(helper.$widget, { tabindex: '0' });
        helper.checkItemsAttributes([], { });
    });

    test('Items[] -> Items[\'Item_1\', \'Item_2\', \'Item_3\' ]', function(assert) {
        helper.createWidget({ items: [] });

        helper.checkAttributes(helper.$widget, { tabindex: '0' });
        helper.checkItemsAttributes([], { });

        helper.widget.option('items', this.items);
        helper.checkAttributes(helper.$widget, { tabindex: '0' });
        helper.checkItemsAttributes([], { });
    });

    test('Set focusedElement: item[1] -> clean focusedElement', function() {
        helper.createWidget({ items: this.items });

        const $focusedItem = helper.$widget.find(`.${ITEM_CLASS}`).eq(1);
        helper.widget.option('focusedElement', $focusedItem);

        helper.checkAttributes(helper.$widget, { 'aria-activedescendant': helper.widget.getFocusedItemId(), tabindex: '0' });
        helper.checkItemsAttributes([], { focusedItemIndex: 1 });

        helper.widget.option('focusedElement', null);
        helper.checkAttributes(helper.$widget, { tabindex: '0' });
        helper.checkItemsAttributes([], { });
    });

    test('Select item[0] on focus -> focusout', function() {
        helper.createWidget({ items: this.items });

        helper.$widget.focusin();
        helper.checkAttributes(helper.$widget, { 'aria-activedescendant': helper.widget.getFocusedItemId(), tabindex: '0' });
        helper.checkItemsAttributes([], { focusedItemIndex: 0 });

        helper.$widget.focusout();
        helper.checkAttributes(helper.$widget, { 'aria-activedescendant': helper.widget.getFocusedItemId(), tabindex: '0' });
        helper.checkItemsAttributes([], { focusedItemIndex: 0 });
    });

    test('SelectionMode: single, selectedIndex: 1', function() {
        helper.createWidget({ items: this.items, selectedIndex: 1, selectionMode: 'single' });

        helper.checkAttributes(helper.$widget, { tabindex: '0' });
        helper.checkItemsAttributes([1], { attributes: ['aria-selected'] });
    });

    test('Refresh aria-activedescendant when focused item changed', function(assert) {
        let refreshActiveDescendantCallCount = 0;
        helper.createWidget({ items: this.items });

        const $item = helper.$widget.find(`.${ITEM_CLASS}`).eq(1);
        const spy = helper.widget._refreshActiveDescendant;

        helper.widget._refreshActiveDescendant = () => {
            refreshActiveDescendantCallCount++;
        };

        try {
            helper.widget.option('focusedElement', $item);

            helper.checkAttributes(helper.$widget, { tabindex: '0' });
            helper.checkItemsAttributes([], { focusedItemIndex: 1 });
            assert.strictEqual(refreshActiveDescendantCallCount, 1, `activedescendant was refreshed ${refreshActiveDescendantCallCount} time`);
        } finally {
            helper.widget._refreshActiveDescendant = spy;
        }
    });

    test('onFocusedItemChanged option on init', function(assert) {
        let focusedItemChangedCallCount = 0;

        helper.createWidget({
            items: this.items,
            selectedIndex: 1,
            useNative: false,
            selectionMode: 'single',
            onFocusedItemChanged: (e) => {
                focusedItemChangedCallCount++;
                assert.ok(e.actionValue, 'onFocusedItemChanged, defined on init, gets id as a parameter');
            }
        });

        const $items = helper.$widget.find('.dx-item');

        helper.widget.option('focusedElement', $items.eq(0));
        helper.checkAttributes(helper.$widget, { 'aria-activedescendant': helper.widget.getFocusedItemId(), tabindex: '0' });
        helper.checkItemsAttributes([1], { attributes: ['aria-selected'], focusedItemIndex: 0 });
        assert.strictEqual(focusedItemChangedCallCount, 1, 'onFocusedItemChanged.callCount');

        focusedItemChangedCallCount = 0;
        helper.widget.option('onFocusedItemChanged', () => {
            focusedItemChangedCallCount++;
        });

        helper.widget.option('focusedElement', $items.eq(1));
        helper.checkAttributes(helper.$widget, { 'aria-activedescendant': helper.widget.getFocusedItemId(), tabindex: '0' });
        helper.checkItemsAttributes([1], { attributes: ['aria-selected'], focusedItemIndex: 1 });
        assert.strictEqual(focusedItemChangedCallCount, 1, 'onFocusedItemChanged.callCount');
    });
});


module('default template', {
    beforeEach: function() {
        this.prepareItemTest = (data) => {
            const testWidget = new TestWidget($('<div>'), {
                items: [data]
            });

            return testWidget.itemElements().eq(0).find('.dx-item-content').contents();
        };
    }
}, () => {
    test('template should be rendered correctly with text', function(assert) {
        const $content = this.prepareItemTest('custom');

        assert.equal($content.text(), 'custom');
    });

    test('template should be rendered correctly with boolean', function(assert) {
        const $content = this.prepareItemTest(true);

        assert.equal($.trim($content.text()), 'true');
    });

    test('template should be rendered correctly with number', function(assert) {
        const $content = this.prepareItemTest(1);

        assert.equal($.trim($content.text()), '1');
    });

    test('template should be rendered correctly with object that has the text property', function(assert) {
        const $content = this.prepareItemTest({ text: 'custom' });

        assert.equal($.trim($content.text()), 'custom');
    });

    test('template should be rendered correctly with text equals to zero', function(assert) {
        const $content = this.prepareItemTest({ text: 0 });

        assert.strictEqual($.trim($content.text()), '0');
    });

    test('template should be rendered correctly with html', function(assert) {
        const $content = this.prepareItemTest({ html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();
        assert.ok($span.length);
        assert.equal($span.text(), 'test');
    });

    test('template should be rendered correctly with html equals to an empty string', function(assert) {
        const $content = this.prepareItemTest({ text: 'test', html: '' });

        assert.strictEqual($.trim($content.text()), '');
    });

    test('template should be rendered correctly with htmlstring', function(assert) {
        const $content = this.prepareItemTest('<span>test</span>');

        assert.equal($content.text(), '<span>test</span>');
    });

    test('template should be rendered correctly with html & text', function(assert) {
        const $content = this.prepareItemTest({ text: 'text', html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();

        assert.ok($span.length);
        assert.equal($content.text(), 'test');
    });

    test('displayExpr option should work', function(assert) {
        const $element = $('#cmp');

        const instance = new TestWidget($element, {
            dataSource: [{ name: 'Item 1' }],
            displayExpr: 'name'
        });

        const $item = $(instance.itemElements()).eq(0);

        assert.strictEqual($item.text(), 'Item 1', 'displayExpr works');
    });
});

module('selection', {
    beforeEach: function() {
        this.createWidget = (options) => {
            options.items = options.items || [1, 2, 3];

            return new TestWidget($('#cmp'), options);
        };
    }
}, () => {
    ['single', 'multiple'].forEach((selectionMode) => {
        test(`selectedItemKeys should be updates properly with the ${selectionMode} selection mode`, function(assert) {
            const instance = this.createWidget({
                selectionMode
            });
            const originalKeys = instance.option('selectedItemKeys');

            instance.selectItem(instance.itemElements().eq(1));
            const newKeys = instance.option('selectedItemKeys');

            assert.deepEqual(originalKeys, [], 'there is no selected items after widget creating');
            assert.deepEqual(newKeys, [2], 'after selection \'selectedItemKeys\' container correct item key');
        });

        test(`selectedItemKeys === null should not throw an error with the ${selectionMode} selection mode`, function(assert) {
            let isOK = true;
            let selectedItemKeys;

            try {
                const instance = this.createWidget({
                    selectedItemKeys: null,
                    selectionMode
                });

                instance.selectItem(instance.itemElements().eq(1));
                selectedItemKeys = instance.option('selectedItemKeys');
            } catch(e) {
                isOK = false;
            }

            assert.ok(isOK, 'selectedItemKeys === null handled correctly');
            assert.deepEqual(selectedItemKeys, [2], 'after selection \'selectedItemKeys\' container correct item key');
        });
    });

    test('selection totalCount should return correct value if items are grouped (T1053754)', function(assert) {
        const dataSource = new DataSource({
            store: [{
                group: 1,
                key: 1,
                name: '1'
            }, {
                group: 1,
                key: 2,
                name: '2'
            }, {
                group: 2,
                key: 3,
                name: '3'
            }, {
                group: 2,
                key: 4,
                name: '4'
            }],
            group: 'group',
            key: 'id'
        });
        const instance = this.createWidget({
            dataSource,
            grouped: true
        });

        assert.strictEqual(instance._selection.options.totalCount(), 4, 'total count is correct');
    });
});
