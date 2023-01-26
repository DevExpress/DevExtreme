const config = require('core/config');

QUnit.module('config.useJQuery');

QUnit.test('config value useJQuery should be false if jquery is not included', function(assert) {
    assert.equal(!!config().useJQuery, false);
});
