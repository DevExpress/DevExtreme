var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    ko = require('knockout'),
    KoTemplate = require('integration/knockout/template').KoTemplate;

QUnit.module('rendering', {
    beforeEach: function() {
        var that = this;

        this.testBindingInit = noop;
        ko.bindingHandlers.testBinding = {
            init: function(element) {
                that.testBindingInit(element);
            }
        };
    },
    afterEach: function() {
        ko.bindingHandlers.testBinding = null;
    }
});

QUnit.test('template should be rendered to container directly', function(assert) {
    var $container = $('<div class=\'container\'>'),
        template = new KoTemplate($('<div class=\'content\' data-bind=\'testBinding: {}\'>'));

    this.testBindingInit = function(element) {
        assert.equal($(element).parent().get(0), $container.get(0), 'template rendered in attached container');
    };
    template.render({ container: $container });
});

QUnit.test('template result should be correct', function(assert) {
    var $container = $('<div class=\'container\'>'),
        template = new KoTemplate($('<div class=\'content\' data-bind=\'testBinding: {}\'>'));

    var result;
    this.testBindingInit = function(element) {
        result = element;
    };
    assert.equal(template.render({ container: $container }).get(0), result, 'result is correct');
});

QUnit.test('user\'s options object should not be changed after template rendering', function(assert) {
    var template = new KoTemplate($('<div data-bind=\'text: $data.testField + $index\'>'));
    var options = { container: $('<div>'), model: { testField: 'test' }, index: 1 };

    template.render(options);

    assert.deepEqual(options.model, { testField: 'test' });
});

QUnit.test('template binding works when model is object', function(assert) {
    var $container = $('<div>');
    var template = new KoTemplate($('<div data-bind=\'text: $data.testField + $index\'>'));

    template.render({ container: $container, model: { testField: 'test' }, index: 1 });

    assert.equal($container.children().text(), 'test1');
});

QUnit.test('template binding works when model is string', function(assert) {
    var $container = $('<div>');
    var template = new KoTemplate($('<div data-bind=\'text: $data + $index\'>'));

    template.render({ container: $container, model: 'test', index: 1 });

    assert.equal($container.children().text(), 'test1');
});

QUnit.test('template binding works when model is observable', function(assert) {
    var $container = $('<div>');
    var template = new KoTemplate($('<div data-bind=\'text: $data + $index\'>'));
    var test = ko.observable('test');

    template.render({ container: $container, model: test, index: 1 });

    assert.equal($container.children().text(), 'test1');
});

QUnit.test('template binding works when model is not defined', function(assert) {
    var $container = $('<div>');
    var template = new KoTemplate($('<div data-bind=\'text: $index\'>'));

    template.render({ container: $container, index: 1 });

    assert.equal($container.children().text(), '1');
});

QUnit.test('bindingContext for container must have $root field (T561880)', function(assert) {
    var vm = {
        text: 'test'
    };
    ko.applyBindings(vm, $('#qunit-fixture')[0]);
    var $container = $('<div>');
    var template = new KoTemplate($('<div data-bind=\'text: text + $root.text\'>'));

    template.render({ container: $container, model: vm });

    assert.equal($container.children().text(), 'testtest');
});
