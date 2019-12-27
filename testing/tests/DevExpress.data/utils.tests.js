import Guid from 'core/guid';
import dataUtils from 'data/utils';
import odataUtils from 'data/odata/utils';

const keysEqual = dataUtils.keysEqual;
const processRequestResultLock = dataUtils.processRequestResultLock;
const b64 = dataUtils.base64_encode;
const throttleChanges = dataUtils.throttleChanges;
const isGroupCriterion = dataUtils.isGroupCriterion;

QUnit.module('keysEqual');

QUnit.test('non-strict comparison is used', function(assert) {
    // NOTE there is no point in considering "1" and 1 as different keys
    assert.ok(keysEqual('id', 1, '1'));
    assert.ok(keysEqual(['a', 'b'], { a: 1, b: 2 }, { a: '1', b: '2' }));
});

QUnit.test('toComparable is used for compound keys', function(assert) {
    const guid1 = new Guid();
    const guid2 = new Guid(guid1);

    assert.ok(guid1 !== guid2);

    assert.ok(keysEqual(
        ['a', 'b'],
        { a: 1, b: guid1 },
        { a: 1, b: guid2 }
    ));
});

// T364210
QUnit.test('toComparable is used for EdmLiteral', function(assert) {

    const EdmLiteral = odataUtils.EdmLiteral;
    const edm1 = new EdmLiteral('50m');
    const edm2 = new EdmLiteral('50m');

    assert.ok(edm1 !== edm2);

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

    QUnit.test('check', (assert) => {
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
