var dependencyInjector = require('core/utils/dependency_injector');

QUnit.module('dependencyInjector');

QUnit.test('inject and resetInjection methods', function(assert) {
    var base = {
        func: function(value) {
            return value + 1;
        },
        text: 'base',
        obj: {
            a: 1
        }
    };
    var wrapped = dependencyInjector(base);

    wrapped.inject({
        func: function(value) {
            return this.callBase(value) * 2;
        },
        text: 'injected',
        obj: {
            b: 2
        }
    });

    assert.equal(wrapped.text, 'injected');
    assert.equal(wrapped.obj.a, undefined);
    assert.equal(wrapped.obj.b, 2);
    assert.equal(wrapped.func(3), 8);

    wrapped.resetInjection();

    assert.equal(wrapped.text, 'base');
    assert.equal(wrapped.obj.a, 1);
    assert.equal(wrapped.obj.b, undefined);
    assert.equal(wrapped.func(3), 4);

    wrapped.inject({
        func: function(value) {
            return this.callBase(value) * 3;
        },
        text: 'reinjected',
        obj: {
            a: 3,
            c: 4
        }
    });

    assert.equal(wrapped.text, 'reinjected');
    assert.equal(wrapped.obj.a, 3);
    assert.equal(wrapped.obj.b, undefined);
    assert.equal(wrapped.obj.c, 4);
    assert.equal(wrapped.func(3), 12);
});
