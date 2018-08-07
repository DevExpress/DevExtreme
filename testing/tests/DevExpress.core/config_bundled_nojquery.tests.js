define(function(require) {
    require("/artifacts/transpiled/bundles/dx.mobile.js");

    QUnit.module("config.useJQuery");

    QUnit.test("config value useJQuery should be false if jquery is not included", function(assert) {
        var config = DevExpress.config;
        assert.equal(!!config().useJQuery, false);
    });
});
