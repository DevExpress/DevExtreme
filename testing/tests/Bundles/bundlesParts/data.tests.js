import $ from 'jquery';
import errors from 'core/errors';

QUnit.test('data', function(assert) {
    return $.each([
        'Guid',
        'base64_encode',
        'applyChanges',
        'query',
        'Store',
        'setErrorHandler',
        'ArrayStore',
        'CustomStore',
        'LocalStore',
        'DataSource'
    ], (_, namespace) =>
        assert.ok(DevExpress.data[namespace], `DevExpress.data.${namespace} present`)
    );
});

QUnit.test('DevExpress.data.errorHandler setter should log deprecation message', function(assert) {
    const logStub = sinon.stub(errors, 'log');

    DevExpress.data.errorHandler = () => void 0;
    assert.strictEqual(logStub.callCount, 1);
    assert.deepEqual(logStub.lastCall.args, ['W0003', 'DevExpress.data', 'errorHandler', '21.1', 'Use the \'setErrorHandler\' method instead']);

    DevExpress.data._errorHandler = () => void 0;
    assert.strictEqual(logStub.callCount, 2);
    assert.deepEqual(logStub.lastCall.args, ['W0003', 'DevExpress.data', '_errorHandler', '21.1', 'Use the \'setErrorHandler\' method instead']);
});
