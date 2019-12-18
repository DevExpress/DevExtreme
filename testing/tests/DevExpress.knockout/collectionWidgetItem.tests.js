var $ = require('jquery'),
    ko = require('knockout'),
    registerComponent = require('core/component_registrator'),
    CollectionWidget = require('ui/collection/ui.collection_widget.edit'),
    CollectionWidgetItem = require('ui/collection/item');

require('integration/knockout');

var FIXTURE_ELEMENT = $('<div id=qunit-fixture></div>').appendTo('body');

QUnit.module('observables', {
    beforeEach: function() {
        var TestCollectionItem = this.TestCollectionItem = CollectionWidgetItem.inherit({
            _renderWatchers: function() {
                this._startWatcher('value', this._renderValue.bind(this));
            },
            _renderValue: function(value) {
                this._$element.data('value', value);
            },
            value: function(value) {
                this._renderValue(value);
            }
        });

        var TestCollection = this.TestCollection = CollectionWidget.inherit({
            _getDefaultOptions: function() {
                return $.extend(this.callBase(), {
                    valueExpr: 'value'
                });
            }
        });
        TestCollection.ItemClass = TestCollectionItem;

        registerComponent('dxTestCollection', TestCollection);
    }
});

QUnit.test('item should correctly watch changes', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {} }')
        .appendTo(FIXTURE_ELEMENT);

    var vm = { items: ko.observableArray([]) };
    ko.applyBindings(vm, $markup[0]);

    vm.items.push({ value: ko.observable(1) });
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    assert.equal($item.data('value'), 1, 'value changed');

    vm.items()[0].value(2);
    assert.equal($item.data('value'), 2, 'value changed');
});

QUnit.test('item should correctly watch changes in nested observable', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {} }')
        .appendTo(FIXTURE_ELEMENT);

    var vm = { items: ko.observableArray([]) };
    ko.applyBindings(vm, $markup[0]);

    vm.items.push(ko.observable({ value: ko.observable(1) }));
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    assert.equal($item.data('value'), 1, 'value changed');

    vm.items()[0]().value(2);
    assert.equal($item.data('value'), 2, 'value changed');
});

QUnit.test('item should correctly watch changes if whole item is observable', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {} }')
        .appendTo(FIXTURE_ELEMENT);

    var vm = { items: ko.observableArray([]) };
    ko.applyBindings(vm, $markup[0]);

    vm.items.push(ko.observable({ value: 1 }));
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    assert.equal($item.data('value'), 1, 'value changed');

    vm.items()[0]({ value: 2 });
    assert.equal($item.data('value'), 2, 'value changed');
});

QUnit.test('item should correctly watch changes for complex expressions', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {}, valueExpr: valueExpr }')
        .appendTo(FIXTURE_ELEMENT);

    var vm = {
        items: ko.observableArray([]),
        valueExpr: function(data) {
            return data.value() + 1;
        }
    };
    ko.applyBindings(vm, $markup[0]);

    vm.items.push({ value: ko.observable(1) });
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    assert.equal($item.data('value'), 2, 'value changed');

    vm.items()[0].value(2);
    assert.equal($item.data('value'), 3, 'value changed');
});

QUnit.test('item should not watch changes for not observables', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {} }')
        .appendTo(FIXTURE_ELEMENT);

    var vm = { items: ko.observableArray([{ value: 1 }]) };
    ko.applyBindings(vm, $markup[0]);
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);

    vm.items()[0].value = 2;
    assert.equal($item.data('value'), 1, 'value not changed');
});

QUnit.test('item should not be rerendered', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {} }')
        .appendTo(FIXTURE_ELEMENT);

    var vm = { items: ko.observableArray([{ value: ko.observable(1) }]) };
    ko.applyBindings(vm, $markup[0]);

    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    $item.data('rendered', true);

    vm.items()[0].value(2);
    assert.equal($item.data('rendered'), true, 'item not rerendered');
});

QUnit.test('item should not leak watchers', function(assert) {
    var $markup = $('<div></div>')
        .attr('data-bind', 'dxTestCollection: { items: items, itemTemplate: function() {} }')
        .appendTo(FIXTURE_ELEMENT);

    var item = ko.observable({ value: ko.observable(1) });
    var vm = { items: ko.observableArray([item]) };
    ko.applyBindings(vm, $markup[0]);

    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    $item.data('rendered', true);

    vm.items([]);

    item().value(2);
    assert.notEqual($item.data('value'), 2, 'value not changed through nested observers');

    item({ value: 2 });
    assert.notEqual($item.data('value'), 2, 'value not changed through global observer');
});
