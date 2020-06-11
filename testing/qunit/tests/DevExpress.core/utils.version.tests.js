const compare = require('core/utils/version').compare;

QUnit.module('version');

QUnit.test('compareVersions', function(assert) {
    assert.equal(compare('1.0', '1.1'), -1);
    assert.equal(compare('1.1', '1.0'), 1);

    assert.equal(compare('1', '1.0.0'), 0);
    assert.equal(compare('1.0.1', '1'), 1);
    assert.equal(compare('1.11', '1.2'), 1);

    assert.equal(compare([8, 9], 9), -1);

    assert.equal(compare('2.0.1', '2.0.9', 2), 0);

    assert.equal(compare('1.9.1', [1, 10]), -1);
    assert.equal(compare('1.10.0', [1, 10]), 0);
    assert.equal(compare('1.11.3', [1, 10]), 1);
});
