require('../DevExpress.core/domComponent.markup.tests.js');

const DOMComponent = require('core/dom_component');
const Proxy = window.Proxy;

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

    let element = document.createElement('div');
    const serverSideElementAttributesMock = [ undefined ];

    element = new Proxy(element, {
        get: function(target, name) {
            if(name === 'attributes') {
                return serverSideElementAttributesMock;
            }

            const value = target[name];
            return value && value.bind ? value.bind(target) : value;
        },
        set: function(obj, prop, value) {
            obj[prop] = value;
            return true;
        }
    });

    const instance = new this.TestComponent(element);

    instance.dispose();
});
