const useJQuery = !QUnit.urlParams['nojquery'];

window.DevExpress = window.DevExpress || {};
window.DevExpress.config = { useJQuery: useJQuery };

// Must stay dynamic: static imports hoist above the config assignment.
await import('bundles/dx.all.js');

QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;

QUnit.module('config.useJQuery');

QUnit.test('config value useJQuery with jQuery in window', function(assert) {
    const config = DevExpress.config;
    assert.equal(config().useJQuery, useJQuery);
});
