import { extend } from "core/utils/extend";

QUnit.test("extend does not pollute object prototype", (assert) => {
    extend(true, { }, JSON.parse(`{ "__proto__": { "pollution": true }}`));
    assert.ok(!("pollution" in { }), "object prototype is not polluted");
});
