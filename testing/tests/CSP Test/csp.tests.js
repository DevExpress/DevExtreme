import { render } from 'inferno';

QUnit.module('CSP test (remove if after some CSP tasks will be turned on)', function() {
    QUnit.test('test', function(assert) {
        assert.equal(typeof render, 'function', 'test');
    });
});
