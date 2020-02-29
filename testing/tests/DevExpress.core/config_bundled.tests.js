const useJQuery = !QUnit.urlParams['nojquery'];

window.DevExpress = window.DevExpress || {};
window.DevExpress.config = { useJQuery: useJQuery };

define(function(require) {
    require('/artifacts/transpiled/bundles/dx.all.js');

    QUnit.module('config.useJQuery');

    QUnit.test('config value useJQuery with jQuery in window', function(assert) {
        const config = DevExpress.config;
        assert.equal(config().useJQuery, useJQuery);
    });
});
