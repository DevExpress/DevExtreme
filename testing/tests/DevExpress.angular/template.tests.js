var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    angular = require('angular'),
    registerComponent = require('core/component_registrator'),
    Widget = require('ui/widget/ui.widget');

require('integration/angular');

QUnit.module('simple component tests', {
    beforeEach: function() {
        registerComponent('testWidget', Widget.inherit({}));

        var that = this,
            testModule = angular.module('test', ['dx']);

        this.testBindingInit = noop;
        testModule.directive('testBinding', function() {
            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    that.testBindingInit($element);
                }
            };
        });

        this.$fixtureElement = $('<div/>').attr('ng-app', 'testApp').appendTo('#qunit-fixture');
        var $container = $('<div/>').appendTo(this.$fixtureElement),
            $widget = $('<div/>').attr('test-widget', '').appendTo($container);

        angular.bootstrap($container, ['test']);

        this.instance = $widget['testWidget']('instance');
    },
    afterEach: function() {
        this.$fixtureElement.remove();
    }
});

QUnit.test('template should be rendered to container directly', function(assert) {
    var $container = $('<div class=\'container\'>');

    this.testBindingInit = function(element) {
        assert.equal($(element).parent().get(0), $container.get(0), 'template rendered in attached container');
    };

    this.instance.$element().append($container);
    var template = this.instance._getTemplate($('<div class=\'content\' test-binding>'));
    template.render({
        container: $container
    });
});

QUnit.test('template result should be correct', function(assert) {
    var $container = $('<div class=\'container\'>');

    var $result;
    this.testBindingInit = function(element) {
        $result = element;
    };

    this.instance.$element().append($container);
    var template = this.instance._getTemplate($('<div class=\'content\' test-binding>'));
    template.render({
        container: $container
    });
    assert.equal(template.render({
        container: $container
    }).get(0), $result.get(0), 'result is correct');
});
