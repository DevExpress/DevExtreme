var $ = require('jquery'),
    ko = require('knockout'),
    registerComponent = require('core/component_registrator'),
    CollectionWidget = require('ui/collection/ui.collection_widget.edit'),
    executeAsyncMock = require('../../helpers/executeAsyncMock.js');

require('integration/knockout');

QUnit.testStart(function() {
    var markup =
        '<div id="cmp"></div>\
        <div id="cmp-with-template">\
            <div data-options="dxTemplate : { name: \'testTemplate\' } ">\
                First Template\
            </div>\
        </div>\
        \
        <div id="cmp-ko" data-bind="dxTestComponent: { items: items }">\
            <div data-options="dxTemplate : { name: \'item\' } ">\
                <div data-bind="text: $parent.text"></div>\
            </div>\
        </div>\
        \
        <div id="cmp-with-zero-template">\
            <div data-options="dxTemplate: {name: \'0\'}">zero</div>\
        </div>\
        \
        <div id="container-with-jq-template" data-bind="dxTestComponent: { items: items }">\
            <div data-options="dxTemplate : { name: \'firstTemplate\' } ">\
                First Template\
            </div>\
            <div data-options="dxTemplate : { name: \'secondTemplate\' } ">\
                Second Template\
            </div>\
        </div>\
        \
        <div id="container-with-ko-template" data-bind="dxTestComponent: { items: items }">\
            <div data-options="dxTemplate : { name: \'firstTemplate\' } ">\
                First: <span data-bind="text: text"></span>\
            </div>\
            <div data-options="dxTemplate : { name: \'secondTemplate\' } ">\
                Second: <span data-bind="text: text"></span>\
            </div>\
        </div>\
        \
        <div id="container-with-ko-template-and-item-index" data-bind="dxTestComponent: { items: items }">\
            <div data-options="dxTemplate : { name: \'item\' } ">\
                $index: <span data-bind="text: $index"></span>\
            </div>\
        </div>\
        \
        <div id="container-with-nested-container" data-bind="dxTestComponent: { dataSource: [{}] }">\
            <div data-options="dxTemplate : { name: \'item\' } ">\
                <div data-bind="dxTestComponent: { dataSource: [], noDataText: \'No Data\' }"></div>\
            </div>\
        </div>\
        \
        <script type="text/html" id="externalTemplate">\
            Test\
        </script>\
        \
        <script type="text/html" id="externalTemplateNoRootElement">\
            Outer text <div>Test</div>\
        </script>\
        \
        <div id="container-with-items-in-markup" data-bind="dxTestComponent: {}">\
            <div data-options="dxItem: { text: \'1\' }"></div>\
            <div data-options="dxItem: { text: \'2\' }"></div>\
            <div data-options="dxItem: { text: \'3\' }"></div>\
        </div>\
        \
        <div id="container-with-items-with-template" data-bind="dxTestComponent: {}">\
            <div data-options="dxItem: { }">1</div>\
            <div data-options="dxItem: { }">2</div>\
        </div>\
        \
        <div id="container-with-items-and-custom-template" data-bind="dxTestComponent: {}">\
            <div data-options="dxTemplate: { name: \'custom\' }">custom</div>\
            <div data-options="dxItem: { template: \'custom\' }">1</div>\
        </div>\
        \
        <div id="container-with-items-in-markup-and-items-in-options" data-bind="dxTestComponent: { items: items }">\
            <div data-options="dxItem: { text: \'1\' }"></div>\
            <div data-options="dxItem: { text: \'2\' }"></div>\
            <div data-options="dxItem: { text: \'3\' }"></div>\
        </div>\
        \
        <div id="ko-selecting-case" data-bind="dxTestComponent: { items: items, selectedItems: selectedItems, selectionMode: selectionMode }"></div>';

    $('#qunit-fixture').html(markup);
});

var ITEM_CLASS = 'dx-item',
    EMPTY_MESSAGE_CLASS = 'dx-empty-message',
    ITEM_SELECTED_CLASS = 'dx-item-selected';

var TestComponent = CollectionWidget.inherit({

    NAME: 'TestComponent',

    _activeStateUnit: '.item',

    _itemClass: function() {
        return 'item';
    },

    _itemDataKey: function() {
        return '123';
    },

    _itemContainer: function() {
        return this.$element();
    }

});


QUnit.module('render', {
    beforeEach: function() {
        this.element = $('#cmp');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
    }
});

QUnit.test('item specifies its template', function(assert) {
    registerComponent('dxTestComponent', TestComponent);

    try {
        var items = [
            { template: 'custom', text: 'customText' },
            { template: 'nonExistent', text: 'nonExistentText' }
        ];

        var $markup = $(
            '<div id=\'container\'>' +
            '   <div data-bind=\'dxTestComponent: { items: items }\'>' +
            '       <div data-options="dxTemplate: { name: \'custom\' }">CustomTemplate</div>' +
            '       <div data-options="dxTemplate: { name: \'item\' }">Item</div>' +
            '   </div>' +
            '</div>'
        ).appendTo($('#qunit-fixture'));

        ko.applyBindings({ items: items }, $markup.get(0));

        var itemElements = $markup.find('.item');
        assert.equal(itemElements.length, 2);
        assert.equal(itemElements.eq(0).text(), 'CustomTemplate', 'custom item.template');
        assert.equal(itemElements.eq(1).text(), 'nonExistent', 'render template name if template does not exists');

    } finally {
        delete ko.bindingHandlers['dxTestComponent'];
        delete $.fn['dxTestComponent'];
    }
});

QUnit.test('item specifies non existent template', function(assert) {
    registerComponent('dxTestComponent', TestComponent);

    try {
        var items = [
            { text: 'test', template: 'custom' }
        ];

        var $markup = $(
            '<div id=\'container\'>' +
            '   <div data-bind=\'dxTestComponent: { items: items }\'>' +
            '   </div>' +
            '</div>'
        ).appendTo($('#qunit-fixture'));

        ko.applyBindings({ items: items }, $markup.get(0));

        var itemElements = $markup.find('.item');
        assert.equal(itemElements.length, 1);
        assert.equal(itemElements.eq(0).text(), 'custom');

    } finally {
        delete ko.bindingHandlers['dxTestComponent'];
        delete $.fn['dxTestComponent'];
    }
});

QUnit.test('Q556417 - NoDataItem shouldn\'t be removed for nested CollectionWidget', function(assert) {
    var $element = $('#container-with-nested-container');

    try {
        registerComponent('dxTestComponent', TestComponent);

        ko.applyBindings({}, $element.get(0));

        var $noData = $element.find('.' + EMPTY_MESSAGE_CLASS);
        assert.equal($noData.length, 1, 'nodata element rendered for nested component without items');

    } finally {
        delete ko.bindingHandlers['dxTestComponent'];
        delete $.fn['dxTestComponent'];
    }
});

QUnit.test('render items with multiple templates, ko scenario', function(assert) {
    try {
        var $element = $('#container-with-ko-template'),
            testSet = ['First: book', 'Second: pen', 'eraser', 'abc', 'pencil', 'First: liner'],
            $items;

        registerComponent('dxTestComponent', TestComponent);

        ko.applyBindings({
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
        }, $element.get(0));

        $items = $element.find('.item');
        assert.equal($items.length, testSet.length, 'quantity of a test set items and rendered items are equal');

        $items.each(function(index) {
            assert.equal($.trim($(this).text()), testSet[index]);
        });
    } finally {
        delete ko.bindingHandlers['dxTestComponent'];
        delete $.fn['dxTestComponent'];
    }
});

QUnit.test('$index is available in markup (T542335)', function(assert) {
    try {
        var $element = $('#container-with-ko-template-and-item-index');

        registerComponent('dxTestComponent', TestComponent);

        ko.applyBindings({
            items: [
                { text: 'text1' },
                { text: 'text2' }
            ]
        }, $element.get(0));

        var $items = $element.find('.item');

        assert.equal($.trim($items.eq(0).text()), '$index: 0');
        assert.equal($.trim($items.eq(1).text()), '$index: 1');

    } finally {
        delete ko.bindingHandlers['dxTestComponent'];
        delete $.fn['dxTestComponent'];
    }
});


QUnit.module('items via markup', {
    beforeEach: function() {
        registerComponent('dxTestComponent', TestComponent);
    },
    afterEach: function() {
        delete ko.bindingHandlers['dxTestComponent'];
        delete $.fn['dxTestComponent'];
    }
});

QUnit.test('define items in markup', function(assert) {
    var $component = $('#container-with-items-in-markup');
    ko.applyBindings({}, $component.get(0));

    var component = $component.dxTestComponent('instance');
    var expectedItems = [
        { text: '1' },
        { text: '2' },
        { text: '3' }
    ];

    assert.deepEqual(component.option('items'), expectedItems, 'items fetched');

    var $items = $component.find('.item');
    assert.equal($items.length, 3, 'rendered 3 items');
    assert.equal($component.text(), '123', 'items rendered');
});

QUnit.test('items in markup with templates', function(assert) {
    var $component = $('#container-with-items-with-template');
    ko.applyBindings({}, $component.get(0));

    var component = $component.dxTestComponent('instance');
    var items = component.option('items');
    assert.equal(items.length, 2, '2 items fetched');
    assert.ok(items[0].template, 'template defined');
    assert.ok(items[1].template, 'template defined');
    assert.notEqual(items[0].template, items[1].template, 'templates are different');

    var $items = $component.find('.item');
    assert.equal($items.length, 2, 'rendered 2 items');
    assert.equal($items.eq(0).text(), '1', 'items rendered');
    assert.equal($items.eq(1).text(), '2', 'items rendered');
});

QUnit.test('item uses custom template', function(assert) {
    var $component = $('#container-with-items-and-custom-template');
    ko.applyBindings({}, $component.get(0));

    assert.equal($.trim($component.text()), 'custom');
});

QUnit.test('option items has higher priority than items in markup', function(assert) {
    var $component = $('#container-with-items-in-markup-and-items-in-options');
    var items = [1, 2, 3];

    ko.applyBindings({ items: items }, $component.get(0));

    var component = $component.dxTestComponent('instance');

    assert.equal(component.option('items'), items, 'items replaced');
});

QUnit.test('$parent should be correct for collection item', function(assert) {
    var vm = {
        text: 'parent',
        items: [{ 'nonsense': true }]
    };

    var $markup = $('#cmp-ko');
    ko.applyBindings(vm, $markup.get(0));

    var $item = $markup.find('.dx-item');
    assert.equal($.trim($item.text()), 'parent');
});


QUnit.module('deleting MVVM support', {
    beforeEach: function() {
        registerComponent('dxTestComponent', TestComponent);
    },
    afterEach: function() {
        $.fn['TestComponent'] = null;
    }
});


QUnit.module('selecting MVVM support', {
    beforeEach: function() {
        registerComponent('dxTestComponent', TestComponent);
    },
    afterEach: function() {
        $.fn['TestComponent'] = null;
    }
});

QUnit.test('selectedItems option should contain correct items', function(assert) {
    var items = [{ a: 0 }, { a: 1 }, { a: 2 }],
        $element = $('#ko-selecting-case');

    var vm = {
        items: items,
        selectedItems: ko.observableArray([]),
        selectionMode: 'multiple'
    };

    ko.applyBindings(vm, $element[0]);

    var instance = $element.dxTestComponent('instance');

    var item = function(index) {
        return $element.find('.' + ITEM_CLASS).eq(index);
    };

    instance.selectItem(item(0));
    instance.selectItem(item(1));
    instance.selectItem(item(2));
    instance.unselectItem(item(1));
    instance.deleteItem(item(2));

    assert.deepEqual(vm.selectedItems(), [{ a: 0 }], 'correct items present');
});

QUnit.test('items should be selected when widget rendered', function(assert) {
    var items = [{ a: 0 }, { a: 1 }, { a: 2 }],
        $element = $('#ko-selecting-case');

    var vm = {
        items: items,
        selectedItems: ko.observableArray([items[0], items[2]]),
        selectionMode: 'multiple'
    };

    ko.applyBindings(vm, $element[0]);

    var item = function(index) {
        return $element.find('.' + ITEM_CLASS).eq(index);
    };

    assert.deepEqual(vm.selectedItems(), [{ a: 0 }, { a: 2 }], 'correct items selected');
    assert.equal(item(0).hasClass(ITEM_SELECTED_CLASS), true, 'first selected');
    assert.equal(item(2).hasClass(ITEM_SELECTED_CLASS), true, 'third selected');
});

QUnit.test('component should respond on outside selectedItems changes', function(assert) {
    var items = [{ a: 0 }, { a: 1 }],
        $element = $('#ko-selecting-case');

    var vm = {
        items: items,
        selectedItems: ko.observableArray([]),
        selectionMode: 'multiple'
    };
    ko.applyBindings(vm, $element[0]);

    var selectionChangeFired = 0;
    var instance = $element.dxTestComponent('instance');
    instance.option('onSelectionChanged', function() {
        selectionChangeFired++;
    });

    var $items = $element.find('.' + ITEM_CLASS);

    vm.selectedItems([items[0], items[1]]);
    vm.selectedItems([items[1]]);

    assert.equal($items.eq(0).hasClass(ITEM_SELECTED_CLASS), false, 'first unselected');
    assert.equal($items.eq(1).hasClass(ITEM_SELECTED_CLASS), true, 'second selected');
    assert.strictEqual(selectionChangeFired, 2, 'onSelectionChanged action fired once for each selectedItems change');
});
