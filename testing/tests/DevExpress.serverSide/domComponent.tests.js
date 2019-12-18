require('../DevExpress.core/domComponent.markup.tests.js');

var DOMComponent = require('core/dom_component');
var Proxy = window.Proxy;

QUnit.module('SSR specific for DOM Component', {
    beforeEach: function(module) {
        this.TestComponent = DOMComponent.inherit({});
    }
});

QUnit.test('safe attributes removing on dispose', function(assert) {
    assert.expect(0);

    if(!Proxy) {
        return;
    }

    var element = document.createElement('div');
    var serverSideElementAttributesMock = [ undefined ];

    element = new Proxy(element, {
        get: function(target, name) {
            if(name === 'attributes') {
                return serverSideElementAttributesMock;
            }

            var value = target[name];
            return value && value.bind ? value.bind(target) : value;
        },
        set: function(obj, prop, value) {
            obj[prop] = value;
            return true;
        }
    });

    var instance = new this.TestComponent(element);

    instance.dispose();
});
