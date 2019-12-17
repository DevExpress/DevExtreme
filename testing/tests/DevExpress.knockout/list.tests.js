var $ = require('jquery'),
    ko = require('knockout'),
    executeAsyncMock = require('../../helpers/executeAsyncMock.js');

require('ui/list');
require('integration/knockout');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="list"></div>\
        <div id="templated-list">\
            <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
        </div>\
        <div id="groupedListContainer">\
            <div data-bind="dxList: { grouped: true, items: groups }">\
                <div data-options="dxTemplate: { name: \'custom\' }">Custom Group Template</div>\
                <div data-options="dxTemplate: { name: \'group\' }">Group Template</div>\
                <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
            </div>\
        </div>\
        <div id="testListContentReady">\
            <div id="listContentReady" data-bind="dxList: { useNativeScrolling: false, dataSource: dataSource, onContentReady: onContentReady }"></div>\
        </div>\
        <div id="koSelectingList" data-bind="dxList: { items: items, grouped: grouped, editEnabled: editEnabled, selectedItems: selectedItems, selectionMode: selectionMode }"></div>';

    $('#qunit-fixture').html(markup);
});

var LIST_CLASS = 'dx-list',
    LIST_ITEM_CLASS = 'dx-list-item',
    LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';

var toSelector = function(cssClass) {
    return '.' + cssClass;
};

var moduleSetup = {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.element = $('#list');

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();

        this.clock.restore();
    }
};

QUnit.module('rendering', moduleSetup);

QUnit.test('default with ko approach', function(assert) {
    var vm = {
        items: [0, 1]
    };

    var $element = this.element;

    $element.attr('data-bind', 'dxList: {items: items}');

    ko.applyBindings(vm, $element.get(0));

    assert.ok($element.hasClass(LIST_CLASS));

    var items = $element.find(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 2);
    assert.ok(items.eq(0).hasClass(LIST_ITEM_CLASS));
    assert.ok(items.eq(1).hasClass(LIST_ITEM_CLASS));
    assert.equal($.trim(items.text()), '01', 'all items rendered');
});


QUnit.module('regressions', moduleSetup);

QUnit.test('scrollView size updated on onContentReady (B253584)', function(assert) {
    var scrollView,
        itemHeight = 20;

    var vm = {
        dataSource: {
            store: [1, 2, 3, 4, 5],
            paginate: false
        },
        onContentReady: function(e) {
            scrollView = $(e.element).dxScrollView('instance');
            scrollView.scrollTo(itemHeight);
        }
    };

    $('#listContentReady').height(50);

    ko.applyBindings(vm, $('#testListContentReady').get(0));

    assert.equal(scrollView.scrollOffset().top, itemHeight, 'scroll view scrolled correctly');
});

QUnit.test('observableArray.push must refresh', function(assert) {
    var vm = {
        data: ko.observableArray([1])
    };

    this.element.attr('data-bind', 'dxList: { dataSource: data }');
    ko.applyBindings(vm, this.element[0]);

    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 1);
    assert.equal(this.element.dxList('instance').option('items').length, 1);

    vm.data.push(2);
    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2);
    assert.equal(this.element.dxList('instance').option('items').length, 2);
});

QUnit.test('B233222. List - group header uses item template', function(assert) {
    var vm = {
        groups: [
            { key: 'simple', items: ['1', '2', '3'] },
            { template: 'custom', key: 'custom', items: ['1', '2', '3'] },
            { template: 'nonExistent', key: 'nonExistent', items: ['1', '2', '3'] }
        ]
    };

    ko.applyBindings(vm, $('#groupedListContainer').get(0));

    var $list = $('#groupedListContainer').find('.dx-list'),
        $headers = $list.find('.dx-list-group-header');

    assert.equal($headers.eq(0).text(), 'Group Template', 'group template');
    assert.equal($headers.eq(1).text(), 'Custom Group Template', 'custom group.template');
    assert.equal($headers.eq(2).text(), 'nonExistent', 'default list group template when custom group.template was not found');
});


QUnit.module('deleting in grouped list MVVM support');

QUnit.test('deleteItem should correctly be handled by ko subscriptions with isolated items', function(assert) {
    assert.expect(2);

    var items = [{
        key: 1,
        items: ko.observableArray([1, 2, 3])
    }, {
        key: 2,
        items: ko.observableArray([1, 2, 3])
    }];

    items[0].items.subscribe(function() {
        assert.ok('first group subscription triggered');
    });
    items[1].items.subscribe(function() {
        assert.ok('second group subscription triggered');
    });

    var $list = $('#templated-list').dxList({
            items: items,
            grouped: true
        }),
        list = $list.dxList('instance');

    list.deleteItem({ group: 0, item: 0 });
    list.deleteItem({ group: 1, item: 0 });
});


QUnit.module('selecting MVVM support');

QUnit.test('grouped list should respond on outside selectedItems changes', function(assert) {
    var items = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }]
            }
        ],
        $list = $('#koSelectingList');
    var vm = {
        items: items,
        grouped: true,
        editEnabled: true,
        selectedItems: ko.observableArray([]),
        selectionMode: 'multiple'
    };
    ko.applyBindings(vm, $list[0]);

    var selectActionFired = 0,
        unselectActionFired = 0;
    var list = $list.dxList('instance');
    list.option('onSelectionChanged', function(args) {
        selectActionFired += args.addedItems.length;
        unselectActionFired += args.removedItems.length;
    });

    var $items = $list.find(toSelector(LIST_ITEM_CLASS));

    vm.selectedItems([
        {
            key: 'second',
            items: [items[1].items[1]]
        },
        {
            key: 'first',
            items: [items[0].items[0]]
        }
    ]);
    vm.selectedItems([
        {
            key: 'second',
            items: [items[1].items[1]]
        }
    ]);

    assert.equal($items.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), false, 'first in first group unselected');
    assert.equal($items.eq(3).hasClass(LIST_ITEM_SELECTED_CLASS), true, 'second in second group selected');
    assert.strictEqual(selectActionFired, 2, 'select action called on first and on last only once');
    assert.strictEqual(unselectActionFired, 1, 'select action called only on first');
});
