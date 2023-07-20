define(function(require) {
    QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;
    require('bundles/dx.all.js');

    QUnit.module('config.useJQuery');

    QUnit.test('config value useJQuery should be false if jquery is not included', function(assert) {
        const config = DevExpress.config;
        assert.equal(!!config().useJQuery, false);
    });
});
