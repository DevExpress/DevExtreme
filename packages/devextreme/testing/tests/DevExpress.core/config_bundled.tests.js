const useJQuery = !QUnit.urlParams['nojquery'];

window.DevExpress = window.DevExpress || {};
window.DevExpress.config = { useJQuery: useJQuery };

define(function(require) {
    QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;
    require('bundles/dx.all.js');

    QUnit.module('config.useJQuery');

    QUnit.test('config value useJQuery with jQuery in window', function(assert) {
        const config = DevExpress.config;
        assert.equal(config().useJQuery, useJQuery);
    });
});
