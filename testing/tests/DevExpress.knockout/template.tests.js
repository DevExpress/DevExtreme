const $ = require('jquery');
const noop = require('core/utils/common').noop;
const ko = require('knockout');
const KoTemplate = require('integration/knockout/template').KoTemplate;

QUnit.module('rendering', {
    beforeEach: function() {
        const that = this;

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
    const $container = $('<div class=\'container\'>');
    const template = new KoTemplate($('<div class=\'content\' data-bind=\'testBinding: {}\'>'));

    this.testBindingInit = function(element) {
        assert.equal($(element).parent().get(0), $container.get(0), 'template rendered in attached container');
    };
    template.render({ container: $container });
});

QUnit.test('template result should be correct', function(assert) {
    const $container = $('<div class=\'container\'>');
    const template = new KoTemplate($('<div class=\'content\' data-bind=\'testBinding: {}\'>'));

    let result;
    this.testBindingInit = function(element) {
        result = element;
    };
    assert.equal(template.render({ container: $container }).get(0), result, 'result is correct');
});

QUnit.test('user\'s options object should not be changed after template rendering', function(assert) {
    const template = new KoTemplate($('<div data-bind=\'text: $data.testField + $index\'>'));
    const options = { container: $('<div>'), model: { testField: 'test' }, index: 1 };

    template.render(options);

    assert.deepEqual(options.model, { testField: 'test' });
});

QUnit.test('template binding works when model is object', function(assert) {
    const $container = $('<div>');
    const template = new KoTemplate($('<div data-bind=\'text: $data.testField + $index\'>'));

    template.render({ container: $container, model: { testField: 'test' }, index: 1 });

    assert.equal($container.children().text(), 'test1');
});

QUnit.test('template binding works when model is string', function(assert) {
    const $container = $('<div>');
    const template = new KoTemplate($('<div data-bind=\'text: $data + $index\'>'));

    template.render({ container: $container, model: 'test', index: 1 });

    assert.equal($container.children().text(), 'test1');
});

QUnit.test('template binding works when model is observable', function(assert) {
    const $container = $('<div>');
    const template = new KoTemplate($('<div data-bind=\'text: $data + $index\'>'));
    const test = ko.observable('test');

    template.render({ container: $container, model: test, index: 1 });

    assert.equal($container.children().text(), 'test1');
});

QUnit.test('template binding works when model is not defined', function(assert) {
    const $container = $('<div>');
    const template = new KoTemplate($('<div data-bind=\'text: $index\'>'));

    template.render({ container: $container, index: 1 });

    assert.equal($container.children().text(), '1');
});

QUnit.test('bindingContext for container must have $root field (T561880)', function(assert) {
    const vm = {
        text: 'test'
    };
    ko.applyBindings(vm, $('#qunit-fixture')[0]);
    const $container = $('<div>');
    const template = new KoTemplate($('<div data-bind=\'text: text + $root.text\'>'));

    template.render({ container: $container, model: vm });

    assert.equal($container.children().text(), 'testtest');
});
