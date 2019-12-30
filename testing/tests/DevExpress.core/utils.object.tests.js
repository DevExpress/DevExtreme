const objectUtils = require('core/utils/object');

QUnit.test('orderEach', function(assert) {
    const checkOrderEach = function(mapKeys, keys) {
        let i;
        const map = {};
        for(i = 0; i < mapKeys.length; i++) {
            map[mapKeys[i]] = i;
        }

        mapKeys = [];
        objectUtils.orderEach(map, function(key, value) {
            mapKeys.push(key);
            assert.strictEqual(map[key], value, 'key value');
        });
        assert.deepEqual(mapKeys, keys, 'keys order');
    };

    checkOrderEach(['', 1, '100', 12, -5, 'test', 3, undefined, null], ['-5', '1', '3', '12', '100', '', 'null', 'test', 'undefined']);
});

// T396670
QUnit.test('orderEach when there is custom method in prototype of the array', function(assert) {
    /* eslint-disable no-extend-native */
    // arrange
    const array = [1, 2, 3];
    const keys = [];

    Array.prototype.add = function(item) {
        this[this.length] = item;
    };

    // act
    objectUtils.orderEach(array, function(key, value) {
        keys.push(key);
    });

    // assert
    assert.deepEqual(keys, ['0', '1', '2'], 'keys order');
    delete Array.prototype.add;
});

QUnit.module('Object cloning', {
    beforeEach: function() {
        this.SomeClass = function(a, b) {
            this.a = a;
            this.b = b;
            this.changeB = function(b) { this.b = b; };
        };
        this.source = new this.SomeClass('a', 'b');
    }
});

QUnit.test('Prototypical cloning', function(assert) {
    // act
    const clone = objectUtils.clone(this.source);

    // assert
    assert.ok(clone);
    assert.ok(clone instanceof this.SomeClass);
    assert.notEqual(clone, this.source);
    assert.equal(clone.a, 'a');
    assert.equal(clone.b, 'b');
});

QUnit.test('External source changes affect clone', function(assert) {
    // arrange
    const clone = objectUtils.clone(this.source);

    // act
    this.source.a = 'aa';

    // assert
    assert.equal(this.source.a, 'aa');
    assert.equal(clone.a, 'aa');
});

QUnit.test('External clone changes don\'t affect source', function(assert) {
    // arrange
    const clone = objectUtils.clone(this.source);

    // act
    clone.a = 'aa';

    // assert
    assert.equal(this.source.a, 'a');
    assert.equal(clone.a, 'aa');
});

QUnit.test('Internal source changes affect clone', function(assert) {
    // arrange
    const clone = objectUtils.clone(this.source);

    // act
    this.source.changeB(15);

    // assert
    assert.equal(this.source.b, 15);
    assert.equal(clone.b, 15);
});

QUnit.test('Internal clone changes don\'t affect source', function(assert) {
    // arrange
    const clone = objectUtils.clone(this.source);

    // act
    clone.changeB([]);

    // assert
    assert.equal(this.source.b, 'b');
    assert.deepEqual(clone.b, []);
});

QUnit.module('deepExtendArraySafe utility', {
    beforeEach: function() {
        this.SomeClass = function(simpleProp, toChange) {
            this.simpleProp = simpleProp;
            this.toChange = toChange;
        };
    }
});

QUnit.test('deepExtendArraySafe utility does not change complex \'object\' to plain \'object\' by default', function(assert) {
    const target = {
        deepProp: new this.SomeClass('simple value', 'value to be changed')
    };
    const changes = {
        deepProp: { toChange: 'changed value' }
    };
    let result;

    result = objectUtils.deepExtendArraySafe(target, changes);

    assert.equal(result.deepProp.simpleProp, undefined);
    assert.equal(result.deepProp.toChange, 'changed value');
});

QUnit.test('deepExtendArraySafe utility can extend complex \'object\' by plain \'object\' (T482160)', function(assert) {
    const target = {
        deepProp: new this.SomeClass('simple value', 'value to be changed')
    };
    const changes = {
        deepProp: { toChange: 'changed value' }
    };
    let result;

    result = objectUtils.deepExtendArraySafe(target, changes, true);

    assert.equal(result.deepProp.simpleProp, 'simple value');
    assert.equal(result.deepProp.toChange, 'changed value');
});

QUnit.test('deepExtendArraySafe utility could not extend complex \'object\' by another complex \'object\' ', function(assert) {
    const oldValue = {
        deepProp: new this.SomeClass('some value', 'missed value')
    };
    const newValue = {
        deepProp: new this.SomeClass('new value')
    };
    let result;

    result = objectUtils.deepExtendArraySafe(oldValue, newValue, true);

    assert.equal(result.deepProp.simpleProp, 'new value');
    assert.notOk(!!result.deepProp.toChange);
});

QUnit.test('deepExtendArraySafe utility does not throw an error with \'null\' deep property', function(assert) {
    const oldValue = {
        deepProp: null
    };
    const newValue = {
        deepProp: { toChange: 'changed value' }
    };
    let result;

    result = objectUtils.deepExtendArraySafe(oldValue, newValue, true);

    assert.equal(result.deepProp.toChange, 'changed value');
});

QUnit.test('deepExtendArraySafe utility does not pollute object prototype', function(assert) {
    objectUtils.deepExtendArraySafe({ }, JSON.parse('{ "__proto__": { "pollution": true }}'), true);
    assert.ok(!('pollution' in { }), 'object prototype is not polluted');
});
