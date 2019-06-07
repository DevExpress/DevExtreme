"use strict";

var extend = require("core/utils/extend").extend;

QUnit.test("extend does not pollute object prototype", function(assert) {
    extend(true, { }, JSON.parse("{ \"__proto__\": { \"pollution\": true }}"));
    assert.ok(!("pollution" in { }), "object prototype is not polluted");
});
