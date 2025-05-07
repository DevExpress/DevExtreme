import Guid from 'core/guid';
import { processRequestResultLock, keysEqual, isGroupCriterion, throttleChanges, base64_encode as b64, isUniformEqualsByOr } from 'common/data/utils';
import { EdmLiteral } from 'common/data/odata/utils';
import { createObjectWithChanges } from 'common/data/array_utils';

QUnit.module('keysEqual');

QUnit.test('non-strict comparison is used', function(assert) {
    // NOTE there is no point in considering "1" and 1 as different keys
    assert.ok(keysEqual('id', 1, '1'));
    assert.ok(keysEqual(['a', 'b'], { a: 1, b: 2 }, { a: '1', b: '2' }));
    assert.ok(keysEqual(['a.b', 'a.c'], { a: { b: 1, c: 2 } }, { a: { b: '1', c: '2' } }));
    assert.ok(keysEqual('a', { b: 1, c: 2 }, { b: '1', c: '2' }));
});

QUnit.test('toComparable is used for compound keys', function(assert) {
    const guid1 = new Guid();
    const guid2 = new Guid(guid1);

    assert.notStrictEqual(guid1, guid2);

    assert.ok(keysEqual(
        ['a', 'b'],
        { a: 1, b: guid1 },
        { a: 1, b: guid2 }
    ));
});

QUnit.test('isUniformEqualsByOr(filter) returns true only for uniform equals filter with OR', function(assert) {
    [
        [['prop', '=', 1], 'or', ['other', '=', 1]],
        [1],
        [['prop', '=', 1], 'or', 1],
        [['prop', '=', 1], 'or', ['prop', '!=', 1]],
        [[() => 'prop', '=', 1], 'or', ['prop', '!=', 1]],
        [['prop', '=', 1], 'and', ['prop', '=', 1]],
        [['prop', '=', 1], 'or', [['prop', '=', 1], 'or', 1]],
    ].forEach(
        (filter) => assert.ok(!isUniformEqualsByOr(filter))
    );

    [
        [['prop', '=', 1], 'or', ['prop', '=', 2]],
        [['prop', '=', 1], 'or', ['prop', '=', 2], 'or', ['prop', '=', 3]],
        [['prop', '=', 1], 'or', ['prop', '=', '2']],
    ].forEach(
        (filter) => assert.ok(isUniformEqualsByOr(filter))
    );
});

// T364210
QUnit.test('toComparable is used for EdmLiteral', function(assert) {
    const edm1 = new EdmLiteral('50m');
    const edm2 = new EdmLiteral('50m');

    assert.notStrictEqual(edm1, edm2);

    assert.ok(keysEqual(null, edm1, edm2));
});

QUnit.module('processRequestResultLock');

QUnit.test('it works', function(assert) {
    assert.equal(processRequestResultLock.promise().state(), 'resolved', 'resolved by default');

    processRequestResultLock.obtain();
    assert.equal(processRequestResultLock.promise().state(), 'pending', 'pending when locked');

    processRequestResultLock.obtain();
    const promise = processRequestResultLock.promise();
    assert.equal(promise.state(), 'pending', 'pending when locked twice');

    processRequestResultLock.release();
    assert.equal(promise.state(), 'pending', 'pending when not all locks are released');

    processRequestResultLock.release();
    assert.equal(promise.state(), 'resolved', 'resolved when all locks are released');
});

QUnit.test('reset', function(assert) {
    processRequestResultLock.obtain();

    let promise = processRequestResultLock.promise();
    assert.equal(promise.state(), 'pending', 'pending when locked');

    processRequestResultLock.reset();
    assert.equal(promise.state(), 'resolved', 'old promises are resolved when reset');

    promise = processRequestResultLock.promise();
    assert.equal(promise.state(), 'resolved', 'default state is reset');
});

QUnit.test('nested tasks are executed immediately if no lock', function(assert) {
    let executed1 = false;
    let executed2 = false;

    processRequestResultLock
        .promise()
        .done(function() {
            executed1 = true;

            processRequestResultLock
                .promise()
                .done(function() {
                    executed2 = true;
                });

            assert.ok(executed2);
        });

    assert.ok(executed1);
    assert.ok(executed2);
});

QUnit.module('base64');

QUnit.test('encode', function(assert) {
    assert.equal(b64(''), '');
    assert.equal(b64('A'), 'QQ==');
    assert.equal(b64('AA'), 'QUE=');
    assert.equal(b64('AAA'), 'QUFB');
    assert.equal(b64('DevExpress'), 'RGV2RXhwcmVzcw==');
    assert.equal(b64('\u0401'), '0IE=');
    assert.equal(b64([65]), 'QQ==');
});

QUnit.module('Throttling', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.test('push with timeout', function(assert) {
        const spy = sinon.spy();
        const throttle = throttleChanges(spy, 100);
        for(let i = 0; i < 10; i++) {
            throttle([i]);
        }
        assert.equal(spy.callCount, 0);
        this.clock.tick(100);
        assert.equal(spy.callCount, 1);
        assert.equal(spy.firstCall.args[0].length, 10);
    });

    QUnit.test('dispose', function(assert) {
        const spy = sinon.spy();
        const throttle = throttleChanges(spy, 100);
        let timeoutId;
        for(let i = 0; i < 10; i++) {
            timeoutId = throttle([i]);
        }
        assert.equal(spy.callCount, 0);
        clearTimeout(timeoutId);
        this.clock.tick(100);
        assert.equal(spy.callCount, 0);
    });
});

QUnit.module('isGroupCriterion', () => {

    QUnit.test('check', function(assert) {
        const testFunc = () => {};
        const testBinary = ['id', '=', 1];

        assert.ok(isGroupCriterion([testBinary, testBinary]));
        assert.ok(isGroupCriterion([testBinary, testFunc]));
        assert.ok(isGroupCriterion([testFunc, testBinary]));
        assert.ok(isGroupCriterion([testFunc, testFunc]));
        assert.ok(isGroupCriterion([testFunc, 'and', testBinary]));
        assert.ok(isGroupCriterion([testFunc, 'or', testFunc]));

        assert.notOk(isGroupCriterion([testFunc]));
        assert.notOk(isGroupCriterion([testFunc, '=', 1]));
        assert.notOk(isGroupCriterion([testFunc, 1]));
    });

});

QUnit.module('createObjectWithChanges', () => {
    QUnit.test('check shallow', function(t) {
        const target = { top: 1 };
        const changes = { top: 2 };
        const result = createObjectWithChanges(target, changes);
        t.deepEqual(result, changes);
        t.notEqual(result, changes);
        t.notEqual(target, changes);
    });
    QUnit.test('check deep', function(t) {
        const target = { top: {
            inner: {
                deep: 1
            }
        }
        };
        const changes = { top: {
            inner: {
                deep: 3
            }
        } };
        const result = createObjectWithChanges(target, changes);
        t.deepEqual(result.top, changes.top);
        t.notEqual(result, changes);
        t.equal(result.top.inner.deep, changes.top.inner.deep);
    });
    QUnit.test('check new prop', function(t) {
        const target = { top: 1 };
        const changes = { topExtra: 2 };
        const result = createObjectWithChanges(target, changes);
        const desiredObj = { top: 1, topExtra: 2 };
        t.deepEqual(result, desiredObj);
    });
    QUnit.test('check handles readonly props', function(t) {
        function Target(id, text) {
            this.id = id;
            this.text = text;
        }
        Object.defineProperty(Target.prototype, 'ID', {
            configurable: true,
            enumerable: true,
            get: function() { return this.id; }
        });

        const target = new Target(0, 'test');
        const changes = { text: '2' };

        const result = createObjectWithChanges(target, changes);

        t.equal(result.id, 0);
        t.equal(result.text, changes.text);
    });
    QUnit.test('handles objects with recursive properties', function(t) {
        function Target() {
            this.text = 'Hello';
            this.circular = this;
        }
        const target = {
            test: 'test',
            circular: new Target()
        };
        const changes = { text: 'text' };

        const result = createObjectWithChanges(target, changes);
        t.equal(result.text, changes.text);
        t.equal(result.circular, target.circular);
    });
    // T1086600
    QUnit.test('handles BreezeJS like objects', function(t) {
        function ObjectWithConstructor() {
            this.text = 'Hello';
            this.circular = this;
        }
        const target = {
            complexObject: new ObjectWithConstructor(),
            plainObject: { text: 'test' },
            get text() {
                return this.plainObject.text;
            },
            set text(text) {
                this.plainObject.text = text;
            }
        };
        const changes = { text: 'text' };

        const result = createObjectWithChanges(target, changes);
        t.equal(result.complexObject, target.complexObject);
        t.notEqual(result.plainObject, target.plainObject);
        t.equal(result.text, changes.text);
    });
    QUnit.test('handles complex nested recursive links', function(t) {
        function Foo() {
            this.text = 'Hello';
            this.bar = new Bar(this);
        }
        function Bar(foo) {
            this.foo = foo;
        }
        const target = { foo: new Foo() };
        const changes = { foo: { text: 'test' } };

        const result = createObjectWithChanges(target, changes);
        t.strictEqual(result.foo.bar.foo, target.foo);
        t.strictEqual(result.foo.bar, target.foo.bar);
        t.equal(result.foo.text, changes.foo.text);

    });
    QUnit.test('handles extra complex nested recursive links', function(t) {
        function Foo() {
            this.text = 'Hello';
            this.bar = new Bar(this);
        }
        function Bar(foo) {
            this.foo = foo;
        }
        const target = { foo: new Foo() };
        const changes = { foo: { bar: { foo: { text: 'test' } } } };

        const result = createObjectWithChanges(target, changes);
        // t.strictEqual(result.foo, target.foo);
        t.notStrictEqual(result.foo.bar.foo, target.foo);
        t.notStrictEqual(result.foo.bar, target.foo.bar);
        t.equal(result.foo.bar.foo.text, changes.foo.bar.foo.text);

    });
    QUnit.test('handles nested class instances', function(t) {
        class Data {
            prop1;
        }
        class Prop1 {
            prop2;
        }

        class Prop2 {
            name;
        }

        const target = {
            prop1: {
                prop2: {
                    field: 'test'
                }
            }
        };
        Object.setPrototypeOf(target, Data);
        Object.setPrototypeOf(target.prop1, Prop1);
        Object.setPrototypeOf(target.prop1.prop2, Prop2);
        const changes = {
            prop1: { prop2: { field: 'abc' } }
        };
        const result = createObjectWithChanges(target, changes);
        t.notEqual(target, result);
        t.notEqual(target.prop1.prop2.field, changes.prop1.prop2.field);
        t.notEqual(target.prop1.prop2.field, result.prop1.prop2.field);
    });
    QUnit.test('handles prototypes', function(t) {
        function DataItem(id, text) {
            this.id = id;
            this.text = text;
        }
        Object.defineProperty(DataItem.prototype, 'ID', {
            configurable: true,
            enumerable: false,
            get: function() { return this.id; },
            set: function(value) { this.id = value; }
        });
        Object.defineProperty(DataItem.prototype, 'Text', {
            configurable: true,
            enumerable: false,
            get: function() { return this.text; },
            set: function(value) { this.text = value; }
        });
        const target = new DataItem(0, 'text0');
        const changes = { text: 'test' };
        const result = createObjectWithChanges(target, changes);
        t.equal(result.ID, 0);
        t.equal(result.text, 'test');

    });

});

