import { toFixed } from "localization/utils";

const { module: testModule, test } = QUnit;

testModule("Localization utils", () => {
    test("toFixed", (assert) => {
        assert.strictEqual(toFixed(4.645, 2), "4.65");
        assert.strictEqual(toFixed(4.645, 1), "4.6");
        assert.strictEqual(toFixed(4.645, 0), "5");
        assert.strictEqual(toFixed(4.64, 2), "4.64");
        assert.strictEqual(toFixed(35.855, 2), "35.86");
        assert.strictEqual(toFixed(35.855, 5), "35.85500");
        assert.strictEqual(toFixed(-4.645, 2), "-4.65");
        assert.strictEqual(toFixed(-4.645, 1), "-4.6");
        assert.strictEqual(toFixed(-4.645, 0), "-5");
        assert.strictEqual(toFixed(-4.64, 2), "-4.64");
        assert.strictEqual(toFixed(-35.855, 2), "-35.86");
        assert.strictEqual(toFixed(-35.855, 5), "-35.85500");
    });
});
