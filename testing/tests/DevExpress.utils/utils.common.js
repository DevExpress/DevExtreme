import { pairToObject } from "core/utils/common";
const { test, module } = QUnit;

module("pairToObject", {}, () => {
    test("result should rounded", function(assert) {
        const result = pairToObject(100.2);
        assert.equal(result.h, 100, "h value should be rounded");
        assert.equal(result.v, 100, "v value should be rounded");
    });

    test("result should prevented rounded", function(assert) {
        const result = pairToObject(100.2, true);
        assert.equal(result.h, 100.2, "h value shouldn't rounded");
        assert.equal(result.v, 100.2, "v value shouldn't rounded");
    });
});
