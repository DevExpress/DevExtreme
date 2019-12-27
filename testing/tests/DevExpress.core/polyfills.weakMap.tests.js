define(function(require) {
    const WeakMap = require('core/polyfills/weak_map');

    if(window.WeakMap) {
        return;
    }

    QUnit.module('weakMap');

    QUnit.test('set/get', function(assert) {
        const testWeakMap = new WeakMap();
        const key = document.createElement('div');
        const anotherKey = document.createElement('div');
        const value = 'test value';

        testWeakMap.set(key, value);

        assert.equal(testWeakMap.get(key), value);
        assert.equal(testWeakMap.get(key), value);
        assert.strictEqual(testWeakMap.get(anotherKey), undefined);
    });

    QUnit.test('has', function(assert) {
        const testWeakMap = new WeakMap();
        const key = document.createElement('div');
        const anotherKey = document.createElement('div');
        const value = 'test value';

        testWeakMap.set(key, value);

        assert.ok(testWeakMap.has(key));
        assert.notOk(testWeakMap.has(anotherKey));
    });

    QUnit.test('delete', function(assert) {
        const testWeakMap = new WeakMap();
        const key = document.createElement('div');
        const value = 'test value';

        testWeakMap.set(key, value);
        testWeakMap.delete(key, value);

        assert.notOk(testWeakMap.has(key));
        assert.strictEqual(testWeakMap.get(key), undefined);
    });
});
