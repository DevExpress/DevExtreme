import { stringify } from "core/utils/stringify";

QUnit.module("stringify", function() {
    QUnit.test("Circular", function(assert) {
        var a = { i: 1 };
        a.a = a;
        assert.equal(stringify(a), "{\"i\":1,\"a\":\"[Circular]\"}");
    });

    QUnit.test("Max deep", function(assert) {
        var a1 = { a2: { a3: { a4: { a5: { a6: {} } } } } };
        a1.a = a1;
        assert.equal(stringify(a1), "{\"a2\":{\"a3\":{\"a4\":{\"a5\":{\"a6\":\"[MAX_DEEP]\"}}}},\"a\":\"[Circular]\"}");
    });
});
