const $ = require('jquery');
const noop = require('core/utils/common').noop;
const angular = require('angular');
const registerComponent = require('core/component_registrator');
const Widget = require('ui/widget/ui.widget');

require('integration/angular');

QUnit.module('simple component tests', {
    beforeEach: function() {
        registerComponent('testWidget', Widget.inherit({}));

        const that = this;
        const testModule = angular.module('test', ['dx']);

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
        const $container = $('<div/>').appendTo(this.$fixtureElement);
        const $widget = $('<div/>').attr('test-widget', '').appendTo($container);

        angular.bootstrap($container, ['test']);

        this.instance = $widget['testWidget']('instance');
    },
    afterEach: function() {
        this.$fixtureElement.remove();
    }
});

QUnit.test('template should be rendered to container directly', function(assert) {
    const $container = $('<div class=\'container\'>');

    this.testBindingInit = function(element) {
        assert.equal($(element).parent().get(0), $container.get(0), 'template rendered in attached container');
    };

    this.instance.$element().append($container);
    const template = this.instance._getTemplate($('<div class=\'content\' test-binding>'));
    template.render({
        container: $container
    });
});

QUnit.test('template result should be correct', function(assert) {
    const $container = $('<div class=\'container\'>');

    let $result;
    this.testBindingInit = function(element) {
        $result = element;
    };

    this.instance.$element().append($container);
    const template = this.instance._getTemplate($('<div class=\'content\' test-binding>'));
    template.render({
        container: $container
    });
    assert.equal(template.render({
        container: $container
    }).get(0), $result.get(0), 'result is correct');
});
