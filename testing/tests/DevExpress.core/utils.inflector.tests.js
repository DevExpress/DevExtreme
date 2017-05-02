"use strict";

var inflector = require("core/utils/inflector");

QUnit.module("inflector");

QUnit.test("dasherize", function(assert) {
    assert.equal(inflector.dasherize("buyMeCandy"), "buy-me-candy");
    assert.equal(inflector.dasherize("Buy me Candy"), "buy-me-candy");
    assert.equal(inflector.dasherize(), "");
    assert.equal(inflector.dasherize(null), "");
    assert.equal(inflector.dasherize(true), "true");
});

QUnit.test("camelize", function(assert) {
    assert.equal(inflector.camelize("Buy me candy"), "buyMeCandy");
    assert.equal(inflector.camelize("buy-me_candy", true), "BuyMeCandy");
    assert.equal(inflector.camelize(), "");
    assert.equal(inflector.camelize(null), "");
    assert.equal(inflector.camelize(false), "false");
});

QUnit.test("humanize", function(assert) {
    assert.equal(inflector.humanize("BuyMeCandy"), "Buy me candy");
    assert.equal(inflector.humanize("productID"), "Product id");
    assert.equal(inflector.humanize(), "");
    assert.equal(inflector.humanize(null), "");
    assert.equal(inflector.humanize(NaN), "Na n");
});

QUnit.test("titleize", function(assert) {
    assert.equal(inflector.titleize("buy-me-candy"), "Buy Me Candy");
    assert.equal(inflector.titleize(), "");
    assert.equal(inflector.titleize(null), "");
    assert.equal(inflector.titleize(123), "123");
});

QUnit.test("underscore", function(assert) {
    assert.equal(inflector.underscore("buyMeCandy"), "buy_me_candy");
    assert.equal(inflector.underscore(), "");
    assert.equal(inflector.underscore(null), "");
    assert.equal(inflector.underscore({}), "[object_object]");
});
