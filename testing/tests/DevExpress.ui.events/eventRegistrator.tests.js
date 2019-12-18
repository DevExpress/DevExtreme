var $ = require('jquery'),
    registerEvent = require('events/core/event_registrator'),
    eventsEngine = require('events/core/events_engine'),
    registerEventCallbacks = require('events/core/event_registrator_callbacks'),
    Class = require('core/class');

var eventHelper = require('../../helpers/eventHelper.js');

registerEventCallbacks.add(function(name, eventObject) {
    eventHelper.special[name] = eventObject;
});

QUnit.testStart(function() {
    var markup =
        '<div id="container">\
            <div id="element"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('event registration', {
    beforeEach: function() {
        var impl = Class.inherit({
            ctor: function() {
                var impl = this;

                impl.LOG = { };

                $.each([
                    'setup',
                    'teardown',
                    'add',
                    'remove',
                    'trigger',
                    '_default',
                    'handle'
                ], function(_, methodName) {
                    impl[methodName] = function() {
                        impl.LOG[methodName] = {
                            context: this,
                            arguments: $.makeArray(arguments)
                        };
                    };
                });
            },

            noBubble: false,

            delegateType: false,

            bindType: false
        });

        this.testEventImplementer = new impl();

        registerEvent('dxtestevent', this.testEventImplementer);
        this.element = $('#element');
    },

    afterEach: function() {
        eventHelper.special = {};
    }
});

QUnit.test('\'noBubble\' property', function(assert) {
    assert.strictEqual(eventHelper.special['dxtestevent'].noBubble, false);
});

QUnit.test('\'bindType\' property', function(assert) {
    assert.strictEqual(eventHelper.special['dxtestevent'].bindType, false);
});

QUnit.test('\'delegateType\' property', function(assert) {
    assert.strictEqual(eventHelper.special['dxtestevent'].delegateType, false);
});

QUnit.test('\'setup\' method', function(assert) {
    var data = {},
        handler = function() { },
        LOG;

    eventsEngine.on(this.element, 'dxtestevent.test1.test2', data, handler);

    LOG = this.testEventImplementer.LOG.setup;
    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 4, 'arguments count');
    assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
    assert.strictEqual(LOG.arguments[1], data, 'data');
    assert.deepEqual(LOG.arguments[2], ['test1', 'test2'], 'namespaces');
    assert.ok($.isFunction(LOG.arguments[3]), 'eventHandle');
});

QUnit.test('\'teardown\' method', function(assert) {
    var data = {},
        handler = function() { },
        LOG;


    eventsEngine.on(this.element, 'dxtestevent.test1.test2', data, handler);
    eventsEngine.off(this.element, 'dxtestevent.test1.test2');

    LOG = this.testEventImplementer.LOG.teardown;

    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 3, 'arguments count');
    assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
    assert.deepEqual(LOG.arguments[1], ['test1', 'test2'], 'namespaces');
    assert.ok($.isFunction(LOG.arguments[2]), 'eventHandle');
});

QUnit.test('\'add\' method', function(assert) {
    var data = {},
        handler = function() { },
        LOG;

    eventsEngine.on(this.element, 'dxtestevent.test1.test2', '.some', data, handler);

    LOG = this.testEventImplementer.LOG.add;

    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 2, 'arguments count');
    assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
    assert.ok($.isPlainObject(LOG.arguments[1]), 'handleObj');
    assert.equal(LOG.arguments[1].type, 'dxtestevent', 'handleObj.type');
    assert.equal(LOG.arguments[1].namespace, 'test1.test2', 'handleObj.namespace');
    assert.equal(LOG.arguments[1].selector, '.some', 'handleObj.selector');
    assert.strictEqual(LOG.arguments[1].data, data, 'handleObj.data');
    assert.equal(LOG.arguments[1].handler, handler, 'handleObj.handler');
});

QUnit.test('\'remove\' method', function(assert) {
    var data = {},
        handler = function() { },
        LOG;

    eventsEngine.on(this.element, 'dxtestevent.test1.test2', '.some', data, handler);
    eventsEngine.off(this.element, 'dxtestevent.test1.test2', handler);

    LOG = this.testEventImplementer.LOG.add;

    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 2, 'arguments count');
    assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
    assert.ok($.isPlainObject(LOG.arguments[1]), 'handleObj');
    assert.equal(LOG.arguments[1].type, 'dxtestevent', 'handleObj.type');
    assert.equal(LOG.arguments[1].namespace, 'test1.test2', 'handleObj.namespace');
    assert.equal(LOG.arguments[1].selector, '.some', 'handleObj.selector');
    assert.strictEqual(LOG.arguments[1].data, data, 'handleObj.data');
    assert.equal(LOG.arguments[1].handler, handler, 'handleObj.handler');
});

QUnit.test('\'trigger\' method', function(assert) {
    var data = {},
        handler = function() { },
        event = eventsEngine.Event('dxtestevent'),
        LOG;

    eventsEngine.on(this.element, 'dxtestevent.test1.test2', handler);
    eventsEngine.trigger(this.element, event, data);

    LOG = this.testEventImplementer.LOG.trigger;
    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 3, 'arguments count');
    assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
    assert.strictEqual(LOG.arguments[1], event, 'event');
    assert.strictEqual(LOG.arguments[2], data, 'data');
});

QUnit.test('\'_default\' method', function(assert) {
    var data = {},
        handler = function() { },
        event = eventsEngine.Event('dxtestevent'),
        LOG;

    eventsEngine.on(this.element, 'dxtestevent.test1.test2', data, handler);
    eventsEngine.trigger(this.element, event, data);

    LOG = this.testEventImplementer.LOG._default;
    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 3, 'arguments count');
    assert.strictEqual(LOG.arguments[1], event, 'event');
    assert.strictEqual(LOG.arguments[2], data, 'data');
});

QUnit.test('\'handle\' method', function(assert) {
    var data = {},
        handler = function() { },
        event = eventsEngine.Event('dxtestevent'),
        LOG;

    eventsEngine.on(this.element, 'dxtestevent.test1.test2', data, handler);
    eventsEngine.trigger(this.element, event, data);

    LOG = this.testEventImplementer.LOG.handle;
    assert.strictEqual(LOG.context, this.testEventImplementer, 'context');
    assert.equal(LOG.arguments.length, 3, 'arguments count');
    assert.strictEqual(LOG.arguments[0], this.element[0], 'element');
    assert.strictEqual(LOG.arguments[1], event, 'event');
    assert.strictEqual(LOG.arguments[2], data, 'data');
});
