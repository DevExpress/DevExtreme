import $ from 'jquery';
import angular from 'angular';

import registerComponent from 'core/component_registrator';
import CollectionWidget from 'ui/collection/ui.collection_widget.edit';
import CollectionWidgetItem from 'ui/collection/item';

import 'integration/angular';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

QUnit.module('CollectionWidgetItem', {
    beforeEach: function() {
        var TestCollectionItem = this.TestCollectionItem = CollectionWidgetItem.inherit({
            _renderWatchers: function() {
                this._startWatcher('value', this._renderValue.bind(this));
            },
            _renderValue: function(value) {
                this._$element.data('value', value);
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

        var DefaultCollection = this.DefaultCollection = CollectionWidget.inherit();

        registerComponent('dxTestCollection', TestCollection);
        registerComponent('dxDefaultCollection', DefaultCollection);

        this.testApp = angular.module('testApp', ['dx']);
        this.$fixtureElement = $('<div/>').attr('ng-app', 'testApp').appendTo('#qunit-fixture');
        this.$container = this.$fixtureElement;
        this.$controller = $('<div></div>')
            .attr('ng-controller', 'my-controller')
            .appendTo(this.$container);
    }
});

QUnit.test('item should correctly watch changes', function(assert) {
    var $markup = $('<div></div>')
        .attr('dx-test-collection', '{ itemTemplate: noop, bindingOptions: { items: \'items\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [];
        $scope.noop = function() {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    var scope = $markup.scope();

    scope.$apply(function() { scope.items = [{ value: 1 }]; });
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    assert.equal($item.data('value'), 1, 'value changed');

    scope.$apply(function() { scope.items[0].value = 2; });
    assert.equal($item.data('value'), 2, 'value changed');
});

QUnit.test('item should correctly watch changes for complex expressions', function(assert) {
    var $markup = $('<div></div>')
        .attr('dx-test-collection', '{ itemTemplate: noop, valueExpr: valueExpr, bindingOptions: { items: \'items\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [];
        $scope.noop = function() {};
        $scope.valueExpr = function(data) {
            return data.value + 1;
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    var scope = $markup.scope();

    scope.$apply(function() { scope.items = [{ value: 1 }]; });
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    assert.equal($item.data('value'), 2, 'value changed');

    scope.$apply(function() { scope.items[0].value = 2; });
    assert.equal($item.data('value'), 3, 'value changed');
});

QUnit.test('item should correctly reset collection focus state', function(assert) {
    const $markup = $('<div></div>')
        .attr('dx-default-collection', '{ itemTemplate: noop, bindingOptions: { items: \'items\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [{ text: 'test' }];
        $scope.noop = function() {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    const scope = $markup.scope();
    const collection = this.DefaultCollection.getInstance($markup);
    const $firstItem = $(collection.itemElements()).first();
    const resetFocusSpy = sinon.spy(collection, '_resetItemFocus');

    collection.option('focusedElement', $firstItem.get(0));
    assert.ok($firstItem.hasClass(FOCUSED_STATE_CLASS));

    scope.$apply(function() { scope.items[0].disabled = true; });
    assert.ok(resetFocusSpy.calledOnce);
    assert.notOk($firstItem.hasClass(FOCUSED_STATE_CLASS));

    scope.$apply(function() { scope.items[0].disabled = false; });
    assert.ok(resetFocusSpy.calledOnce);
});

QUnit.test('item should not be rerendered', function(assert) {
    var $markup = $('<div></div>')
        .attr('dx-test-collection', '{ itemTemplate: noop, bindingOptions: { items: \'items\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [{ value: 1 }];
        $scope.noop = function() {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    var scope = $markup.scope();
    var $item = this.TestCollection.getInstance($markup).itemElements().eq(0);
    $item.data('rendered', true);

    scope.$apply(function() { scope.items[0].value = 2; });
    assert.equal($item.data('rendered'), true, 'item not rerendered');
});

QUnit.test('item should not generate watchers for null expressions', function(assert) {
    var $markup = $('<div></div>')
        .attr('dx-test-collection', '{ itemTemplate: noop, valueExpr: null, bindingOptions: { items: \'items\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [];
        $scope.noop = function() {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    var scope = $markup.scope();

    var startWatchersCount = scope.$$watchers.length;
    scope.$apply(function() { scope.items = [{ value: 1 }]; });
    assert.equal(scope.$$watchers.length, startWatchersCount + 1, 'watcher not created for value');
});

QUnit.test('item should not leak watchers', function(assert) {
    var $markup = $('<div></div>')
        .attr('dx-test-collection', '{ itemTemplate: noop, bindingOptions: { items: \'items\' } }')
        .appendTo(this.$controller);

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [];
        $scope.noop = function() {};
    });

    angular.bootstrap(this.$container, ['testApp']);

    var scope = $markup.scope();

    var startWatchersCount = scope.$$watchers.length;
    scope.$apply(function() { scope.items = [{ value: 1 }]; });

    scope.$apply(function() { scope.items = []; });
    assert.equal(scope.$$watchers.length, startWatchersCount, 'watchers cleared');
});

QUnit.test('onItemRendered event should have a completely rendered itemElement', function(assert) {
    $('<div></div>')
        .attr('dx-test-collection', '{ bindingOptions: { items: \'items\', onItemRendered: \'onItemRendered\' }}')
        .appendTo(this.$controller);

    var itemElementText;

    this.testApp.controller('my-controller', function($scope) {
        $scope.items = [{ text: 'test' }];
        $scope.onItemRendered = function(e) {
            itemElementText = $(e.itemElement).text();
        };
    });

    angular.bootstrap(this.$container, ['testApp']);

    assert.equal(itemElementText, 'test', 'itemElement has a rendered text on \'itemRendered\' event');
});
